//////////////////////////////////////////////////////////////////
// Assignment 1:  Programing
/////////////////////////////////////////////////////////////////


// SETUP RENDERER AND SCENE
var scene = new THREE.Scene();
var body;
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP BACKGROUND

// Load the background texture
var bgScene = new THREE.Scene();
var bgTexture = THREE.ImageUtils.loadTexture('images/bgImage.jpg');
var bgMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2,2,0),
  new THREE.MeshBasicMaterial({
    map: bgTexture, side: THREE.DoubleSide 
  }));

bgScene.background = bgTexture;
bgTexture.wrapS = THREE.MirroredRepeatWrapping;
bgTexture.wrapT = THREE.MirroredRepeatWrapping;


bgMesh.material.depthTest = false;
bgMesh.material.depthWrite = false;

//Add components to background scene
var bgCam = new THREE.Camera();
bgScene.add(bgCam);
bgScene.add(bgMesh);


// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(-8,3,10);
positionCamera(scene);
scene.add(camera);


// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.update();
////////////////////////////////////////////////////////////////////////////////
//  loadOBJ( ):  loads OBJ file vertex mesh, with vertex normals
////////////////////////////////////////////////////////////////////////////////

function loadOBJ(objName, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };
  var onError = function() {
    console.log('Failed to load ' + file);
  };
  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.name = objName;
    scene.add(object);

  }, onProgress, onError);
}

////////////////////////////////////////////////////////////////////////////////////
//   resize( ):  adjust camera parameters if the window is resized
////////////////////////////////////////////////////////////////////////////////////

function resize() {
  
  var aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
//  printMatrix('camera',camera.projectionMatrix);
}

window.addEventListener('resize', resize);
resize();

////////////////////////////////////////////////////////////////////////////////////
//   create the needed objects
////////////////////////////////////////////////////////////////////////////////////

  // FLOOR WITH CHECKERBOARD 

var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(20, 20);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

/////////////////////////////////////////////////////////////////////////////////////
//   Create sky with clouds
/////////////////////////////////////////////////////////////////////////////////////


  // LIGHTS:  needed for phong illumination model

var light = new THREE.PointLight(0xFFFFFF);
light.position.x=-70;
light.position.y=100;
light.position.z=70;
scene.add(light);
var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

  // MATERIALS

var brownMaterial = new THREE.MeshPhongMaterial( { 
     ambient: 0x402020, color: 0x483D8B, specular: 0x808080, shininess: 10.0, shading: THREE.SmoothShading });
var whiteMaterial = new THREE.MeshPhongMaterial( { 
     ambient: 0x404040, color: 0x808080, specular: 0x808080, shininess: 40.0, shading: THREE.SmoothShading });
var normalMaterial = new THREE.MeshNormalMaterial();

////////////////////////////////////////////////////////////////
// Create Leg Geometry
///////////////////////////////////////////////////////////////

// Sphere: Knee geometry

var sphereGeometry = new THREE.SphereGeometry( 0.1, 7, 7 );
var frontRK = new THREE.Mesh( sphereGeometry, whiteMaterial );
scene.add( frontRK );
frontRK.matrixAutoUpdate = false;

// Front left knee
var frontLK = new THREE.Mesh( sphereGeometry, whiteMaterial );
scene.add( frontLK );
frontLK.matrixAutoUpdate = false;

// Front right thigh

var legLength = 0.4;
var legAngle = 30;       // animation parameter
var legGeometry = new THREE.CylinderGeometry( 0.13, 0.1, legLength );
var calfGeometry = new THREE.CylinderGeometry (0.1, 0.05, legLength );

var frontRT = new THREE.Mesh( legGeometry, brownMaterial );
frontRT.name ='leg';
scene.add( frontRT );
frontRT.matrixAutoUpdate = false;

////////////////////////
// Set up bounding sphere
///////////////////////


// Front left thigh
var frontLT = new THREE.Mesh(legGeometry, brownMaterial);
scene.add(frontLT);
frontLT.matrixAutoUpdate = false;

// Front right calf
var frontRC = new THREE.Mesh( calfGeometry, brownMaterial);
scene.add( frontRC );
frontRC.matrixAutoUpdate = false;

