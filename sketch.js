let density = 0.005; // Background line density
let squareColor, strokeColor, baseColors;
let baseUnits = []; // Array of small rectangles holding bases
let baseX;
let flyingBalls = []; // Array of flying balls
let headnumber = 3

// BicolorCircle class
class BicolorCircle {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
  }

  display() {
    // Setting a uniform stroke
    stroke(strokeColor);
    strokeWeight(1.5);

    // Draw the top half red
    fill('#fc4b46');                                                                                                  
    arc(this.x, this.y, this.diameter, this.diameter, PI, 0);

    // Drawing the lower half green
    fill('#5ea269');
    arc(this.x, this.y, this.diameter, this.diameter, 0, PI);

    // Drawing the yellow line dividing the center
    stroke('#e4be6e');
    line(this.x - this.diameter / 2 + 3, this.y, this.x + this.diameter / 2 - 3, this.y);
  }
}

class FlyingBicolorCircle extends BicolorCircle {
  constructor(x, y, diameter) {
    super(x, y, diameter);
    this.speedY = -15;
    this.speedX = random(-2, 2);
    this.active = true; // Whether the ball is shown on the screen
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    
    // Define the range of the mouse
    let mouseRangeLeft = mouseX - 50;
    let mouseRangeRight = mouseX + 50;

    // Bounce back after reaching the top
    if (this.y < this.diameter / 2) {
      this.y = this.diameter / 2;
      this.speedY *= -1;
    }
    
    // Bounce back after reaching the bottom
    if (this.y > height * 0.6 - this.diameter / 2) {
      if (this.x > mouseRangeLeft && this.x < mouseRangeRight) {
        this.y = height * 0.6 - this.diameter / 2;
        this.speedY *= -1;
      }

      // Mark as not active
      else if(this.y > height - this.diameter / 2) {
        this.active = false;
      }
    }

    // Bounce back after reaching the left or right
    if (this.x < this.diameter / 2 || this.x > width - this.diameter / 2) {
      this.speedX *= -1;
    }
  }
}

// RectangleUnit class
class RectangleUnit {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.semicircleDiameter = random(width * 0.5, width * 0.75);
    this.bottomSemicircleColor = random(baseColors);
  }

  display() {
    // Rectangular base
    stroke('#e4be6e'); 
    strokeWeight(3);
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);

    // Drawing the bottom half-circle
    noStroke(); 
    fill(this.bottomSemicircleColor);
    arc(
      this.x + this.width / 2,
      this.y + this.height - 1.5,
      this.semicircleDiameter,
      this.semicircleDiameter, 
      PI, TWO_PI
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#1E3A5F');
  strokeWeight(0.5); 
  stroke(255, 255, 102, 50);
  noFill();

  // Define uniform stroke colours
  strokeColor = '#3c4449';

  // Calculate the number of lines based on the canvas area
  let numBranches = int(windowWidth * windowHeight * density);

  // background line
  for (let i = 0; i < numBranches; i++) {
    drawBranch(random(width), random(height));
  }

  // Drawing Squares
  squareColor = color('#69a27d');
  drawGreenSquares();

  // Creating a base
  baseColors = ['#e4be6e', '#5ea269', '#fc4b46'];
  createBase();

  baseX = windowWidth / 2;

  // Drawing a base
  drawBase();

  // Drawing Circles
  drawConnectedCircles();
}

  // Drawing Circles
