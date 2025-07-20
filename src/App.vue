<script setup>
import Building from './components/Building.vue';
import Log from '@/components/Log.vue';
import { TOTAL_FLOORS, TOTAL_ELEVATORS } from './constants/buildingSpecs';
</script>

<template>
  <div class="app-container">
    <div class="building-section">
      <Building :totalFloors="TOTAL_FLOORS" :totalElevators="TOTAL_ELEVATORS" />
    </div>
    <div class="log-section">
      <Log />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.building-section {
  flex: 2;
  padding: var(--content-spacing);
}

.log-section {
  flex: 1;
  border-left: 1px solid #ccc;
  padding: var(--content-spacing);
}
</style>
