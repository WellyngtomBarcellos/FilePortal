import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-100 group-[.toaster]:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] group-[.toaster]:rounded-[1.5rem] group-[.toaster]:px-6 group-[.toaster]:py-4 group-[.toaster]:font-bold",
          description: "group-[.toast]:text-slate-400 group-[.toast]:font-medium",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-white group-[.toast]:rounded-full",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 group-[.toast]:rounded-full",
        },
      }}
      {...props}
    />

  );
};

export { Toaster, toast };
