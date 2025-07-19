<script setup>
import Elevator from './Elevator.vue';
import { ref } from 'vue';

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
  }))
);
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