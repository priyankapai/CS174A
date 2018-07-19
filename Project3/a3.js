/**
 * CS 174A, 2018
 * Assignment 3 Template
 */

var scene = new THREE.Scene();

////////////////////////////////////////////////
// VARIABLES FOR PARTICLES
////////////////////////////////////////////////
var curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        20, 20,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

//defines the amount of points the path will have
var path = new THREE.Path( curve.getPoints( 100 ) );

var geometry= path.createPointsGeometry(100);
var material = new THREE.LineBasicMaterial({color:0xffffff});
var line = new THREE.Line(geometry,material);
line.position.set(0,1,0);
scene.add(line);

// Setup renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// Setup camera
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(0, 45, 150);
camera.lookAt(scene.position); 
scene.add(camera);

// Setup orbit control of camera
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// Adapt to window resize
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// Planet texture for manual environment mapping of top cube face
var planetTexture = new THREE.ImageUtils.loadTexture('images/planet.jpg');

// Cubemap setup:
// First, prepare paths to load 2D textures for each cube face: 
// {pos x, neg x, pos y, neg y, pos z, neg z}
var path = "cube/";
var format = '.jpeg';
var urls = [
  path + 'px' + format, path + 'nx' + format,
  'images/planet.jpg', path + 'ny' + format,    
  path + 'pz' + format, path + 'nz' + format
]; //Change top face manually

// Next, create cubemap with loaded textures in colour format,
// use predefined cube shader libs & pass cubemap ('texturecube')
var cubemap = THREE.ImageUtils.loadTextureCube(urls); 
cubemap.format = THREE.RGBFormat;
var shader = THREE.ShaderLib['cube'];                 
shader.uniforms['tCube'].value = cubemap;             

// Skybox setup:
// First, create shader for skybox, attach shader with loaded cubemap uniform,
// set depthwrite to false to fix z-buffer, and set images to render on inside of cube
var skyBoxMaterial = new THREE.ShaderMaterial( {
  fragmentShader: shader.fragmentShader,
  vertexShader: shader.vertexShader,
  uniforms: shader.uniforms,
  depthWrite: false,                                  
  side: THREE.BackSide                                
});

// Next, create & add new skybox to scene
var skybox = new THREE.Mesh(
  new THREE.CubeGeometry(1000, 1000, 1000),
  skyBoxMaterial
);
scene.add(skybox);

// Lighting parameters for shaders
var lightColor = new THREE.Color(1,1,1);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(-0.3,0.49,0.49);

// Material properties for shaders
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;

var shininess = 10.0;

///////////////////////// Blinn-Phong Shader Material

var blinn_phong_material = new THREE.ShaderMaterial({
    // !!!!!!!!!!!!!!ATTACH REMAINING UNIFORMS HERE!!!!!!!!!!!!!!
    // Here we specify how three.js "binds" the shader uniform variables to Javascript values
    //    See the shader definition, glsl/blinn_phong.fs.glsl,
    //    for the 7 different uniform vars that you need to add.
    // Below we have already added one of these.
    // The relevant Javascript variables that you need to bind to are listed immediately above.

// examples:  
//    
//   myShaderVarUniform: {type: "c", value: myJavascriptVar},   // THREE.Color
//   myShaderVarUniform: {type: "f", value: myJavascriptVar},   // float
//   myShaderVarUniform: {type: "v3", value: myJavascriptVar},  // THREE.Vector3
//   myShaderVarUniform: {type: "v4", value: myJavascriptVar},  // THREE.Vector4

   uniforms: {
     lightColorUniform: {type: "c", value: lightColor},  
     ambientColorUniform: {type: "c", value: ambientColor},
     lightDirectionUniform: {type: "v3", value: lightDirection},

     kAmbientUniform: {type: "f", value: kAmbient},
     kDiffuseUniform: {type: "f", value: kDiffuse},
     kSpecularUniform: {type: "f", value: kSpecular},

     shininessUniform: {type: "f", value: shininess},

//  add the other six required shader-uniforms-to-Javascript bindings below

  },
});

/////////////////////// Phong Shader Material

