import { useEffect } from 'react';

interface CopyToastProps {
  message: string;
  onClose: () => void;
}

const CopyToast = ({ message, onClose }: CopyToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
      style={{
        top: '780px', // ✅ 상단에서 정확히 780px
        width: '358px',
        height: '38px',
        backgroundColor: 'rgba(9, 9, 9, 0.7)',
        borderRadius: '8px',
      }}
    >
      <img
        src="/images/icons/copy_right.png"
        alt="복사됨"
        style={{
          width: '17px',
          height: '16px',
          marginRight: '8px',
          filter: 'brightness(0) invert(1)',
        }}
      />
      <span
        style={{
          color: '#FFF',
          fontFamily: 'Pretendard',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '22px',
          letterSpacing: '-0.35px',
          textAlign: 'center',
        }}
      >
        {message}
      </span>
    </div>
  );
};

export default CopyToast;
