const flock = [];
const numBoids = 5;

let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(640, 420);
  colorMode(HSB, 360, 255, 255);
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  separationSlider = createSlider(0, 5, 1, 0.1);
  for (let i = 0; i < numBoids; i++) {
    flock.push(new Boid());
  }
}

function mouseClicked(event) {
  // for (let existingBoid of flock) {
  //   existingBoid.hue = 100;
  // }

  let boid = new Boid();
  boid.position.x = event.x;
  boid.position.y = event.y;
  // boid.hue = 1;
  flock.push(boid);
}

function draw() {
  background(51);

  let tempFlock = [...flock];
  for (let boid of flock) {
    boid.flock(tempFlock);
    boid.update();
    boid.show();
  }
}
