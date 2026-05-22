const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 
const weeks = 52/2;

const table = document.querySelector("#habit-body")

table.addEventListener("click", (e)=>{
  const cell = e.target; 

  // Ignore day labels and other elements 
  if (!cell.matches("td[data-date]")) return; 

  cell.classList.toggle("filled"); 
  console.log("Clicked: ", cell.dataset.date);
});

const rows = {};

days.forEach(day => {
  const tr = document.createElement("tr"); 

  const label = document.createElement("td"); 
  label.textContent = day; 
  label.classList.add("day-label");
  tr.appendChild(label); 

  rows[day] = tr; 
  table.appendChild(tr);
});

const startDate = new Date("2026-01-04"); 

for (let i = 0; i < 365/2; i++) {
  const date = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + i
  );

  const dayName = days[date.getDay()];

  const td = document.createElement("td");

  td.dataset.date =
    `${date.getFullYear()}-${
      String(date.getMonth() + 1).padStart(2, "0")
    }-${
      String(date.getDate()).padStart(2, "0")
    }`;
  //td.classList.add("filled");
  rows[dayName].appendChild(td);
}


