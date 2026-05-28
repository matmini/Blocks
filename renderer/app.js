import { initializeTooltip } from './components/tooltip.js';
import { buildHabitTable } from './ui/buildHabitTable.js';

//-------------------------------------------------------------------
/**
 * Build table
 */

const table = document.querySelector("#habit-body")

window.addEventListener('DOMContentLoaded', async() => { 
  let savedHabits = [];
  // Call Handler 2 (Get the habits) 
  console.log('🔄 Attempting to fetch habits from main process...');
  try{
    savedHabits = await window.api.getHabits();
    console.log('✅ Connection Successful! Here is your saved data:');
    console.dir(savedHabits); // console.dir prints objects cleanly
    buildHabitTable(savedHabits); 
  } catch (error){
    console.error('❌ Failed to fetch habits from main process:', error);
    buildHabitTable(savedHabits); // fallback to blank calendar if things break
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


const habitTxt = document.getElementById("habit-name-txt");
// function to save the title 
async function handleSaveTitle() {
 // grab the updated text and trim 
  const updatedTitle = habitTxt.textContent.trim(); 

  // send it to the backend along with the card's specific id 
  console.log(`Saving new title...`); 

  try{
    await window.api.saveTitle("fake id", updatedTitle);
    console.log(`Title saved successfully: ${updatedTitle}`);
  } catch (error) {
    console.log(`error: ${error.message}`)
  }
}
habitTxt.addEventListener("keydown", async (e)=>{
  // Check if the pressed key is Enter 
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default action (creating a new line)
    
    // removes focus from text field
    habitTxt.blur();
  }
});

habitTxt.addEventListener("blur", handleSaveTitle);

//-----------------------------------------

// a cell in table is clicked 
table.addEventListener("click", async (e)=>{
  const cell = e.target; 
  
  // Ignore day labels and other elements 
  if (!cell.matches("td[data-date]")) return; 

  const dateString = cell.dataset.date; 

  // toggle filled and isChecked depends on it 
  const isChecked = cell.classList.toggle("filled");  

  try {
    // Call the bridge function safely 
    // the code pauses here until the main process saves to electron-store
    await window.api.toggleHabit("fake id", dateString, isChecked);

    console.log(`Saved: ${dateString} is now ${isChecked}`);
  } catch {
    console.error("Failed to save habit to storage: ", error);
  }

  //console.log("Clicked: ", cell.dataset.date);
});
//--------------------------------------------

//-------------------------------------------------------------

const tooltip = document.getElementById('global-tooltip');
// tooltip logic
initializeTooltip(table, tooltip);