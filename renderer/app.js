import { initializeTooltip } from './components/tooltip.js';
import { buildHabitUI } from './ui/buildHabitUI.js';

//-------------------------------------------------------------------
/**
 * Build habit cards
 */
window.addEventListener('DOMContentLoaded', async() => { 
  let savedHabits = [];
  // Call Handler 2 (Get the habits) 
  console.log('🔄 Attempting to fetch habits from main process...');
  try{
    savedHabits = await window.api.getHabits();
    console.log('✅ Connection Successful! Here is your saved data:');
    //console.dir(savedHabits); // console.dir prints objects cleanly
    //buildHabitTable(savedHabits); 
    if (savedHabits && savedHabits.length > 0){
      savedHabits.forEach(habit => {
        buildHabitUI(habit);
        console.log(habit);
      });
    }

  } catch (error){
    console.error('❌ Failed to fetch habits from main process:', error);
    //buildHabitUI({}); // pass in empty object if there are no previous habits
  }
});
//-------------------------------------------------------------------
/*

async function initializeHabitData() {
  try {
    const savedHabits = await window.api.getHabits(); 

    document.querySelectorAll("")
  }
}
*/
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


//-------------------------------------------------------------

const tooltip = document.getElementById('global-tooltip');
// tooltip logic
initializeTooltip(table, tooltip);