"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/helpers/cn";

import IconifyIcon from "../wrappers/IconifyIcon";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-default-100 text-default-900 hover:bg-default-200",
  outline: "border border-default-300 bg-white text-default-900 hover:bg-default-100",
  ghost: "text-default-900 hover:bg-default-100",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10 p-0",
};

type ButtonProps = {
  label?: string;
  href?: string;
  icon?: string;
  iconClassName?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      label,
      href,
      icon,
      iconClassName,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
    const content = children ?? (
      <>
        {icon ? <IconifyIcon icon={icon} className={cn("h-4 w-4", iconClassName)} /> : null}
        {label}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }
            onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
          }}
        >
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} disabled={disabled} onClick={onClick} {...props}>
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
