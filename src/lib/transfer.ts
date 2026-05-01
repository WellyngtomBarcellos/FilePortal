/**
 * P2P File Transfer Protocol (over PeerJS DataConnection)
 *
 * Messages are JSON for control frames; binary chunks are sent as ArrayBuffer
 * preceded by a JSON 'chunk-meta' frame.
 *
 * Flow:
 *  Sender -> 'offer'   { transferId, name, size, type }
 *  Recv   -> 'accept' | 'reject' { transferId }
 *  Sender -> 'chunk-meta' { transferId, index, last }
 *  Sender -> ArrayBuffer (the chunk bytes)
 *  Recv   -> 'progress' { transferId, received }   (every N chunks)
 *  Sender -> 'complete' { transferId }
 *  Either -> 'cancel'   { transferId }
 */

import type { DataConnection } from "peerjs";

export const CHUNK_SIZE = 256 * 1024; // 256 KB
export const BUFFER_HIGH_WATERMARK = 8 * 1024 * 1024; // 8 MB
export const BUFFER_LOW_WATERMARK = 1 * 1024 * 1024;

export type ControlMessage =
  | { kind: "offer"; transferId: string; name: string; size: number; type: string }
  | { kind: "accept"; transferId: string }
  | { kind: "reject"; transferId: string }
  | { kind: "cancel"; transferId: string }
  | { kind: "chunk-meta"; transferId: string; index: number; last: boolean }
  | { kind: "progress"; transferId: string; received: number }
  | { kind: "complete"; transferId: string }
  | { kind: "hello"; name: string }
  | { kind: "ping"; t: number }
  | { kind: "pong"; t: number };

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function sendControl(conn: DataConnection, msg: ControlMessage) {
  // Evita poluir logs com ping/pong (ocorrem a cada 3s)

  conn.send(msg);
}

export interface SenderHooks {
  onProgress: (sent: number, total: number) => void;
  onDone: () => void;
  onCancel: () => void;
  onError: (e: Error) => void;
}

export class FileSender {
  private cancelled = false;
  private pendingMeta: ControlMessage | null = null;
  constructor(
    private conn: DataConnection,
    private file: File,
    private transferId: string,
    private hooks: SenderHooks,
  ) {}

  cancel() {
    this.cancelled = true;
    sendControl(this.conn, { kind: "cancel", transferId: this.transferId });
  }

  async start() {
    try {
      const total = this.file.size;
      let offset = 0;
      let index = 0;
      const startTime = performance.now();


      const stream = this.file.stream() as ReadableStream<Uint8Array>;
      const reader = stream.getReader();

      let buffer = new Uint8Array(0);

      const flushChunk = async (bytes: Uint8Array, last: boolean) => {
        if (this.cancelled) return;
        // Backpressure on the underlying RTCDataChannel buffer.
        // PeerJS expõe o RTCDataChannel como `_dc`.
        const dc = (this.conn as unknown as { _dc?: RTCDataChannel })._dc;
        if (dc && dc.bufferedAmount > BUFFER_HIGH_WATERMARK) {

        }
        while (dc && dc.bufferedAmount > BUFFER_HIGH_WATERMARK) {
          await new Promise<void>((resolve) => {
            const handler = () => {
              if (dc.bufferedAmount < BUFFER_LOW_WATERMARK) {
                dc.removeEventListener("bufferedamountlow", handler);
                resolve();
              }
            };
            dc.bufferedAmountLowThreshold = BUFFER_LOW_WATERMARK;
            dc.addEventListener("bufferedamountlow", handler);
            // Safety timeout
            setTimeout(() => {
              dc.removeEventListener("bufferedamountlow", handler);
              resolve();
            }, 250);
          });
          if (this.cancelled) return;
        }

        // chunk-meta direto (sem log para não poluir)
        this.conn.send({
          kind: "chunk-meta",
          transferId: this.transferId,
          index,
          last,
        });
        this.conn.send(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
        offset += bytes.byteLength;
        index += 1;

        this.hooks.onProgress(offset, total);
      };

      while (!this.cancelled) {
        const { value, done } = await reader.read();
        if (done) break;
        // Concatenate residual + new
        const merged = new Uint8Array(buffer.byteLength + value.byteLength);
        merged.set(buffer, 0);
        merged.set(value, buffer.byteLength);
        buffer = merged;

        while (buffer.byteLength >= CHUNK_SIZE) {
          const chunk = buffer.subarray(0, CHUNK_SIZE);
          await flushChunk(new Uint8Array(chunk), false);
          buffer = buffer.subarray(CHUNK_SIZE);
          if (this.cancelled) return;
        }
      }

      if (this.cancelled) {
        this.hooks.onCancel();
        return;
      }

      // Flush remaining bytes as the last chunk (could be 0 bytes for empty files).
      if (buffer.byteLength > 0) {
        await flushChunk(buffer, true);
      } else {

        this.conn.send({
          kind: "chunk-meta",
          transferId: this.transferId,
          index,
          last: true,
        });
        this.conn.send(new ArrayBuffer(0));
      }

      sendControl(this.conn, { kind: "complete", transferId: this.transferId });
      const elapsed = (performance.now() - startTime) / 1000;

      this.hooks.onDone();
    } catch (e) {

      this.hooks.onError(e as Error);
    }
  }

  // External helper: receiver sets pendingMeta when meta arrives,
  // not used in sender. Kept for symmetry.
  _setPendingMeta(m: ControlMessage) {
    this.pendingMeta = m;
  }
  _getPendingMeta() {
    return this.pendingMeta;
  }
}

export interface ReceiverHooks {
  onProgress: (received: number, total: number) => void;
  onDone: () => void;
  onCancel: () => void;
  onError: (e: Error) => void;
}

/**
 * Receiver writes incoming chunks straight to disk via FileSystemWritableFileStream.
 * No full buffering in memory.
 */
export class FileReceiver {
  private writer: FileSystemWritableFileStream | null = null;
  private received = 0;
  private writtenToDisk = 0;
  private cancelled = false;
  private finalized = false;
  private gotCompleteSignal = false;
  private pendingMeta: Extract<ControlMessage, { kind: "chunk-meta" }> | null = null;
  private lastProgressEmit = 0;
  // Buffer de escrita: agrupa vários chunks de 256 KB antes de chamar
  // writer.write(), reduzindo overhead do FileSystem Access API.
  private writeQueue: Uint8Array[] = [];
  private writeQueueBytes = 0;
  private writeChain: Promise<void> = Promise.resolve();
  private static FLUSH_THRESHOLD = 4 * 1024 * 1024; // 4 MB

