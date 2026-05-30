const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  // Existing function... 
  pingBackend: ()=> ipcRenderer.invoke('ping'),

  // Add these two lines for your habit tracker: 
  toggleHabit : (habitId, dateString, isChecked) => ipcRenderer.invoke('toggle-habit', habitId, dateString, isChecked),
  getHabits: () => ipcRenderer.invoke('get-habits'),
  saveTitle: (habitId, newTitle) => ipcRenderer.invoke('save-title', habitId, newTitle),
  createNewHabit: (habit) => ipcRenderer.invoke('create-new-habit', habit)
}); 