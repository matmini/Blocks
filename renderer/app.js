import { initializeTooltip } from './components/tooltip.js';
import { buildHabitTable } from './ui/buildHabitTable.js';

//-------------------------------------------------------------------
/**
 * Build table
 */

const table = document.querySelector("#habit-body")

window.addEventListener('DOMContentLoaded', async() => {
  const blankTable = document.querySelector("#habit-body");

  // Pass the blank table, catch the fully loaded table 
  const populatedTable = buildHabitTable(blankTable); 

  console.log("Table successfully build with row: ", populatedTable);

})
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
habitTxt.addEventListener("keydown", (e)=>{
  // Check if the pressed key is Enter 
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default action (creating a new line)
    habitTxt.blur();
  }
});

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
    await window.api.toggleHabit(dateString, isChecked);

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