function drawConnectedCircles() {
  let squareSize = height * 0.05;
  let baseWidth = squareSize * 3.5;
  let rectWidth = baseWidth / 6;
  let yPosition = height * 0.8 - (rectWidth * 1.5) / 2;

    // Record data for the bottom five horizontal circles
  let diameters = [];
  let totalWidth = 0;
  for (let i = 0; i < 5; i++) {
    let diameter = random(rectWidth * 0.5, rectWidth);
    diameters.push(diameter);
    totalWidth += diameter;
  }

  let startX = baseX - totalWidth / 2; 

  // Draw the bottom five horizontal circles
  let currentX = startX;
  for (let i = 0; i < 5; i++) {
    let circleDiameter = diameters[i];
    let bicolorCircle = new BicolorCircle(currentX + circleDiameter / 2, yPosition, circleDiameter);
    bicolorCircle.display();
    currentX += circleDiameter;

    // Draw six vertical circles for the third circle
    if (i === 2) {

      // Record data with the fifth circle as the reference
      let verticalY = yPosition - circleDiameter / 2;
      let fifthVerticalCircleY = null;
      let fifthCircleDiameter = null;

      for (let j = 0; j < 6; j++) {
        let verticalDiameter = random(rectWidth * 0.75, rectWidth * 1.25);
        // Rotate 90 degrees
        push();
        translate(currentX - circleDiameter / 2, verticalY - verticalDiameter / 2);
        rotate(HALF_PI);
        let verticalCircle = new BicolorCircle(0, 0, verticalDiameter);
        verticalCircle.display();
        pop();
        
        // Record the centre position and diameter at the fifth vertical circle
        if (j === 4) {
          fifthVerticalCircleY = verticalY;
          fifthCircleDiameter = verticalDiameter;
        }
        verticalY -= verticalDiameter;
      }

      // Add horizontal circles to the left and right sides of the fifth vertical circle.
      if (fifthVerticalCircleY !== null && fifthCircleDiameter !== null) {
        let adjustedY = fifthVerticalCircleY - fifthCircleDiameter / 2;
        let leftDiameters = [];
        let leftTotalWidth = 0;

        // Record data for the fifth circle
        for (let k = 0; k < 4; k++) {
          let leftDiameter = random(rectWidth * 0.5, rectWidth);
          leftDiameters.push(leftDiameter);
          leftTotalWidth += leftDiameter;
        }

        let leftStartX = currentX - circleDiameter / 2 - fifthCircleDiameter / 2 - leftTotalWidth;

        // Draw four horizontal circles on the left side
        for (let k = 0; k < 4; k++) {
          let leftCircleDiameter = leftDiameters[k];
          let leftCircleX = leftStartX + leftCircleDiameter / 2;
          let leftCircle = new BicolorCircle(leftCircleX, adjustedY, leftCircleDiameter);
          leftCircle.display();
          leftStartX += leftCircleDiameter;

          // Draw four vertical circles on the left side
          if (k === 0) {
            let verticalY = adjustedY - leftCircleDiameter / 2;
            for (let j = 0; j < 4; j++) {
              let verticalDiameter = random(rectWidth * 0.75, rectWidth * 1);
              // Rotate 90 degrees
              push();
              translate(leftCircleX, verticalY - verticalDiameter / 2);
              rotate(HALF_PI);
              let verticalCircle = new BicolorCircle(0, 0, verticalDiameter);
              verticalCircle.display();
              pop();
              verticalY -= verticalDiameter;
            }
          }
        }

        // Draw three horizontal circles on the right side
        let rightDiameters = [];
        let rightTotalWidth = 0;

        for (let k = 0; k < 3; k++) {
          let rightDiameter = random(rectWidth * 0.5, rectWidth);
          rightDiameters.push(rightDiameter);
          rightTotalWidth += rightDiameter;
        }

        let rightStartX = currentX - circleDiameter / 2 + fifthCircleDiameter / 2;

        for (let k = 0; k < 3; k++) {
          let rightCircleDiameter = rightDiameters[k];
          let rightCircleX = rightStartX + rightCircleDiameter / 2;
          let rightCircle = new BicolorCircle(rightCircleX, adjustedY, rightCircleDiameter);
          rightCircle.display();
          rightStartX += rightCircleDiameter;

          if (k === 2) {
            let verticalY = adjustedY - rightCircleDiameter / 2;
            for (let j = 0; j < 4; j++) {
              let verticalDiameter = random(rectWidth * 0.75, rectWidth * 1);
              // Rotate 90 degrees
              push();
              translate(rightCircleX, verticalY - verticalDiameter / 2);
              rotate(HALF_PI);
              let verticalCircle = new BicolorCircle(0, 0, verticalDiameter);
              verticalCircle.display();
              pop();
              verticalY -= verticalDiameter;
            }
          }
        }
      }

      // Draw three horizontal circles above the vertical circle.
      let topYPosition = verticalY;
      let topDiameters = [];
      let topTotalWidth = 0;

      // Generate the diameters of the top three horizontal circles and calculate the total width
      for (let k = 0; k < headnumber; k++) {
        let topDiameter = random(rectWidth * 0.5, rectWidth);
        topDiameters.push(topDiameter);
        topTotalWidth += topDiameter;
      }

      // Calculate the starting x-position of the top horizontal alignment so that it is centred
      let topStartX = currentX - circleDiameter / 2 - topTotalWidth / 2;

      // Draw three circles horizontally aligned at the top
      for (let k = 0; k < headnumber; k++) {
        let topCircleDiameter = topDiameters[k];
        let topCircleX = topStartX + topCircleDiameter / 2;
        let topCircle = new BicolorCircle(topCircleX, topYPosition - topCircleDiameter / 2, topCircleDiameter);
        topCircle.display();
        topStartX += topCircleDiameter;
      }
    }
  }
}

