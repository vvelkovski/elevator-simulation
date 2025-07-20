import { FLOOR_TRAVEL_TIME, STOP_DURATION } from '@/constants/buildingSpecs.js';
import Direction from '@/constants/directionEnum.js';
import { useLoggerStore } from '@/stores/logger.js';

let loggerStore = null;

export function initializeLogger() {
  loggerStore = useLoggerStore();
}

export function log(message) {
  if (loggerStore) {
    loggerStore.log(message);
  } else {
    console.log(message); // Fallback if store not initialized
  }
}

/**
* Moves an elevator to a target floor progressively, updating the current floor
* every FLOOR_TRAVEL_TIME milliseconds until the destination is reached.
* 
* @param {Object} elevator - The elevator object to move
* @param {number} targetFloor - The destination floor number
* @returns {Promise<void>} A promise that resolves when the elevator reaches the target floor
*/
export function moveToFloor(elevator, targetFloor) {
 return new Promise(resolve => {
   log(`🚚 Elevator ${elevator.id} moving ${elevator.direction} to floor ${targetFloor}`);
   
   const movementDirection = targetFloor > elevator.currentFloor ? 1 : -1;
   
   const interval = setInterval(() => {
     // Move one floor in the direction of target
     elevator.currentFloor += movementDirection;
     
     // Check if we've reached the target floor
     if (elevator.currentFloor === targetFloor) {
       clearInterval(interval);
       resolve();
     }
   }, FLOOR_TRAVEL_TIME);
 });
}

function loadPassengers(elevator) {
  return new Promise(resolve => {
    log(`🚪 Elevator ${elevator.id} loading/unloading passengers`);
    elevator.loading = true;
    setTimeout(() => {
      elevator.loading = false;
      resolve();
    }, STOP_DURATION);
  });
}

/**
 * Moves an elevator to service all floors in its queue, following proper elevator logic
 * to avoid yo-yo behavior. The elevator will complete all floors in one direction
 * before switching to the opposite direction.
 * 
 * @param {Object} elevator - The elevator object to move
 * @returns {Promise<void>} A promise that resolves when all floors in the queue are serviced
 */
export async function moveElevator(elevator) {
  elevator.busy = true;

  while (elevator.queue.length > 0) {
    // STEP 1: Determine initial direction if not set
    if (!elevator.direction) {
      const firstFloor = elevator.queue[0];
      elevator.direction = firstFloor > elevator.currentFloor ? Direction.Up : Direction.Down;
      log(`Initial direction set to: ${elevator.direction === Direction.Up ? 'Up' : 'Down'}`);
    }

    // STEP 2: Get floors that can be serviced in the current direction
    // This is where we filter out floors that are "behind" us in the current direction
    const floorsInCurrentDirection = getFloorsInDirection(elevator);
    log(`Floors in current direction (${elevator.direction === Direction.Up ? 'Up' : 'Down'}):`, floorsInCurrentDirection);

    if (floorsInCurrentDirection.length === 0) {
      // STEP 3: No floors in current direction, switch direction
      // This prevents yo-yo behavior by ensuring we complete one direction first
      elevator.direction = elevator.direction === Direction.Up ? Direction.Down : Direction.Up;
      log(`No floors in current direction. Switching to: ${elevator.direction === Direction.Up ? 'Up' : 'Down'}`);
      continue; // Go back to STEP 2 with new direction
    }

    // STEP 4: Service all floors in the current direction (this prevents yo-yo)
    // We process floors in optimal order for current direction
    for (const targetFloor of floorsInCurrentDirection) {
      log(`Servicing floor ${targetFloor} in ${elevator.direction === Direction.Up ? 'Up' : 'Down'} direction`);
      
      // Move to the target floor if not already there
      if (elevator.currentFloor !== targetFloor) {
        await moveToFloor(elevator, targetFloor);
      }

      // Simulate passenger loading/unloading
      await loadPassengers(elevator);
      
      // STEP 5: Remove the serviced floor from the queue
      const floorIndex = elevator.queue.indexOf(targetFloor);
      if (floorIndex > -1) {
        elevator.queue.splice(floorIndex, 1);
        log(`Removed floor ${targetFloor} from queue. Remaining:`, elevator.queue);
      }
    }

    // STEP 6: Check if we should continue in the same direction or switch
    // This is where we decide whether to change direction after completing current run
    const remainingFloorsInDirection = getFloorsInDirection(elevator);
    if (remainingFloorsInDirection.length === 0) {
      // No more floors in current direction, prepare to switch
      if (elevator.queue.length > 0) {
        log(`Completed ${elevator.direction === Direction.Up ? 'Up' : 'Down'} run. Preparing to switch direction.`);
        elevator.direction = elevator.direction === Direction.Up ? Direction.Down : Direction.Up;
        log(`Direction switched to: ${elevator.direction === Direction.Up ? 'Up' : 'Down'}`);
      }
    }
    // If remainingFloorsInDirection.length > 0, we continue in same direction (no yo-yo)
  }

  // STEP 7: Reset elevator state when done
  elevator.direction = null;
  elevator.busy = false;
  log('Elevator completed all requests. Now idle.');
}

