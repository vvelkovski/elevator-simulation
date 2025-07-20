<script setup>
import Elevator from './Elevator.vue';
import { ref, onMounted } from 'vue';
import { assignElevator, log } from '@/utils/elevatorUtils.js';
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

// Create an array of elevators and initialize them with default values
const elevators = ref(
  Array.from({ length: props.totalElevators }, (_, index) => ({
    id: index + 1,
    currentFloor: 1,
    queue: [],
    direction: null,
    busy: false,
    loading: false,
  }))
);

function generateRandomCall() {
  const floor = Math.floor(Math.random() * props.totalFloors) + 1;
  const direction = Math.random() > 0.5 ? Direction.Up : Direction.Down;
  log(`📞 ${direction.toUpperCase()} request on floor ${floor}`);
  assignElevator(floor, direction, elevators.value);
}

onMounted(() => {
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