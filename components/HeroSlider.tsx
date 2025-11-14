"use client";

import { useState, useEffect } from "react";

const heroImages = [
  {
    src: "/images/hero/hero-1.jpg",
    alt: "Authentic Colombian rural community with smiling locals",
  },
  {
    src: "/images/hero/hero-2.jpg",
    alt: "Lush green Colombian mountains and coffee farms",
  },
  {
    src: "/images/hero/hero-3.jpg",
    alt: "Colonial-style houses in rural Colombia",
  },
];

export default function HeroSlider() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {/* Subtle overlay for text readability - WithLocals style */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
    </div>
  );
}
