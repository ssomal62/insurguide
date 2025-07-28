import React from 'react';
import { clsx } from 'clsx';

interface CardFlipProps {
  isFlipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
}

export const CardFlip = ({ isFlipped, front, back }: CardFlipProps) => {
  return (
    <div className="w-full h-full perspective">
      <div
        className={clsx(
          'relative w-full h-full transition-transform duration-500 transform-style preserve-3d',
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        <div className="absolute w-full h-full backface-hidden">
          {front}
        </div>
        <div className="absolute w-full h-full rotate-y-180 backface-hidden">
          {back}
        </div>
      </div>
    </div>
  );
};