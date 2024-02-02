class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(1.5, 4));
    this.acceleration = createVector();
    this.maxForce = 0.05;
    this.maxSpeed = random(1, 5);
    // this.hue = random(1, 360);
    this.hue = this.maxSpeed * 60;
  }

  wrapAround() {
    if (this.position.x > width) {
      this.position.x = this.position.x - width;
    } else if (this.position.x < 0) {
      this.position.x = width - this.position.x;
    }
    if (this.position.y > height) {
      this.position.y = this.position.y - height;
    } else if (this.position.y < 0) {
      this.position.y = height - this.position.y;
    }
  }

  calculateVelocities(boids) {
    let perceptionRadius = 50;
    let alignVelocity = createVector();
    let cohesionVelocity = createVector();
    let separationVelocity = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (this !== other && d < perceptionRadius) {
        // Alignment
        alignVelocity.add(other.velocity);

        // Cohesion
        cohesionVelocity.add(other.position);
        total++;

        // Separation
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d ^ 2); // Force is inversely proportional to the distance to the other boid
        separationVelocity.add(diff);
      }
    }
    if (total > 0) {
      alignVelocity.div(total);
      alignVelocity.setMag(this.maxSpeed);
      alignVelocity.sub(this.velocity);
      alignVelocity.limit(this.maxForce);

      cohesionVelocity.div(total);
      cohesionVelocity.sub(this.position);
      cohesionVelocity.setMag(this.maxSpeed);
      cohesionVelocity.sub(this.velocity);
      cohesionVelocity.limit(this.maxForce);

      separationVelocity.div(total);
      separationVelocity.setMag(this.maxSpeed);
      separationVelocity.sub(this.velocity);
      separationVelocity.limit(this.maxForce);
    }
    return {
      "alignVelocity": alignVelocity,
      "cohesionVelocity": cohesionVelocity,
      "separationVelocity": separationVelocity
    };
  }

  // align(boids) {
  //   let perceptionRadius = 50;
  //   let desiredVelocity = createVector();
  //   let total = 0;
  //   for (let other of boids) {
  //     let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
  //     if (this !== other && d < perceptionRadius) {
  //       desiredVelocity.add(other.velocity);
  //       total++;
  //     }
  //   }
  //   if (total > 0) {
  //     desiredVelocity.div(total);
  //     desiredVelocity.setMag(this.maxSpeed);
  //     desiredVelocity.sub(this.velocity);
  //     desiredVelocity.limit(this.maxForce);
  //   }
  //   return desiredVelocity;
  // }

  flock(boids) {
    let {alignVelocity, cohesionVelocity, separationVelocity} = this.calculateVelocities(boids);

    alignVelocity.mult(alignSlider.value());
    cohesionVelocity.mult(cohesionSlider.value());
    separationVelocity.mult(separationSlider.value());

    this.acceleration.add(alignVelocity);
    this.acceleration.add(cohesionVelocity);
    this.acceleration.add(separationVelocity);
  }

  update() {
    this.wrapAround();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(8);
    stroke(this.hue, 255, 255);
    // color(this.hue);
    point(this.position.x, this.position.y);
  }
}