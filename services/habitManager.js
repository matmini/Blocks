// habitManager.js 
/**
 * HABIT MANAGER (Main Process Backend)
 * This is connected to the frontend through preload.js
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
  ipcMain.handle('toggle-habit', async(event, habitId, dateString, isChecked) => {
    
    // Open and read what is currently in you config.json file 
    // Returns empty object {} if first time 
    // const habits = store.get('habits', {}); 
    const tracks = store.get('habitTracks', []);

    // Find the specific habit object by its ID 
    let targetHabit = tracks.find(h => h.id === habitId); 

    if (!targetHabit) {
      targetHabit = {
        id: habitId, 
        title: "Default Habit Title",
        history: {}
      };
      tracks.push(targetHabit);
    }

    // safely modify the history object now that we guaranteee targetHabit exists
    if (!targetHabit.history) targetHabit.history = {}; 

    if (isChecked) {
      targetHabit.history[dateString] = true; 
    } else {
      delete targetHabit.history[dateString];
    }

    store.set('habitTracks', tracks);
    
    return tracks;

  });

  
  // Handler 2: Fetch data when frontend loads 
  /*
  ipcMain.handle('get-habits', async () => {
    return store.get('habits', {});
  });
  */ 
  // Update handler 2 (updated structure) 
  ipcMain.handle('get-habits', async () => {
    // returns a default starting habit if thestore is completely empty 
    return store.get('habitTracks', [
      {
        id: "default-habit", 
        title: "Habit 1", 
        history: {}
      }
    ]);
  });


  // Handler 3: Updates the title of a specific habit card 
  ipcMain.handle('save-title', async(event, habitId, newTitle) => {
    const tracks = store.get('habitTracks', []); 
    const targetHabit = tracks.find(h => h.id === habitId); 

    if (targetHabits) {
      targetHabit.title = newTitle; 
      store.set('habitTracks', tracks);
    }
    return tracks; 
  });
}

module.exports = { initHabitManager };


