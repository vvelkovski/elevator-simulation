<script setup>
import Direction from '@/constants/directionEnum.js';

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
    <div class="elevator-top">
      <div class="elevator-top-content">
        <template v-if="elevator.loading">&#8644;</template>
      </div>
      <div class="elevator-top-content">
        <template v-if="elevator.direction === Direction.Up">&#8593;</template>
        <template v-else-if="elevator.direction === Direction.Down">&#8595;</template>
        <template v-else>&#8645;</template>
      </div>
      <div class="elevator-top-content">
        <span>{{ elevator.currentFloor }}</span>
      </div>
    </div>
    <div class="floors-container">
      <div 
        v-for="floor in totalFloors" 
        :key="floor"
        class="floor"
        :class="{ 'current-floor': floor === elevator.currentFloor }"
      >
        <div class="floor-number">{{ floor }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elevator {
  width: 150px;
  height: calc(100dvh - 2 * var(--content-spacing));
  border: 1px solid var(--vt-c-white);
  position: relative;
  display: flex;
  flex-direction: column;
}

.elevator-top {
  height: 60px;
  background-color: var(--vt-c-black-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--vt-c-white);
  border-bottom: 1px solid var(--vt-c-white);
}

.elevator-top-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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

.current-floor {
  background-color: var(--vt-c-black-mute);
  color: var(--vt-c-green) !important;
}

.floor-number {
  font-size: 14px;
  font-weight: bold;
}
</style>