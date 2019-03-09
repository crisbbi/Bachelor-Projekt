let imuWidth = 50;
let imuHeight = 10;
let imuDepth = 200;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}
	
function draw(){
	background(200);
	//rotateZ(KFangleX);
	camera(300, -50, (height / 150) / tan(Math.PI / 6), 0, 0, 0, 0, 1, 0);
	rotateX(KFangleX * (Math.PI / 180));
	rotateZ(KFangleY * (Math.PI / 180));
	fill(50,50,50); // black
	noStroke();
	beginShape(); 
	// left
	vertex(-imuDepth / 2, -imuHeight / 2, imuWidth / 2);
	vertex(-imuDepth / 2, imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, -imuHeight / 2, imuWidth / 2);
	endShape(CLOSE);
	// back
	fill(100,100,200); // purple
	beginShape();
	vertex(-imuDepth / 2, -imuHeight / 2, imuWidth / 2);
	vertex(-imuDepth / 2, imuHeight / 2, imuWidth / 2);
	vertex(-imuDepth / 2,imuHeight / 2, - imuWidth / 2);
	vertex(-imuDepth / 2,-imuHeight / 2, - imuWidth / 2);
	endShape(CLOSE);
	// RIGHT
	fill(100,200,200); // cyan
	beginShape();
	vertex(-imuDepth / 2, -imuHeight / 2, -imuWidth / 2);
	vertex(-imuDepth / 2, imuHeight / 2, -imuWidth / 2);
	vertex(imuDepth / 2, imuHeight / 2, -imuWidth / 2);
	vertex(imuDepth / 2, -imuHeight / 2, -imuWidth / 2);
	endShape(CLOSE);
	// front
	fill(50,200,100); // green
	beginShape();
	vertex(imuDepth / 2, -imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, imuHeight / 2, -imuWidth / 2);
	vertex(imuDepth / 2, -imuHeight / 2, -imuWidth / 2);
	endShape(CLOSE);
	// up
	fill(250,250,75); // yellow
	beginShape();
	vertex(-imuDepth / 2, -imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, -imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, -imuHeight / 2, -imuWidth / 2);
	vertex(-imuDepth / 2, -imuHeight / 2, -imuWidth / 2);
	endShape(CLOSE);
	// down
	fill(250,50,75); // red
	beginShape();
	vertex(-imuDepth / 2, imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, imuHeight / 2, imuWidth / 2);
	vertex(imuDepth / 2, imuHeight / 2, -imuWidth / 2);
	vertex(-imuDepth / 2, imuHeight / 2, -imuWidth / 2);
	endShape(CLOSE);
}