/**
 * Dynamically builds the habit tracking grid 
 * 
 * @param list savedHabits - the object fetched from electron-store 
 *    (e.g., {'2026-05-29': true})
 * 
 * Takes a blank table object, populates it with dates and month headers
 * and returns the populated table. 
 */

import { initializeTooltip } from '../components/tooltip.js';

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
const weeks = 52;

export function buildHabitUI(habit){
  const habitsWrapper = document.getElementById('habits-wrapper');
  const addHabitBtn = document.getElementById('add-habit-btn'); 
  const habitTemplate = document.getElementById('habit-template'); 

  //clone the template content 
  const templateClone = habitTemplate.content.cloneNode(true); 

  // select elements inside the cloned template 
  const cardContainer = templateClone.querySelector('.habit-card');
  const nameHeading = templateClone.querySelector('.habit-name-txt');
  const tableBody = templateClone.querySelector('.habit-body'); 
  const deleteBtn = templateClone.querySelector('.delete-habit-btn'); 
  
  const tooltip = document.getElementById('global-tooltip'); 

  // Populate data if it exists, otherwise use defaults 
  if (habit) { // previously saved habit
    nameHeading.textContent = habit.title; 
    console.log(`habit.title: ${habit.title}`)
    generateTable(tableBody, habit);
    addListener(tableBody, habit);
    initializeTooltip(tableBody, tooltip);
  } else { // default habit
    nameHeading.textContent = 'New Habit';
    generateTable(tableBody, null)
  }

  // Attach Event Listener: Delete Button 
  deleteBtn.addEventListener('click', () => {
    cardContainer.remove();
  }); 

  nameHeading.addEventListener('blur', async () => {
  // grab the updated text and trim 
    const updatedTitle = nameHeading.textContent.trim(); 
    saveNewTitle(habit.id, updatedTitle);
  });
  nameHeading.addEventListener("keydown", async (e)=>{
    // Check if the pressed key is Enter 
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action (creating a new line)
      
      // removes focus from text field
      nameHeading.blur();
    }
  });
  habitsWrapper.appendChild(templateClone);
}

function addListener(table, habit){
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
      await window.api.toggleHabit(habit.id, dateString, isChecked);

      console.log(`Saved: ${dateString} is now ${isChecked}`);
    } catch {
      console.error("Failed to save habit to storage: ", error);
    }
    //console.log("Clicked: ", cell.dataset.date);
  });
}

function generateTable(table, habit){
  const habitHistory = habit.history;
  const headerRow = document.createElement("tr"); 
  // Empty corner cell so the months align with the columns, cnot the day labels 
  const emptyCorner = document.createElement("th"); 
  headerRow.appendChild(emptyCorner);
  table.appendChild(headerRow); 

  const rows = {};

  // creating day label
  
  days.forEach(day => {
    const tr = document.createElement("tr"); 
    const label = document.createElement("td"); 
    label.textContent = day; 
    label.classList.add("day-label");
    tr.appendChild(label); 

    rows[day] = tr;  
    /**
     *   we set the tr = rows[day] so that we can still access 
     * the table row and we can specify in which we're adding
     */

    table.appendChild(tr);
  });

  // Dynamically set the starting date to the first sunday of the current year 
  const currentYear = new Date().getFullYear(); 
  console.log(`current year: ${currentYear}`);

  // Start at January 1st of the current year 
  const firstOfJan = new Date(`${currentYear}-01-01`); 

  // getDay() return 0 for Sunday, 1 for Monday, etc. 
  // calculate how many days we need to add to get to the first Sunday 
  const daysUntilSunday = (7 - firstOfJan.getDay()) % 7; 
  console.log(`daysUntilSunday: ${daysUntilSunday}`);

  // Create the final start date by adding the offset 
  const startDate = new Date(firstOfJan);
  startDate.setDate(firstOfJan.getDate() + daysUntilSunday); 
  console.log(`firstOfJan.getDate(): ${firstOfJan.getDate()}`);
  console.log(`startDate: ${startDate}`);

  let currentMonth = -1;
  let monthCell = null; 
  let columnCount = 0;
  
  /**
   * Generate the grid 
   * we get 365 days 
   * starting from the startDate
   */
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i
    );

    const td = document.createElement("td");
    // adds date dataset to the td in format: 
    // 2026-01-01
    let dateStr = `${date.getFullYear()}-${
        String(date.getMonth() + 1).padStart(2, "0")
      }-${
        String(date.getDate()).padStart(2, "0")
      }`
    td.dataset.date = dateStr;
    td.setAttribute("data-tooltip", dateStr)

    /**
     * Check if the date is marked true 
     * and add the class 'filled' if true
     */
    if (habitHistory && habitHistory[dateStr] === true){
      td.classList.add('filled');
    }

    /**
     * we get the dayName of the date 
     * because we will use this as index to row list
     * so that we add the td to the correct row
     * when we date.getDay(), it returns an int
     * 0 for Sunday
     * 1 for Monday
     * and so on 
     * so to get the words, we use that index to our 
     * days array where days[0]='Sun'
     */
    const dayName = days[date.getDay()];
    rows[dayName].appendChild(td);

    /**
     * Dynamically track and colspan month labels 
     * Every time Sunday hits , it means a new column (week) has started 
     */
    
    if (date.getDay() === 0 || i === 0){ //if it is a sunday
      const dateMonth = date.getMonth(); 

      // if we entered a new month, create a new header 
      if (dateMonth != currentMonth) {
        currentMonth = dateMonth; 
        monthCell = document.createElement("th"); 
        monthCell.textContent = months[currentMonth]; 
        monthCell.classList.add("month-label"); 
        headerRow.appendChild(monthCell); 
        columnCount = 0;
      }
      // expand the month's width by 1 column for the new week
      columnCount++;
      if (monthCell){
        monthCell.colSpan = columnCount;
      }
    }
  }


}
async function  saveNewTitle (id, newTitle){
  console.log("Saving new title...");
  try{
    await window.api.saveTitle(id, newTitle);
    console.log(`Title saved successfully: ${newTitle}`);
  } catch (error) {
    console.log(`error: ${error.message}`)
  }
}





