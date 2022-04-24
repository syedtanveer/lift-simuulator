import './style.css';

const reset = document.getElementById('reset');
const form = document.getElementById('input-form');
const floorsInput = document.getElementById('floors');
const liftsInput = document.getElementById('lifts');
const building = document.getElementById('lift-simulator');
let lift = null;
let doorLeft = null;
let doorRight = null;
let queue = [];
let qIntervalId, t1, t2, t3;
let isQueuePaused = false;
let lastFloorVisited = 1;

//? Event listeners
reset.addEventListener('click', function() {
  floorsInput.value = '';
  liftsInput.value = '';
  resetSimulator();
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  run();
});


building.addEventListener('click', function(event) {
  if(event.target.className.indexOf('btn-round') >= 0) {
    addLiftRequest({direction: event.target.dataset.direction, floorNo: parseInt(event.target.dataset.floorNo)});
  }
});

//? Run the code
function run() {
  resetSimulator();
  generateBuilding();
  lift = document.querySelector('.gate-container');
  doorLeft = document.querySelector('.door-left');
  doorRight = document.querySelector('.door-right');
  qIntervalId = setInterval(function checkQueue() {
    if(!isQueuePaused && queue.length > 0) {
      isQueuePaused = true;
      const {floorNo} = queue.shift();
      console.log(lastFloorVisited)
      console.log(floorNo);
      moveLift(floorNo);
      lastFloorVisited = floorNo;
    }
  }, 200);
}
run();

//? common functions
function moveLift(floorNo) {
  const dist = Math.abs(lastFloorVisited - floorNo);
  document.documentElement.style.setProperty('--floor', floorNo-1);
  document.documentElement.style.setProperty('--liftTime', dist);
  // translateY(calc(-${(floorNo-1)*100}% - ${8*(floorNo-1)}px))
  // lift.style.transform = q;
  lift.classList.add("move");
  clearTimeout(t1);
  clearTimeout(t2);
  clearTimeout(t3);
  t1 = setTimeout(() => {
    doorLeft.classList.add('slideLeft');
    doorRight.classList.add('slideRight');
  }, 2000*(dist));
  t2 = setTimeout(() => {
    doorLeft.classList.remove('slideLeft');
    doorRight.classList.remove('slideRight');
  }, 2000*(dist)+2500);
  t3 = setTimeout(() =>{
    isQueuePaused = false;
  }, 2000*(dist)+5000);
}

function generateBuilding(){
  resetSimulator();
  const intFloors = parseInt(floorsInput.value);
  const noOfFloors = isNaN(intFloors) ? 0 : intFloors;
  if(noOfFloors === 0) return;
  const floors = getFloors(noOfFloors);
  addLiftsToBuilding(floors);
  building.appendChild(floors);
}

function addLiftRequest(request) {
  queue.push(request);
}

function addLiftsToBuilding(building, count = 0) {
  //? for now we are adding 1 lift
  const lift = document.createElement('div');
  lift.classList.add('gate-container');
  lift.innerHTML = `<div class="gate">
      <div class="door door-left"></div>
      <div class="door door-right"></div>
    </div>`;
  building.lastChild.append(lift);
}

function resetSimulator() {
  building.innerHTML = '';
  queue = [];
  clearInterval(qIntervalId);
}

function getFloors(count = 0) {
  const container = document.createElement('div');
  let floors = '';
  for(let i = count; i > 0; i--) {
    floors += `<div class="floor"><div class="floor-number">${i}</div>
    <div class="buttons">
      <button data-floor-no=${i} data-direction="up" class="btn-round up"><span class="button fa fa-caret-up"></span></button>
      <button data-floor-no=${i} data-direction="down" class="btn-round down"><span class="button fa fa-caret-down"></span></button>
    </div></div>`;
  }
  container.innerHTML = floors;
  return container;
}
