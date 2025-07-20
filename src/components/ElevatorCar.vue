<script setup>
defineProps({
  elevator: {
    type: Object,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div
    class="elevator-car"
    :class="{ 'current-floor': floor === elevator.currentFloor }"
  >
    <div class="floor-number">{{ floor }}</div>
    <template v-if="elevator.currentFloor === floor">
      <div class="loading">
        <!-- loading: <template v-if="elevator.loading">&#8644;</template> -->
        {{ elevator.loading ? 'loading' : elevator.busy ? 'moving' : 'idle' }}
      </div>
      <div class="queue">
        queue: [{{ elevator.queue.join(', ') }}]
      </div>
    </template>
  </div>
</template>

<style scoped>
.elevator-car {
  padding: 10px;
  width: 100%;
  height: 100%;
  color: var(--vt-c-white-mute);
  transition: background-color 0.3s ease;
}

.current-floor {
  background-color: var(--vt-c-black-mute);
  color: var(--vt-c-green) !important;
}

.floor-number {
  font-family: 'Digital';
  font-size: 16px;
  font-weight: bold;
}
</style>