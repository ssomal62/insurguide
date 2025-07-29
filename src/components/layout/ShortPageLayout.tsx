interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ShortPageLayout = ({ header, children, footer, className }: Props) => {
  return (
    <div
      className={`flex flex-col justify-between items-center w-full h-full ${
        className ?? "bg-white"
      }`}
    >
      {header && <div className="w-full">{header}</div>}

      <main className="flex-1 flex items-center justify-center w-full">
        {children}
      </main>

      {footer && (
        <footer className="w-full px-4 pb-[clamp(16px,6vh,48px)] flex justify-center">
          <div className="w-full max-w-[700px]">{footer}</div>
        </footer>
      )}
    </div>
  );
};

export default ShortPageLayout;
