/**
 * Dynamically builds the habit tracking grid 
 * 
 * @param {Object} savedHabits - the object fetched from electron-store 
 *    (e.g., {'2026-05-29': true})
 * 
 * Takes a blank table object, populates it with dates and month headers
 * and returns the populated table. 
 */
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul"]; 
const weeks = 52/2;

export function buildHabitTable(savedHabits){
  const table = document.querySelector("#habit-body");

  // Clear anything inside just in case 
  table.innerHTML = ''; 

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

  // The first date in the table
  // We chose january 4 2026 because it is the first sunday
  // and we need a sunday so it aligns with our labels 
  const startDate = new Date("2026-01-04"); 
  let currentMonth = -1;
  let monthCell = null; 
  let columnCount = 0;
  /**
   * Generate the grid 
   * we get 6-months worth of days 
   * starting from the startDate
   */
  for (let i = 0; i < 365/2; i++) {
    const date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i
    );
  /**
   * we get the dayName of the date 
   * because we will use this as index to row
   * so that we add the td to the correct row
   */
    const dayName = days[date.getDay()];
    /**
     * when we date.getDay(), it returns an int
     * 0 for Sunday
     * 1 for Monday
     * and so on 
     * so to get the words, we use that index to our 
     * days array where days[0]='Sun'
     */

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

    if (savedHabits && savedHabits[dateStr] === true){
      td.classList.add('filled');
    }
    rows[dayName].appendChild(td);

    /**
     * Dynamically track and colspan month labels 
     * Every time Sunday hits , it means a new column (week) has started 
     */
    if (date.getDay() === 0 || i === 0){
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

  return table;
}





