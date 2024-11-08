let density = 0.005; // 背景线条密度
let squareColor, strokeColor, baseColors;
let baseUnits = []; // 存放底座小长方形的数组
let baseX; // 底座水平位置
let flyingBalls = []; // 存储所有生成的飞行球
let headnumber = 3

// BicolorCircle 类
class BicolorCircle {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
  }

  display() {
    // 设置统一的描边
    stroke(strokeColor);
    strokeWeight(1.5);

    // 绘制上半边红色
    fill('#fc4b46');                                                                                                  
    arc(this.x, this.y, this.diameter, this.diameter, PI, 0);

    // 绘制下半边绿色
    fill('#5ea269');
    arc(this.x, this.y, this.diameter, this.diameter, 0, PI);

    // 绘制中间的黄线分界
    stroke('#e4be6e');
    line(this.x - this.diameter / 2 + 3, this.y, this.x + this.diameter / 2 - 3, this.y);
  }
}

class FlyingBicolorCircle extends BicolorCircle {
  constructor(x, y, diameter) {
    super(x, y, diameter); // 继承父类的构造函数
    this.speedY = -15; // 初始向上速度
    this.speedX = random(-2, 2); // 随机的水平速度
    this.active = true; // 新增属性，用于检测球是否活跃
  }

  // 更新位置并检测边缘反弹
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    
    // 定义鼠标范围的边界
    let mouseRangeLeft = mouseX - 50;
    let mouseRangeRight = mouseX + 50;

    // 碰到顶部边缘反弹
    if (this.y < this.diameter / 2) {
      this.y = this.diameter / 2;
      this.speedY *= -1;
    }
    
    // 碰到底部边缘反弹
    if (this.y > height * 0.6 - this.diameter / 2) {
      if (this.x > mouseRangeLeft && this.x < mouseRangeRight) {
        this.y = height * 0.6 - this.diameter / 2;
        this.speedY *= -1; // 在鼠标范围内反弹
      }
      else if(this.y > height - this.diameter / 2) {
        // 超出反弹范围，标记为不活跃
        this.active = false;
      }
    }

    // 碰到左右边缘反弹
    if (this.x < this.diameter / 2 || this.x > width - this.diameter / 2) {
      this.speedX *= -1;
    }
  }

  // 直接使用父类的 display() 方法
}

// RectangleUnit 类
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
    // 小长方形底座
    stroke('#e4be6e'); 
    strokeWeight(3);
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);

    // 绘制底边半圆
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

  // 定义统一的描边颜色
  strokeColor = '#3c4449';

  // 根据画布面积计算线条数量
  let numBranches = int(windowWidth * windowHeight * density);

  // 背景线条
  for (let i = 0; i < numBranches; i++) {
    drawBranch(random(width), random(height));
  }

  // 绘制正方形
  squareColor = color('#69a27d');
  drawGreenSquares();

  // 创建底座
  baseColors = ['#e4be6e', '#5ea269', '#fc4b46'];
  createBase();

  // 初始化底座 X 坐标
  baseX = windowWidth / 2;

  // 绘制底座
  drawBase();

  // 绘制圆
  drawConnectedCircles();
}