  constructor(
    public transferId: string,
    public name: string,
    public size: number,
    public mime: string,
    private conn: DataConnection,
    private hooks: ReceiverHooks,
  ) {}

  async openWriter(handle: FileSystemFileHandle) {

    try {
      this.writer = await handle.createWritable({
        keepExistingData: false,
        // @ts-expect-error - 'mode' é suportado em Chromium recentes
        mode: "exclusive",
      });
    } catch (e) {
      this.writer = await handle.createWritable({ keepExistingData: false });
    }
  }

  setPendingMeta(m: Extract<ControlMessage, { kind: "chunk-meta" }>) {
    this.pendingMeta = m;
  }

  async markComplete() {

    this.gotCompleteSignal = true;
    if (this.received >= this.size) {
      await this.finalize();
    } else {

    }
  }

  private flushQueue() {
    if (!this.writer || this.writeQueue.length === 0) return;
    const merged = new Uint8Array(this.writeQueueBytes);
    let off = 0;
    for (const part of this.writeQueue) {
      merged.set(part, off);
      off += part.byteLength;
    }
    const flushBytes = this.writeQueueBytes;
    this.writeQueue = [];
    this.writeQueueBytes = 0;
    const writer = this.writer;
    const position = this.writtenToDisk;
    this.writtenToDisk += merged.byteLength;

    this.writeChain = this.writeChain
      .then(() => writer.write({ type: "write", position, data: merged }))
      .catch((e) => {
        throw e;
      });
  }

  private async finalize() {
    if (!this.writer || this.finalized) {

      return;
    }
    this.finalized = true;

    this.flushQueue();
    try {
      await this.writeChain;
    } catch (e) {
    }
    const t0 = performance.now();
    await this.writer.close();

    this.writer = null;
    this.hooks.onDone();
  }

  async handleBinary(data: ArrayBuffer | Blob | ArrayBufferView) {
    if (this.cancelled) return;
    try {
      if (!this.writer) throw new Error("Writer não inicializado");
      const meta = this.pendingMeta;
      this.pendingMeta = null;
      if (!meta) {

        throw new Error("Chunk recebido sem metadados");
      }

      const buf =
        data instanceof Blob
          ? new Uint8Array(await data.arrayBuffer())
          : data instanceof ArrayBuffer
            ? new Uint8Array(data)
            : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

      if (buf.byteLength > 0) {
        this.writeQueue.push(buf);
        this.writeQueueBytes += buf.byteLength;
        this.received += buf.byteLength;
        if (this.writeQueueBytes >= FileReceiver.FLUSH_THRESHOLD) {
          this.flushQueue();
        }
      }

      const isLast = meta.last;

      const now = performance.now();
      if (now - this.lastProgressEmit > 100 || isLast) {
        this.lastProgressEmit = now;
        this.hooks.onProgress(this.received, this.size);
        sendControl(this.conn, {
          kind: "progress",
          transferId: this.transferId,
          received: this.received,
        });
      }

      if (isLast || (this.gotCompleteSignal && this.received >= this.size)) {

        await this.finalize();
      }
    } catch (e) {

      this.hooks.onError(e as Error);
    }
  }

  async cancel() {

    this.cancelled = true;
    try {
      await this.writer?.abort();
    } catch (e) {

    }
    this.writer = null;
    this.hooks.onCancel();
  }
}
