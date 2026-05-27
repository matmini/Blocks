// habitManager.js 
const { ipcMain } = require('electron'); 

const Store = require('electron-store').default; 
// Initialize the store 
const store = new Store(); 

function initHabitManager() {
  
  // Handler 1: Toggle/Save a habit day 
  // Electron catches the request because the channel name matches perfectly
  ipcMain.handle('toggle-habit', async(event, dateString, isChecked) => {
    
    // Open and read what is currently in you config.json file 
    // Returns empty object {} if first time 
    const habits = store.get('habits', {}); 

    // Update the Javascript object with the new date status 
    if (isChecked) {
      habits[dateString] = true;
    } else {
      delete habits[dateString];
    }

    // Safely write the updated object back down to the hard drive file 
    store.set('habits', habits);

    // Send the data back across the bridge as a confirmed return value 
    return habits;
  });

  // Handler 2: Fetch data when frontend loads 
  ipcMain.handle('get-habits', async () => {
    return store.get('habits', {});
  });
}

module.exports = { initHabitManager };


