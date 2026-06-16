import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
}

export const Button = ({
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${className} w-full rounded-2xl border-4 border-border-custom py-2 font-bold text-md shadow-[4px_4px_0px_var(--border)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2`}
    >
      {icon}
      {children}
    </button>
  );
};
