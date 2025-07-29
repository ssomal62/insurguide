import { Copy, Share } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gpt';
  isLoading?: boolean;
  icon?: 'copy' | 'share' | null;
  label: ReactNode;
  labelColorClass?: string;
  className?: string; 
}

export const CommonButton = ({
  variant = 'primary',
  isLoading = false,
  icon = null,
  label,
  className = '',
  ...props
}: CommonButtonProps) => {

  const variants = {
    primary: 'bg-[#1989FF] hover:bg-[#147ce0] text-white',
    secondary:
      'bg-white hover:bg-[#F5F5F5] border border-[#1989FF] text-[#1989FF]',
    gpt: 'bg-white hover:bg-gray-100 border border-black text-black',
  };

  const iconMap = {
    copy: <Copy size={18} className="mr-2" />,
    share: <Share size={18} className="mr-2" />,
  };

  return (
    <button
      {...props}
style={{
  width: '100%',
  height: 'clamp(48px, 8vh, 80px)', // 또는 원하는 fluid 값
}}
      className={clsx(
        'flex items-center justify-center px-[10px] rounded-[6px] transition-colors duration-150 focus:outline-none disabled:opacity-50',
        variants[variant],
        className
      )}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? (
        <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        icon && iconMap[icon]
      )}
      <span
        style={{
          fontSize: 'clamp(16px, 3.2vw, 20px)',
        }}
        className="leading-[1.4] font-[Pretendard] text-center w-full flex justify-center"
      >
        {label}
      </span>
    </button>
  );
};