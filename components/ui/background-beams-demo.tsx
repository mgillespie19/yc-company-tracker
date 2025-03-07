'use client';

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsDemo = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 2,
      repeatDelay: 0,
      delay: 0,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 1.5,
      repeatDelay: 0,
      delay: 0.2,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 2.5,
      repeatDelay: 0,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 2,
      repeatDelay: 0,
      delay: 0.5,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 2.2,
      repeatDelay: 0,
      className: "h-20",
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={parentRef}
      className={cn("h-96 bg-background relative flex items-center w-full justify-center overflow-hidden rounded-lg", className)}
    >
      {beams.map((beam, index) => (
        <BeamWithCollision
          key={index}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      <div className="relative z-10">{children}</div>
      <div
        ref={containerRef}
        className="absolute bottom-0 w-full h-1 bg-primary/20"
      />
    </div>
  );
};

const BeamWithCollision = ({
  beamOptions,
  containerRef,
  parentRef,
}: {
  beamOptions: any;
  containerRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkCollision = () => {
      if (!beamRef.current || !containerRef.current || !parentRef.current) return;

      const beam = beamRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      const parent = parentRef.current.getBoundingClientRect();

      if (beam.bottom >= container.top && !collision) {
        setCollision(true);
        setPosition({
          x: beam.left - parent.left + beam.width / 2,
          y: container.top - parent.top,
        });

        setTimeout(() => {
          setCollision(false);
        }, 300);
      }
    };

    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [collision, containerRef, parentRef]);

  return (
    <>
      <motion.div
        ref={beamRef}
        animate={{
          translateY: ["-100px", "800px"],
        }}
        transition={{
          duration: beamOptions.duration,
          repeat: Infinity,
          delay: beamOptions.delay || 0,
          ease: "linear",
        }}
        className={cn(
          "absolute left-0 top-0 w-px h-12 bg-primary",
          beamOptions.className
        )}
        style={{ left: beamOptions.translateX }}
      />
      <AnimatePresence>
        {collision && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute w-8 h-8 bg-primary/30 rounded-full blur-sm"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/60"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};