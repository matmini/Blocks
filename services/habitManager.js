// habitManager.js 
/**
 * HABIT MANAGER (Main Process Backend)
 * Handles reading and wrriting habit tracking data o the user's hard drive. 
 * It uses 'electron-store' to save data in a JSON file that persists even
 * when the app closes.
 * 
 * How it works: 
 * 1. ('get-habits'): Sends saved habit dates to the frontend when the app boots up
 * 2. ('toggle-habit'): Listens for clicks from the frontend to save or delete completed dates
 * 
 */
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


