import { buildHabitUI } from './ui/buildHabitUI.js';

let savedHabits = [];
//-------------------------------------------------------------------
/**
 * Build habit cards
 */
window.addEventListener('DOMContentLoaded', async() => { 
  // Call Handler 2 (Get the habits) 
  console.log('🔄 Attempting to fetch habits from main process...');
  try{
    savedHabits = await window.api.getHabits();
    console.log('✅ Connection Successful! Here is your saved data:');
    console.dir(savedHabits); // console.dir prints objects cleanly
    if (savedHabits && savedHabits.length > 0){
      savedHabits.forEach(habit => {
        buildHabitUI(habit);
      });
    }
  } catch (error){
    console.error('❌ Failed to fetch habits from main process:', error);
    //buildHabitUI({}); // pass in empty object if there are no previous habits
  }
});
//-------------------------------------------------------------------

/**
 * Implement addHabit 
 */
const addHabitBtn = document.getElementById('add-habit-btn'); 
addHabitBtn.addEventListener('click', async ()=> {
  console.log('addHabitBtn clicked...');
  const newHabitData = {
    id:`habit-${Date.now()}`, // unique timstamp id 
    title: 'New Habit', 
    history: {}
  }
  try{
    savedHabits = await window.api.createNewHabit(newHabitData);
    console.dir(savedHabits);
    buildHabitUI(newHabitData);
  } catch (error) {
    console.error('❌ Failed to add new habit:', error)
  }

})

//-------------------------------------------------------------------

//-------------------------------------------------------------------
const testBtn = document.getElementById('test-btn'); 
const testStatus = document.getElementById('test-status'); 

if (testBtn && testStatus) {
  testBtn.addEventListener('click', async () => {
    testStatus.textContent = "Sending ping..."; 

    try {
      // call the function across the bridge 
      const response = await window.api.pingBackend(); 

      // Display the response from main.js in the UI
      testStatus.textContent = response;
    } catch (error) {
      testStatus.textContent = `Error: ${error.message}`; 
      console.error(error);
    }
  });
}