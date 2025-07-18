<script setup>
  // import { ref } from 'vue';
import { TOTAL_FLOORS } from '@/constants/buildingSpecs';

const props = defineProps({
  passengers: {
    type: Number,
    default: 0,
  },
  currentFloor: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= TOTAL_FLOORS,
  },
  // destinationFloor: {
  //   type: Number,
  //   required: true,
  // },
  // direction: {
  //   type: String,
  //   required: true,
  // },
});

console.log(props);

  // const destinationFloor = ref(props.destinationFloor);
  // const currentFloor = ref(props.currentFloor);
  // const direction = ref(props.direction);
  // const passengers = ref(props.passengers);
  // const isMoving = ref(false);

  // const move = () => {
  //   if (direction.value === 'up') {
  //     currentFloor.value++;
  //   } else if (direction.value === 'down') {
  //     currentFloor.value--;
  //   }
  // };

  // const openDoors = () => {
  //   isMoving.value = false;
  // };
</script>

<template>
  <div class="elevator">
    I am an elevator
  </div>
</template>

<style scoped>
.elevator {
  width: 150px;
  height: calc(100dvh - 2 * var(--content-spacing));
  border: 1px solid var(--vt-c-white);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>