interface Props {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const ScrollPageLayout = ({ children, footer, className }: Props) => {
  return (
    <div className={`w-full max-w-container min-w-screen mx-auto bg-white ${className ?? ""}`}>
      {/* 메인 컨텐츠 영역 */}
      <main className="w-full px-[4.33%] pt-[clamp(32px,4vh,60px)] pb-[clamp(32px,4vh,60px)]">
        {children}
      </main>

      {/* 푸터 영역 */}
      {footer && (
        <footer className="w-full px-4 pb-[clamp(16px,6vh,48px)] -mt-[clamp(32px,4vh,60px)] flex justify-center">
          <div className="w-full max-w-[700px]">{footer}</div>
        </footer>
      )}
    </div>
  );
};

export default ScrollPageLayout;