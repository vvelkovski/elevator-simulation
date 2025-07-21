<script setup>
import Elevator from './elevator/Elevator.vue';
import { ref, onMounted, reactive } from 'vue';
import { assignElevator, log, initializeLogger } from '@/utils/elevatorUtils.js';
import { Elevator as ElevatorClass } from '@/classes/elevator.js';
import Direction from '@/constants/directionEnum.js';

const props = defineProps({
  totalFloors: {
    type: Number,
    required: true,
  },
  totalElevators: {
    type: Number,
    required: true,
  },
});

// Create an array of Elevator class instances with Vue reactivity
const elevators = ref(
  Array.from({ length: props.totalElevators }, (_, index) => {
    // Create Elevator class instance with logging function
    const elevatorInstance = new ElevatorClass(index + 1, 1, log);
    
    // Wrap in reactive to ensure Vue can track changes to class properties
    return reactive(elevatorInstance);
  })
);

function generateRandomCall() {
  const floor = Math.floor(Math.random() * props.totalFloors) + 1;
  // TODO: (Vladimir) extend logic to manually set the direction when elevator is called from the bottom or top floor
  const direction = Math.random() > 0.5 ? Direction.Up : Direction.Down;
  log(`🔔 ${direction} request on floor ${floor}`);
  assignElevator(floor, direction, elevators.value);
}

onMounted(() => {
  initializeLogger();
  setInterval(generateRandomCall, 5000); // every 5s for demo purposes
});
</script>

<template>
  <div class="building">
    <Elevator 
      v-for="elevator in elevators" 
      :key="elevator.id"
      :elevator="elevator"
      :totalFloors="totalFloors"
    />
  </div>
</template>

<style scoped>
.building {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100dvh - 2 * var(--content-spacing));
}
</style>