interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ShortPageLayout = ({ header, children, footer, className }: Props) => {
  return (
    <div className={`w-full min-h-[100dvh] flex flex-col justify-between items-center max-w-container min-w-screen mx-auto ${className ?? "bg-white"}`}>
      {header && <div className="w-full">{header}</div>}

      <div className="flex-1 flex items-center justify-center w-full px-[4.33%]">
        {children}
      </div>

      {footer && (
        <div className="w-full px-[4.33%] pb-[8.22vh] flex justify-center">
          <div className="w-full flex justify-center">
            {footer}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ShortPageLayout;



