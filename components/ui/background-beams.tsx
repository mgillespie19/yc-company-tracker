'use client';

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeams = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beams = [
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-8 opacity-30",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
      className: "h-6 opacity-20",
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-24 opacity-40",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-96 relative flex items-center justify-center overflow-hidden bg-background",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <motion.div
          key={idx}
          initial={{
            translateY: "-100%",
            translateX: beam.initialX,
          }}
          animate={{
            translateY: "200%",
            translateX: beam.translateX,
          }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beam.delay || 0,
            repeatDelay: beam.repeatDelay || 0,
          }}
          className={cn(
            "absolute left-0 top-0 w-px rounded-full bg-gradient-to-b from-transparent via-primary to-transparent",
            beam.className
          )}
        />
      ))}
      {children}
    </div>
  );
};