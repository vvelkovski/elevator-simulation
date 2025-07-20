import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoggerStore = defineStore('logger', () => {
  const logs = ref([]);
  
  function log(message) {
    logs.value.unshift({ 
      message, 
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString()
    });
  }
  
  function clearLogs() {
    logs.value = [];
  }

  return { logs, log, clearLogs };
}); 