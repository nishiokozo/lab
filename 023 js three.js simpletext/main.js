
//import * as THREE from './three.module.js';

//import { OrbitControls } from './OrbitControls.js';

let g_camera, g_scene, g_renderer;

init();
update();

//---------------------------------------------------------------------
function init() 
//---------------------------------------------------------------------
{
	function func_font( font ) 
	{


		let color = 0xffaa44;

			let matLite = new THREE.MeshBasicMaterial( {
				color: color,
				transparent: false,
				opacity: 0.4,
				side: THREE.DoubleSide
			} );

		let message = "yukizone lab\nYUKIZONE LAB";



		{
			let shapes = font.generateShapes( message, 100 );
			let geometry = new THREE.ShapeBufferGeometry( shapes );
			let text = new THREE.Mesh( geometry, matLite );
//			text.position.z = - 250;
			g_scene.add( text );

			let holeShapes = [];

			for ( let i = 0; i < shapes.length; i ++ ) {

				let shape = shapes[ i ];

				if ( shape.holes && shape.holes.length > 0 ) {

					for ( let j = 0; j < shape.holes.length; j ++ ) {

						let hole = shape.holes[ j ];
					//	holeShapes.push( hole );

					}

				}

			}
	
		}

	} 

	g_camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	g_camera.position.set( 0, - 400, 1600 );

	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xffffff );

	let loader = new THREE.FontLoader();
	loader.load( 'gentilis_bold.typeface.json', func_font );
	g_renderer = new THREE.WebGLRenderer( { antialias: true } );
	g_renderer.setPixelRatio( window.devicePixelRatio );
	g_renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( g_renderer.domElement );


	window.addEventListener( 'resize', onResize, false );

}

//---------------------------------------------------------------------
function onResize() 
//---------------------------------------------------------------------
{

	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();
	g_renderer.setSize( window.innerWidth, window.innerHeight );

}

//---------------------------------------------------------------------
function update() 
//---------------------------------------------------------------------
{

	requestAnimationFrame( update );

	g_renderer.render( g_scene, g_camera );

}

