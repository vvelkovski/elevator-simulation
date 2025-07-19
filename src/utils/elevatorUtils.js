import { FLOOR_TRAVEL_TIME } from '@/constants/buildingSpecs';

/**
* Moves an elevator to a target floor progressively, updating the current floor
* every FLOOR_TRAVEL_TIME milliseconds until the destination is reached.
* 
* @param {Object} elevator - The elevator object to move
* @param {number} elevator.currentFloor - The current floor of the elevator
* @param {number} targetFloor - The destination floor number
* @returns {Promise<void>} A promise that resolves when the elevator reaches the target floor
*/
export function moveToFloor(elevator, targetFloor) {
 return new Promise(resolve => {
   // log(`🚚 Elevator ${elevator.id} moving ${elevator.direction} to floor ${targetFloor}`);
   
   const direction = targetFloor > elevator.currentFloor ? 1 : -1;
   
   const interval = setInterval(() => {
     // Move one floor in the direction of target
     elevator.currentFloor += direction;
     
     // Check if we've reached the target floor
     if (elevator.currentFloor === targetFloor) {
       clearInterval(interval);
       resolve();
     }
   }, FLOOR_TRAVEL_TIME);
 });
}

// export function loadPassengers(elevator, floor) {
//   return new Promise(resolve => {
//     log(`🚪 Elevator ${elevator.id} loading/unloading at floor ${floor}`);
//     setTimeout(() => {
//       resolve();
//     }, LOAD_TIME);
//   });
// }