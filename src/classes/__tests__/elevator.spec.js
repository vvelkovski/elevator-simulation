import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Elevator } from '../elevator.js';
import Direction from '@/constants/directionEnum.js';

describe('Elevator', () => {
  let elevator;
  let mockLogFunction;

  beforeEach(() => {
    mockLogFunction = vi.fn();
    elevator = new Elevator(1, 5, mockLogFunction);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should initialize with correct default values', () => {
      const defaultElevator = new Elevator(2);
      
      expect(defaultElevator.id).toBe(2);
      expect(defaultElevator.currentFloor).toBe(1);
      expect(defaultElevator.queue).toEqual([]);
      expect(defaultElevator.direction).toBeNull();
      expect(defaultElevator.busy).toBe(false);
      expect(defaultElevator.loading).toBe(false);
      expect(defaultElevator.logFunction).toBeNull();
    });

    it('should initialize with custom values', () => {
      expect(elevator.id).toBe(1);
      expect(elevator.currentFloor).toBe(5);
      expect(elevator.queue).toEqual([]);
      expect(elevator.direction).toBeNull();
      expect(elevator.busy).toBe(false);
      expect(elevator.loading).toBe(false);
      expect(elevator.logFunction).toBe(mockLogFunction);
    });
  });

  describe('log', () => {
    it('should use provided log function when available', () => {
      const message = 'Test message';
      elevator.log(message);
      
      expect(mockLogFunction).toHaveBeenCalledWith(message, elevator.id);
    });

    it('should fall back to console.log when no log function provided', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const elevatorWithoutLogger = new Elevator(2, 3);
      const message = 'Test message';
      
      elevatorWithoutLogger.log(message);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(`[Elev ${elevatorWithoutLogger.id}] ${message}`);
      
      consoleLogSpy.mockRestore();
    });
  });

  describe('addToQueue', () => {
    it('should add floor to queue when not already present', () => {
      const result = elevator.addToQueue(3);
      
      expect(result).toBe(true);
      expect(elevator.queue).toContain(3);
    });

    it('should not add floor when already in queue', () => {
      elevator.addToQueue(3);
      const result = elevator.addToQueue(3);
      
      expect(result).toBe(false);
      expect(elevator.queue).toEqual([3]);
    });

    it('should add multiple different floors', () => {
      elevator.addToQueue(2);
      elevator.addToQueue(8);
      elevator.addToQueue(1);
      
      expect(elevator.queue).toEqual([2, 8, 1]);
    });
  });

  describe('isOnTheWay', () => {
    it('should return false when elevator is not busy', () => {
      elevator.busy = false;
      elevator.direction = Direction.Up;
      
      expect(elevator.isOnTheWay(7, Direction.Up)).toBe(false);
    });

    it('should return false when direction does not match', () => {
      elevator.busy = true;
      elevator.direction = Direction.Up;
      
      expect(elevator.isOnTheWay(7, Direction.Down)).toBe(false);
    });

    it('should return true for floor above when going up', () => {
      elevator.busy = true;
      elevator.direction = Direction.Up;
      elevator.currentFloor = 5;
      
      expect(elevator.isOnTheWay(7, Direction.Up)).toBe(true);
      expect(elevator.isOnTheWay(3, Direction.Up)).toBe(false);
      expect(elevator.isOnTheWay(5, Direction.Up)).toBe(false);
    });

    it('should return true for floor below when going down', () => {
      elevator.busy = true;
      elevator.direction = Direction.Down;
      elevator.currentFloor = 5;
      
      expect(elevator.isOnTheWay(3, Direction.Down)).toBe(true);
      expect(elevator.isOnTheWay(7, Direction.Down)).toBe(false);
      expect(elevator.isOnTheWay(5, Direction.Down)).toBe(false);
    });
  });

  describe('getDistanceTo', () => {
    it('should calculate correct distance to floor above', () => {
      elevator.currentFloor = 5;
      
      expect(elevator.getDistanceTo(8)).toBe(3);
    });

    it('should calculate correct distance to floor below', () => {
      elevator.currentFloor = 5;
      
      expect(elevator.getDistanceTo(2)).toBe(3);
    });

    it('should return 0 for current floor', () => {
      elevator.currentFloor = 5;
      
      expect(elevator.getDistanceTo(5)).toBe(0);
    });
  });

  describe('moveToFloor', () => {
    it('should move up to target floor', async () => {
      elevator.currentFloor = 3;
      elevator.direction = Direction.Up;

      const movePromise = elevator.moveToFloor(6);
      
      // Advance time step by step to simulate floor-by-floor movement
      expect(elevator.currentFloor).toBe(3);
      
      await vi.advanceTimersByTimeAsync(10000); // FLOOR_TRAVEL_TIME
      expect(elevator.currentFloor).toBe(4);
      
      await vi.advanceTimersByTimeAsync(10000);
      expect(elevator.currentFloor).toBe(5);
      
      await vi.advanceTimersByTimeAsync(10000);
      expect(elevator.currentFloor).toBe(6);
      
      await movePromise;
      expect(mockLogFunction).toHaveBeenCalledWith('🚚 Moving Up to floor 6', elevator.id);
    });

    it('should move down to target floor', async () => {
      elevator.currentFloor = 7;
      elevator.direction = Direction.Down;

      const movePromise = elevator.moveToFloor(5);
      
      await vi.advanceTimersByTimeAsync(10000);
      expect(elevator.currentFloor).toBe(6);
      
      await vi.advanceTimersByTimeAsync(10000);
      expect(elevator.currentFloor).toBe(5);
      
      await movePromise;
      expect(mockLogFunction).toHaveBeenCalledWith('🚚 Moving Down to floor 5', elevator.id);
    });

    it('should handle moving to same floor', async () => {
      elevator.currentFloor = 5;
      elevator.direction = Direction.Up;

      const movePromise = elevator.moveToFloor(5);
      
      // Should resolve immediately without any timer advancement
      await movePromise;
      expect(elevator.currentFloor).toBe(5);
      // Should not log movement message since no movement occurred
      expect(mockLogFunction).not.toHaveBeenCalledWith('🚚 Moving Up to floor 5', elevator.id);
    });
  });

  describe('loadPassengers', () => {
    it('should set loading to true during passenger loading', async () => {
      expect(elevator.loading).toBe(false);
      
      const loadPromise = elevator.loadPassengers();
      expect(elevator.loading).toBe(true);
      
      await vi.advanceTimersByTimeAsync(10000); // STOP_DURATION
      
      await loadPromise;
      expect(elevator.loading).toBe(false);
      expect(mockLogFunction).toHaveBeenCalledWith('🚪 Loading/unloading passengers', elevator.id);
    });
  });

  describe('getFloorsInCurrentDirection', () => {
    beforeEach(() => {
      elevator.currentFloor = 5;
      elevator.queue = [2, 3, 5, 7, 8];
    });

    it('should return empty array when no direction set', () => {
      elevator.direction = null;
      
      expect(elevator.getFloorsInCurrentDirection()).toEqual([]);
    });

    it('should return floors above current floor when going up, sorted ascending', () => {
      elevator.direction = Direction.Up;
      
      const result = elevator.getFloorsInCurrentDirection();
      expect(result).toEqual([5, 7, 8]);
    });

    it('should return floors below current floor when going down, sorted descending', () => {
      elevator.direction = Direction.Down;
      
      const result = elevator.getFloorsInCurrentDirection();
      expect(result).toEqual([5, 3, 2]);
    });

    it('should handle empty queue', () => {
      elevator.queue = [];
      elevator.direction = Direction.Up;
      
      expect(elevator.getFloorsInCurrentDirection()).toEqual([]);
    });
  });

  describe('startMoving', () => {
    it('should complete a simple upward journey', async () => {
      elevator.currentFloor = 2;
      elevator.queue = [4, 6];

      const startPromise = elevator.startMoving();
      
      expect(elevator.busy).toBe(true);
      expect(elevator.direction).toBe(Direction.Up);

      // Move to floor 4
      await vi.advanceTimersByTimeAsync(20000); // 2 floors * FLOOR_TRAVEL_TIME
      expect(elevator.currentFloor).toBe(4);
      
      // Load passengers at floor 4
      await vi.advanceTimersByTimeAsync(10000); // STOP_DURATION
      
      // Move to floor 6  
      await vi.advanceTimersByTimeAsync(20000); // 2 floors * FLOOR_TRAVEL_TIME
      expect(elevator.currentFloor).toBe(6);
      
      // Load passengers at floor 6
      await vi.advanceTimersByTimeAsync(10000); // STOP_DURATION
      
      await startPromise;
      
      expect(elevator.busy).toBe(false);
      expect(elevator.direction).toBeNull();
      expect(elevator.queue).toEqual([]);
    });

    it('should handle direction switching', async () => {
      elevator.currentFloor = 5;
      elevator.queue = [7, 2];

      const startPromise = elevator.startMoving();
      
      // First go up to 7
      expect(elevator.direction).toBe(Direction.Up);
      
      await vi.advanceTimersByTimeAsync(20000); // Move to floor 7 (2 floors * 10s)
      await vi.advanceTimersByTimeAsync(10000); // Load passengers at floor 7
      
      // Then switch direction and go down to 2  
      await vi.advanceTimersByTimeAsync(50000); // Move to floor 2 (5 floors down * 10s)
      await vi.advanceTimersByTimeAsync(10000); // Load passengers at floor 2
      
      await startPromise;
      
      expect(elevator.currentFloor).toBe(2);
      expect(elevator.queue).toEqual([]);
      expect(elevator.busy).toBe(false);
    });

    it('should handle multiple floors in same direction efficiently', async () => {
      elevator.currentFloor = 2;
      elevator.queue = [4, 6, 8];

      const startPromise = elevator.startMoving();
      
      // Should visit floors 4, 6, 8 in order
      await vi.advanceTimersByTimeAsync(20000); // Move to floor 4
      await vi.advanceTimersByTimeAsync(10000); // Load at 4
      
      await vi.advanceTimersByTimeAsync(20000); // Move to floor 6  
      await vi.advanceTimersByTimeAsync(10000); // Load at 6
      
      await vi.advanceTimersByTimeAsync(20000); // Move to floor 8
      await vi.advanceTimersByTimeAsync(10000); // Load at 8
      
      await startPromise;
      
      expect(elevator.currentFloor).toBe(8);
      expect(elevator.queue).toEqual([]);
    });

    it('should not move if already at target floor', async () => {
      elevator.currentFloor = 5;
      elevator.queue = [5];

      const startPromise = elevator.startMoving();
      
      // Should only load passengers, no movement
      await vi.advanceTimersByTimeAsync(10000); // STOP_DURATION
      
      await startPromise;
      
      expect(elevator.currentFloor).toBe(5);
      expect(elevator.queue).toEqual([]);
    });
  });

  describe('isIdle', () => {
    it('should return true when not busy and queue is empty', () => {
      elevator.busy = false;
      elevator.queue = [];
      
      expect(elevator.isIdle()).toBe(true);
    });

    it('should return false when busy', () => {
      elevator.busy = true;
      elevator.queue = [];
      
      expect(elevator.isIdle()).toBe(false);
    });

    it('should return false when queue has items', () => {
      elevator.busy = false;
      elevator.queue = [3, 7];
      
      expect(elevator.isIdle()).toBe(false);
    });

    it('should return false when both busy and queue has items', () => {
      elevator.busy = true;
      elevator.queue = [3, 7];
      
      expect(elevator.isIdle()).toBe(false);
    });
  });

  describe('edge cases and integration', () => {
    it('should handle complex mixed direction scenarios', async () => {
      elevator.currentFloor = 5;
      elevator.queue = [8, 2, 9, 1];

      const startPromise = elevator.startMoving();
      
      // Should go up first (8 is first target, so direction is up)
      // Visit 8, then 9 (in ascending order)
      expect(elevator.direction).toBe(Direction.Up);
      
      await vi.advanceTimersByTimeAsync(30000 + 10000); // Move to 8 and load
      await vi.advanceTimersByTimeAsync(10000 + 10000); // Move to 9 and load
      
      // Then switch to down and visit 2, then 1 (in descending order) 
      await vi.advanceTimersByTimeAsync(70000 + 10000); // Move down to 2 and load
      await vi.advanceTimersByTimeAsync(10000 + 10000); // Move down to 1 and load
      
      await startPromise;
      
      expect(elevator.currentFloor).toBe(1);
      expect(elevator.queue).toEqual([]);
      expect(elevator.busy).toBe(false);
      expect(elevator.direction).toBeNull();
    });

    it('should log appropriate messages during operation', async () => {
      elevator.currentFloor = 3;
      elevator.queue = [5];

      const startPromise = elevator.startMoving();
      
      await vi.advanceTimersByTimeAsync(20000); // Move to floor 5
      await vi.advanceTimersByTimeAsync(10000); // Load passengers
      
      await startPromise;
      
      expect(mockLogFunction).toHaveBeenCalledWith('🚚 Moving Up to floor 5', elevator.id);
      expect(mockLogFunction).toHaveBeenCalledWith('🚪 Loading/unloading passengers', elevator.id);
      expect(mockLogFunction).toHaveBeenCalledWith('🏁 Completed all requests. Now idle.', elevator.id);
    });
  });
}); 