// Front left calf
var frontLC = new THREE.Mesh( calfGeometry,brownMaterial);
scene.add(frontLC);
frontLC.matrixAutoUpdate = false;

//Back right thigh
var backRT = new THREE.Mesh(legGeometry,brownMaterial);
scene.add(backRT);
backRT.matrixAutoUpdate = false;

//Back right knee
var backRK = new THREE.Mesh( sphereGeometry, whiteMaterial);
scene.add(backRK);
backRK.matrixAutoUpdate = false;

//Back right calf
var backRC = new THREE.Mesh(calfGeometry,brownMaterial);
scene.add(backRC);
backRC.matrixAutoUpdate = false;

//Back left thigh
var backLT = new THREE.Mesh(legGeometry,brownMaterial);
scene.add(backLT);
backLT.matrixAutoUpdate = false;

//Back left knee
var backLK = new THREE.Mesh( sphereGeometry, whiteMaterial);
scene.add(backLK);
backLK.matrixAutoUpdate = false;

//Back left calf
var backLC = new THREE.Mesh(calfGeometry,brownMaterial);
scene.add(backLC);
backLC.matrixAutoUpdate = false; 

 // Body

loadOBJ('body','centaur/cent_no_legs.obj',normalMaterial,1,0,0,0,0,0,0);

///////////////////////////////////////////////////////////////////
// printMatrix():  prints a matrix
//////////////////////////////////////////////////////////////////

function printMatrix(name,matrix) {       // matrices are stored column-major, although matrix.set() uses row-major
    console.log('Matrix ',name);
    var e = matrix.elements;
    console.log(e[0], e[4], e[8], e[12]);
    console.log(e[1], e[5], e[9], e[13]);
    console.log(e[2], e[6], e[10], e[14]);
    console.log(e[3], e[7], e[11], e[15]);
}

//////////////////////////////////////////////////////////////////
// setupBody():  build model Matrix for body, and then its children
//////////////////////////////////////////////////////////////////

var bodyHeight=0.2;
var bodyAngle =0;
var bodyDistance =0;
var pose = 4;
////////////////////////// !! change body height to bring centaur down

function setupBody(parentMatrix) {
  body.matrix.copy(parentMatrix);     // copy the parent link transformation
  
  //Makes the horse walk within the checkered plane
  if(bodyDistance > 10){
    bodyDistance = -10;
  }
  body.matrix.multiply(new THREE.Matrix4().makeTranslation(0,bodyHeight,bodyDistance));
  body.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI/24));
  switch(pose){
    case 0:
    {
      body.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0.15,0));
      body.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI/6.0));
    }
    break;
    case 1:
    {
      body.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0.3,0));
      body.matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI/8.0));
    }
    break;
    case 3: 
      body.matrix.multiply(new THREE.Matrix4().makeTranslation(0,0.4,0));
    break;
    case 5:
    {
      body.matrix.multiply(new THREE.Matrix4().makeRotationY(180));
      
    }
    break;
    default:
    break;
  } 
  setupLeg(body.matrix);
//  setUpCamera(body.matrix);
// body.matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));   // post multiply by scale matrix, to scale down body geometry
  body.matrix.multiply(new THREE.Matrix4().makeScale(0.07,0.07,0.07));   // post multiply by scale matrix, to scale down body geometry
  body.updateMatrixWorld();         // force update of internal body.matrixWorld
}

////////////////////////////////////////////////////////////////
//  setUpCamera(): change camera position
////////////////////////////////////////////////////////////////

function positionCamera(obj)
{
   camera.lookAt(obj.position);
   camera.updateProjectionMatrix();
}


//////////////////////////////////////////////////////////////////
// setupHead():  build model Matrix for head
//////////////////////////////////////////////////////////////////

 legAngle = 1;   // - 15 and 25
 var legAngleL = 1;
 pose = -1;
 
function setupLeg(parentMatrix) {


//printMatrix("leg parent",parentMatrix);
  frontRT.matrix.copy(parentMatrix);     // copy the parent link transformation             // for front: (-0.2, 0.65, 0.5)
  frontRT.matrix.multiply(new THREE.Matrix4().makeTranslation(-0.2, 0.68,0.35));
  if(pose == -1 || pose == 4 || pose ==5){
    frontRT.matrix.multiply(new THREE.Matrix4().makeRotationX(25)); // legAngle
  }else {
  frontRT.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngle*Math.PI/180.0)); 
  }
  frontRT.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));              // post multiply by translate matrix
  frontRT.updateMatrixWorld();         // force update of internal body.matrixWorld
  

