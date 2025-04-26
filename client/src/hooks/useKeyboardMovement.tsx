import { useEffect } from 'react';

// Movement speed in pixels
const MOVEMENT_SPEED = 10;

interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

/**
 * Custom hook to handle keyboard movement
 */
const useKeyboardMovement = (
  position: Position, 
  updatePosition: (position: Position) => void,
  dimensions?: Dimensions
) => {
  useEffect(() => {
    // Boundaries for the metaverse
    const BOUNDARY = {
      MIN_X: 50,
      MAX_X: (dimensions?.width || window.innerWidth) - 50,
      MIN_Y: 50,
      MAX_Y: (dimensions?.height || window.innerHeight) - 50,
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if any input element is currently focused
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement || 
        activeElement instanceof HTMLTextAreaElement || 
        activeElement instanceof HTMLSelectElement ||
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      
      let newX = position.x;
      let newY = position.y;
      
      // Handle arrow keys
      switch (e.key) {
        case 'ArrowUp':
          newY = Math.max(BOUNDARY.MIN_Y, position.y - MOVEMENT_SPEED);
          break;
        case 'ArrowDown':
          newY = Math.min(BOUNDARY.MAX_Y, position.y + MOVEMENT_SPEED);
          break;
        case 'ArrowLeft':
          newX = Math.max(BOUNDARY.MIN_X, position.x - MOVEMENT_SPEED);
          break;
        case 'ArrowRight':
          newX = Math.min(BOUNDARY.MAX_X, position.x + MOVEMENT_SPEED);
          break;
        default:
          return; // Do nothing for other keys
      }
      
      // Only update if position changed
      if (newX !== position.x || newY !== position.y) {
        updatePosition({ x: newX, y: newY });
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, updatePosition, dimensions]);
  
  return null;
};

export default useKeyboardMovement;