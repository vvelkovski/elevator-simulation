import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializeLogger, log, assignElevator } from '../elevatorUtils.js';
import Direction from '@/constants/directionEnum.js';

// Mock the logger store
const mockLoggerStore = {
  log: vi.fn(),
  logs: { value: [] },
  clearLogs: vi.fn()
};

// Mock the useLoggerStore import
vi.mock('@/stores/logger.js', () => ({
  useLoggerStore: vi.fn(() => mockLoggerStore)
}));

describe('elevatorUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initializeLogger', () => {
    it('should initialize the logger store', async () => {
      const { useLoggerStore } = await import('@/stores/logger.js');
      
      initializeLogger();
      
      expect(useLoggerStore).toHaveBeenCalled();
    });
  });

  describe('log', () => {
    it('should use logger store when available', () => {
      initializeLogger();
      const message = 'Test message';
      const elevatorId = 1;
      
      log(message, elevatorId);
      
      expect(mockLoggerStore.log).toHaveBeenCalledWith(message, elevatorId);
    });

    it('should format message correctly with elevator ID in console fallback', () => {
      initializeLogger();
      const message = 'Test message';
      const elevatorId = 2;
      
      log(message, elevatorId);
      
      // Verify the logger store was called with correct parameters
      expect(mockLoggerStore.log).toHaveBeenCalledWith(message, elevatorId);
    });

    it('should format message correctly without elevator ID', () => {
      initializeLogger();
      const message = 'General message';
      
      log(message);
      
      expect(mockLoggerStore.log).toHaveBeenCalledWith(message, null);
    });
  });

  describe('assignElevator', () => {
    let mockElevator1, mockElevator2, mockElevator3;
    
    beforeEach(() => {
      initializeLogger(); // Initialize logger for these tests
      
      // Create mock elevators with all required methods
      mockElevator1 = {
        id: 1,
        currentFloor: 3,
        queue: [],
        direction: null,
        busy: false,
        getDistanceTo: vi.fn(),
        isIdle: vi.fn(),
        isOnTheWay: vi.fn(),
        addToQueue: vi.fn(),
        startMoving: vi.fn()
      };

      mockElevator2 = {
        id: 2,
        currentFloor: 7,
        queue: [8, 9],
        direction: Direction.Up,
        busy: true,
        getDistanceTo: vi.fn(),
        isIdle: vi.fn(),
        isOnTheWay: vi.fn(),
        addToQueue: vi.fn(),
        startMoving: vi.fn()
      };

      mockElevator3 = {
        id: 3,
        currentFloor: 1,
        queue: [5],
        direction: Direction.Up,
        busy: true,
        getDistanceTo: vi.fn(),
        isIdle: vi.fn(),
        isOnTheWay: vi.fn(),
        addToQueue: vi.fn(),
        startMoving: vi.fn()
      };
    });

    it('should assign idle elevator with shortest distance', () => {
      const floor = 5;
      const direction = Direction.Up;
      const elevators = [mockElevator1, mockElevator2];

      // Setup: both elevators are idle, elevator1 is closer
      mockElevator1.isIdle.mockReturnValue(true);
      mockElevator1.getDistanceTo.mockReturnValue(2); // |5-3| = 2

      mockElevator2.isIdle.mockReturnValue(true);
      mockElevator2.getDistanceTo.mockReturnValue(2); // |5-7| = 2, but elevator1 will be found first

      assignElevator(floor, direction, elevators);

      expect(mockElevator1.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator1.startMoving).toHaveBeenCalled();
      expect(mockElevator2.addToQueue).not.toHaveBeenCalled();
    });

    it('should prefer closer idle elevator', () => {
      const floor = 6;
      const direction = Direction.Down;
      const elevators = [mockElevator1, mockElevator2];

      // Setup: both elevators are idle, elevator2 is closer to floor 6
      mockElevator1.isIdle.mockReturnValue(true);
      mockElevator1.getDistanceTo.mockReturnValue(3); // |6-3| = 3

      mockElevator2.isIdle.mockReturnValue(true);
      mockElevator2.busy = false; // Make it idle for this test
      mockElevator2.getDistanceTo.mockReturnValue(1); // |6-7| = 1

      assignElevator(floor, direction, elevators);

      expect(mockElevator2.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator2.startMoving).toHaveBeenCalled();
      expect(mockElevator1.addToQueue).not.toHaveBeenCalled();
    });

    it('should assign moving elevator if on the way and in same direction', () => {
      const floor = 8;
      const direction = Direction.Up;
      const elevators = [mockElevator2]; // Moving up

      // Setup: elevator2 is moving up and floor 8 is on the way
      mockElevator2.isIdle.mockReturnValue(false);
      mockElevator2.isOnTheWay.mockReturnValue(true);
      mockElevator2.getDistanceTo.mockReturnValue(1); // |8-7| = 1

      assignElevator(floor, direction, elevators);

      expect(mockElevator2.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator2.startMoving).not.toHaveBeenCalled(); // Should not start moving (already moving)
    });

    it('should not assign moving elevator if not on the way', () => {
      const floor = 5;
      const direction = Direction.Up;
      const elevators = [mockElevator2]; // Moving up but floor 5 is not on the way

      // Setup: elevator2 is moving but floor is not on the way
      mockElevator2.isIdle.mockReturnValue(false);
      mockElevator2.isOnTheWay.mockReturnValue(false);
      mockElevator2.getDistanceTo.mockReturnValue(2);

      assignElevator(floor, direction, elevators);

      expect(mockElevator2.addToQueue).not.toHaveBeenCalled();
      expect(mockLoggerStore.log).toHaveBeenCalledWith(`No suitable elevator available for floor ${floor} (${direction})`, null);
    });

    it('should not assign moving elevator if going in opposite direction', () => {
      const floor = 8;
      const direction = Direction.Down;
      const elevators = [mockElevator2]; // Moving up, but call is for down

      mockElevator2.isIdle.mockReturnValue(false);
      // Direction doesn't match, so isOnTheWay won't even be called

      assignElevator(floor, direction, elevators);

      expect(mockElevator2.addToQueue).not.toHaveBeenCalled();
      expect(mockLoggerStore.log).toHaveBeenCalledWith(`No suitable elevator available for floor ${floor} (${direction})`, null);
    });

    it('should prefer moving elevator over distant idle elevator', () => {
      const floor = 8;
      const direction = Direction.Up;
      const elevators = [mockElevator1, mockElevator2]; // idle vs moving

      // Setup: elevator1 is idle but far, elevator2 is moving up and close
      mockElevator1.isIdle.mockReturnValue(true);
      mockElevator1.getDistanceTo.mockReturnValue(5); // |8-3| = 5

      mockElevator2.isIdle.mockReturnValue(false);
      mockElevator2.isOnTheWay.mockReturnValue(true);
      mockElevator2.getDistanceTo.mockReturnValue(1); // |8-7| = 1

      assignElevator(floor, direction, elevators);

      expect(mockElevator2.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator1.addToQueue).not.toHaveBeenCalled();
    });

    it('should handle multiple idle elevators and pick the closest', () => {
      const floor = 4;
      const direction = Direction.Down;
      
      // Add a third elevator that's closest
      const elevators = [mockElevator1, mockElevator2, mockElevator3];

      mockElevator1.isIdle.mockReturnValue(true);
      mockElevator1.getDistanceTo.mockReturnValue(1); // |4-3| = 1

      mockElevator2.isIdle.mockReturnValue(true);
      mockElevator2.busy = false;
      mockElevator2.getDistanceTo.mockReturnValue(3); // |4-7| = 3

      mockElevator3.isIdle.mockReturnValue(true);
      mockElevator3.busy = false;
      mockElevator3.getDistanceTo.mockReturnValue(3); // |4-1| = 3

      assignElevator(floor, direction, elevators);

      expect(mockElevator1.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator1.startMoving).toHaveBeenCalled();
      expect(mockElevator2.addToQueue).not.toHaveBeenCalled();
      expect(mockElevator3.addToQueue).not.toHaveBeenCalled();
    });

    it('should not start moving if elevator was already busy', () => {
      const floor = 9;
      const direction = Direction.Up;
      const elevators = [mockElevator2];

      // Elevator is already moving and on the way
      mockElevator2.isIdle.mockReturnValue(false);
      mockElevator2.isOnTheWay.mockReturnValue(true);
      mockElevator2.getDistanceTo.mockReturnValue(2);

      assignElevator(floor, direction, elevators);

      expect(mockElevator2.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator2.startMoving).not.toHaveBeenCalled(); // Should not call startMoving
    });

    it('should log message when no suitable elevator is found', () => {
      const floor = 10;
      const direction = Direction.Down;
      const elevators = [mockElevator2, mockElevator3]; // Both moving up

      mockElevator2.isIdle.mockReturnValue(false);
      mockElevator2.isOnTheWay.mockReturnValue(false);
      
      mockElevator3.isIdle.mockReturnValue(false);
      mockElevator3.isOnTheWay.mockReturnValue(false);

      assignElevator(floor, direction, elevators);

      expect(mockLoggerStore.log).toHaveBeenCalledWith(`No suitable elevator available for floor ${floor} (${direction})`, null);
      expect(mockElevator2.addToQueue).not.toHaveBeenCalled();
      expect(mockElevator3.addToQueue).not.toHaveBeenCalled();
    });

    it('should handle empty elevator array gracefully', () => {
      const floor = 5;
      const direction = Direction.Up;
      const elevators = [];

      assignElevator(floor, direction, elevators);

      expect(mockLoggerStore.log).toHaveBeenCalledWith(`No suitable elevator available for floor ${floor} (${direction})`, null);
    });

    it('should handle complex scenario with mixed elevator states', () => {
      const floor = 6;
      const direction = Direction.Up;
      const elevators = [mockElevator1, mockElevator2, mockElevator3];

      // Complex setup:
      // Elevator 1: Idle, distance 3
      // Elevator 2: Moving up, but not on the way to floor 6
      // Elevator 3: Moving up, on the way to floor 6, distance 5

      mockElevator1.isIdle.mockReturnValue(true);
      mockElevator1.getDistanceTo.mockReturnValue(3); // |6-3| = 3

      mockElevator2.isIdle.mockReturnValue(false);
      mockElevator2.isOnTheWay.mockReturnValue(false); // Not on the way

      mockElevator3.isIdle.mockReturnValue(false);
      mockElevator3.isOnTheWay.mockReturnValue(true); // On the way
      mockElevator3.getDistanceTo.mockReturnValue(5); // |6-1| = 5

      assignElevator(floor, direction, elevators);

      // Should choose idle elevator1 (distance 3) over moving elevator3 (distance 5)
      expect(mockElevator1.addToQueue).toHaveBeenCalledWith(floor);
      expect(mockElevator1.startMoving).toHaveBeenCalled();
      expect(mockElevator2.addToQueue).not.toHaveBeenCalled();
      expect(mockElevator3.addToQueue).not.toHaveBeenCalled();
    });
  });
}); 