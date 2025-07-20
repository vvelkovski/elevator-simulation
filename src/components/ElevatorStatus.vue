<script setup>
import Direction from '@/constants/directionEnum.js';

defineProps({
  elevator: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="elevator-status">
    <div class="row">
      <div class="content">
        <template v-if="elevator.loading">&#8644;</template>
      </div>
      <div class="content">
        <template v-if="elevator.direction === Direction.Up">&#8593;</template>
        <template v-else-if="elevator.direction === Direction.Down">&#8595;</template>
        <template v-else>&#8645;</template>
      </div>
      <div class="content">
        <span>{{ elevator.currentFloor }}</span>
      </div>
    </div>
    <div class="content">
      queue: [{{ elevator.queue.join(', ') }}]
    </div>
  </div>
</template>

<style scoped>
.elevator-status {
  padding: 5px;
  background-color: var(--vt-c-black-mute);
  display: flex;
  flex-direction: column;
  font-size: 18px;
  color: var(--vt-c-white);
  border-bottom: 1px solid var(--vt-c-white);
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>