import { FLOOR_TRAVEL_TIME, STOP_DURATION } from '@/constants/buildingSpecs.js';
import Direction from '@/constants/directionEnum.js';

export class Elevator {
  constructor(id, initialFloor = 1, logFunction = null) {
    this.id = id;
    this.currentFloor = initialFloor;
    this.queue = [];
    this.direction = null;
    this.busy = false;
    this.loading = false;
    this.logFunction = logFunction;
  }

  /**
   * Internal logging method that uses the provided log function
   * @param {string} message - The message to log
   */
  log(message) {
    if (this.logFunction) {
      this.logFunction(message, this.id);
    } else {
      console.log(`[Elevator ${this.id}] ${message}`);
    }
  }

  /**
   * Adds a floor to the elevator's queue if not already present
   * @param {number} floor - The floor to add to the queue
   * @returns {boolean} - True if floor was added, false if already in queue
   */
  addToQueue(floor) {
    if (!this.queue.includes(floor)) {
      this.queue.push(floor);
      return true;
    }
    return false;
  }

  /**
   * Checks if a floor is on the way for the given direction
   * @param {number} floor - The floor to check
   * @param {string} direction - The requested direction (Direction.Up or Direction.Down)
   * @returns {boolean} - True if the floor is on the way
   */
  isOnTheWay(floor, direction) {
    if (!this.busy || this.direction !== direction) {
      return false;
    }

    if (direction === Direction.Up) {
      return floor > this.currentFloor;
    } else {
      return floor < this.currentFloor;
    }
  }

  /**
   * Gets the distance to a specific floor
   * @param {number} floor - The target floor
   * @returns {number} - Absolute distance to the floor
   */
  getDistanceTo(floor) {
    return Math.abs(floor - this.currentFloor);
  }

  /**
   * Moves the elevator to a target floor progressively
   * @param {number} targetFloor - The destination floor number
   * @returns {Promise<void>} - Promise that resolves when floor is reached
   */
  async moveToFloor(targetFloor) {
    return new Promise(resolve => {
      this.log(`🚚 Moving ${this.direction} to floor ${targetFloor}`);
      
      const movementDirection = targetFloor > this.currentFloor ? 1 : -1;
      
      const interval = setInterval(() => {
        // Move one floor in the direction of target
        this.currentFloor += movementDirection;
        
        // Check if we've reached the target floor
        if (this.currentFloor === targetFloor) {
          clearInterval(interval);
          resolve();
        }
      }, FLOOR_TRAVEL_TIME);
    });
  }

  /**
   * Simulates loading/unloading passengers
   * @returns {Promise<void>} - Promise that resolves after loading is complete
   */
  async loadPassengers() {
    return new Promise(resolve => {
      this.log('🚪 Loading/unloading passengers');
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        resolve();
      }, STOP_DURATION);
    });
  }

  /**
   * Gets floors from the queue that are in the current direction of travel
   * @returns {number[]} - Array of floors sorted in the direction of travel
   */
  getFloorsInCurrentDirection() {
    if (!this.direction) {
      return [];
    }

    // Filter floors that are "ahead" in current direction
    const floorsInDirection = this.queue.filter(floor => {
      if (this.direction === Direction.Up) {
        return floor >= this.currentFloor;
      } else {
        return floor <= this.currentFloor;
      }
    });

    // Sort floors in optimal order for current direction
    return floorsInDirection.sort((a, b) => {
      return this.direction === Direction.Up ? a - b : b - a;
    });
  }

  /**
   * Main elevator movement algorithm that services all floors in the queue
   * @returns {Promise<void>} - Promise that resolves when all requests are completed
   */
  async startMoving() {
    this.busy = true;

    while (this.queue.length > 0) {
      // STEP 1: Determine initial direction if not set
      if (!this.direction) {
        const firstFloor = this.queue[0];
        this.direction = firstFloor > this.currentFloor ? Direction.Up : Direction.Down;
        this.log(`🎯 Initial direction set to: ${this.direction === Direction.Up ? 'Up' : 'Down'}`);
      }

      // STEP 2: Get floors that can be serviced in the current direction
      const floorsInCurrentDirection = this.getFloorsInCurrentDirection();

      if (floorsInCurrentDirection.length === 0) {
        // STEP 3: No floors in current direction, switch direction
        this.direction = this.direction === Direction.Up ? Direction.Down : Direction.Up;
        this.log(`🔄 Switching direction to: ${this.direction === Direction.Up ? 'Up' : 'Down'}`);
        continue; // Go back to STEP 2 with new direction
      }

      // STEP 4: Service all floors in the current direction
      for (const targetFloor of floorsInCurrentDirection) {
        // Move to the target floor if not already there
        if (this.currentFloor !== targetFloor) {
          await this.moveToFloor(targetFloor);
        }

        // Simulate passenger loading/unloading
        await this.loadPassengers();
        
        // STEP 5: Remove the serviced floor from the queue
        const floorIndex = this.queue.indexOf(targetFloor);
        if (floorIndex > -1) {
          this.queue.splice(floorIndex, 1);
        }
      }

      // STEP 6: Check if we should continue in the same direction or switch
      const remainingFloorsInDirection = this.getFloorsInCurrentDirection();
      if (remainingFloorsInDirection.length === 0) {
        // No more floors in current direction, prepare to switch
        if (this.queue.length > 0) {
          this.log(`✅ Completed ${this.direction === Direction.Up ? 'Up' : 'Down'} run, switching direction`);
          this.direction = this.direction === Direction.Up ? Direction.Down : Direction.Up;
        }
      }
    }

    // STEP 7: Reset elevator state when done
    this.direction = null;
    this.busy = false;
    this.log('🏁 Completed all requests. Now idle.');
  }

  /**
   * Checks if the elevator is idle (not busy and no queue)
   * @returns {boolean} - True if elevator is completely idle
   */
  isIdle() {
    return !this.busy && this.queue.length === 0;
  }
}
