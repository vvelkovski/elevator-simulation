<script setup>
import ElevatorStatus from './ElevatorStatus.vue';
import ElevatorCar from './ElevatorCar.vue';

defineProps({
  elevator: {
    type: Object,
    required: true,
  },
  totalFloors: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="elevator">
    <ElevatorStatus :elevator="elevator" />
    <div class="floors-container">
      <div 
        v-for="floor in totalFloors" 
        :key="floor"
        class="floor"
      >
        <ElevatorCar :elevator="elevator" :floor="floor" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.elevator {
  width: 160px;
  height: calc(100dvh - 2 * var(--content-spacing));
  border: 1px solid var(--vt-c-white);
  position: relative;
  display: flex;
  flex-direction: column;
}

.floors-container {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
}

.floor {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--vt-c-white-mute);
  font-size: 14px;
  color: var(--vt-c-white-mute);
  transition: background-color 0.3s ease;
}
</style>