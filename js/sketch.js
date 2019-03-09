function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}
	
function draw(){
	background(200);
	//rotateZ(KFangleX);
	camera(320, 0, (height / 12) / tan(Math.PI / 6), 0, 0, 0, 1, 0, 0);
	rotateX(KFangleX * (Math.PI / 180));
	rotateY(KFangleY * (Math.PI / 180));
	box(100,100,20);
}