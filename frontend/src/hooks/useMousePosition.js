import { useEffect } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook to track mouse position globally and update Zustand.
 * Optimized to only update store if delta is significant (prevents lag).
 */
export const useMousePosition = () => {
  const setMousePosition = useStore((state) => state.setMousePosition);

  useEffect(() => {
    let lastX = 0, lastY = 0;
    
    const handleMouseMove = (e) => {
      // Throttle slightly by checking delta to prevent Zustand floods
      const deltaX = Math.abs(e.clientX - lastX);
      const deltaY = Math.abs(e.clientY - lastY);
      
      if (deltaX > 5 || deltaY > 5) {
        // Normalize to -1 to 1
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition]);
};