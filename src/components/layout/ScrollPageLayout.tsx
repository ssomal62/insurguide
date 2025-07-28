interface Props {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const ScrollPageLayout = ({ children, footer, className }: Props) => {
  return (
    <div className={`w-full min-h-[100dvh] overflow-y-auto scrollbar-hide max-w-container min-w-screen mx-auto ${className ?? "bg-white"}`}>
      <div className="w-full px-[4.33%] pt-safe">
        {children}
      </div>

      {footer && (
        <div className="w-full px-[4.33%] pb-[8.22vh] mt-[clamp(32px,6vh,60px)] flex justify-center">
          <div className="w-full flex justify-center">
            {footer}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ScrollPageLayout;