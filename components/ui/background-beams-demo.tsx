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
  // More beams with varied properties for a richer visual effect
  const beams = [
    {
      initialX: 60,
      translateX: 60,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0,
      width: 1,
      color: "rgba(255, 100, 50, 0.8)",
    },
    {
      initialX: 160,
      translateX: 260,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.2,
      width: 2,
      color: "rgba(255, 100, 50, 0.6)",
    },
    {
      initialX: 360,
      translateX: 360,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.4,
      width: 1,
      color: "rgba(255, 100, 50, 0.7)",
    },
    {
      initialX: 540,
      translateX: 540,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      className: "h-6",
      width: 1,
      color: "rgba(255, 100, 50, 0.7)",
    },
    {
      initialX: 880,
      translateX: 880,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.5,
      width: 1,
      color: "rgba(255, 100, 50, 0.8)",
    },
    {
      initialX: 1100,
      translateX: 1100,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      className: "h-20",
      width: 2,
      color: "rgba(255, 100, 50, 0.7)",
    },
    {
      initialX: 1450,
      translateX: 1450,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.7,
      width: 1,
      color: "rgba(255, 100, 50, 0.6)",
    },
    {
      initialX: 1990,
      translateX: 1990,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.3,
      width: 1,
      color: "rgba(255, 100, 50, 0.8)",
    },
    {
      initialX: 2380,
      translateX: 2380,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.6,
      width: 1,
      color: "rgba(255, 100, 50, 0.7)",
    },
    {
      initialX: 2500,
      translateX: 2500,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.4,
      width: 2,
      color: "rgba(255, 100, 50, 0.65)",
    },
    {
      initialX: 3000,
      translateX: 3000,
      duration: Math.random() * 6 + 3,
      repeatDelay: 0,
      delay: 0.1,
      width: 1,
      color: "rgba(255, 100, 50, 0.75)",
    },
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
        className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10"
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
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    angle: number;
    speed: number;
    opacity: number;
    color: string;
    gravity?: number;
    horizontalDrift?: number;
    opacityDecay?: number;
    sizeDecay?: number;
  }>>([]);
  // Track if we've already created particles for this collision
  const hasCreatedParticles = useRef(false);

  // Create spray particles on collision - only once per collision
  const createParticles = (x: number, y: number) => {
    // Only create particles if we haven't already for this collision
    if (hasCreatedParticles.current) return;
    
    const particleCount = Math.floor(Math.random() * 8) + 5;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Create particles that spray straight up with some horizontal variation
      // PI is straight left, PI/2 is straight up, 0 is straight right
      // We'll use angles between PI/4 (45°) and 3*PI/4 (135°) for an upward spray
      const angle = Math.PI * 1.25 + (Math.random() * Math.PI * 0.5); // Downward spray with horizontal variation
      
      // Slower speeds for more realistic effect
      const speed = 1 + Math.random() * 3; 
      
      // Varied sizes with some larger particles
      const size = 1 + Math.random() * 2.5;
      
      // Higher base opacity for more visibility
      const opacity = 0.4 + Math.random() * 0.6;
      
      // Add slight gravity effect
      const gravity = 0;
      
      // Add slight horizontal drift (mostly rightward to counteract leftward bias)
      const horizontalDrift = Math.random() * 0.2;
      
      newParticles.push({
        id: Date.now() + i,
        x,
        y: y + 10,
        size,
        angle,
        speed,
        opacity,
        gravity,
        horizontalDrift,
        color: beamOptions.color || "rgba(255, 100, 50, 0.8)",
        opacityDecay: 0.97 + Math.random() * 0.02,
        sizeDecay: 0.99 + Math.random() * 0.005,
      });
    }
    
    // Mark that we've created particles for this collision
    hasCreatedParticles.current = true;
    setParticles(newParticles);
  };

  useEffect(() => {
    const checkCollision = () => {
      if (!beamRef.current || !containerRef.current || !parentRef.current) return;

      const beam = beamRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      const parent = parentRef.current.getBoundingClientRect();

      if (beam.bottom >= container.top && !collision) {
        setCollision(true);
        const posX = beam.left - parent.left + beam.width / 2;
        const posY = container.top - parent.top;
        
        setPosition({
          x: posX,
          y: posY,
        });
        
        // Create spray particles - only once per collision
        createParticles(posX, posY);

        setTimeout(() => {
          setCollision(false);
          // Reset the flag when collision ends
          hasCreatedParticles.current = false;
        }, 1000);
      }
    };

    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [collision, containerRef, parentRef, beamOptions.color]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles
          .map(particle => ({
            ...particle,
            // Move particles along their angle with horizontal drift
            x: particle.x + Math.cos(particle.angle) * particle.speed + (particle.horizontalDrift || 0),
            // Add gravity effect to make particles arc downward
            y: particle.y + Math.sin(particle.angle) * particle.speed + (particle.gravity || 0),
            // Gradually reduce opacity for fade-out effect (slower decay)
            opacity: particle.opacity * (particle.opacityDecay || 0.95),
            // Slightly reduce size (slower decay)
            size: particle.size * (particle.sizeDecay || 0.98),
          }))
          // Keep particles visible longer
          .filter(particle => particle.opacity > 0.03)
      );
    };
    
    // Slower animation frame rate for more realistic motion
    const animationFrame = setTimeout(() => {
      requestAnimationFrame(animateParticles);
    }, 16); // ~60fps with a slight delay
    
    return () => clearTimeout(animationFrame);
  }, [particles]);

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
        style={{
          position: "absolute",
          left: beamOptions.translateX,
          top: 0,
          width: `${beamOptions.width || 1}px`,
          height: beamOptions.className ? undefined : "48px",
          background: beamOptions.color || "var(--primary)",
        }}
        className={cn(
          "absolute left-0 top-0 h-12",
          beamOptions.className
        )}
      />
      
      {/* Render spray particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ opacity: particle.opacity }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: particle.color,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </>
  );
};