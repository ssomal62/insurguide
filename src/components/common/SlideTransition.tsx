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
        className="w-full max-w-container mx-auto relative"
        initial={{ x: 393, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -393, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}

      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideTransition;