/**
 * Gets floors from the elevator's queue that are in the current direction of travel.
 * This is the KEY FUNCTION that prevents yo-yo behavior by filtering floors.
 * 
 * @param {Object} elevator - The elevator object
 * @returns {number[]} Array of floors sorted in the direction of travel
 */
function getFloorsInDirection(elevator) {
  if (!elevator.direction) {return [];}

  // FILTERING STEP: Only include floors that are "ahead" in current direction
  const floorsInDirection = elevator.queue.filter(floor => {
    if (elevator.direction === Direction.Up) {
      // For UP direction: only floors >= current floor
      // Example: If on floor 5 going UP, floor 2 is filtered OUT, floors 7,9 are kept
      return floor >= elevator.currentFloor;
    } else {
      // For DOWN direction: only floors <= current floor  
      // Example: If on floor 9 going DOWN, floor 2 is kept, floors above 9 are filtered OUT
      return floor <= elevator.currentFloor;
    }
  });

  // SORTING STEP: Sort floors in optimal order for current direction
  // UP: ascending order (5, 7, 9) - closest floors first
  // DOWN: descending order (9, 7, 5) - closest floors first
  return floorsInDirection.sort((a, b) => {
    return elevator.direction === Direction.Up ? a - b : b - a;
  });
}


/**
 * Assigns the most suitable elevator to respond to a call from a specific floor and direction.
 *
 * The function evaluates all elevators to find the best candidate based on proximity and direction.
 * If a suitable elevator is found, the requested floor is added to its queue (if not already present),
 * and the elevator is started if it is idle. The queue is sorted according to the elevator's direction.
 *
 * @param {number} floor - The floor where the elevator call was made.
 * @param {DirectionEnum} direction - The direction requested (e.g. Direction.Up/Down).
 * @param {Array<Object>} elevators - The array of elevator objects to consider for assignment.
 * @returns {void}
 */
export function assignElevator(floor, direction, elevators) {

  // Tracks the most suitable elevator found so far.
  let bestElevator = null;
  // Tracks how "good" the current best elevator is (lower is better).
  let bestScore = Infinity;

  for (const el of elevators) {
    const diff = floor - el.currentFloor;
    const absDiff = Math.abs(diff);

    if (!el.busy) {
      // Idle elevator: consider directly.
      if (absDiff < bestScore) {
        bestElevator = el;
        bestScore = absDiff;
      }
    } else if (el.direction === direction) {
      // Moving elevator: accept if floor is on the way.
      const isOnTheWay = direction === Direction.Up
        ? floor > el.currentFloor
        : floor < el.currentFloor;

      if (isOnTheWay && absDiff < bestScore) {
        bestElevator = el;
        bestScore = absDiff;
      }
    }
  }

  if (bestElevator) {
    if (!bestElevator.queue.includes(floor)) {
      // If the requested floor is not already in its queue, add it.
      bestElevator.queue.push(floor);
      // Note: Queue sorting is now handled by the moveElevator function
      // to ensure proper directional runs and avoid yo-yo behavior
    }

    if (!bestElevator.busy) {
      // If the elevator was idle, start its movement process.
      moveElevator(bestElevator);
    }

    log(`✅ Assigned elevator ${bestElevator.id} to floor ${floor}`);
  } else {
    log(`⚠️ No suitable elevator available for floor ${floor} (${direction})`);
  }
}