//Set up knee
  frontRK.matrix.copy(frontRT.matrix);     // copy the parent link transformation              // for front: (0.0,-0.1,0.0)
  frontRK.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));              // post multiply by translate matrix
  frontRK.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));              // post multiply by translate matrix
  frontRK.updateMatrixWorld();         // force update of internal body.matrixWorld

  frontRC.matrix.copy(frontRK.matrix);
  frontRC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));                     // for front: (0.0,-0.1,0.0)
  if(pose == 2){
    frontRC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngle*Math.PI/140.0));
    frontRC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,0.0,-0.1));
  }
  if(pose == 3){
    frontRC.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngle*Math.PI/180.0));
  }
  else if(pose == 1){
    frontRC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngle*Math.PI/180.0));
  }
  else if(pose == -1 || pose == 5){
    frontRC.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngle*Math.PI/180.0));
  }
  else{
    frontRC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngle*Math.PI/90.0));
  }
  
  frontRC.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0)); 
  frontRC.updateMatrixWorld();
  
  //Front left leg
  frontLT.matrix.copy(parentMatrix);
  frontLT.matrix.multiply(new THREE.Matrix4().makeTranslation(0.2, 0.7, 0.35));              // post multiply by translate matrix
  
  if(pose == -1 || pose == 4){
    frontLT.matrix.multiply(new THREE.Matrix4().makeRotationX(25));
  }else {
  frontLT.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngleL*Math.PI/180.0));
  }
  //frontLT.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngleL*Math.PI/180.0));           // post multiply by rotation matrix
  frontLT.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));  
  frontLT.updateMatrixWorld();

  //Front left knee
  frontLK.matrixAutoUpdate = false;
  frontLK.matrix.copy(frontLT.matrix);    
  frontLK.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));       
  frontLK.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));             
  frontLK.updateMatrixWorld(); 

  //Front left calf
  frontLC.matrix.copy(frontLK.matrix);
  frontLC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));                     
  if(pose == 2){
    frontLC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngle*Math.PI/80.0));
    frontLC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,0.0,-0.1));
  }
  if(pose == 3 || pose == 4 || pose == -1){
    frontLC.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngleL*Math.PI/180.0));
  }
  else{
    frontLC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngleL*Math.PI/240.0));
  }
  frontLC.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));
  frontLC.updateMatrixWorld();

  if(pose == 0 || pose == 4 ) {
    legAngle = 30; 
    legAngleL = 30; 
  }
  else if (pose == -1){
    legAngle = 15
    legAngleL = 15    
  }
  else if(pose == 3)
  {
    bodyHeight =0.4;
    var t = clock.getElapsedTime();
    legAngle = 30*Math.sin(6*t)+10;
    legAngleL = -30*Math.sin(6*t)+10;
    bodyHeight = 0.2*Math.sin(3*t);
  }
  else
  {
    legAngle = 50; //Both were 50 earlier
    legAngleL = 50;
  }
  
  //Back right thigh
  backRT.matrix.copy(parentMatrix);
  backRT.matrix.multiply(new THREE.Matrix4().makeTranslation(-0.15, 0.8, -0.3));              // post multiply by translate matrix
  backRT.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngleL*Math.PI/180.0));           // post multiply by rotation matrix
  backRT.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));  
  backRT.updateMatrixWorld();

  //Back right knee
  backRK.matrixAutoUpdate = false;
  backRK.matrix.copy(backRT.matrix);
  backRK.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));
  backRK.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));
  backRK.updateMatrixWorld(); 

  //Back right calf
  backRC.matrix.copy(backRK.matrix);
  backRC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));
  if(pose == 2 ){
    backRC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngleL*Math.PI/90.0));
    backRC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,0.0,0.1));
   }
  else{
    backRC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngleL*Math.PI/180.0));
  }
  backRC.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));
  backRC.updateMatrixWorld(); 
  

  //Back left thigh
  backLT.matrix.copy(parentMatrix);
   
  backLT.matrix.multiply(new THREE.Matrix4().makeTranslation(0.15, 0.8, -0.3));              // post multiply by translate matrix
  
  if(pose == -1){
    backLT.matrix.multiply(new THREE.Matrix4().makeRotationX(30*Math.PI/180.0));  
  } 
  else{
    backLT.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngle*Math.PI/180.0));           // post multiply by rotation matrix
  }
  backLT.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));
  backLT.updateMatrixWorld();
 
  //Back left knee
  backLK.matrixAutoUpdate = false;
  backLK.matrix.copy(backLT.matrix);
  backLK.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));
  backLK.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));
  backLK.updateMatrixWorld();

  //Back left calf
  backLC.matrix.copy(backLK.matrix);
  backLC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,-0.1,0.0));
  if(pose == 2){
    backLC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngleL*Math.PI/180.0));
    backLC.matrix.multiply(new THREE.Matrix4().makeTranslation(0.0,0.0,0.1));
  }
  if(pose == 3)
  {
    backLC.matrix.multiply(new THREE.Matrix4().makeRotationX(legAngleL*Math.PI/180.0));
  }
  else if(pose == -1){
    backLC.matrix.multiply(new THREE.Matrix4().makeRotationX(-15*Math.PI/90.0));
  }
  else{
    backLC.matrix.multiply(new THREE.Matrix4().makeRotationX(-legAngleL*Math.PI/180.0));
  }
  backLC.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5*legLength,0));
  backLC.updateMatrixWorld();   


}
//////////////////////////////////////////////////////////////////
// updateWorld():  update all degrees of freedom, as needed, and recompute matrices
//////////////////////////////////////////////////////////////////

