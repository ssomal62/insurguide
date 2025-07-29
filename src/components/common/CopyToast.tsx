import { useEffect } from "react";

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
      className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center px-[clamp(12px,3vw,20px)]"
      style={{
        top: "clamp(600px, 80vh, 780px)",
        width: "clamp(240px, 90vw, 358px)",
        height: "clamp(32px, 5vh, 38px)",
        backgroundColor: "rgba(9, 9, 9, 0.7)",
        borderRadius: "8px",
      }}
    >
      <img
        src="/images/icons/copy_right.png"
        alt="복사됨"
        className="mr-[clamp(4px,1vw,8px)]"
        style={{
          width: "clamp(14px, 4vw, 17px)",
          height: "clamp(14px, 4vw, 16px)",
          filter: "brightness(0) invert(1)",
        }}
      />
      <span
        className="text-white text-center font-[Pretendard]"
        style={{
          fontSize: "clamp(12px, 3.5vw, 14px)",
          fontWeight: 400,
          lineHeight: "1.5",
          letterSpacing: "-0.35px",
        }}
      >
        {message}
      </span>
    </div>
  );
};

export default CopyToast;
