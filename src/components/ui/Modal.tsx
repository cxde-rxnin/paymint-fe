import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = "md" 
}: ModalProps) {
  console.log("Modal component - isOpen:", isOpen);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full ${sizeClasses[size]}
        bg-black/30 backdrop-blur-xl
        rounded-lg shadow-2xl
        border border-gray-700/50
        transform transition-all duration-300
        scale-100 opacity-100
      `}>
        {/* Header */}
        {title && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white gradient-text">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="px-6 py-6">
          {children}
        </div>
        
        {/* Close button if no title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
