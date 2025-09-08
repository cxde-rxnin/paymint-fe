import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  icon, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : ''} 
            bg-white/20 backdrop-blur-sm
            border-2 border-gray-200/50 
            rounded-lg 
            outline-none
            transition-all duration-300
            focus:outline-none 
            hover:border-gray-300
            placeholder:text-gray-400
            text-gray-800
            shadow-sm
            hover:shadow-md
            focus:shadow-lg
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
