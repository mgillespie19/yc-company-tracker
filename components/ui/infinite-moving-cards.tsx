'use client';

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface CompanyCard {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  teamSize?: number;
  stage?: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: CompanyCard[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "250s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "500s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "750s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={item.name + idx}
            className="w-[350px] max-w-full relative rounded-2xl border border-border flex-shrink-0 px-8 py-6 md:w-[450px] bg-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold">{item.name[0]}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                {item.stage && (
                  <span className="text-sm text-muted-foreground">
                    {item.stage}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{item.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {item.website && (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Website
                </a>
              )}
              {item.teamSize && (
                <span>
                  {item.teamSize} team members
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};