var clock = new THREE.Clock(true);

function updateWorld() {
  var modelMatrix = new THREE.Matrix4();
  modelMatrix.identity();
    // only start the matrix setup if the 'body' object has been loaded
  if (body != undefined) {   
    setupBody(modelMatrix);     
  }
}

//////////////////////////////////////////////////////////////////
//  checkKeyboard():   listen for keyboard presses
//////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
var mode = -1;
function checkKeyboard() {
   body = scene.getObjectByName( 'body' );

    if (body != undefined) {
     body.matrixAutoUpdate = false;
   }

  for (var i=0; i<6; i++)
  {
    if (keyboard.pressed(i.toString()))
    {
      mode = i;
      break;
    }
  }
  switch(mode)
  {
    //add poses here:
    case 0:{
      pose = 0;
      legAngle = -40;
      legAngleL = -70;
      bodyHeight = 0.3;} 
      break;     
    case 1:{       // pose hind legs raised
      pose = 1;
      legAngle = -30;
      legAngleL = -30;}
      break;
    case 2:{       // pose front legs raised
      pose = 2;
      legAngle = -30;
      legAngleL = -30;}
      break;
    case 3:      {     // animation
      pose = 3;
      var t = clock.getElapsedTime();
      legAngle = 30*Math.sin(6*t)+10;
      legAngleL = -30*Math.sin(6*t)+10;
      bodyHeight = 0.2*Math.sin(3*t);
      bodyDistance += 0.05;
      }
      camera.matrixAutoUpdate = true;
      
      break;
    case 4:  // camera moves with left hind leg and looks at front right leg
      { pose = 4;
      legAngle =-25;
      legAngleL = 25;
      bodyHeight = 0.2;
      }
      break;
    case 5:{
      pose = 5;
      }
      break;
    case 6:{
      pose = 6;
      }
     break;
  }
}

//////////////////////////////////////////////////////////////////
//  update()
//////////////////////////////////////////////////////////////////

function update() {
  checkKeyboard();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(bgScene, bgCam);
  
  //Rotate camera
  controls.keys = {
  LEFT: 37, //left arrow
  UP: 38, // up arrow
  RIGHT: 39, // right arrow
  BOTTOM: 40 // down arrow
  }
  controls.autoRotate = true;
  controls.update();
  
  renderer.render(scene, camera);
  updateWorld();
  requestAnimationFrame(update);     // this requests the next update call
}

update();     // launch an infinite drawing loop
