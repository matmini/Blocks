const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  // Existing function... 
  pingBackend: ()=> ipcRenderer.invoke('ping'),

  // Add these two lines for your habit tracker: 
  toggleHabit : (dateString, isChecked) => ipcRenderer.invoke('toggle-habit', dateString, isChecked),
  getHabits: ipcRenderer.invoke('get-habits')
}); 