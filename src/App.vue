<script setup>
import Building from './components/Building.vue';
import { TOTAL_FLOORS, TOTAL_ELEVATORS } from './constants/buildingSpecs';
</script>

<template>
  <div>
    <Building :floors="TOTAL_FLOORS" :elevators="TOTAL_ELEVATORS" />
  </div>
</template>

<style scoped>


@media (min-width: 1024px) {
 
}
</style>
