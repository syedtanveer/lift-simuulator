import './style.css';

//! DOM elements
const reset = document.getElementById('reset');
const form = document.getElementById('input-form');
const floorsInput = document.getElementById('floors');
const liftsInput = document.getElementById('lifts');
const building = document.getElementById('lift-simulator');
let lifts = null;
let numberOfFloors = 0;
//! Global variables
let queue = [];
let qIntervalId = null;


const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down'
}

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
  generateBuilding();
  building.style.display = 'block';
  lifts = Array.from(document.querySelectorAll('.gate-container')).map(lift => ({
    lastFloorVisited: 1,
    direction: null,
    canBeQueued: true,
    lift
  }));
  qIntervalId = setInterval(function checkQueue() {
    if(queue.length > 0) {
      const req = queue.shift();
      //get what lift to move, using some algorithm
      const {floorNo, direction}  =req;
      const nearestLift = getNearestLift(floorNo, direction);
      if(nearestLift === null) {
        queue.unshift(req);
        return;
      }
      nearestLift.canBeQueued = false;
      moveLift(floorNo, nearestLift, direction);
    }
  }, 400);
}

function getNearestLift(floorNo, direction) {
  const candidates  = lifts.filter(lift => {
    return (lift.canBeQueued);
  });
  candidates.sort((a, b) => {
    return Math.abs(a.lastFloorVisited - floorNo) - Math.abs(b.lastFloorVisited - floorNo);
  });
  return candidates[0] ? candidates[0] : null;
}

//? common functions
function moveLift(floorNo, lift, direction) {
  const dist = Math.abs(lift.lastFloorVisited - floorNo);
  move(lift.lift, dist, floorNo - 1);
  const doorLeft = lift.lift.querySelector('.door-left');
  const doorRight = lift.lift.querySelector('.door-right');
  let t1, t2, t3;
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
    lift.canBeQueued = true;
  }, 2000*(dist)+5000);
  if(floorNo === numberOfFloors){
    lift.direction = DIRECTIONS.DOWN;
  }
  else if(lift.lastFloorVisited - floorNo < 0) {
    lift.direction = DIRECTIONS.UP;
  }
  else if(lift.lastFloorVisited - floorNo === 0) {
    lift.direction = direction;
  }
  else {
    lift.direction = DIRECTIONS.DOWN;
  }
  lift.lastFloorVisited = floorNo;
}

function move(lift, liftTime, floorNo) {
  const floorShift = floorNo*-100 + '%';
  const borderShift =  floorNo*8+'px';
  lift.style.transition = `transform ${liftTime*2}s linear`;
  lift.style.transform = `translateY(calc(${floorShift} - ${borderShift}))`;
}

function generateBuilding(){
  resetSimulator();
  const intFloors = parseInt(floorsInput.value);
  const noOfFloors = isNaN(intFloors) || intFloors <= 0 ? 0 : intFloors;
  if(noOfFloors === 0) return;
  numberOfFloors = noOfFloors;
  const intLifts = parseInt(liftsInput.value);
  const noOfLifts = isNaN(intLifts) || intLifts <= 0 ? 0 : intLifts;
  if(noOfLifts === 0) return;

  const floors = getFloors(noOfFloors);
  addLiftsToBuilding(floors, noOfLifts);
  building.appendChild(floors);
}

function addLiftRequest(request) {
  queue.push(request);
}

function addLiftsToBuilding(building, count) {
  let totalWidth = 13;
  //? for now we are adding 1 lift
  for(let i = 0; i < count; i++) {
    const lift = document.createElement('div');
    lift.style.left = (5 + 6.4*(i+1)) + 'rem';
    totalWidth += 6.4;
    lift.classList.add('gate-container');
    lift.innerHTML = `<div class="gate">
      <div class="door door-left"></div>
      <div class="door door-right"></div>
    </div>`;
    building.lastChild.append(lift);
  }

  //Resize building if there are too many lifts
  const liftsWidth = convertRemToPixels(totalWidth);
  if(getBuildingWidth() < liftsWidth) {
    building.style.width = liftsWidth+'px';
  }
  document.documentElement.style.setProperty('--total-lifts-width', liftsWidth);
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
      <button data-floor-no=${i} data-direction="up" class="btn-round up"><span class="button fa-solid fa-caret-up"></span></button>
      <button data-floor-no=${i} data-direction="down" class="btn-round down"><span class="button fa-solid fa-caret-down"></span></button>
    </div></div>`;
  }
  container.innerHTML = floors;
  return container;
}

function convertRemToPixels(rem) {   
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getBuildingWidth() {
  return Math.min(document.documentElement.offsetWidth*.92, 1368);
}