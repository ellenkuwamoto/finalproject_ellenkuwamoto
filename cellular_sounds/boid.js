//credit to Dan Shiffman for this flocking algorythem code 
//adapted by me

class Boid extends c2.Point{
    
  constructor() {
    let x = (random(width))
    let y = (random(height))
    super(x,y)
    this.position = createVector(this.x, this.y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4)); //controls speed range 
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;
  } 
    
    edges() {
        if (this.position.x > width) {
          this.position.x = 0;
        } else if (this.position.x < 0) {
          this.position.x = width;
        }
        if (this.position.y > height) {
          this.position.y = 0;
        } else if (this.position.y < 0) {
          this.position.y = height;
        }
      }
    
      align(boids) {
        let perceptionRadius = 25;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (other != this && d < perceptionRadius) {
            steering.add(other.velocity);
            total++;
          }
        }
        if (total > 0) {
          steering.div(total);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
      }
    
      separation(boids) {
        let perceptionRadius = 24;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (other != this && d < perceptionRadius) {
            let diff = p5.Vector.sub(this.position, other.position);
            diff.div(d * d);
            steering.add(diff);
            total++;
          }
        }
        if (total > 0) {
          steering.div(total);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
      }
    
      cohesion(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (other != this && d < perceptionRadius) {
            steering.add(other.position);
            total++;
          }
        }
        if (total > 0) {
          steering.div(total);
          steering.sub(this.position);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
      }

    
      flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
    
        alignment.mult(1.5);
        cohesion.mult(1);
        separation.mult(separationAmplify*1.5);
    
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);

        
      }
    
      update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
        this.x = this.position.x
        this.y = this.position.y

        
      }

      repulse () { 
        let cursorTarget = createVector(mouseX, mouseY)
        let repulsion 
        let repulsionStrength = 10
        let attractionToggle = false //easily switch between attraction and repulsion
        let perceptionRadius = 50; //
        let d = dist(this.position.x, this.position.y, mouseX, mouseY);
        if ( d < perceptionRadius) {
          repulsion = p5.Vector.sub(cursorTarget, this.position);
          repulsion.mult(-repulsionStrength)
          if(attractionToggle==true){
              repulsion.mult(-1)
          }
        }
        this.acceleration.add(repulsion);
      }
      /*
      i like that the effect from mouse imput
      is very subtle it feels more engaging 
      makes the cells feel squishy
      */
    
      show() {
        noStroke()
        fill(255)
        ellipse(this.position.x, this.position.y,cellAmplify,cellAmplify);
      }
}

