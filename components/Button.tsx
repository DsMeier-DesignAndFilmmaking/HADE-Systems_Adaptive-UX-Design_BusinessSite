"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "cta-button",
  secondary: "secondary-button",
  ghost: "inline-flex items-center justify-center rounded-full px-6 py-3 font-sans text-sm font-semibold text-ink/70 hover:text-ink",
};

const sizeOverrides: Record<ButtonSize, string> = {
  default: "",
  sm: "!px-4 !py-2 !text-xs",
};

const motionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 400, damping: 20 },
};

/**
 * HADE Systems Button
 *
 * Polymorphic button / link component with variant system.
 * Wraps existing CSS classes from globals.css with Framer Motion hover/tap scale.
 *
 * Usage:
 *   <Button variant="primary" href="/contact">Book Sprint</Button>
 *   <Button variant="secondary" href="/services">View Services</Button>
 *   <Button type="submit">Submit Form</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      href,
      children,
      className = "",
      type = "button",
      disabled,
      onClick,
    },
    ref
  ) => {
    const classes = [variantClasses[variant], sizeOverrides[size], className]
      .filter(Boolean)
      .join(" ");

    if (href) {
      return (
        <motion.div {...motionProps} className="inline-block">
          <Link href={href} className={classes}>
            {children}
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