function drawConnectedCircles() {
  let squareSize = height * 0.05;
  let baseWidth = squareSize * 3.5;
  let rectWidth = baseWidth / 6;
  let yPosition = height * 0.8 - (rectWidth * 1.5) / 2;

  let diameters = [];
  let totalWidth = 0;
  for (let i = 0; i < 5; i++) {
    let diameter = random(rectWidth * 0.5, rectWidth);
    diameters.push(diameter);
    totalWidth += diameter;
  }

  let startX = baseX - totalWidth / 2; // 水平中心位置

  let currentX = startX;
  for (let i = 0; i < 5; i++) {
    let circleDiameter = diameters[i];
    let bicolorCircle = new BicolorCircle(currentX + circleDiameter / 2, yPosition, circleDiameter);
    bicolorCircle.display();
    currentX += circleDiameter;

    if (i === 2) {
      // 绘制上方的竖直和水平圆
      let verticalY = yPosition - circleDiameter / 2;
      let fifthVerticalCircleY = null;
      let fifthCircleDiameter = null;

      for (let j = 0; j < 6; j++) {
        let verticalDiameter = random(rectWidth * 0.75, rectWidth * 1.25);
        push();
        translate(currentX - circleDiameter / 2, verticalY - verticalDiameter / 2);
        rotate(HALF_PI);
        let verticalCircle = new BicolorCircle(0, 0, verticalDiameter);
        verticalCircle.display();
        pop();
        if (j === 4) {
          fifthVerticalCircleY = verticalY;
          fifthCircleDiameter = verticalDiameter;
        }
        verticalY -= verticalDiameter;
      }

      if (fifthVerticalCircleY !== null && fifthCircleDiameter !== null) {
        let adjustedY = fifthVerticalCircleY - fifthCircleDiameter / 2;
        let leftDiameters = [];
        let leftTotalWidth = 0;

        for (let k = 0; k < 4; k++) {
          let leftDiameter = random(rectWidth * 0.5, rectWidth);
          leftDiameters.push(leftDiameter);
          leftTotalWidth += leftDiameter;
        }

        let leftStartX = currentX - circleDiameter / 2 - fifthCircleDiameter / 2 - leftTotalWidth;

        for (let k = 0; k < 4; k++) {
          let leftCircleDiameter = leftDiameters[k];
          let leftCircleX = leftStartX + leftCircleDiameter / 2;
          let leftCircle = new BicolorCircle(leftCircleX, adjustedY, leftCircleDiameter);
          leftCircle.display();
          leftStartX += leftCircleDiameter;

          if (k === 0) {
            let verticalY = adjustedY - leftCircleDiameter / 2;
            for (let j = 0; j < 4; j++) {
              let verticalDiameter = random(rectWidth * 0.75, rectWidth * 1);
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

      let topYPosition = verticalY;
      let topDiameters = [];
      let topTotalWidth = 0;

      for (let k = 0; k < headnumber; k++) {
        let topDiameter = random(rectWidth * 0.5, rectWidth);
        topDiameters.push(topDiameter);
        topTotalWidth += topDiameter;
      }

      let topStartX = currentX - circleDiameter / 2 - topTotalWidth / 2;

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

// 绘制背景线条
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

// 绘制绿色正方形
function drawGreenSquares() {
  let squareSize = height * 0.05;
  let numSquares = width / squareSize;
  let yPositionBase = height * 0.8;

  fill(squareColor);
  stroke(strokeColor);
  strokeWeight(3);

  for (let i = 0; i < numSquares; i++) {
    let yOffset = random(-5, 5); // 上下随机偏移，范围在 -5 到 5 像素之间
    rect(i * squareSize, yPositionBase + yOffset, squareSize, squareSize);
  }
}

// 创建底座
function createBase() {
  // 按比例计算小长方形大小
  let squareSize = height * 0.05;
  let baseWidth = squareSize * 3.5;
  let rectWidth = baseWidth / 6;
  let rectHeight = rectWidth * 1.5;
  let yPosition = height * 0.8 - rectHeight / 2;

  // 创建底座的小长方形并存储到数组
  baseUnits = [];
  for (let i = 0; i < 6; i++) {
    let x = (width - baseWidth) / 2 + i * rectWidth;
    let color = random(baseColors);
    let unit = new RectangleUnit(x, yPosition, rectWidth, rectHeight, color);
    baseUnits.push(unit);
  }
}

function drawBase() {
  let squareSize = height * 0.05;
  let baseWidth = squareSize * 3.5;
  let rectWidth = baseWidth / 6;
  let rectHeight = rectWidth * 1.5;
  let yPosition = height * 0.8 - rectHeight / 2;

  // 绘制底座的外围描边
  push();
  translate(baseX - baseWidth / 2, yPosition); // 使用 baseX 控制底座水平位置
  stroke(strokeColor);
  strokeWeight(1.5);
  noFill();
  rect(-3, -3, baseWidth + 6, rectHeight + 6);
  pop();

  // 绘制每个小长方形
  for (let i = 0; i < baseUnits.length; i++) {
    let unit = baseUnits[i];
    unit.x = baseX - baseWidth / 2 + i * rectWidth; // 根据 baseX 动态设置每个小长方形的水平位置
    unit.display();
  }
}

// 适应屏幕大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

function draw() {
  // 更新 baseX 为鼠标的 X 坐标
  baseX = mouseX;

  background('#1E3A5F');
  strokeWeight(0.5); 
  stroke(255, 255, 102, 50);
  noFill();

  // 定义统一的描边颜色
  strokeColor = '#3c4449';

  // 根据画布面积计算线条数量
  let numBranches = int(windowWidth * windowHeight * density);

  // 背景线条
  for (let i = 0; i < numBranches; i++) {
    drawBranch(random(width), random(height));
  }

  // 绘制正方形
  squareColor = color('#69a27d');
  drawGreenSquares();

  // 使用最新的 baseX 重新绘制底座和连接的圆
  drawBase();
  drawConnectedCircles();

  for (let i = flyingBalls.length - 1; i >= 0; i--) {
    let ball = flyingBalls[i];
    ball.update();
    ball.display();

    // 移除不活跃的球
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

// 在鼠标点击时生成一个新球
function mousePressed() {
  // 只允许生成最多 3 个球
  if (flyingBalls.length < 3 && headnumber > 0) {
    let ball = new FlyingBicolorCircle(mouseX, height * 0.6, 20);
    flyingBalls.push(ball);
    headnumber -= 1; // 减少 headnumber
  }
}