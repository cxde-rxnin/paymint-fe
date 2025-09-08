import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = "", 
  variant = "default", 
  hover = true 
}: CardProps) {
  const baseStyles = "rounded-lg transition-all duration-300";
  
  const variantStyles = {
    default: "bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg",
    glass: "bg-white/20 backdrop-blur-md border border-white/20 shadow-2xl",
    gradient: "bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/30 shadow-xl"
  };

  const hoverStyles = hover ? "hover:transform hover:-translate-y-1 hover:shadow-2xl" : "";

  const classes = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  return (
    <div className={classes}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
