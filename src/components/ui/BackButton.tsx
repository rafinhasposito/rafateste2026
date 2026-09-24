import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  to?: string;
}

export const BackButton = ({ label = "Retornar", onClick, className, to }: BackButtonProps) => {
  const navigate = useNavigate();

  const handlePress = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      onClick={handlePress}
      className={cn(
        "group flex items-center gap-3 text-white/50 hover:text-white transition-all duration-300 w-fit backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full",
        className
      )}
    >
      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs font-mono uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
};
