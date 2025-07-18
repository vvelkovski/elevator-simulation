<script setup>
import Elevator from './Elevator.vue';

defineProps({
  floors: {
    type: Number,
    required: true,
  },
  elevators: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="building">
    <Elevator 
      v-for="elevator in elevators" 
      :key="`${floor}-${elevator}`"
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