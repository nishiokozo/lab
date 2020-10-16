
var scene;
var	camera;
var renderer;
var g_obj1 =null;


init();
run();


//-----------------------------------------------------------------------------
function init()
//-----------------------------------------------------------------------------
{

	var width = window.innerWidth;
	var height = window.innerHeight;

	//create scene
	scene = new THREE.Scene();

	{	//create camera
		camera = new THREE.PerspectiveCamera(
			60,				//fieldOfView,
			width / height,	//aspectRatio,
			1,				//nearPlane,
			10000			//farPlane
		);
		camera.position.x = 0;
		camera.position.z = 80;
		camera.position.y = 0;
	}

	{	//create renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		document.body.appendChild( renderer.domElement );
	}

	//create light
	if(0)
	{
		var light = new THREE.HemisphereLight(0xffffff,0x000000, 1.0)
		scene.add(light);
	}


	if (1)
	{
				camera.position.z = 18;
				var objectLoader = new THREE.ObjectLoader();
				objectLoader.load("scene5.json"
					,function ( obj )
					{
					 	scene.add( obj );
						g_obj1 = obj.children[0];
					} 
				);
	}

}

//-----------------------------------------------------------------------------
function run()
//-----------------------------------------------------------------------------
{
	if ( g_obj1 !=null )	// three.jsは非同期でデータを読み込む
	{
		g_obj1.rotation.x += 0.0121;
		g_obj1.rotation.y += 0.0131;
	}

	renderer.render(scene, camera);
	window.requestAnimationFrame(run);
}


