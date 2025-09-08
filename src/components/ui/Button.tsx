import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
}

export default function Button({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variantStyles = {
    primary: "bg-white text-gray-800 shadow-lg hover:shadow-xl border border-gray-200/50 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md hover:shadow-lg",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
