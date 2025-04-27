import { useEffect } from 'react';
import { isOnPath, GRID_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../assets/mapData';

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
      MIN_X: 0,
      MAX_X: MAP_WIDTH,
      MIN_Y: 0,
      MAX_Y: MAP_HEIGHT,
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
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
      
      // Check if the new position is on a valid path
      if (isOnPath(newX, newY)) {
        // Only update if position changed and is on a path
        if (newX !== position.x || newY !== position.y) {
          updatePosition({ x: newX, y: newY });
        }
      } else {
        // Try moving in smaller increments to avoid getting stuck at edges
        const smallerStep = MOVEMENT_SPEED / 2;
        
        // Try smaller steps in the same direction
        switch (e.key) {
          case 'ArrowUp':
            newY = Math.max(BOUNDARY.MIN_Y, position.y - smallerStep);
            break;
          case 'ArrowDown':
            newY = Math.min(BOUNDARY.MAX_Y, position.y + smallerStep);
            break;
          case 'ArrowLeft':
            newX = Math.max(BOUNDARY.MIN_X, position.x - smallerStep);
            break;
          case 'ArrowRight':
            newX = Math.min(BOUNDARY.MAX_X, position.x + smallerStep);
            break;
        }
        
        // Check again with the smaller step
        if (isOnPath(newX, newY)) {
          updatePosition({ x: newX, y: newY });
        }
        // If still not on path, don't move (stay on current position)
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