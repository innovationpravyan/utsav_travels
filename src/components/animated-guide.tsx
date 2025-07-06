'use client';

import { motion, useTime, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedGuide() {
  const [isClient, setIsClient] = useState(false);

  // --- Start of Hooks: Must be unconditional ---
  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);
  
  const characterX = useSpring(0, { stiffness: 100, damping: 20 });
  const bodyRotation = useSpring(0, { stiffness: 100, damping: 20 });
  const leftArmAngle = useSpring(-15, { stiffness: 100, damping: 30 });

  // Eye tracking based on cursor.
  const eyeXOffset = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-6, 6], { clamp: true });

  // Derived motion values for pupil positions.
  const leftPupilX = useTransform(eyeXOffset, (val) => 58 + val);
  const rightPupilX = useTransform(eyeXOffset, (val) => 92 + val);

  // Idle animations
  const time = useTime();
  const bodyBob = useTransform(time, t => Math.sin(t / 400) * 3);
  const mouthBottomY = useTransform(time, t => 65 + Math.sin(t / 150) * 2);
  const eyeLidHeight = useTransform(time, t => (Math.sin(t / 900) > 0.95 ? 0 : 10));
  const mouthPath = useTransform(mouthBottomY, y => `M 68 55 C 71 ${y}, 79 ${y}, 82 55`);
  // --- End of Hooks ---


  useEffect(() => {
    // This ensures code that needs window/document runs only on the client
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      // --- Body Tilt Calculation ---
      const windowWidth = window.innerWidth;
      const midPointX = windowWidth / 2;
      const tilt = (clientX - midPointX) / midPointX * 15; // Max 15 degrees tilt
      bodyRotation.set(tilt);
      
      // --- Arm Angle Calculation ---
      const charX = characterX.get(); 
      const charY = window.innerHeight - 220; // SVG height is 220
      
      const shoulderScreenX = charX + 22;
      const shoulderScreenY = charY + 80; // Approx shoulder Y position within SVG

      const deltaX = clientX - shoulderScreenX;
      const deltaY = clientY - shoulderScreenY;
      
      const angleRad = Math.atan2(deltaY, deltaX);
      const angleDeg = angleRad * (180 / Math.PI) - 90; // -90 offset as arm is drawn pointing down
      
      leftArmAngle.set(angleDeg);
    };

    const handleMouseLeave = () => {
      const windowWidth = window.innerWidth;
      mouseX.set(windowWidth / 2);
      mouseY.set(window.innerHeight / 2);
      bodyRotation.set(0);
      leftArmAngle.set(-15); // Reset arm to default idle position
    };
    
    // Set initial position
    handleMouseLeave();

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, characterX, bodyRotation, leftArmAngle]);


  useEffect(() => {
    const updateCharacterPosition = (latestMouseX: number) => {
        if (typeof window === 'undefined') return;

        const midPoint = window.innerWidth / 2;
        const characterWidth = 150;

        if (latestMouseX === Infinity) {
            characterX.set(midPoint - characterWidth / 2);
        } else if (latestMouseX < midPoint) {
            characterX.set(window.innerWidth - characterWidth - 50);
        } else {
            characterX.set(50);
        }
    }
    
    const unsubscribe = mouseX.on("change", updateCharacterPosition);
    
    const handleResize = () => updateCharacterPosition(mouseX.get());
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    }
  }, [characterX, mouseX]);


  if (!isClient) {
    return null; // Prevent server-side rendering
  }

  return (
    <motion.div
      className="fixed bottom-0 z-50 pointer-events-none"
      style={{ width: 150, height: 220, x: characterX }}
    >
      <motion.svg
        width="150"
        height="220"
        viewBox="0 0 150 220"
        style={{ y: bodyBob }}
      >
        <motion.g style={{ transformOrigin: "center 180px", rotate: bodyRotation }}>
          {/* Legs */}
          <g>
            <rect x="45" y="150" width="25" height="60" rx="12.5" fill="hsl(var(--muted-foreground))" />
            <rect x="40" y="205" width="35" height="15" rx="7.5" fill="hsl(var(--muted))" />
          </g>
           <g>
            <rect x="80" y="150" width="25" height="60" rx="12.5" fill="hsl(var(--muted-foreground))" />
            <rect x="75" y="205" width="35" height="15" rx="7.5" fill="hsl(var(--muted))" />
          </g>
        
          {/* Body */}
          <rect x="35" y="60" width="80" height="95" rx="25" fill="hsl(var(--secondary))" stroke="hsl(var(--card))" strokeWidth="2" />
          <rect x="55" y="70" width="40" height="12" rx="6" fill="hsl(var(--primary))" />
          
          {/* Arms */}
           <g> {/* Right Arm */}
             <rect x="115" y="70" width="25" height="70" rx="12.5" fill="hsl(var(--secondary))" stroke="hsl(var(--card))" strokeWidth="2" />
             <circle cx="128" cy="145" r="10" fill="hsl(var(--primary))" />
          </g>
          <motion.g style={{ transformOrigin: "22px 80px", rotate: leftArmAngle }}> {/* Left (Pointing) Arm */}
             <rect x="10" y="70" width="25" height="70" rx="12.5" fill="hsl(var(--secondary))" stroke="hsl(var(--card))" strokeWidth="2" />
             <circle cx="22" cy="145" r="10" fill="hsl(var(--primary))" />
          </motion.g>

          {/* Head */}
          <g>
            <circle cx="75" cy="40" r="35" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />
            {/* Eyes */}
            <g>
                <circle cx="58" cy="40" r="9" fill="white" />
                <motion.circle cx={leftPupilX} cy="40" r="4.5" fill="black" />
                <motion.rect x="50" y="30" width="16" height={eyeLidHeight} fill="hsl(var(--primary))" rx="5" />
            </g>
            <g>
                <circle cx="92" cy="40" r="9" fill="white" />
                <motion.circle cx={rightPupilX} cy="40" r="4.5" fill="black" />
                <motion.rect x="84" y="30" width="16" height={eyeLidHeight} fill="hsl(var(--primary))" rx="5" />
            </g>
            
            {/* Mouth */}
            <motion.path
                d={mouthPath}
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            />
          </g>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
