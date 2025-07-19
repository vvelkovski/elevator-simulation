<script setup>
import Building from './components/Building.vue';
import { TOTAL_FLOORS, TOTAL_ELEVATORS } from './constants/buildingSpecs';
</script>

<template>
  <div>
    <Building :totalFloors="TOTAL_FLOORS" :totalElevators="TOTAL_ELEVATORS" />
  </div>
</template>

<style scoped>

</style>
