// Map configuration with paths and non-traversable areas
interface GridCell {
  x: number;
  y: number;
  type: 'path' | 'obstacle';
}

// Grid size
export const GRID_SIZE = 20; // Size of each grid cell in pixels

// Map dimensions
export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 800;

// Grid dimensions
export const GRID_WIDTH = Math.floor(MAP_WIDTH / GRID_SIZE);
export const GRID_HEIGHT = Math.floor(MAP_HEIGHT / GRID_SIZE);

// Generate map grid
export const generateMapGrid = (): GridCell[][] => {
  const grid: GridCell[][] = [];
  
  // Initialize with obstacles
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = {
        x: x * GRID_SIZE,
        y: y * GRID_SIZE,
        type: 'obstacle' // Default to obstacle
      };
    }
  }
  
  // Define paths (horizontal and vertical lines)
  
  // Horizontal paths (main roads)
  for (let x = 5; x < GRID_WIDTH - 5; x++) {
    for (let offset = -1; offset <= 1; offset++) { // Make roads 3 cells wide
      const y1 = 10 + offset;
      const y2 = 20 + offset;
      const y3 = 30 + offset;
      
      if (y1 >= 0 && y1 < GRID_HEIGHT) grid[y1][x].type = 'path';
      if (y2 >= 0 && y2 < GRID_HEIGHT) grid[y2][x].type = 'path';
      if (y3 >= 0 && y3 < GRID_HEIGHT) grid[y3][x].type = 'path';
    }
  }
  
  // Vertical paths (connecting roads)
  for (let y = 3; y < GRID_HEIGHT - 3; y++) {
    for (let offset = -1; offset <= 1; offset++) { // Make roads 3 cells wide
      const x1 = 15 + offset;
      const x2 = 30 + offset;
      const x3 = 45 + offset;
      
      if (x1 >= 0 && x1 < GRID_WIDTH) grid[y][x1].type = 'path';
      if (x2 >= 0 && x2 < GRID_WIDTH) grid[y][x2].type = 'path';
      if (x3 >= 0 && x3 < GRID_WIDTH) grid[y][x3].type = 'path';
    }
  }
  
  // Add a central plaza (larger open area)
  const centerX = Math.floor(GRID_WIDTH / 2);
  const centerY = Math.floor(GRID_HEIGHT / 2);
  
  // Plaza size
  const plazaSize = 8;
  
  // Create central plaza
  for (let y = centerY - plazaSize; y <= centerY + plazaSize; y++) {
    for (let x = centerX - plazaSize; x <= centerX + plazaSize; x++) {
      if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
        grid[y][x].type = 'path';
      }
    }
  }
  
  return grid;
};

// Map grid with paths and obstacles
export const mapGrid = generateMapGrid();

// Helper function to check if a position is on a path
export const isOnPath = (x: number, y: number): boolean => {
  // Convert pixel coordinates to grid coordinates
  const gridX = Math.floor(x / GRID_SIZE);
  const gridY = Math.floor(y / GRID_SIZE);
  
  // Check if inside grid boundaries
  if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
    return false;
  }
  
  // Check if the cell is a path
  return mapGrid[gridY][gridX].type === 'path';
};

// Find the nearest valid position on a path
export const findNearestPathPosition = (x: number, y: number): { x: number, y: number } => {
  // If already on a path, return current position
  if (isOnPath(x, y)) {
    return { x, y };
  }
  
  // Define search radius
  const searchRadius = 10; // Grid cells
  
  // Start searching in increasing radius
  for (let radius = 1; radius <= searchRadius; radius++) {
    for (let offsetY = -radius; offsetY <= radius; offsetY++) {
      for (let offsetX = -radius; offsetX <= radius; offsetX++) {
        // Only check points on the perimeter of the current radius
        if (Math.abs(offsetX) === radius || Math.abs(offsetY) === radius) {
          const testX = x + offsetX * GRID_SIZE;
          const testY = y + offsetY * GRID_SIZE;
          
          if (isOnPath(testX, testY)) {
            return { x: testX, y: testY };
          }
        }
      }
    }
  }
  
  // If no path found, return a default safe position (center of map)
  return { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
}; 