
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button'
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 font-black uppercase tracking-widest skew-x-[-12deg] transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-rugbyRed text-white hover:bg-red-700",
    secondary: "bg-electricBlue text-white hover:bg-blue-700",
    outline: "border-2 border-white text-white hover:bg-white hover:text-deepNavy",
    ghost: "text-white hover:bg-white/10"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      <span className="block skew-x-[12deg]">{children}</span>
    </button>
  );
};

export default Button;
