import { useLoggerStore } from '@/stores/logger.js';

let loggerStore = null;

export function initializeLogger() {
  loggerStore = useLoggerStore();
}

export function log(message, elevatorId = null) {
  if (loggerStore) {
    loggerStore.log(message, elevatorId);
  } else {
    const formattedMessage = elevatorId 
      ? `[Elev ${elevatorId}] ${message}`
      : message;
    console.log(formattedMessage); // Fallback if store not initialized
  }
}

/**
 * Assigns the most suitable elevator to respond to a call from a specific floor and direction.
 * Works exclusively with Elevator class instances.
 *
 * @param {number} floor - The floor where the elevator call was made.
 * @param {string} direction - The direction requested (Direction.Up or Direction.Down).
 * @param {Array<Elevator>} elevators - The array of Elevator class instances to consider for assignment.
 * @returns {void}
 */
export function assignElevator(floor, direction, elevators) {
  let bestElevator = null;
  let bestScore = Infinity;

  for (const elevator of elevators) {
    const distance = elevator.getDistanceTo(floor);

    if (elevator.isIdle()) {
      // Idle elevator: consider directly based on distance
      if (distance < bestScore) {
        bestElevator = elevator;
        bestScore = distance;
      }
    } else if (elevator.direction === direction) {
      // Moving elevator: accept if floor is on the way
      if (elevator.isOnTheWay(floor, direction) && distance < bestScore) {
        bestElevator = elevator;
        bestScore = distance;
      }
    }
    // TODO: (Vladimir) an else statement to handle the case where the elevator is not on the way.
  }

  if (bestElevator) {
    const wasIdle = bestElevator.isIdle();
    
    // Add floor to queue
    bestElevator.addToQueue(floor);

    // Start moving if elevator was idle before adding to queue
    if (wasIdle) {
      bestElevator.startMoving();
    }
  } 
  // This else statement can be removed if we implement the "TODO" above.
  else {
    // If there is no idle or elevator on the way, don't accept the call.
    log(`No suitable elevator available for floor ${floor} (${direction})`);
  }
}