var phong_material = new THREE.ShaderMaterial({
   uniforms: {
    // !!!!!!!!!!!!!!ATTACH YOUR UNIFORMS HERE!!!!!!!!!!!!!!
    // see the Blinn-Phong shader for what you will need
   lightColorUniform: {type: "c", value: lightColor},
     ambientColorUniform: {type: "c", value: ambientColor},
     lightDirectionUniform: {type: "v3", value: lightDirection},

     kAmbientUniform: {type: "f", value: kAmbient},
     kDiffuseUniform: {type: "f", value: kDiffuse},
     kSpecularUniform: {type: "f", value: kSpecular},

     shininessUniform: {type: "f", value: shininess},
 
 },
});

// Cubemap texture and planet texture for custom shaders
var cubemapUniform = {type: "t", value: cubemap };
var textureUniform = {type: "t", value: planetTexture };

// Setup shaders and uniforms for lighting models
// Environment Map Shader Material
var reflective_material = new THREE.ShaderMaterial ({
  uniforms: {
    cubemapUniform: cubemapUniform,
    textureUniform: textureUniform,
  }
});

var refractive_material = new THREE.ShaderMaterial ({
  uniforms: {
    cubmapUniform : cubemapUniform,
    textureUniform: textureUniform,
  }
});

// Load shader paths
var shaderFiles = [
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/blinn_phong.vs.glsl',
  'glsl/blinn_phong.fs.glsl',
  'glsl/reflective.vs.glsl',
  'glsl/reflective.fs.glsl',
  'glsl/refractive.vs.glsl',
  'glsl/refractive.fs.glsl',
];

// Load & attach shaders to materials, set update flags to true
new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  phong_material.vertexShader = shaders['glsl/phong.vs.glsl'];
  phong_material.fragmentShader = shaders['glsl/phong.fs.glsl'];
  blinn_phong_material.vertexShader = shaders['glsl/blinn_phong.vs.glsl'];
  blinn_phong_material.fragmentShader = shaders['glsl/blinn_phong.fs.glsl'];
  reflective_material.vertexShader = shaders['glsl/reflective.vs.glsl'];
  reflective_material.fragmentShader = shaders['glsl/reflective.fs.glsl'];
  refractive_material.fragmentShader = shaders['glsl/refractive.fs.glsl'];
  refractive_material.vertexShader = shaders['glsl/refractive.vs.glsl']; 
 
  reflective_material.needsUpdate = true;
  phong_material.needsUpdate = true;
  blinn_phong_material.needsUpdate = true;
  refractive_material.needsUpdate = true;
})

// Optional: object loader for user-defined meshes
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader()
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
    object.parent = floor;
    scene.add(object);

  }, onProgress, onError);
}

// Setup, create & add spheres to scenes
var sphere = new THREE.SphereGeometry(8, 16, 16);

// Blinn-Phong lighting model sphere
var gem_blinn_phong = new THREE.Mesh(sphere, blinn_phong_material);
gem_blinn_phong.position.set(35, 0, 0);
scene.add(gem_blinn_phong);

// Phong lighting model sphere
// !!!!!!!!!!!!!!CHANGE SPHERE MATERIAL!!!!!!!!!!!!!!
var gem_phong = new THREE.Mesh(sphere, phong_material);
gem_phong.position.set(-35, 0, 0);
scene.add(gem_phong);

// Environment mapping model sphere
// !!!!!!!!!!!!!!CHANGE SPHERE MATERIAL!!!!!!!!!!!!!!
var gem_reflective = new THREE.Mesh(sphere, reflective_material);
gem_reflective.position.set(0, 0, 0);
scene.add(gem_reflective);


var material = new THREE.MeshPhongMaterial();
material.map = planetTexture;
console.log(material.map);
var moveSphere = new THREE.Mesh(sphere, material);
moveSphere.scale.set(0.5,0.5,0.5);
moveSphere.position.set(-20, 0, 0);
scene.add(moveSphere);

///////////////////////////////////////////////////
//  Set up Mouse Interaction 
///////////////////////////////////////////////////

var mouse = new THREE.Vector2(), INTERSECTED;

function onMouseMove(event){
  // Calculate mouse position in NDC
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
}
 
// Setup update & callback 
var keyboard = new THREEx.KeyboardState();
var t = 0;
var render = function() {
 
  var i; t+=0.01;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  
  //console.log(curve.getPoint(0));
  for(i = 0; i < 100; i += 1)
  {
    var position = curve.getPoint(i/t);
    moveSphere.position.set(position.x,position.y,0);
  }
}

window.addEventListener( 'mousemove' , onMouseMove, false );
render();
