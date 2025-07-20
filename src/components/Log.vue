<template>
  <h2>Event Log</h2>
  <div class="log">
    <div v-for="log in loggerStore.logs" :key="log.timestamp" class="log-entry">
      <span class="timestamp">[{{ log.time }}]</span>
      <span class="message">{{ log.message }}</span>
    </div>
  </div>
  <button @click="clearLogs" class="clear-button">Clear Logs</button>
</template>

<script setup>
import { useLoggerStore } from '@/stores/logger.js';

const loggerStore = useLoggerStore();

function clearLogs() {
  loggerStore.clearLogs();
}
</script>

<style scoped>
.log {
  height: calc(100dvh - 200px);
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background-color: #f8f8f8;
}

.log-entry {
  margin: 2px 0;
  padding: 2px;
}

.timestamp {
  color: #666;
  font-size: 11px;
  margin-right: 8px;
}

.message {
  color: #333;
}

.clear-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.clear-button:hover {
  background-color: #ff5252;
}
</style>
