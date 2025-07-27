import { motion, AnimatePresence, MotionProps } from "framer-motion";

interface FadeTransitionProps extends MotionProps {
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
}

const FadeTransition = ({ isVisible, children, className = "", ...props }: FadeTransitionProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default FadeTransition;
