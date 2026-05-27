// tooltip.js
let lastCell = null; 
let fadeTimeout = null;

// We export this function so your main file can call it
export function initializeTooltip(tableElement, tooltipElement) {
  
  tableElement.addEventListener('mousemove', (event) => {
    const cell = event.target.closest('td');
    if (!cell || !cell.getAttribute('data-tooltip')) return;
    
    if (cell !== lastCell) {
      clearTimeout(fadeTimeout);
      tooltipElement.style.opacity = '0'; 
      lastCell = cell; 

      fadeTimeout = setTimeout(() => {
        tooltipElement.textContent = cell.getAttribute('data-tooltip'); 

        const cellRect = cell.getBoundingClientRect();
        const cellCenterX = cellRect.left + (cellRect.width / 2); 
        const cellTopY = cellRect.top;

        tooltipElement.style.left = `${cellCenterX}px`;
        tooltipElement.style.top = `${cellTopY - 45}px`; 

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            tooltipElement.style.opacity = '1'; 
          });
        });
      }, 70); 
    }
  });

  tableElement.addEventListener('mouseout', (event) => {
    const relatedTarget = event.relatedTarget;
    const currentCell = event.target.closest('td');
    
    if (currentCell && (!relatedTarget || relatedTarget.closest('td') !== currentCell)) {
      clearTimeout(fadeTimeout);
      tooltipElement.style.opacity = '0'; 
      lastCell = null; 
    }
  });
}