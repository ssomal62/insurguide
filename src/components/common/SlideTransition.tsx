import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SlideTransitionProps {
  children: ReactNode;
  keyId: string | number;
}

const SlideTransition = ({ children, keyId }: SlideTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        initial={{ x: 393, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -393, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideTransition;