// Drawing background lines
function drawBranch(startX, startY) {
  let length = random(20, 50);
  let angle = random(TWO_PI);

  beginShape();
  let x = startX;
  let y = startY;
  for (let i = 0; i < length; i++) {
    vertex(x, y);
    x += cos(angle) * 2;
    y += sin(angle) * 2;
    angle += (noise(x * 0.005, y * 0.005) - 0.5) * 0.2;
  }
  endShape();
}

// Drawing green squares
function drawGreenSquares() {
  let squareSize = height * 0.05;
  let numSquares = width / squareSize;
  let yPositionBase = height * 0.8;

  fill(squareColor);
  stroke(strokeColor);
  strokeWeight(3);

  for (let i = 0; i < numSquares; i++) {
    let yOffset = random(-5, 5);
    rect(i * squareSize, yPositionBase + yOffset, squareSize, squareSize);
  }
}

// Creating a base
function createBase() {
  // Proportionally sizing small rectangles
  let squareSize = height * 0.05;
  let baseWidth = squareSize * 3.5;
  let rectWidth = baseWidth / 6;
  let rectHeight = rectWidth * 1.5;
  let yPosition = height * 0.8 - rectHeight / 2;

  // Create small rectangles for the base and store them in an array.
  baseUnits = [];
  for (let i = 0; i < 6; i++) {
    let x = (width - baseWidth) / 2 + i * rectWidth;
    let color = random(baseColors);
    let unit = new RectangleUnit(x, yPosition, rectWidth, rectHeight, color);
    baseUnits.push(unit);
  }
}

// Drawing the base
function drawBase() {
  let squareSize = height * 0.05;
  let baseWidth = squareSize * 3.5;
  let rectWidth = baseWidth / 6;
  let rectHeight = rectWidth * 1.5;
  let yPosition = height * 0.8 - rectHeight / 2;

  // Control the position use the basX
  push();
  translate(baseX - baseWidth / 2, yPosition);
  stroke(strokeColor);
  strokeWeight(1.5);
  noFill();
  rect(-3, -3, baseWidth + 6, rectHeight + 6);
  pop();

  // Draw each small rectangle
  for (let i = 0; i < baseUnits.length; i++) {
    let unit = baseUnits[i];
    unit.x = baseX - baseWidth / 2 + i * rectWidth;
    unit.display();
  }
}

// Adaptation to screen size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

function draw() {
  // Update the baseX as the mouseX
  baseX = mouseX;

  background('#1E3A5F');
  strokeWeight(0.5); 
  stroke(255, 255, 102, 50);
  noFill();

  strokeColor = '#3c4449';

  // Calculate the number of lines based on the canvas area
  let numBranches = int(windowWidth * windowHeight * density);

  // background line
  for (let i = 0; i < numBranches; i++) {
    drawBranch(random(width), random(height));
  }

  // Drawing Squares
  squareColor = color('#69a27d');
  drawGreenSquares();

  drawBase();
  drawConnectedCircles();

  for (let i = flyingBalls.length - 1; i >= 0; i--) {
    let ball = flyingBalls[i];
    ball.update();
    ball.display();

    // Remove the not active balls
    if (!ball.active) {
      flyingBalls.splice(i, 1);
    }
  }

  if (flyingBalls.length === 0 && headnumber <= 0) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}

// Generate a new ball when mose pressed 
function mousePressed() {
  // Limit the amount of balls
  if (flyingBalls.length < 3 && headnumber > 0) {
    let ball = new FlyingBicolorCircle(mouseX, height * 0.6, 20);
    flyingBalls.push(ball);
    headnumber -= 1; // Reduce the headnumber
  }
}