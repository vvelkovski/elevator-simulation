<script setup>
import { onMounted } from 'vue';
// TODO: remove this import if I decide to use props for totalFloors
import { moveToFloor } from '@/utils/elevatorUtils.js';

const props = defineProps({
  elevator: {
    type: Object,
    required: true,
  },
  totalFloors: {
    type: Number,
    required: true,
  },
});

onMounted(() => {
  moveToFloor(props.elevator, 5);
});
</script>

<template>
  <div class="elevator">
    <div class="elevator-top">
      Motor Room
    </div>
    <div class="floors-container">
      <div 
        v-for="floor in totalFloors" 
        :key="floor"
        class="floor"
        :class="{ 'current-floor': floor === elevator.currentFloor }"
      >
        Floor {{ floor }}
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
  font-size: 12px;
  color: var(--vt-c-white);
  border-bottom: 1px solid var(--vt-c-white);
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
  transition: background-color 0.3s ease;
}

.current-floor {
  background-color: var(--vt-c-black-mute);
}
</style>