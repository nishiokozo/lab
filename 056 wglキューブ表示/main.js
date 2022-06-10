"use strict";


let g_yaw = 0;
let g_model_qubic;
let g_reqId;

let canvas = document.getElementById( "html_canvas" );

//-----------------------------------------------------------------------------
function model_create_qubic( vecOfs, pos, sc, col_flat, col_wire )	
//-----------------------------------------------------------------------------
{
	//ワイヤーフレームのキューブを作って描画するライブラリ。

	// キューブモデルの原型
	let vert_cmn = 
	[
		[-0.5*sc.x,-0.5*sc.y,-0.5*sc.z],
		[ 0.5*sc.x,-0.5*sc.y,-0.5*sc.z],
		[ 0.5*sc.x, 0.5*sc.y,-0.5*sc.z],
		[-0.5*sc.x, 0.5*sc.y,-0.5*sc.z],

		[-0.5*sc.x,-0.5*sc.y, 0.5*sc.z],
		[ 0.5*sc.x,-0.5*sc.y, 0.5*sc.z],
		[ 0.5*sc.x, 0.5*sc.y, 0.5*sc.z],
		[-0.5*sc.x, 0.5*sc.y, 0.5*sc.z],
	];

	let index_wire = 
	[
		0,1,
		1,2,
		2,3,
		3,0,

		4+0,4+1,
		4+1,4+2,
		4+2,4+3,
		4+3,4+0,

		0,4+0,
		1,4+1,
		2,4+2,
		3,4+3,
	];
	let tblIndex_flat = 
	[
		4,6,7,6,4,5,
		7,2,3,2,7,6,
		5,2,6,2,5,1,
		0,7,3,7,0,4,
		0,2,1,2,0,3,
		4,1,5,1,4,0,
	];

	function gen( pos )
	{
		let ofs = model.tblVertex.length/3;
		for ( let v of vert_cmn )
		{
			model.tblVertex.push( v[0] + pos.x );
			model.tblVertex.push( v[1] + pos.y );
			model.tblVertex.push( v[2] + pos.z );
		}
		for ( let id of index_wire )
		{
			model.tblIndex_wire.push( id+ofs );
		}
		for ( let id of tblIndex_flat )
		{
			model.tblIndex_flat.push( id+ofs );
		}
	}

	let model = {};
	model.tblVertex = [];
	model.tblIndex_wire = [];
	model.tblIndex_flat = [];
	model.color1 = col_flat;
	model.color2 = col_wire;
	model.M = mtrans( vecOfs );
	gen( pos );

	return model;
}



//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	let cam = cam_create( vec3(  0, 1, 6 ), vec3( 0, 0,0 ), 28, 1.0,1000.0  );
	let gra3d = gra3d_create( canvas );

	gra3d.backcolor( vec3( 1,1,1 ) );

	//---------------------------------------------------------------------
	function	update_paint( now )
	//---------------------------------------------------------------------
	{
		function	draw_scene()
		{

			// プロジェクション計算
			let P = mperspective( cam.fovy,  canvas.width/ canvas.height, cam.near, cam.far );
			// ビュー計算
			let V= mlookat( cam.pos, cam.at );
			g_yaw += radians( -0.4263 );
			V = mmul( V, mrotate( g_yaw, vec3( 0,0.1,0 ) ) );

			gra3d.cls();
			// 色設定
			// 描画
			gra3d.drawModel( P, V, g_model_qubic );
		}

		draw_scene();

		if ( g_reqId ) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される可能性がある
		g_reqId = window.requestAnimationFrame( update_paint );
	}


	g_reqId = null;


	g_model_qubic 	= model_create_qubic( vec3( 0, 0.0, 0.0 ), vec3(0.75,0,0), vec3(0.5,0.3,1), vec3(1,1,1),vec3(0.32,0.32,0.32) );
//	g_model_qubic 	= model_create_qubic( vec3( 0, 0.0, 0.0 ), vec3(1,0,0), vec3(0.5,1.5,0.5), vec3(1,1,0),vec3(0.92,0.32,0.0) );
	update_paint(0);
}



