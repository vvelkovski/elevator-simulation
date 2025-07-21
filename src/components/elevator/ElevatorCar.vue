<script setup>
import { computed } from 'vue';
import Direction from '@/constants/directionEnum.js';

const props = defineProps({
  elevator: {
    type: Object,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
});

const isCurrentFloor = computed(() => props.elevator.currentFloor === props.floor);
const elevatorState = computed(
  () => props.elevator.loading 
    ? 'loading 🔄' 
    : props.elevator.busy 
      ? `moving ${props.elevator.direction === Direction.Up ? '⬆️' : '⬇️'}` 
      : 'idle ⏸️'
);
</script>

<template>
  <div
    class="elevator-car"
    :class="{ 'current-floor': isCurrentFloor }"
  >
    <div class="floor-number">{{ floor }}</div>
    <div v-if="isCurrentFloor" class="loading" v-html="elevatorState" />
    <div v-if="isCurrentFloor" class="queue">
      Q: [{{ elevator.queue.join(', ') }}]
    </div>
  </div>
</template>

<style scoped>
.elevator-car {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 5px 10px;
  width: 100%;
  height: 100%;
  color: var(--vt-c-white-mute);
  transition: background-color 0.3s ease;
}

.current-floor {
  background-color: var(--vt-c-black-mute);
  border: 1px solid var(--vt-c-green);
}

.floor-number {
  font-family: 'Digital';
  font-size: 16px;
  font-weight: bold;
  align-self: flex-start;
}

.loading {
  position: absolute;
  top: 10px;
  right: 10px;
}

.queue {
  margin-top: auto;
}

.current-floor > .floor-number {
  color: var(--vt-c-green) !important;
}
</style>