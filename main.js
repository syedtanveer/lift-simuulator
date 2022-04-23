import './style.css';

const reset = document.getElementById('reset');
const form = document.getElementById('input-form');
const floorsInput = document.getElementById('floors');
const liftsInput = document.getElementById('lifts');
const queue = [];
const building = document.getElementById('lift-simulator');

reset.addEventListener('click', function() {
  floorsInput.value = '';
  liftsInput.value = '';
  // form.classList.remove('slide-up');
  // building.classList.remove('slide-up');
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  // form.classList.add('slide-up');
  // building.classList.add('slide-up');
  generateBuilding();
});


building.addEventListener('click', function(event) {
  // if(event.target.className.indexOf('button') >= 0) {
    console.dir(event.target)
    console.dir(event.target.dataset.floorNo);
    console.dir(event.target.dataset.direction);
  // }
});

// Run

function generateBuilding(){
  resetBuilding();
  const intFloors = parseInt(floorsInput.value);
  const noOfFloors = isNaN(intFloors) ? 0 : intFloors;
  if(noOfFloors === 0) return;
  const floors = getFloors(noOfFloors);
  addLiftsToBuilding(floors);
  building.appendChild(floors);
}

function addLiftsToBuilding(building, count = 0) {
  const lift = document.createElement('div');
  lift.classList.add('gate-container');
  lift.innerHTML = `<div class="gate">
      <div class="door door-left"></div>
      <div class="door door-right"></div>
    </div>`;
  building.lastChild.append(lift);
}

function resetBuilding() {
  building.innerHTML = '';
}

function getFloors(count = 0) {
  const container = document.createElement('div');
  let floors = '';
  for(let i = 0; i < count; i++) {
    floors += `<div class="floor"><div class="floor-number">${i+1}</div>
    <div class="buttons">
      <button data-floor-no=${i+1} data-direction="up" class="btn-round up"><span class="button fa fa-caret-up"></span></button>
      <button data-floor-no=${i+1} data-direction="down" class="btn-round down"><span class="button fa fa-caret-down"></span></button>
    </div></div>`;
  }
  container.innerHTML = floors;
  return container;
}
