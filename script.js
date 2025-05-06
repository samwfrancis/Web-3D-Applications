var scene, camera, renderer, clock, mixer, actions = [], mode, isWireframe = false;
let loadedModel;
init();

function init(){

    const assetPath = './';

    clock = new THREE.Clock();

    scene=new THREE.Scene();

    scene.background = new THREE.Color(0xfffbee);
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-5, 25, 20);
//can be tweaked
const canvas = document.getElementById('threeContainer');
renderer = new THREE.WebGLRenderer({ canvas: canvas});
renderer.setPixelRatio( window.devicePixelRatio );
resize();
document.body.appendChild( renderer.domElement );


const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xFFFFF);
light.position.set(0,10,2);
scene.add(light);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(1,2,0);
controls.update();

mode = 'open';
const btn = document.getElementById("btn");
btn.addEventListener('click', function(){
if (action.length === 2){
    if(mode=== "open"){
        actions.forEach(action => {
            action.timeScale = 1.;
            action.reset();
            action.play();
        })
    }
}
})

const wireframeBtn = document.getElementById("toggleWireframe");
wireframeBtn.addEventListener('click', function (){
    isWireframe = !isWireframe;
    togglerWireframe(isWireframe);
});

const rotateBtn = document.getElementById("Rotate");
rotateBtn.addEventListener('click', function (){
    if(loadedModel) {
        const axis = new THREE.Vector3(0,1,0);
        const angle = Math.PI / 8;
        loadedModel.rotateOnAxis(axis, angle);
    }
    else{
        console.warn('Model not loaded yet');
    }
});

//GLTF loader

const loader = new THREE.GLTFLoader();
loader.load(assetPath + 'assets/vinyl_disk.glb', function(gltf){
const model = gltf.scene;
scene.add(model);

loadedModel = model;

mixer = new THREE.AnimationMixer(model);
const animations = gltf.animations;

animations.forEach(clip =>{
const action = mixer.clipAction(clip);
actions.push(action);
});
});


window.addEventListener('resize', resize,false);

animate();
}

function togglerWireframe(enable){
    scene.traverse(function (object){
        if (object. isMesh){
            object.material.wireframe = enable;
        }
    });
}

function animate(){
    requestAnimationFrame(animate);

    if(mixer){
        mixer.update(clock.getDelta());
    }


    renderer.render(scene, camera);

}

function resize(){
    const canvas = document.getElementById('threeContainer');
    const width = window.innerWidth;
    const height = window.innerHeight;
camera.aspect = width / height;
camera.updateProjectionMatrix();
renderer.setSize(width, height);

}