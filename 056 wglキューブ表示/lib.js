// 2022/06/10 ggra3d追加 
// 2022/06/10 cam追加 
// 2022/06/09 rand追加
// 2022/02/24 gra.printの座標をwindow座標に変更
// 2022/02/22 html関数群追加
// 2022/02/18 html _...関連を一旦全廃
// 2022/01/24 html _...関連の廃止＆リネーム
// 2022/01/20 ..._rgbなど廃止名前変更
// 2022/01/18 html _radio_set htmlアクセス関係関数を追加
// 2021/12/26 gra.color_rgb,gra.backcolor_rgb
// 2021/12/26 graアスペクト、アジャストのデフォルトを変更gra.asp,gra.adj
// 2021/11/29 strfloatで-0.2などを入れると正常動作しないバグを修正
// 2021/11/16 refract2( I, N, eta ) 追加
// 2021/11/01 gra.color_row追加
// 2021/10/31 gra.line_pictgram 追加
// 2021/10/31 strfloatで0.99999999などを入れると正常動作しないバグを修正
// 2021/10/17 gra.line_spring 追加 drawbane2d廃止
// 2021/10/15 ene_create 引数変更
// 2021/10/12 strfloatで1e-33などを入れると正常動作しないバグを修正
// 2021/10/03 ene.prot_entry を追加
// 2021/10/01 ene reset、最大最小設定を止める
// 2021/10/01 ene reset、最大最小設定、サンプリング時間を設定できるように
// 2021/09/20 symbolも文字設定
// 2021/08/16 ene 追加 oscillo 削除
// 2021/08/15 oscillo timemax 追加
// 2021/08/15 oscillo_create オシロスコープのように波形を描画
// 2021/08/15 gra アスペクト周りバグ取り
// 2021/08/13 gra.pset() 追加/ gra.setAspect()追加
// 2021/08/08 gra.drawmesure_line追加 strfloat追加
// 2021/08/06 gra.drawbane2d drawarrow2d drawarrow2d_line追加
// 2021/08/05 gra.fill の修正
// 2021/08/03 vec2 vrot2 二次元回転関数 追加
// 2021/07/30 gra.drawpictgrambone ピクトグラム風、円が二つ連なった図形の描画
// 2021/07/29 gra.bezier_n 追加
// 2021/07/29 gra windowとcanvasのアスペクト比を反映
// 2021/07/26 se 効果音ライブラリ
// 2021/07/24 KEY追加
// 2021/07/23 半直線と点との距離,	線分と点との距離,直線と直線の距離,半直線と線分の距離,線分と線分の距離 関数追加
// 2021/07/23 pad_create ゲームパッド入力ライブラリ追加
// 2021/07/22 gra フルスクリーン用にアスペクト機能を追加
// 2021/07/19 ver1.12 gra backcolor()追加
// 2021/07/10 ver1.11 フォント送りサイズ変更
// 2021/07/10 ver1.10 gra.alpha追加
// 2021/07/02 ver1.09 geom 2021/07/02 vec2追加 gra_create 追加
// 2021/05/28 ver1.08	行列式のコメント追加
// 2021/05/26 ver1.07	minvers再びアルゴリズム交換
// 2021/05/25 ver1.06	minvers別のアルゴリズムに交換
// 2021/05/24 ver1.05	行列のコメントを修正
// 2021/05/23 ver1.04	列優先バグ修正vec4->vec3
// 2021/05/17 ver1.03	mrotx / vrotx 等、名称変更
// 2021/05/09 ver1.02	minverts追加、mlookat変更
// 2021/05/07 ver1.01	デバッグ、vec3対応
// 2021/05/06 ver1.00	分離
//
//	行列ライブラリコンセプト
//	GLSLと同じ数式同じ行列がメインプログラムでも同様に機能する
//
// OpenGL® Programming Guide: The Official Guide 
// https://www.cs.utexas.edu/users/fussell/courses/cs354/handouts/Addison.Wesley.OpenGL.Programming.Guide.8th.Edition.Mar.2013.ISBN.0321773039.pdf
"use strict";

//-----------------------------------------------------------------------------
function gra3d_create( cv )	// 2022/06/10
//-----------------------------------------------------------------------------
{
	// ライブラリコンセプト
	//	・座標(xyz,w)と色(r,g,b)のみで、三角形と線を描画
	//	・線画、BASICのLINEのような使い勝手が出来るライブラリ。
	//	・速度は重視しない
	//	・透視変換にシェーダーを使わない
	//	・毎回ＶＲＡＭ転送
	//	・graライブラリと似せる

	let gra3d = {}
	let	m_shader = {};
	let	m_hdlVertexbuf;
	let	m_hdlColorbuf;
	let m_tblVertex = [];
	let m_tblColor = [];
	let m_tblDisplay = [];
	let m_offset = 0;

	let gl = cv.getContext( "webgl", { antialias: false } );
	gra3d.gl = gl; 
	//-----------------------------------------------------------------------------
	function compile( type, src )
	//-----------------------------------------------------------------------------
	{
		let sdr = gl.createShader( type );				//※ gl.createShader( type )⇔  gl.deleteShader( shader );
		gl.shaderSource( sdr, src );
		gl.compileShader( sdr );
		if( gl.getShaderParameter( sdr, gl.COMPILE_STATUS ) == false )
		{
			console.log( gl.getShaderInfoLog( sdr ) );
		}
		return sdr
	}

	//-----------------------------------------------------------------------------
	gra3d.cls = function( col=vec3(0,0,0) )
	//-----------------------------------------------------------------------------
	{
		gl.clearColor( col.x , col.y , col.z , 1.0);
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	}

	if ( gl == null )
	{
		alert( "ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。" );
	}
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );// gl.LESS;	最も奥が1.0、最も手前が0.0
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clearDepth( 1.0 );
	gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );
	gl.enable( gl.CULL_FACE );	// デフォルトでは反時計回りが表示

	// シェーダーコンパイル

	// シェーダー構成
	{

		let src_vs = 
			 "attribute vec4 pos;"
			+"attribute vec3 col;"
			+"varying vec3 vColor;"
			+"void main( void )"
			+"{"
		//挙動確認用コード 
		//	+   "mat4 S = mat4( 0.5,  0.0,  0.0,  0.0,"
		//	+   "              0.0,  0.5,  0.0,  0.0,"
		//	+   "              0.0,  0.0,  0.5,  0.0,"
		//	+   "              0.0,  0.0,  0.0,  1.0 );"
		//	+   "float th = radians( 15.0 );"
		//	+   "float c = cos( th );"
		//	+   "float s = sin( th );"
		//	+   "mat4 Rx = mat4( 1.0,  0.0,  0.0,  0.0,"
		//	+   "               0.0,    c,   -s,  0.0,"
		//	+   "               0.0,    s,    c,  0.0,"
		//	+   "               0.0,  0.0,  0.0,  1.0 );"
		//	+   "mat4 Ry = mat4(  c,  0.0,    s,  0.0,"
		//	+   "               0.0,  1.0,  0.0,  0.0,"
		//	+   "                -s,  0.0,    c,  0.0,"
		//	+   "               0.0,  0.0,  0.0,  1.0 );"
		//	+   "mat4 Rz = mat4(  c,   -s,  0.0,  0.0,"
		//	+   "                 s,    c,  0.0,  0.0,"
		//	+   "               0.0,  0.0,  1.0,  0.0,"
		//	+   "               0.0,  0.0,  0.0,  1.0 );"
		//	+   "mat4 Tx = mat4( 1.0,  0.0,  0.0, -1.0,"
		//	+   "               0.0,  1.0,  0.0,  0.0,"
		//	+   "               0.0,  0.0,  1.0,  0.0,"
		//	+   "               0.0,  0.0,  0.0,  1.0 );"
		//	+   "mat4 Ty = mat4( 1.0,  0.0,  0.0,  0.0,"
		//	+   "               0.0,  1.0,  0.0,  1.0,"
		//	+   "               0.0,  0.0,  1.0,  0.0,"
		//	+   "               0.0,  0.0,  0.0,  1.0 );"
		//	+   "mat4 Tz = mat4( 1.0,  0.0,  0.0,  0.0,"
		//	+   "               0.0,  1.0,  0.0,  0.0,"
		//	+   "               0.0,  0.0,  1.0, -9.0,"
		//	+   "               0.0,  0.0,  0.0,  1.0 );"
		//	+   "mat4 T = Rz;         "
		//	+   "float fovy=radians( 45.0 );     "
		//	+   "float sc=1.0/tan( fovy/2.0 );   "
		//	+   "float n=0.0;                  "
		//	+   "float f=-1.0;                 "
		//	+   "float aspect=1.0;             "
		//	+	"mat4 Pm = mat4(               "
		//	+	"	sc/aspect,     0.0,          0.0,              0.0,"
		//	+	"	      0.0,      sc,          0.0,              0.0,"
		//	+	"	      0.0,     0.0, -( f+n )/( f-n ), -( 2.0*f*n )/( f-n ),"
		//	+	"	      0.0,     0.0,         -1.0,              0.0 );"
			+   "gl_Position = pos;"
			+   "vColor = col;"
			+"}"
		;
				
		let src_fs =
			 "precision mediump float;"
			+"varying vec3 vColor;"
			+"void main( void )"
			+"{"
			+	"gl_FragColor = vec4( vColor, 1.0 );"
			+"}"
		;
		m_shader.prog	= gl.createProgram();			//WebGLProgram オブジェクトを作成		※gl.createProgram()	⇔  gl.deleteProgram( program );
		let vs	= compile( gl.VERTEX_SHADER, src_vs );
		let fs	= compile( gl.FRAGMENT_SHADER, src_fs );
		gl.attachShader( m_shader.prog, vs );			//シェーダーを WebGLProgram にアタッチ
		gl.attachShader( m_shader.prog, fs );			//シェーダーを WebGLProgram にアタッチ
		gl.deleteShader( vs );
		gl.deleteShader( fs );
		gl.linkProgram( m_shader.prog );				//WebGLProgram に接続されたシェーダーをリンク
		m_shader.pos		= gl.getAttribLocation( m_shader.prog, "pos" );
		m_shader.col		= gl.getAttribLocation( m_shader.prog, "col" );
		gl.enableVertexAttribArray( m_shader.pos );
		gl.enableVertexAttribArray( m_shader.col );
	}


	//-----------------------------------------------------------------------------
	function reload_to_VRAM()
	//-----------------------------------------------------------------------------
	{
		gl.deleteBuffer( m_hdlVertexbuf );
		gl.deleteBuffer( m_hdlColorbuf );

		m_hdlVertexbuf = gl.createBuffer();				// ※gl.createBuffer() ⇔  gl.deleteBuffer( buffer );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblVertex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		m_hdlColorbuf = gl.createBuffer();				// ※gl.createBuffer() ⇔  gl.deleteBuffer( buffer );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblColor ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		m_tblVertex = [];	// VRAMに転送するので保存しなくてよい
		m_tblColor = [];	// VRAMに転送するので保存しなくてよい


	}
	
	//-----------------------------------------------------------------------------
	gra3d.flush_primitives = function()
	//-----------------------------------------------------------------------------
	{
		
		// 頂点データの再ロード
		reload_to_VRAM();	
		gl.useProgram( m_shader.prog );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.vertexAttribPointer( m_shader.pos, 4, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.vertexAttribPointer( m_shader.col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );


			for ( let it of m_tblDisplay )
			{
				gl.drawArrays( it.type, it.offset, it.count );
			}
		}
		gl.flush();
		m_tblDisplay = [];
	}

	//-----------------------------------------------------------------------------
	gra3d.draw_primitive = function( type, verts )	// [ {"vrt":vec4(),"col":vec3()} ] vert
	//-----------------------------------------------------------------------------
	{
		for ( let v of verts )
		{
			m_tblVertex.push( v.vrt.x, v.vrt.y, v.vrt.z, v.vrt.w );
			m_tblColor.push( v.col.x, v.col.y, v.col.z );
		}
		m_tblDisplay.push( {"type":type, "offset":m_tblVertex.length/4-verts.length, "count":verts.length } ); 
	}
	//-----------------------------------------------------------------------------
	gra3d.draw_TRIANGLE = function( a,b,c )		// {"vrt":vec4(),"col":vec3()}
	//-----------------------------------------------------------------------------
	{
		m_tblVertex.push( a.vrt.x, a.vrt.y, a.vrt.z, a.vrt.w );
		m_tblVertex.push( b.vrt.x, b.vrt.y, b.vrt.z, b.vrt.w );
		m_tblVertex.push( c.vrt.x, c.vrt.y, c.vrt.z, c.vrt.w );

		m_tblColor.push( a.col.x, b.col.y, c.col.z );
		m_tblColor.push( a.col.x, b.col.y, c.col.z );
		m_tblColor.push( a.col.x, b.col.y, c.col.z );
	
		if ( m_tblDisplay.length > 0 && m_tblDisplay[m_tblDisplay.length-1].type == gl.TRIANGLES )
		{
			m_tblDisplay[m_tblDisplay.length-1].count+=3;
		}
		else
		{
			m_tblDisplay.push( {"type":gl.TRIANGLES, "offset":m_tblVertex.length/4-3, "count":3 } ); 
		}
	}	
	//-----------------------------------------------------------------------------
	gra3d.draw_LINE = function( s, e )			// {"vrt":vec4(),"col":vec3()}
	//-----------------------------------------------------------------------------
	{
		m_tblVertex.push( s.vrt.x, s.vrt.y, s.vrt.z, s.vrt.w );
		m_tblVertex.push( e.vrt.x, e.vrt.y, e.vrt.z, e.vrt.w );

		m_tblColor.push( s.col.x, s.col.y, s.col.z );
		m_tblColor.push( e.col.x, e.col.y, e.col.z );

		if ( m_tblDisplay.length > 0 && m_tblDisplay[m_tblDisplay.length-1].type == gl.LINES )
		{
			m_tblDisplay[m_tblDisplay.length-1].count+=2;
		}
		else
		{
			m_tblDisplay.push( {"type":gl.LINES, "offset":m_tblVertex.length/4-2, "count":2} ); 
		}
	}
	
	//-----------------------------------------------------------------------------
	gra3d.drawModel = function( P, V, model )	// モデル表示
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		let tmp = []; 
		{
			for ( let i = 0 ; i < model.tblVertex.length ; i+=3 )
			{
				// 透視変換	//pos = PVMv;
				let v = vec4( 
					model.tblVertex[i+0],
					model.tblVertex[i+1],
					model.tblVertex[i+2],
					1,
				 );
				v = vec4_vmul_Mv( model.M ,v );
				v = vec4_vmul_Mv( V ,v );
				v = vec4_vmul_Mv( P ,v );
				tmp.push( v );
			}
		}

		// 描画	共有頂点を独立三角形にして描画
		{
			{
				gra3d.gl.enable( gra3d.gl.POLYGON_OFFSET_FILL );
				gra3d.gl.polygonOffset(1,1);
				/*
				GL_POLYGON_OFFSET_FILL、GL_POLYGON_OFFSET_LINE、またはGL_POLYGON_OFFSET_POINTが有効になっている場合、
				各フラグメントの深度値は、適切な頂点の深度値から補間された後にオフセットされます。 

				polygonOffset(GLfloat factor, GLfloat units);
				オフセットの値はfactor×DZ+r×unitsです。
				ここで、DZはポリゴンの画面領域に対する深さの変化の測定値であり、
				rは特定の値に対して解決可能なオフセットを生成することが保証されている最小値です。 
				オフセットは、深度テストが実行される前、および値が深度バッファーに書き込まれる前に追加されます。
				*/
			}
			{ // 陰線処理用
				for ( let i = 0 ; i < model.tblIndex_flat.length ; i+=3 )
				{
					let v1 = {"vrt":tmp[model.tblIndex_flat[i+0]], "col":model.color1};
					let v2 = {"vrt":tmp[model.tblIndex_flat[i+1]], "col":model.color1};
					let v3 = {"vrt":tmp[model.tblIndex_flat[i+2]], "col":model.color1};
					gra3d.draw_TRIANGLE( v1, v2, v3 );
				}
			}
			{ // 線描画
				for ( let i = 0 ; i < model.tblIndex_wire.length ; i+=2 )
				{
					let s = {"vrt":tmp[model.tblIndex_wire[i+0]], "col":model.color2};
					let e = {"vrt":tmp[model.tblIndex_wire[i+1]], "col":model.color2};
					gra3d.draw_LINE( s, e );

				}
			}
			gra3d.flush_primitives();
			gra3d.gl.disable( gra3d.gl.POLYGON_OFFSET_FILL );

		}

	}
	//-----------------------------------------------------------------------------
	gra3d.backcolor = function( rgb ) 
	//-----------------------------------------------------------------------------
	{
		gl.clearColor( rgb.x, rgb.y, rgb.z, 1.0 );
	}
	//-----------------------------------------------------------------------------
	gra3d.cls = function()
	//-----------------------------------------------------------------------------
	{
		gl.clear( gl.COLOR_BUFFER_BIT);

	}
	
	return gra3d;
}

//-----------------------------------------------------------------------------
function cam_create( pos, at, fovy, near=1.0, far=1000.0 )
//-----------------------------------------------------------------------------
{
	let body = {};
	body.pos	= pos;
	body.at		= at;
	body.fovy	= fovy;		// 単位は弧度
	body.near	= near;
	body.far	= far;
	return body;

	// サンプル
	// 	let cam = cam_create( vec3(  0, 2.5, 10 ), vec3( 0, 2.5,0 ), 28, 1.0,1000.0  );
	// プロジェクション計算
	//	let P = mperspective( cam.fovy,  gl.canvas.width/ gl.canvas.height, cam.near, cam.far );
	// ビュー計算
	//	let V= mlookat( cam.pos, cam.at );
}

//-----------------------------------------------------------------------------
function rand_create( type = "xorshift32" ) //2022/06/09
//-----------------------------------------------------------------------------
{
	let body = {};
	switch( type )
	{
	case "xorshift32":			//xorshift32 再現性のあるランダム
		body.y = 2463534242;
		body.random = function()
		{
			body.y = body.y ^ (body.y << 13); 
			body.y = body.y ^ (body.y >> 17);
			body.y = body.y ^ (body.y << 5);
			return Math.abs(body.y/((1<<31)));
		}
		break;

	case "Math":				// javascript Math
		body.random = function()
		{
			return Math.random();
		}
		break;

	default:					
		alert("rand_create ERROR : "+ type );

	}
	return body.random;
}

//-----------------------------------------------------------------------------
// html への書き換えタイミングを管理したり、読込タイミングを管理したり
//-----------------------------------------------------------------------------
let html =
{
	//---------------------------------------------------------------------
	"get":function( name ) 
	//---------------------------------------------------------------------
	{
		return html.param[name].val;
	},
	//---------------------------------------------------------------------
	"set":function( name, val ) 
	//---------------------------------------------------------------------
	{
		html.param[name].val = val;
		html.param[name].req = true;
	},
	//---------------------------------------------------------------------
	"add":function( name, val ) 
	//---------------------------------------------------------------------
	{
		html.param[name].val += val;
		html.param[name].req = true;
	},
	//---------------------------------------------------------------------
	"read":function( name ) // HTML -> local buffer
	//---------------------------------------------------------------------
	{
		let val = html.param[name].val;
		switch( html.param[name].type )
		{
			case "textbox":		val = html.getById_textbox( name, val );		break;
			case "innerHTML":	val = html.getById_innerHTML( name, val );		break;
			case "radiobutton":	val = html.getByName_radiobuton( name, val );	break;
			case "checkbox":	val = html.getByName_checkbox( name, val );		break;
			case "selectbox":	val = html.getById_selectbox( name, val );		break;
			default:
				console.error("未宣言のHTML部品:"+html.param[name].type );
		}

		html.param[name].val = val;
	
	},
	//---------------------------------------------------------------------
	"write":function( name ) // local buffer -> HTML
	//---------------------------------------------------------------------
	{
		if ( html.param[name].req )
		{
			html.param[name].req = false;
			
			let val = html.param[name].val;
			switch( html.param[name].type )
			{
				case "textbox":		html.setById_textbox( name, val );			break;
				case "innerHTML":	html.setById_innerHTML( name, val );		break;
				case "radiobutton":	html.setByName_radiobuton( name, val );		break;
				case "checkbox":	html.setByName_checkbox( name, val );		break;
				case "selectbox":	html.setById_selectbox( name, val );		break;
				default:
					console.error("未宣言のHTML部品:"+html.param[name].type );
			}
		}
	
	},
	//---------------------------------------------------------------------
	"read_all":function( name )
	//---------------------------------------------------------------------
	{
		if ( name )
		{
				html.read( name );
		}
		else
		{
			for ( let name of Object.keys(html.param) )
			{
				html.read( name );
			}
		}
	},
	//---------------------------------------------------------------------
	"write_all":function()
	//---------------------------------------------------------------------
	{
		for ( let name of Object.keys(html.param) )
		{
			html.write( name );
		}

	},
	//---------------------------------------------------------------------
	"getById_textbox":function( name, val )
	//---------------------------------------------------------------------
	{
		if ( document.getElementById( name ) )
		{
			val = document.getElementById( name ).value;
		}
		return val;
	},
	//---------------------------------------------------------------------
	"setById_textbox":function( name, val  )
	//---------------------------------------------------------------------
	{
		if ( document.getElementById( name ) )
		{
			document.getElementById( name ).value = val;
		}
	},
	//---------------------------------------------------------------------
	"getById_innerHTML":function( name, val )
	//---------------------------------------------------------------------
	{
		if ( document.getElementById( name ) )
		{
			let val = document.getElementById( name ).innerHTML;
		}
		return val;
	},
	//---------------------------------------------------------------------
	"setById_innerHTML":function( name, val  )
	//---------------------------------------------------------------------
	{
		if ( document.getElementById( name ) )
		{
			document.getElementById( name ).innerHTML = val;
		}
	},
	//---------------------------------------------------------------------
	"getByName_radiobuton":function( name, val )
	//---------------------------------------------------------------------
	{
		var list = document.getElementsByName( name ) ;
		for ( let l of list )
		{
			if ( l.checked ) 
			{
				val = l.value;
				break;
			}
		}
		return val;
	},
	//---------------------------------------------------------------------
	"setByName_radiobuton":function( name, val )
	//---------------------------------------------------------------------
	{
		var list = document.getElementsByName( name ) ;
		for ( let l of list )
		{
			if ( l.value == val )
			{
				l.checked = true;
				break;
			}
		}
		return val;
	},
	//---------------------------------------------------------------------
	"getByName_checkbox":function( name, val )
	//---------------------------------------------------------------------
	{
		if ( document.getElementsByName( name ).length > 0 ) 
		{
			if ( document.getElementsByName( name )[0] ) 
			{
				val = document.getElementsByName( name )[0].checked;
			}
		}
		return val;
	},
	//---------------------------------------------------------------------
	"setByName_checkbox":function( name, val )
	//---------------------------------------------------------------------
	{
		if ( document.getElementsByName( name ).length > 0 ) 
		{
			if ( document.getElementsByName( name )[0] ) 
			{
				document.getElementsByName( name )[0].checked = val;
			}
		}
	},
	//---------------------------------------------------------------------
	"getById_selectbox":function( name, val )
	//---------------------------------------------------------------------
	{
		let select = document.getElementById( name );
		if ( select)
		{
			val = select.value;
		}
		return val;
	},
	//---------------------------------------------------------------------
	"setById_selectbox":function( name, val )
	//---------------------------------------------------------------------
	{
		var select = document.getElementById(name);
		if ( select )
		{
			for ( let o of select.options )
			{
				if ( o.value == val )
				{
					o.selected = true;
				}
			}
		}
	},
};

//-----------------------------------------------------------------------------
function strfloat( v, r=4, f=2 ) // v値、r指数部桁、f小数部桁
//-----------------------------------------------------------------------------
{
	let a = Number.parseFloat(v).toFixed(f);
	let b = r+f+1 - a.length;
	if ( b > 0 )
	{
		a = ' '.repeat(b)+a;
	}
	return a;
/*

	let a = Math.pow(10,f);
	let b = Math.floor( v );
//	let c = parseInt( v, 10 );	// 小数点以下切り捨て
	let c = v>0?Math.floor( v ):-Math.floor( -v );	// 小数点以下切り捨て
	let d = Math.abs(v-c);
//	let e = Math.round( d*a );	// 四捨五入
	let e = (d*a)>0?Math.floor( (d*a) ):-Math.floor( -(d*a) );	// 小数点以下切り捨て
	let g = ('0'.repeat(f)+e).substr(-f);
	let h = (g+'0'.repeat(f)).substr(0,f);
	let i = (' '.repeat(r)+c).substr(-r);
	return i+"."+ h;
*/
}

//-----------------------------------------------------------------------------
function se_create()	// 2021/07/26 効果音ライブラリ
//-----------------------------------------------------------------------------
{
	let se = {};
	let	audioctx
	let analyser;

	//-----------------------------------------------------------------------------
	se.play = function( freq1,len1,freq2,len2, type = 'square', vol=0.5) 
	//-----------------------------------------------------------------------------
	{
		// 二つの周波数の音を繋げて鳴らす、簡易効果音再生
		// 音程周波数1(Hz),長さ1(s),音程周波数2(Hz),長さ2(s),音色タイプ,ボリューム

		//type = "triangle";
		//type = "sawtooth";
		//type = "sine";
		//type = "square";
		// 最初の初期化。起動時に同時に行うとwarnningが出るため、最初に鳴らすときに行う
		if ( audioctx == undefined )
		{
			let	func = window.AudioContext || window.webkitAudioContext;
			audioctx = new func();
		}
		if ( analyser == undefined )
		{
			analyser = audioctx.createAnalyser();
			analyser.connect( audioctx.destination );
		}
		//--

		let t0 = audioctx.currentTime;			// コンテクストが作られてからの経過時間(s)
		let t1 = t0 + len1;
		let t2 = t1 + len2;

		let oscillator = audioctx.createOscillator();
		let gain = audioctx.createGain();

		oscillator.type = type;
		oscillator.frequency.setValueAtTime( freq1, t0 );
		oscillator.frequency.setValueAtTime( freq2, t1 );
		oscillator.start( t0 );
		oscillator.stop( t2 );
		oscillator.connect( gain );

		gain.gain.setValueAtTime( vol, t0 );
		gain.gain.setValueAtTime( vol, t1 );
		gain.gain.linearRampToValueAtTime( 0, t2 );	//前にスケジュールされているパラメーター値から指定された値まで、直線的に連続して値を変化させる
		gain.connect( analyser );
	}

	return se;
}

//------------------------------------------------------------------------------
function func_intersect_Line_Point2( P0, I0, P1 )	// 直線と点との距離
//------------------------------------------------------------------------------
{
	// P0:始点
	// I0:方向（単位ベクトル）
	// P1:点
	// Q :衝突点
	// t :P0からQまでの距離

	let I1 = vsub2(P1 , P0);
	let t = dot2(I0,I1);	// P0からQまでのQ距離
	let Q = vadd2( P0, vmul_scalar2(I0,t));
	let	d =  length2(vsub2(Q , P1));
	return [true,d,Q,t];
}

//------------------------------------------------------------------------------
function func_intersect_HarfLine_Point2( P0, I0, P1 )	// 半直線と点との距離 2021/07/23
//------------------------------------------------------------------------------
{
	let [flg,d,Q,t] = func_intersect_Line_Point2( P0, I0, P1 );

	if ( t <= 0 ) flg = false; 			// 始点トリミング：範囲外でも使える衝突点等の値が返る

	return [flg,d,Q,t];
}

//------------------------------------------------------------------------------
function func_intersect_SegLine_Point2( P0, Q0, P1 )	// 線分と点との距離 2021/07/23
//------------------------------------------------------------------------------
{
	// P0:始点
	// Q0:終点
	// P1:点
 	let L = vsub2(Q0 , P0)
 	let I0 = normalize2(L)

	let [flg,d,Q,t] = func_intersect_Line_Point2( P0, I0, P1 );
	if ( t <= 0 ) flg = false; 			// 始点トリミング：範囲外でも使える衝突点等の値が返る
	if ( t >= length2(L) ) flg = false;	// 終点トリミング：範囲外でも使える衝突点等の値が返る

	return [flg,d,Q,t];
}


//------------------------------------------------------------------------------
function func_intersect_Line_Line2( P0, I0, P1, I1 ) // 直線と直線の距離 2021/07/23
//------------------------------------------------------------------------------
{
	if ( (I0.x==0 && I0.y==0) || (I1.x==0 && I1.y==0) ) return [false,0,vec2(0,0),vec2(0,0),0,0];

	//    P0       P1
	//    |        |
	//    |}t0     |}t1(時間:Iベクトル方向、負の数ならP1より前)
	//    |        |
	// Q0 +--------+ Q1(衝突位置)
	//    |        |
	//    v        v
	//    I0       I1 (I0,I1は単位ベクトル)
	//
	//	交点ができたときは、Q0=Q1 , d=0 になる

	if (  cross2( I0, I1 ) == 0 ) // 平行だった時
	{
		let Q0 = vec2(0.0);
		let Q1 = vec2(0.0);
		let d = Math.abs( cross2( vsub2(P1 , P0), I0 ) );	// func_intersect_Line_Point2():点と線との距離
		return [false,d,Q0,Q1,0,0];
	}

	let d0 = dot2( vsub2(P1 , P0), I0 );
	let d1 = dot2( vsub2(P1 , P0), I1 );
	let d2 = dot2( I0, I1 );

	let t0 = ( d0 - d1 * d2 ) / ( 1.0 - d2 * d2 );
	let t1 = ( d1 - d0 * d2 ) / ( d2 * d2 - 1.0 );

	let	Q0 = vadd2(P0 , vmul_scalar2(I0,t0));
	let	Q1 = vadd2(P1 , vmul_scalar2(I1,t1));
	let	d =  length2(vsub2(Q1 , Q0));

	return [true,d,Q0,Q1,t0,t1];
}
//------------------------------------------------------------------------------
function func_intersect_HarfLine_HarfLine2( P0, I0, P1, I1 )	//2021/07/23 半直線と線分の距離
//------------------------------------------------------------------------------
{
	if ( (I0.x==0 && I0.y==0) || (I1.x==0 && I1.y==0) ) return [false,0,vec2(0,0),vec2(0,0),0,0];

	// 半直線と線分の距離
	// 半直線   : P0+I0
	// 半直線   : p1+I1
	// 距離     : d = |Q1-Q0|
	// 戻り値   : d距離 Q0,Q1	※false でもdだけは取得できる
	
	let [flg,d,Q0,Q1,t0,t1] = func_intersect_Line_Line2( P0, I0, P1, I1 );

	if ( flg )
	{
		// 半直線
		if ( t0 < 0 ) flg = false;
		if ( t1 < 0 ) flg = false;
	}

	return [flg,d,Q0,Q1,t0,t1];
}
//------------------------------------------------------------------------------
function func_intersect_SegLine_SegLine2( p0, q0, p1, q1 )	//2021/07/23 線分と線分の距離
//------------------------------------------------------------------------------
{
	if ( q0.x == p0.x && q0.y == p0.y || q1.x == p1.x && q1.y == p1.y ) return [false,0,vec2(0,0),vec2(0,0),0,0];

	// 線分と線分の距離
	// 線分0開始: p0
	// 線分0終了: q0
	// 線分1開始: p1
	// 線分1終了: q1
	// 距離     : d = |Q1-Q0|
	// 戻り値   : d距離 Q0,Q1	※false でもdだけは取得できる
	
	let	P0 = p0;
	let	I0 = normalize2( vsub2(q0,p0) );
	let	P1 = p1;
	let	I1 = normalize2( vsub2(q1,p1) );

	let [flg,d,Q0,Q1,t0,t1] = func_intersect_Line_Line2( P0, I0, P1, I1 );

	if ( flg )
	{
		// 線分処理
		if ( t1 < 0 ) flg = false;
		if ( t1 > length2(vsub2(q1,p1)) ) flg = false;

		// 線分処理
		if ( t0 < 0 ) flg = false;
		if ( t0 > length2(vsub2(q0,p0)) ) flg = false;

	}

	return [flg,d,Q0,Q1,t0,t1];
}

//-----------------------------------------------------------------------------
function pad_create()	// 2021/07/23 追加
//-----------------------------------------------------------------------------
{
	// PS4パッド、XBOX one パッド、switchパッドでは同じように使える様子
	// 電源ボタン,L3R3アナログボタン押し込み、メニューボタンのようなものは使えず。button[16]もバッファはあるけどアサインは不明

	let body = 
	{
		lx:0,
		ly:0,
		rx:0,
		ry:0,
		a:false,
		b:false,
		x:false,
		y:false,
		l1:false,
		r1:false,
		l2:0,
		r2:0,
		se:false,
		st:false,
		u:false,
		d:false,
		l:false,
		r:false,
		B16:false,
		trig:
		{
			a:false,
			b:false,
			x:false,
			y:false,
			l1:false,
			r1:false,
			se:false,
			st:false,
			u:false,
			d:false,
			l:false,
			r:false,
			B16:false,
		},
		release:
		{
			a:false,
			b:false,
			x:false,
			y:false,
			l1:false,
			r1:false,
			se:false,
			st:false,
			u:false,
			d:false,
			l:false,
			r:false,
			B16:false,
		}
	};

	//-----------------------------------------------------------------------------
	body.getinfo = function()
	//-----------------------------------------------------------------------------
	{
		if(navigator.getGamepads)
		{
			let list = navigator.getGamepads();
			for ( let pad of list )
			{
				if ( pad != null )		
				{
					if ( body.prevButtons == undefined ) 
					{
						body.lx = pad.axes[0];
						body.ly = pad.axes[1];
						body.rx = pad.axes[2];
						body.ry = pad.axes[3];
						body.a  = pad.buttons[ 0].value == 1;
						body.b  = pad.buttons[ 1].value == 1;
						body.x  = pad.buttons[ 2].value == 1;
						body.y  = pad.buttons[ 3].value == 1;
						body.l1 = pad.buttons[ 4].value == 1;
						body.r1 = pad.buttons[ 5].value == 1;
						body.l2 = pad.buttons[ 6].value;
						body.r2 = pad.buttons[ 7].value;
						body.se = pad.buttons[ 8].value == 1;
						body.st = pad.buttons[ 9].value == 1;
						body.u  = pad.buttons[12].value == 1;
						body.d  = pad.buttons[13].value == 1;
						body.l  = pad.buttons[14].value == 1;
						body.r  = pad.buttons[15].value == 1;
						body.B16= pad.buttons[16].value == 1;

						body.trig.a  = pad.buttons[ 0].value == 1;
						body.trig.b  = pad.buttons[ 1].value == 1;
						body.trig.x  = pad.buttons[ 2].value == 1;
						body.trig.y  = pad.buttons[ 3].value == 1;
						body.trig.l1 = pad.buttons[ 4].value == 1;
						body.trig.r1 = pad.buttons[ 5].value == 1;
						body.trig.se = pad.buttons[ 8].value == 1;
						body.trig.st = pad.buttons[ 9].value == 1;
						body.trig.u  = pad.buttons[12].value == 1;
						body.trig.d  = pad.buttons[13].value == 1;
						body.trig.l  = pad.buttons[14].value == 1;
						body.trig.r	 = pad.buttons[15].value == 1;
						body.trig.B16= pad.buttons[16].value == 1;

						body.release.a  = false;
						body.release.b  = false;
						body.release.x  = false;
						body.release.y  = false;
						body.release.l1 = false;
						body.release.r1 = false;
						body.release.se = false;
						body.release.st = false;
						body.release.u  = false;
						body.release.d  = false;
						body.release.l  = false;
						body.release.r	= false;
						body.release.B16= false;
					}
					else
					{
						body.lx =  pad.axes[0];
						body.ly =  pad.axes[1];
						body.rx =  pad.axes[2];
						body.ry =  pad.axes[3];
						body.a  =  pad.buttons[ 0].value == 1;
						body.b  =  pad.buttons[ 1].value == 1;
						body.x  =  pad.buttons[ 2].value == 1;
						body.y  =  pad.buttons[ 3].value == 1;
						body.l1 =  pad.buttons[ 4].value == 1;
						body.r1 =  pad.buttons[ 5].value == 1;
						body.l2 =  pad.buttons[ 6].value;
						body.r2 =  pad.buttons[ 7].value;
						body.se =  pad.buttons[ 8].value == 1;
						body.st =  pad.buttons[ 9].value == 1;
						body.u  =  pad.buttons[12].value == 1;
						body.d  =  pad.buttons[13].value == 1;
						body.l  =  pad.buttons[14].value == 1;
						body.r  =  pad.buttons[15].value == 1;
						body.B16=  pad.buttons[16].value == 1;

						body.trig.a  = (pad.buttons[ 0].value == 1 ) && ( body.prevButtons[ 0].value != 1 );
						body.trig.b  = (pad.buttons[ 1].value == 1 ) && ( body.prevButtons[ 1].value != 1 );
						body.trig.x  = (pad.buttons[ 2].value == 1 ) && ( body.prevButtons[ 2].value != 1 );
						body.trig.y  = (pad.buttons[ 3].value == 1 ) && ( body.prevButtons[ 3].value != 1 );
						body.trig.l1 = (pad.buttons[ 4].value == 1 ) && ( body.prevButtons[ 4].value != 1 );
						body.trig.r1 = (pad.buttons[ 5].value == 1 ) && ( body.prevButtons[ 5].value != 1 );
						body.trig.se = (pad.buttons[ 8].value == 1 ) && ( body.prevButtons[ 8].value != 1 );
						body.trig.st = (pad.buttons[ 9].value == 1 ) && ( body.prevButtons[ 9].value != 1 );
						body.trig.u  = (pad.buttons[12].value == 1 ) && ( body.prevButtons[12].value != 1 );
						body.trig.d  = (pad.buttons[13].value == 1 ) && ( body.prevButtons[13].value != 1 );
						body.trig.l  = (pad.buttons[14].value == 1 ) && ( body.prevButtons[14].value != 1 );
						body.trig.r  = (pad.buttons[15].value == 1 ) && ( body.prevButtons[15].value != 1 );
						body.trig.B16= (pad.buttons[16].value == 1 ) && ( body.prevButtons[16].value != 1 );

						body.release.a  = (pad.buttons[ 0].value == 0 ) && ( body.prevButtons[ 0].value != 0 );
						body.release.b  = (pad.buttons[ 1].value == 0 ) && ( body.prevButtons[ 1].value != 0 );
						body.release.x  = (pad.buttons[ 2].value == 0 ) && ( body.prevButtons[ 2].value != 0 );
						body.release.y  = (pad.buttons[ 3].value == 0 ) && ( body.prevButtons[ 3].value != 0 );
						body.release.l1 = (pad.buttons[ 4].value == 0 ) && ( body.prevButtons[ 4].value != 0 );
						body.release.r1 = (pad.buttons[ 5].value == 0 ) && ( body.prevButtons[ 5].value != 0 );
						body.release.se = (pad.buttons[ 8].value == 0 ) && ( body.prevButtons[ 8].value != 0 );
						body.release.st = (pad.buttons[ 9].value == 0 ) && ( body.prevButtons[ 9].value != 0 );
						body.release.u  = (pad.buttons[12].value == 0 ) && ( body.prevButtons[12].value != 0 );
						body.release.d  = (pad.buttons[13].value == 0 ) && ( body.prevButtons[13].value != 0 );
						body.release.l  = (pad.buttons[14].value == 0 ) && ( body.prevButtons[14].value != 0 );
						body.release.r  = (pad.buttons[15].value == 0 ) && ( body.prevButtons[15].value != 0 );
						body.release.B16= (pad.buttons[16].value == 0 ) && ( body.prevButtons[16].value != 0 );

						let border = 0.15; //15%を遊び
						if ( Math.abs( body.lx ) < border ) body.lx = 0;
						if ( Math.abs( body.ly ) < border ) body.ly = 0;
						if ( Math.abs( body.rx ) < border ) body.rx = 0;
						if ( Math.abs( body.ry ) < border ) body.ry = 0;
					}

					body.prevButtons = pad.buttons;
				}
			}
		}
		return body;
	}

	body.test_press = function()
	{
		let p = body;
		console.log( "press:",p.a,p.b,p.x,p.y,p.l1,p.r1,p.se,p.st,p.lx,p.ly,p.rx,p.ry,p.l2,p.r2,p.u,p.d,p.l,p.r,p.B16 );
	}
	body.test_trig = function()
	{
		let p = body.trig;
		console.log( "trig:",p.a,p.b,p.x,p.y,p.l1,p.r1,p.se,p.st,p.lx,p.ly,p.rx,p.ry,p.l2,p.r2,p.u,p.d,p.l,p.r,p.B16 );
	}
	body.test_release = function()
	{
		let p = body.trig;
		console.log( "release:",p.a,p.b,p.x,p.y,p.l1,p.r1,p.se,p.st,p.lx,p.ly,p.rx,p.ry,p.l2,p.r2,p.u,p.d,p.l,p.r,p.B16 );
	}

	return body;
}

//-----------------------------------------------------------------------------
function gra_create( cv )	//2021/06/01		2Dグラフィックス
//-----------------------------------------------------------------------------
{
	let gra={}
	gra.ctx=cv.getContext('2d');
	gra.x = 0;
	gra.y = 0;

	gra.sx = 0; 
	gra.sy = 0; 
	gra.ex = gra.ctx.canvas.width; 
	gra.ey = gra.ctx.canvas.height; 
	gra.size_w = gra.ex-gra.sx;
	gra.size_h = gra.ey-gra.sy;

	gra.backcol = "#FFFFFF";
//	gra.ctx.font = "12px monospace";	// iOSだとCourierになる	読める限界の小ささ
//	gra.ctx.font = "14px monospace";	// iOSだとCourierになる 程よい小ささ
//	gra.ctx.font = "16px Courier";	// iOSでも使えるモノスペースフォントただし漢字はモノスペースにはならない 見栄えもある
//	gra.ctx.textAlign = "left";
//	gra.ctx.textBaseline = "alphabetic";
	gra.fontw = gra.ctx.measureText("_").width;

	gra.lineWidth = 1;
	if(0)
	{
		//2021/07/22 フルスクリーン用にアスペクト機能を追加	※フルスクリーン画面の解像度はソフトウェアは把握できない。
		gra.asp = 1/(gra.ctx.canvas.width/gra.ctx.canvas.height);
		gra.adj = (gra.ctx.canvas.width-gra.ctx.canvas.height)/2;
	}
	else
	{
		//2021/12/26	デフォルトは確保したサイズと左詰めではないかと思って変更
		gra.asp = 1.0;
		gra.adj = 0;
	}

	//-------------------------------------------------------------------------
	gra.window = function( _sx, _sy, _ex, _ey )
	//-------------------------------------------------------------------------
	{
		gra.sx = _sx;
		gra.sy = _sy;
		gra.ex = _ex;
		gra.ey = _ey;
		gra.size_w = gra.ex-gra.sx;
		gra.size_h = gra.ey-gra.sy;
	}
	//-------------------------------------------------------------------------
	gra.adjust_win = function() // 2021/08/03 window scale に合わせる
	//-------------------------------------------------------------------------
	{
		gra.ctx.lineWidth = gra.ctx.canvas.height/(gra.ey-gra.sy) *gra.lineWidth;
	}	
	
	//-------------------------------------------------------------------------
	gra.setAspect = function( as,ab )	// 2021/08/13追加
	//-------------------------------------------------------------------------
	{
		gra.asp = as;
		gra.adj = ab;
	}


	gra.win_abs = function( x, y )
	{
		let w = gra.ex-gra.sx;
		let h = gra.ey-gra.sy;
		x = (x-gra.sx)/w * gra.ctx.canvas.width;
		y = (y-gra.sy)/h * gra.ctx.canvas.height;
		return [x*gra.asp+gra.adj,y];
	}
	gra.win_range = function( x, y )
	{
		if ( gra.mode == 'no-range' )
		{
		
			// モードはよくない。パラメータで素の値が返るようにするべき
		
			return [x,y];
		}
		else
		if ( gra.mode == '' )
		{
			let w = Math.abs(gra.ex-gra.sx);
			let h = Math.abs(gra.ey-gra.sy);
			x = (x)/w * gra.ctx.canvas.width;
			y = (y)/h * gra.ctx.canvas.height;
			return [x*gra.asp,y];
		}
		else
		{
			alert("gra mode 異常 gra.win_range()");
		}
	}
	gra.mode = ''; 
	//-----------------------------------------------------------------------------
	gra.setMode = function( mode )	// ドットbyドット
	//-----------------------------------------------------------------------------
	{
		gra.mode = mode;
	}
	
	//-----------------------------------------------------------------------------
	gra.box = function( x1, y1, x2, y2 )
	//-----------------------------------------------------------------------------
	{
		function func( sx,sy, ex,ey )
		{
			gra.ctx.beginPath();
		    gra.ctx.rect(sx,sy,ex-sx,ey-sy);
			gra.ctx.closePath();
			gra.ctx.stroke();
		}

		[x1,y1]=gra.win_abs(x1,y1);
		[x2,y2]=gra.win_abs(x2,y2);

		func( x1, y1, x2, y2 );
	}
	//-----------------------------------------------------------------------------
	gra.fill= function(  x1, y1, x2, y2 ) // 使えなくなっていたのを修正
	//-----------------------------------------------------------------------------
	{
		function func( sx,sy, ex,ey )
		{

			gra.ctx.beginPath();
		    gra.ctx.rect(sx,sy,ex-sx,ey-sy);
//			gra.ctx.closePath();
			gra.ctx.fill();
		}

		[x1,y1]=gra.win_abs(x1,y1);
		[x2,y2]=gra.win_abs(x2,y2);

		func( x1, y1, x2, y2 );
	}
	

	//-------------------------------------------------------------------------
	gra.line = function( x1, y1, x2, y2 )
	//-------------------------------------------------------------------------
	{
		function func( sx,sy, ex,ey )
		{
			gra.ctx.beginPath();
			gra.ctx.moveTo( sx, sy );
			gra.ctx.lineTo( ex, ey );
//			gra.ctx.closePath();
			gra.ctx.stroke();
		}

		[x1,y1]=gra.win_abs(x1,y1);
		[x2,y2]=gra.win_abs(x2,y2);

		func( x1, y1, x2, y2 );
	}
	//-------------------------------------------------------------------------
	gra.line2 = function( v0, v1 ) // 2021/08/10 追加
	//-------------------------------------------------------------------------
	{
		gra.line( v0.x, v0.y, v1.x, v1.y );
	}
	
	//-------------------------------------------------------------------------
	gra.pattern = function( type = '' )
	//-------------------------------------------------------------------------
	{
		switch( type )
		{
			case "": gra.ctx.setLineDash([]);	break;
			case "normal": gra.ctx.setLineDash([]);	break;
			case "hasen1": gra.ctx.setLineDash([1,2]);	break;
			case "hasen2": gra.ctx.setLineDash([2,4]);	break;
			case "hasen3": gra.ctx.setLineDash([3,6]);	break;
			case "hasen4": gra.ctx.setLineDash([4,8]);	break;
			case "hasen": gra.ctx.setLineDash([2,4]);	break;
			default: alert("破線パターン異常 gra.pattern():",type);
		}
	}
	//-------------------------------------------------------------------------
	gra.path_n = function( V, mode="/loop/fill" ) // vec2 V
	//-------------------------------------------------------------------------
	{
		for ( let v of V )
		{
			[v.x,v.y]=gra.win_abs(v.x,v.y);
		}

		{
			gra.ctx.beginPath();

			gra.ctx.moveTo( V[0].x, V[0].y );
			
			for ( let i = 1 ; i < V.length ; i++ )
			{
				gra.ctx.lineTo( V[i].x, V[i].y );
			}


			if ( mode == 'fill' ) 
			{
				gra.ctx.fill();
			}
			else
			if ( mode == 'loop' )
			{
				gra.ctx.closePath();
				gra.ctx.stroke();
			}
			else
			{
				gra.ctx.stroke();
			}

		}
	}

	//-------------------------------------------------------------------------
	gra.locate = function( x1, y1 )
	//-------------------------------------------------------------------------
	{
		gra.x=x1*gra.fontw/gra.asp;
		gra.y=y1*16;
	}
	//-------------------------------------------------------------------------
	//gra.print = function( str, x1=gra.x, y1=gra.y )
	gra.print_old = function( str, x1=gra.x, y1=gra.y )
	//-------------------------------------------------------------------------
	{
//		[x1,y1]=gra.win_abs(x1,y1);	
		gra.ctx.font = "14px Courier";	// iOSでも使えるモノスペースフォントただし漢字はモノスペースにはならない 16pxより綺麗に見える
		gra.ctx.textAlign = "left";
		gra.ctx.textBaseline = "alphabetic";
		gra.ctx.fillText( str, x1+2, y1+16-1 );

		gra.x = x1;
		gra.y = y1+16;
	}
	//-------------------------------------------------------------------------
	gra.print = function( str, x1=gra.x, y1=gra.y )
	//-------------------------------------------------------------------------
	{
		[x1,y1]=gra.win_abs(x1,y1);	
		gra.ctx.font = "14px Courier";	// iOSでも使えるモノスペースフォントただし漢字はモノスペースにはならない 16pxより綺麗に見える
		gra.ctx.textAlign = "left";
		gra.ctx.textBaseline = "alphabetic";
		gra.ctx.fillText( str, x1+2, y1+16-1 );

		gra.x = x1;
		gra.y = y1+16;
	}
	//-------------------------------------------------------------------------
	gra.symbol = function( str, x1,y1, size = 16, alighbase="CM", rot=0 )
	//-------------------------------------------------------------------------
	{
		// 画面解像度に合わせて大きさが変わるフォントサイズ	※描画サイズに関係がないので機種依存しない

		[x1,y1]=gra.win_abs(x1,y1);
		let [sw,sh] = gra.win_range(size,size);

		let align;
		let base;
		switch( alighbase )
		{
			case "LB": align="left"		;base="ideographic"		;break;
			case "CB": align="center"	;base="ideographic"		;break;
			case "RB": align="right"	;base="ideographic"		;break;
			case "LM": align="left"		;base="middle"			;break;
			case "CM": align="center"	;base="middle"			;break;
			case "RM": align="right"	;base="middle"			;break;
			case "LT": align="left"		;base="top"				;break;
			case "CT": align="center"	;base="top"				;break;
			case "RT": align="right"	;base="top"				;break;
			case "center": align=alighbase	;base="ideographic"		;break;
			default: 	alert("symbol() 文字位置エラー:"+alighbase);
		}

		gra.ctx.font =   sw+"px Courier";
		gra.ctx.textAlign = align;
//		base="middle";
		gra.ctx.textBaseline = base;
		

				gra.ctx.save();
				gra.ctx.translate(x1,y1);

				gra.ctx.rotate( rot );
					
				gra.ctx.fillText( str, 0, 0 );

				gra.ctx.restore();
	}

	//-------------------------------------------------------------------------
	gra.symbol_row = function( str, x1,y1, size = 16, alighbase="CM" )
	//-------------------------------------------------------------------------
	{
		// 画面解像度に依存しないフォントサイズ				※文字の大きさが変わらないので情報表示用
	
		[x1,y1]=gra.win_abs(x1,y1);
//		let [sw,sh] = gra.win_range(size,size);

		switch( alighbase )
		{
			case "LB": align="left"		;base="ideographic"		;break;
			case "CB": align="center"	;base="ideographic"		;break;
			case "RB": align="right"	;base="ideographic"		;break;
			case "LM": align="left"		;base="middle"			;break;
			case "CM": align="center"	;base="middle"			;break;
			case "RM": align="right"	;base="middle"			;break;
			case "LT": align="left"		;base="top"				;break;
			case "CT": align="center"	;base="top"				;break;
			case "RT": align="right"	;base="top"				;break;
			case "center": align=alighbase	;base="ideographic"		;break;
			default: 	alert("symbol() 文字位置エラー:"+alighbase);
		}

		gra.ctx.font =   size+"px Courier";
		gra.ctx.textAlign = align;
		gra.ctx.textBaseline = base;
		gra.ctx.fillText( str, x1, y1 );
	}

	//-----------------------------------------------------------------------------
	gra.alpha = function( fa=1.0, func='none' ) // 2021/07/10 追加
	//-----------------------------------------------------------------------------
	{
		gra.ctx.globalAlpha=fa;

		switch( func )
		{
			case 'add':		gra.ctx.globalCompositeOperation = "lighter"; 		break;	// 加算合成
			default:		gra.ctx.globalCompositeOperation = "source-over";	break;	// src*(1-α)+dst*α
		}
	}

	//-----------------------------------------------------------------------------
	gra.setLineWidth = function( val=1.0 ) //2021/07/26 追加	windowサイズに合わせる
	//-----------------------------------------------------------------------------
	{
		gra.lineWidth = gra.ctx.canvas.height/(gra.ey-gra.sy) *val;
		gra.ctx.lineWidth = gra.lineWidth;
	}
	//-----------------------------------------------------------------------------
	gra.setLineWidth_row = function( val=1.0 ) //2021/07/26 追加	生のサイズ
	//-----------------------------------------------------------------------------
	{
		gra.lineWidth = val;
		gra.ctx.lineWidth = val;
	}

	//-----------------------------------------------------------------------------
//	gra.rgb = function( col )//2021/10/24
	gra.rgb =  function(  fr, fg, fb  )//2021/11/01
	//-----------------------------------------------------------------------------
	{
		let r = fr*255;
		let g = fg*255;
		let b = fb*255;
		if ( r > 255 ) r = 255;
		if ( g > 255 ) g = 255;
		if ( b > 255 ) b = 255;
		let c = (r<<16)+(g<<8)+(b<<0);
		return c;
	}
	//-----------------------------------------------------------------------------
//	gra.color_rgb = function( [fr, fg, fb] ) //2021/12/26
	gra.color = function( [fr, fg, fb] ) //2021/12/26 作成 2022/01/20 名前変更
	//-----------------------------------------------------------------------------
	{
		let c = gra.rgb( fr,fg,fb);

		let s = "#"+("000000"+c.toString(16)).substr(-6);

		gra.ctx.strokeStyle = s;

		gra.ctx.fillStyle = s;
	}
/* 2022/01/20 廃止
	//-----------------------------------------------------------------------------
	gra.color = function( fr, fg, fb ) //2021/11/01
	//-----------------------------------------------------------------------------
	{
		let c = gra.rgb( fr,fg,fb);

		let s = "#"+("000000"+c.toString(16)).substr(-6);

		gra.ctx.strokeStyle = s;

		gra.ctx.fillStyle = s;
	}
	//-----------------------------------------------------------------------------
	gra.color_row = function( c ) // 2021/11/01
	//-----------------------------------------------------------------------------
	{
	//	let c = gra.rgb( fr,fg,fb);

		let s = "#"+("000000"+c.toString(16)).substr(-6);

		gra.ctx.strokeStyle = s;

		gra.ctx.fillStyle = s;
	}
*/

	//-----------------------------------------------------------------------------
//	gra.backcolor_rgb = function( [fr=0.0, fg=0.0, fb=0.0] ) // 2021/12/26
	gra.backcolor = function( [fr=0.0, fg=0.0, fb=0.0] ) // 2021/12/26 作成 2022/01/20 名称変更
	//-----------------------------------------------------------------------------
	{
		let r = fr*255;
		let g = fg*255;
		let b = fb*255;
		if ( r > 255 ) r = 255;
		if ( g > 255 ) g = 255;
		if ( b > 255 ) b = 255;
		let c = (r<<16)+(g<<8)+(b<<0);
		
		let s = "#"+("000000"+c.toString(16)).substr(-6);
		gra.backcol = s;
	}
/* 2022/01/20 廃止
	//-----------------------------------------------------------------------------
	gra.backcolor = function( fr=0.0, fg=0.0, fb=0.0 ) // 2021/07/19 追加
	//-----------------------------------------------------------------------------
	{
		let r = fr*255;
		let g = fg*255;
		let b = fb*255;
		if ( r > 255 ) r = 255;
		if ( g > 255 ) g = 255;
		if ( b > 255 ) b = 255;
		let c = (r<<16)+(g<<8)+(b<<0);
		
		let s = "#"+("000000"+c.toString(16)).substr(-6);
		gra.backcol = s;
	}
*/	
	//-----------------------------------------------------------------------------
	gra.bezier_n = function( v, mode='/loop/fill/loopfill' ) // vec2[] v;  2021/07/29 add
	//-----------------------------------------------------------------------------
	{
		if ( v.length < 4 ) return;

		for ( let a of v )
		{
			[a.x,a.y]=gra.win_abs(a.x,a.y);
		}

		{
			gra.ctx.beginPath();

			{
				let p = 0;
				let x0,y0;
				let x1,y1;
				let [x2,y2] = [v[p+0].x,v[p+0].y];
				let [x3,y3] = [v[p+1].x,v[p+1].y];
				gra.ctx.moveTo( x2, y2 );
				//--
				for ( let i = 0 ; i < v.length/2 ; i++ )
				{
					p += 2;
					if ( mode == 'loop' || mode == 'loopfill' )	p %= v.length;
					if ( p >= v.length ) break;
					[x0,y0] = [x2,y2];
					[x1,y1] = [x3,y3];
					[x2,y2] = [v[p+0].x,v[p+0].y];
					[x3,y3] = [v[p+1].x,v[p+1].y];

					if ( (i%2)==0 )
					{
						gra.ctx.bezierCurveTo( x1, y1, x2, y2, x3, y3 );
					}
					else
					{
						let x0b = 2*x1-x0;
						let y0b = 2*y1-y0;
						let x3b = 2*x2-x3;
						let y3b = 2*y2-y3;
						gra.ctx.bezierCurveTo( x0b, y0b, x3b, y3b, x2, y2 );
					}
				}
			}

			if ( mode == 'fill' || mode == 'loopfill' )	gra.ctx.fill();
			gra.ctx.stroke();
		}

	}
	//-----------------------------------------------------------------------------
	gra.circle = function( x1,y1,r, st=0, en=Math.PI*2, mode="/loop/fill" ) // 2021/07/21　circle にst en を追加
	//-----------------------------------------------------------------------------
	{
		[x1,y1]=gra.win_abs(x1,y1);
		let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		{
			gra.ctx.beginPath();

			let rotation = 0;
//			gra.ctx.ellipse( x1, y1, rw, rh, rotation, Math.PI*2-en, Math.PI*2-st  );
			gra.ctx.ellipse( x1, y1, rw, rh, rotation, -st, -en, true  ); // 反時計回り(-st, -en, true)

			if ( mode == 'loop' ) 
			{
				gra.ctx.closePath();
				gra.ctx.stroke();
			}
			else
			if ( mode == 'fill' ) 
			{
				gra.ctx.fill();
			}
			else
			{
				gra.ctx.stroke();
			}
		}
	}
	//-----------------------------------------------------------------------------
	gra.circle_row = function( x1,y1,r, st=0, en=Math.PI*2, mode="/loop/fill" ) // 2021/07/21　circle にst en を追加
	//-----------------------------------------------------------------------------
	{
		[x1,y1]=gra.win_abs(x1,y1);
		let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		rw = r;
		rh = r;
		{
			gra.ctx.beginPath();

			let rotation = 0;
//			gra.ctx.ellipse( x1, y1, rw, rh, rotation, Math.PI*2-en, Math.PI*2-st  );
			gra.ctx.ellipse( x1, y1, rw, rh, rotation, -st, -en, true  ); // 反時計回り(-st, -en, true)

			if ( mode == 'loop' ) 
			{
				gra.ctx.closePath();
				gra.ctx.stroke();
			}
			else
			if ( mode == 'fill' ) 
			{
				gra.ctx.fill();
			}
			else
			{
				gra.ctx.stroke();
			}
		}
	}
	//-----------------------------------------------------------------------------
	gra.circlefill = function( x1,y1,r, st=0, en=Math.PI*2 ) // 2021/07/21　circle にst en を追加 )
	//-----------------------------------------------------------------------------
	{
		[x1,y1]=gra.win_abs(x1,y1);
//		let [rw,rh] = gra.win_range(r*gra.asp,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		{
			gra.ctx.beginPath();
			let rotation = 0;
			gra.ctx.ellipse( x1, y1, rw, rh, rotation, st, en );
			gra.ctx.fill();
			gra.ctx.stroke(); // 2022/01/21
		};
	}
	//-----------------------------------------------------------------------------
	gra.dot = function( x1,y1,r, st=0, en=Math.PI*2 ) // 2021/07/21　circle にst en を追加 )
	//-----------------------------------------------------------------------------
	{
		[x1,y1]=gra.win_abs(x1,y1);
//		let [rw,rh] = gra.win_range(r*gra.asp,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		rw = r;
		rh = r;
		{
			gra.ctx.beginPath();
			let rotation = 0;
			gra.ctx.ellipse( x1, y1, rw, rh, rotation, st, en );
			gra.ctx.fill();
		};
	}

	//-----------------------------------------------------------------------------
	gra.pset = function( x1,y1,r=1 ) // 2021/08/13 追加
	//-----------------------------------------------------------------------------
	{
		[x1,y1]=gra.win_abs(x1,y1);
////		let [rw,rh] = gra.win_range(r*gra.asp,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
//		let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
		let st=0;
		let en=Math.PI*2;
		{
			gra.ctx.beginPath();
			let rotation = 0;
			gra.ctx.ellipse( x1, y1, r, r, rotation, st, en );
			gra.ctx.fill();
		};
	}

/*	//-----------------------------------------------------------------------------
	gra.drawpictgrambone = function( p1, r1, p2, r2 )	// 2021/07/30 ピクトグラム風、円が二つ連なった図形の描画
	//-----------------------------------------------------------------------------
	{

		let l = length2(vsub2(p2,p1));
		let rot = Math.atan2(p1.x-p2.x, p1.y-p2.y);
		let th = -Math.asin( (r1-r2)/l);

		let c = Math.cos(th);
		let s = Math.sin(th);
		let va=vec2( r1*c,r1*s);
		let vb=vec2( r2*c,r2*s);
		let vc=vec2(-r1*c,r1*s);
		let vd=vec2(-r2*c,r2*s);

		let pa = vadd2(vrot2(va,rot),p1);
		let pb = vadd2(vrot2(vb,rot),p2);
		let pc = vadd2(vrot2(vc,rot),p1);
		let pd = vadd2(vrot2(vd,rot),p2);

		function path_circle( x1,y1,r, st, en )
		{
			[x1,y1]=gra.win_abs(x1,y1);
			let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
			{
				let rotation = 0;
				gra.ctx.ellipse( x1, y1, rw, rh, rotation, st, en );
			};
		}
		
		function path_line( V ) // vec2 V
		{
			for ( let v of V )
			{
				[v.x,v.y]=gra.win_abs(v.x,v.y);
			}


			gra.ctx.moveTo( V[0].x, V[0].y );
			
			for ( let i = 1 ; i < V.length ; i++ )
			{
				gra.ctx.lineTo( V[i].x, V[i].y );
			}
		}

		gra.ctx.beginPath();
		path_circle( p1.x, p1.y, r1, Math.PI+th+rot, -th+rot );
		path_circle( p2.x, p2.y, r2, -th+rot, Math.PI+th+rot );
		path_line( [pd, pc, pa, pb ] );
		gra.ctx.fill();

	}
*/
	//-----------------------------------------------------------------------------
//	gra.drawpictgrambone = function( p1, r1, p2, r2 )	// 2021/07/30 ピクトグラム風、円が二つ連なった図形の描画
	gra.line_pictgram = function( x0,y0,x1,y1, r1, r2, mode='' )	// 2021/10/31
	//-----------------------------------------------------------------------------
	{
		let p1=vec2(x0,y0);
		let p2=vec2(x1,y1);

		let l = length2(vsub2(p2,p1));
		let rot = Math.atan2(p1.x-p2.x, p1.y-p2.y);
		let th = -Math.asin( (r1-r2)/l);

		let c = Math.cos(th);
		let s = Math.sin(th);
		let va=vec2( r1*c,r1*s);
		let vb=vec2( r2*c,r2*s);
		let vc=vec2(-r1*c,r1*s);
		let vd=vec2(-r2*c,r2*s);

		let pa = vadd2(vrot2(va,rot),p1);
		let pb = vadd2(vrot2(vb,rot),p2);
		let pc = vadd2(vrot2(vc,rot),p1);
		let pd = vadd2(vrot2(vd,rot),p2);

		function path_circle( x1,y1,r, st, en )
		{
			[x1,y1]=gra.win_abs(x1,y1);
			let [rw,rh] = gra.win_range(r,r); // 2021/07/29 windowとcanvasのアスペクト比を反映
			{
				let rotation = 0;
				gra.ctx.ellipse( x1, y1, rw, rh, rotation, st, en );
			};
		}
		
/*
		function path_line( V ) // vec2 V
		{
			for ( let v of V )
			{
				[v.x,v.y]=gra.win_abs(v.x,v.y);
			}


			gra.ctx.moveTo( V[0].x, V[0].y );
			
			for ( let i = 1 ; i < V.length ; i++ )
			{
				gra.ctx.lineTo( V[i].x, V[i].y );
			}
		}
*/
		gra.ctx.beginPath();
		path_circle( p1.x, p1.y, r1, Math.PI+th+rot, -th+rot );
		path_circle( p2.x, p2.y, r2, -th+rot, Math.PI+th+rot );
//		path_line( [pd, pc, pa, pb ] );

		if ( mode == 'fill' )
		{
			gra.ctx.fill();
		}
		else
		{
			gra.ctx.closePath();
			gra.ctx.stroke();
		}

	}
	//-----------------------------------------------------------------------------
	gra.cls = function()
	//-----------------------------------------------------------------------------
	{
		let c = gra.ctx.fillStyle;
		gra.ctx.fillStyle = gra.backcol;//"#ffffff";
		gra.ctx.fillRect( 0, 0, gra.ctx.canvas.width, gra.ctx.canvas.height );
		gra.x=0;
		gra.y=0;
		gra.ctx.fillStyle = c;
	}

	// ばねの表示
/*
	//-----------------------------------------------------------------------------
	gra.drawbane2d = function( a,b,r,step=10,l0=r*2,l1=r*2,wd=4,div=step*14 ) // 2021/08/06 追加
	//-----------------------------------------------------------------------------
	{
		let rot = Math.atan2( b.y-a.y, b.x-a.x );
		let p0=  vadd2( a , vrot2(vec2( l0,0),rot) );
		let p1 = vadd2( b , vrot2(vec2(-l1,0),rot) );
		//
		let v0 = vec2(a.x,a.y);
		let st = step*radians(360)/div;
		let th = radians(0);
		let len = length2( vsub( p1, p0) ); 
		let d = (len / div);
		for ( let i = 0 ; i <= div ; i++ )
		{
			let v1 = vec2(
				r* Math.cos(th)/wd + d*i,
				r* Math.sin(th)  
			);
			v1 = vrot2( v1, rot );
			v1 = vadd2( v1, p0 );

			gra.line( v0.x, v0.y, v1.x, v1.y );
			v0 = v1;

			th += st;
		}

		gra.line( v0.x, v0.y, b.x, b.y );
	}
*/
	//-----------------------------------------------------------------------------
	gra.line_spring= function( x0, y0, x1, y1,r,step=10,l0=r*2,l1=r*2,wd=4,div=step*14 ) // 2021/08/06 追加 2021/10/17変更
	//-----------------------------------------------------------------------------
	{
		let a = vec2(x0,y0);
		let b = vec2(x1,y1);
		let rot = Math.atan2( b.y-a.y, b.x-a.x );
		let p0=  vadd2( a , vrot2(vec2( l0,0),rot) );
		let p1 = vadd2( b , vrot2(vec2(-l1,0),rot) );
		//
		let v0 = vec2(a.x,a.y);
		let st = step*radians(360)/div;
		let th = radians(0);
		let len = length2( vsub( p1, p0) ); 
		let d = (len / div);
		for ( let i = 0 ; i <= div ; i++ )
		{
			let v1 = vec2(
				r* Math.cos(th)/wd + d*i,
				r* Math.sin(th)  
			);
			v1 = vrot2( v1, rot );
			v1 = vadd2( v1, p0 );

			gra.line( v0.x, v0.y, v1.x, v1.y );
			v0 = v1;

			th += st;
		}

		gra.line( v0.x, v0.y, b.x, b.y );
	}
	// 矢印の表示
	//-----------------------------------------------------------------------------
	gra.drawarrow2d = function( p, v, l, sc = 1 ) // vec2 pos, vec2 vel, 
	//-----------------------------------------------------------------------------
	{
		if ( l == 0 || length2(v)==0 ) 
		{
			gra.circle( p.x, p.y, sc );
			return;
		}
		else
		if ( l < 0 )
		{
			l = -l;
		}
		
		let rot = Math.atan2( v.y, v.x );
		let h = 1*sc;
		let w = h/Math.tan(radians(30));

		let tbl = 
			[
				vec2( l,0),
				vec2( l-w*2 ,-h*2	),
				vec2( l-w*2 ,-h		),
				vec2(    0  ,-h		),
				vec2(    0  , h		),
				vec2(    0  , h		),
				vec2( l-w*2 , h		),
				vec2( l-w*2 , h*2	),
				vec2( l,0),
			];
		let tbl2=[];
		for ( let v of tbl )
		{
			v = vrot2( v, rot );
			v = vadd2( v, p );
			tbl2.push(v);
		}

		gra.path_n( tbl2 );
	}
	//-----------------------------------------------------------------------------
	gra.drawarrow_line2d = function( x0, y0, x1, y1, sc = 2 )
	//-----------------------------------------------------------------------------
	{
		let p = new vec2(x0,y0);
		let b = new vec2(x1, y1);
		let v = normalize2(vsub2(b,p));
		let l = length2(vsub2(b,p));
		gra.drawarrow2d( p, v, l, sc );
	}

	//-----------------------------------------------------------------------------
	gra.drawmesure_line = function( x0, y0, x1, y1, w = 4 )
	//-----------------------------------------------------------------------------
	{
		let v = vmul_scalar2( normalize2(vsub2(vec2(x1,y1),vec2(x0,y0))), w );
		[v.x,v.y]=[v.y,v.x];				
		let s1 = vec2( x0, y0  ); let e1=vec2( x1, y1   );
		let s2 = vec2( x0+v.x, y0-v.y); let e2=vec2( x0-v.x, y0+v.y );
		let s3 = vec2( x1+v.x, y1-v.y); let e3=vec2( x1-v.x, y1+v.y );
		gra.line( s1.x,s1.y,e1.x,e1.y);
		gra.line( s2.x,s2.y,e2.x,e2.y);
		gra.line( s3.x,s3.y,e3.x,e3.y);
	}

	return gra;

};

///// geom 2021/07/02 vec2追加

//------------------------------------------------------------------------------
function vec2( x, y )	// 2021/05/28新規追加
//------------------------------------------------------------------------------
{
	return {x:x, y:y};
}
//------------------------------------------------------------------------------
function vsub2( a, b )
//------------------------------------------------------------------------------
{
	return vec2(
		a.x - b.x,
		a.y - b.y 
	);
}
//------------------------------------------------------------------------------
function vadd2( a, b )
//------------------------------------------------------------------------------
{
	return vec2(
		a.x + b.x,
		a.y + b.y 
	);
}
//------------------------------------------------------------------------------
function vmul2( a, b )
//------------------------------------------------------------------------------
{
	return vec2(
		a.x * b.x,
		a.y * b.y 
	);
}
//------------------------------------------------------------------------------
function vdiv2( a, b ) //2021/11/02
//------------------------------------------------------------------------------
{
	return vec2(
		a.x / b.x,
		a.y / b.y 
	);
}
//------------------------------------------------------------------------------
function reflect2( I, N )
//------------------------------------------------------------------------------
{
	// R = I-(I・N)*2N
	let d = 2*(I.x*N.x + I.y*N.y);
 	return vsub2( I , vec2( d*N.x, d*N.y ) ); // I-dN
}

//------------------------------------------------------------------------------
function refract2( I, N, eta ) // 2021/11/16
//------------------------------------------------------------------------------
{
	let R = vec2(0,0);
	let k = 1.0 - eta * eta * (1.0 - dot2(N, I) * dot2(N, I));
	if ( k >= 0.0 )
	{
		let a = eta * I - (eta * dot2(N, I) + Math.sqrt(k));
		R = vmuls2( N, a );
	}
	return R;
}
//------------------------------------------------------------------------------
function vmul_scalar2( a, s )
//------------------------------------------------------------------------------
{
	return vec2(
		a.x * s,
		a.y * s 
	);
}
//------------------------------------------------------------------------------
function vmuls2( a, s ) // 2021/08/15
//------------------------------------------------------------------------------
{
	return vmul_scalar2( a,s )
}

//------------------------------------------------------------------------------
function vdiv_scalar2( a, s ) // 2021/07/26 追加
//------------------------------------------------------------------------------
{
	return vec2(
		a.x / s,
		a.y / s 
	);
}
//------------------------------------------------------------------------------
function vdivs2( a, s ) // 2021/08/16
//------------------------------------------------------------------------------
{
	return vdiv_scalar2( a,s )
}

//------------------------------------------------------------------------------
function vneg2( a )
//------------------------------------------------------------------------------
{
	return vec2( -a.x, -a.y );
}
//------------------------------------------------------------------------------
function dot2( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.x + a.y*b.y;
}
//------------------------------------------------------------------------------
function cross2( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.y-a.y*b.x;
}

//------------------------------------------------------------------------------
function length2( v )	//	 as abs()
//------------------------------------------------------------------------------
{
	if ( v.x==0 && v.y==0 ) return 0; // 2021/07/28 add
	return Math.sqrt(v.x*v.x+v.y*v.y);
}
//------------------------------------------------------------------------------
function vcopy2( v )
//------------------------------------------------------------------------------
{
	return vec2(v.x,v.y);
}
//------------------------------------------------------------------------------
function normalize2( v )
//------------------------------------------------------------------------------
{
	if ( v.x == 0 && v.y == 0 ) return vec2(0,0);
	let s = 1/Math.sqrt( v.x*v.x + v.y*v.y );
	return vec2(
		v.x * s,
		v.y * s
	);
}

//------------------------------------------------------------------------------
function vrot2( v, th )	// 2021/08/03 二次元回転関数
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	if(0)
	{
		// c,  s
		//-s,  c
		return new vec2( 
			 v.x*c + v.y*s,
			-v.x*s + v.y*c
		);
	}
	else
	{
		//『ユークリッド空間の2次元空間では、原点中心の θ 回転（反時計回りを正とする）の回転行列』(wiki)
		return new vec2( 
			 v.x*c - v.y*s,
			 v.x*s + v.y*c
		);
	}
}




///// geom 2021/05/07 vec3対応

//-----------------------------------------------------------------------------
function radians( v )
//-----------------------------------------------------------------------------
{
	return v/180*Math.PI;
}
//-----------------------------------------------------------------------------
function degrees( v )
//-----------------------------------------------------------------------------
{
	return v*180/Math.PI;
}
function vec3( x, y, z )	// 2021/05/06 クラスを止めて配列化
{
	return {x:x, y:y, z:z};
}
function vec4( x, y, z,w )	// 2021/05/06 クラスを止めて配列化
{
	return {x:x, y:y, z:z, w:w};
}
//------------------------------------------------------------------------------
function dot( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.x + a.y*b.y + a.z*b.z;
}
//------------------------------------------------------------------------------
function cross( a, b )
//------------------------------------------------------------------------------
{
	return vec3(
		a.y*b.z-a.z*b.y,
		a.z*b.x-a.x*b.z,
		a.x*b.y-a.y*b.x
	);
}
//------------------------------------------------------------------------------
function length( v )
//------------------------------------------------------------------------------
{
	return Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
}

//------------------------------------------------------------------------------
function normalize( v )
//------------------------------------------------------------------------------
{
	let s = 1/Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
	return vec3(
		v.x * s,
		v.y * s,
		v.z * s
	);
}

//------------------------------------------------------------------------------
function vadd( a, b )
//------------------------------------------------------------------------------
{
	return vec3( 
		a.x +b.x,
		a.y +b.y,
		a.z +b.z
	);
}
//------------------------------------------------------------------------------
function vsub( a, b )
//------------------------------------------------------------------------------
{
	return vec3( 
		a.x -b.x,
		a.y -b.y,
		a.z -b.z
	);
}
//------------------------------------------------------------------------------
function vmul( a, b )
//------------------------------------------------------------------------------
{
	return vec3( 
		a.x *b.x,
		a.y *b.y,
		a.z *b.z
	);
}
//------------------------------------------------------------------------------
function vdiv( a, b )
//------------------------------------------------------------------------------
{
	return vec3( 
		a.x /b.x,
		a.y /b.y,
		a.z /b.z
	);
}
//------------------------------------------------------------------------------
function vmax( a, b )
//------------------------------------------------------------------------------
{
	return vec3( 
		Math.max(a.x,b.x),
		Math.max(a.y,b.y),
		Math.max(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function vmin( a, b )
//------------------------------------------------------------------------------
{
	return vec3( 
		Math.min(a.x,b.x),
		Math.min(a.y,b.y),
		Math.min(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function reflect( I, N )
//------------------------------------------------------------------------------
{
	let a = 2*dot(I,N);
 	return vsub( I , vmul( vec3(a,a,a), N ) );
}
//------------------------------------------------------------------------------
function refract( I, N, eta )
//------------------------------------------------------------------------------
{
	let R = vec3(0,0,0);
	let k = 1.0 - eta * eta * (1.0 - dot(N, I) * dot(N, I));
	if ( k < 0.0 )
	{
		R = vec3(0,0,0);
	}
	else
	{
	//	R = eta * I - (eta * dot(N, I) + sqrt(k)) * N;
		let ve = vec3(eta,eta,eta);
		let a = vmul( ve , I ); 
		let b = eta * dot(N, I);
		let c = b + Math.sqrt(k);
		let d = vmul( vec3(c,c,c) , N);
		R = vsub(a , d);

	}
	return R;
}

function mat4(		// 2021/05/06 二次元配列化
		m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
{
	return [
		[m00,m01,m02,m03],
		[m10,m11,m12,m13],
		[m20,m21,m22,m23],
		[m30,m31,m32,m33]
	];
}


//---------------------------------------------------------------------
function mperspective( fovy, aspect, n, f ) // 2021/05/04 GLに準拠
//---------------------------------------------------------------------
{
	// n : ニアクリップ、必ず正の値を指定	= 視点から投影面までの距離
	// f : ファークリップ、必ず正の値を指定
	// gluPerspective
  	//
	//	Y-up
	//	Z奥がマイナス

    let y = n * Math.tan(fovy * Math.PI / 360.0);
    let x = y * aspect;

	return mfrustum( -x, x, -y, y, n, f );
}

//---------------------------------------------------------------------
function mfrustum( l, r, b, t, n, f ) //2021/05/04 GLに準拠
//---------------------------------------------------------------------
{
	// glFrustum(-1.0, 1.0, -1.0, 1.0, 1.5, 20.0);
  	//
	//	Y-up
	//	Z奥がマイナス

	return mat4(
		2*n/(r-l)	,	0			,	0				,	0	,
			0		,	2*n/(t-b)	,	0				,	0	,
		(r+l)/(r-l)	,	(t+b)/(t-b)	,	-(f+n)/(f-n)	,	-1	,
			0		,	0			,	-(2*f*n)/(f-n)	,	0	);
}
//---------------------------------------------------------------------
function mortho ( l, r, b, t, n, f ) //GL 準拠
//---------------------------------------------------------------------
{
	// glOrtho(-2.0, 2.0, -2.0, 2.0, -1.5, 1.5);
	//
	//	Y-up
	//	Z奥がマイナス

	let tx =  -(r+l)/(r-l);
	let ty =  -(t+b)/(t-b);
	let tz =  -(f+n)/(f-n);

	return mat4(
		2/(r-l)		,	0			,	0			,	0			,
		0			,	2/(t-b)		,	0			,	0			,
		0			,	0			,	-2/(f-n)	,	0			,
		tx			,	ty			,	tz			,	1			);
}
//---------------------------------------------------------------------
function midentity() 
//---------------------------------------------------------------------
{
	//	|	1	0	0	0	|	// 数学的表記
	//	|	0	1	0	0	|
	//	|	0	0	1	0	|
	//	|	0	0	0	1	|
	return mat4(
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mtrans( v )	// GL準拠＆列優先
//---------------------------------------------------------------------
{
	//	|	1	0	0	x	|	// 数学的表記
	//	|	0	1	0	y	|
	//	|	0	0	1	z	|
	//	|	0	0	0	1	|
	return mat4(
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		v.x	,	v.y	,	v.z	,	1	
	);
}
//---------------------------------------------------------------------
function mscale( v )	// 2021/05/06 GL準拠＆列優先
//---------------------------------------------------------------------
{
	//	|	x	0	0	0	|	// 数学的表記
	//	|	0	y	0	0	|
	//	|	0	0	z	0	|
	//	|	0	0	0	1	|
	return mat4(
		v.x	,	0	,	0	,	0	,
		0	,	v.y	,	0	,	0	,
		0	,	0	,	v.z	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotx( th )	// 右ねじ	GL準拠
//---------------------------------------------------------------------
{
	//	|	1		0		0		0	|	// 数学的表記
	//	|	0		cosθ	-s		0	|
	//	|	0		sinθ	cosθ	0	|
	//	|	0		0		0		1	|
	let c = Math.cos(th);
	let s = Math.sin(th);
	return mat4(	// GL準拠＆列優先 
		1	,	0	,	0	,	0	,
		0	,	c	,	s	,	0	,
		0	,	-s	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mroty( th )	// 右ねじ	GL準拠
//---------------------------------------------------------------------
{
	//	|	cosθ	0		sinθ	0	|	// 数学的表記
	//	|	0		1		0		0	|
	//	|	-sinθ	0		cosθ	0	|
	//	|	0		0		0		1	|
	let c = Math.cos(th);
	let s = Math.sin(th);
	return mat4(	// GL準拠＆列優先
		c	,	0	,	-s	,	0	,
		0	,	1	,	0	,	0	,
		s	,	0	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotz( th )	// 右ねじ	GL準拠
//---------------------------------------------------------------------
{
	//	|	cosθ	-sinθ	0		0	|	// 数学的表記
	//	|	sinθ	cosθ	0		0	|
	//	|	0		0		1		0	|
	//	|	0		0		0		1	|
	let c = Math.cos(th);
	let s = Math.sin(th);
	return mat4(	// GL準拠＆列優先 
		c	,	s	,	0	,	0	,
		-s	,	c	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotate( th, axis ) // 2021/05/06 回転行列だけを返す
//---------------------------------------------------------------------
{

	let {x,y,z} = normalize( axis );
	let s = Math.sin(th);
	let c = Math.cos(th);
	let q = 1-c;

	return mat4(
		x*x*q+c		,	y*x*q+z*s	,	z*x*q-y*s	,	0	,
		x*y*q-z*s	,	y*y*q+c		,	z*y*q+x*s	,	0	,
		x*z*q+y*s	,	y*z*q-x*s	,	z*z*q+c		,	0	,
		0			,	0			,	0			,	1	);
}
//---------------------------------------------------------------------
function mmul( A, B )  //  A X B 列優先
//---------------------------------------------------------------------
{
	//	|	00	10	20	30	|		|	00	10	20	30	|	// 数学的表記
	//	|	01	11	21	31	|	X	|	01	11	21	31	|
	//	|	02	12	22	32	|		|	02	12	22	32	|
	//	|	03	13	23	33	|		|	03	13	23	33	|

	return mat4(
		A[0][0] * B[0][0] +  A[1][0] * B[0][1] +  A[2][0] * B[0][2] +  A[3][0] * B[0][3],
		A[0][1] * B[0][0] +  A[1][1] * B[0][1] +  A[2][1] * B[0][2] +  A[3][1] * B[0][3],
		A[0][2] * B[0][0] +  A[1][2] * B[0][1] +  A[2][2] * B[0][2] +  A[3][2] * B[0][3],
		A[0][3] * B[0][0] +  A[1][3] * B[0][1] +  A[2][3] * B[0][2] +  A[3][3] * B[0][3],

		A[0][0] * B[1][0] +  A[1][0] * B[1][1] +  A[2][0] * B[1][2] +  A[3][0] * B[1][3],
		A[0][1] * B[1][0] +  A[1][1] * B[1][1] +  A[2][1] * B[1][2] +  A[3][1] * B[1][3],
		A[0][2] * B[1][0] +  A[1][2] * B[1][1] +  A[2][2] * B[1][2] +  A[3][2] * B[1][3],
		A[0][3] * B[1][0] +  A[1][3] * B[1][1] +  A[2][3] * B[1][2] +  A[3][3] * B[1][3],

		A[0][0] * B[2][0] +  A[1][0] * B[2][1] +  A[2][0] * B[2][2] +  A[3][0] * B[2][3],
		A[0][1] * B[2][0] +  A[1][1] * B[2][1] +  A[2][1] * B[2][2] +  A[3][1] * B[2][3],
		A[0][2] * B[2][0] +  A[1][2] * B[2][1] +  A[2][2] * B[2][2] +  A[3][2] * B[2][3],
		A[0][3] * B[2][0] +  A[1][3] * B[2][1] +  A[2][3] * B[2][2] +  A[3][3] * B[2][3],

		A[0][0] * B[3][0] +  A[1][0] * B[3][1] +  A[2][0] * B[3][2] +  A[3][0] * B[3][3],
		A[0][1] * B[3][0] +  A[1][1] * B[3][1] +  A[2][1] * B[3][2] +  A[3][1] * B[3][3],
		A[0][2] * B[3][0] +  A[1][2] * B[3][1] +  A[2][2] * B[3][2] +  A[3][2] * B[3][3],
		A[0][3] * B[3][0] +  A[1][3] * B[3][1] +  A[2][3] * B[3][2] +  A[3][3] * B[3][3]
	);
}



/*
//----------------------------------------------------------
function	minvers( M ) // 変換ミスがいくつかあった
//----------------------------------------------------------
{
	let z1=4;  //配列の次数

	let A = midentity();
	for( let i = 0 ; i < z1 ; i++ ) 
	for( let j = 0 ; j < z1 ; j++ ) 
	A[i][j]=M[i][j];// 配列コピー

//	A = M.concat();	// 配列コピー
	
	let I = midentity();
	

	//掃き出し法
	for( let i = 0 ; i < z1 ; i++ )
	{
		let f =1/A[i][i];
		for( let j = 0 ; j < z1 ; j++ )
		{
			A[i][j] *= f;
			I[i][j] *= f;
		}
		for( let j = 0 ; j < z1 ; j++ )
		{
			if( i !=j )
			{
				f= A[j][i];
				for( let k = 0 ; k < z1 ; k++ )
				{
					A[j][k] -= A[i][k]*f;
					I[j][k] -= I[i][k]*f;
				}
			}
		}
	}
	return	I;
}
*/
//----------------------------------------
function minvers( M ) // 20_01/05/25 別のアルゴリズムに交換
//----------------------------------------
{

	// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm

	let	m00 = M[0][0], m01 = M[0][1], m02 = M[0][2], m03 = M[0][3];
	let	m10 = M[1][0], m11 = M[1][1], m12 = M[1][2], m13 = M[1][3];
	let	m20 = M[2][0], m21 = M[2][1], m22 = M[2][2], m23 = M[2][3];
	let	m30 = M[3][0], m31 = M[3][1], m32 = M[3][2], m33 = M[3][3];

	let	a00 = m21 * m32 * m13 - m31 * m22 * m13 + m31 * m12 * m23 - m11 * m32 * m23 - m21 * m12 * m33 + m11 * m22 * m33;
	let	a10 = m30 * m22 * m13 - m20 * m32 * m13 - m30 * m12 * m23 + m10 * m32 * m23 + m20 * m12 * m33 - m10 * m22 * m33;
	let	a20 = m20 * m31 * m13 - m30 * m21 * m13 + m30 * m11 * m23 - m10 * m31 * m23 - m20 * m11 * m33 + m10 * m21 * m33;
	let	a30 = m30 * m21 * m12 - m20 * m31 * m12 - m30 * m11 * m22 + m10 * m31 * m22 + m20 * m11 * m32 - m10 * m21 * m32;

	let det = m00 * a00 + m01 * a10 + m02 * a20 + m03 * a30;

	if ( det == 0 ) 
	{
		let msg = "err minvert";
		console.warn(msg);
		return midentity();
	}
	
	let invd = 1 / det;

	return mat4(
		a00 * invd,
		( m31 * m22 * m03 - m21 * m32 * m03 - m31 * m02 * m23 + m01 * m32 * m23 + m21 * m02 * m33 - m01 * m22 * m33 ) * invd,
		( m11 * m32 * m03 - m31 * m12 * m03 + m31 * m02 * m13 - m01 * m32 * m13 - m11 * m02 * m33 + m01 * m12 * m33 ) * invd,
		( m21 * m12 * m03 - m11 * m22 * m03 - m21 * m02 * m13 + m01 * m22 * m13 + m11 * m02 * m23 - m01 * m12 * m23 ) * invd,
		a10 * invd,
		( m20 * m32 * m03 - m30 * m22 * m03 + m30 * m02 * m23 - m00 * m32 * m23 - m20 * m02 * m33 + m00 * m22 * m33 ) * invd,
		( m30 * m12 * m03 - m10 * m32 * m03 - m30 * m02 * m13 + m00 * m32 * m13 + m10 * m02 * m33 - m00 * m12 * m33 ) * invd,
		( m10 * m22 * m03 - m20 * m12 * m03 + m20 * m02 * m13 - m00 * m22 * m13 - m10 * m02 * m23 + m00 * m12 * m23 ) * invd,
		a20 * invd,
		( m30 * m21 * m03 - m20 * m31 * m03 - m30 * m01 * m23 + m00 * m31 * m23 + m20 * m01 * m33 - m00 * m21 * m33 ) * invd,
		( m10 * m31 * m03 - m30 * m11 * m03 + m30 * m01 * m13 - m00 * m31 * m13 - m10 * m01 * m33 + m00 * m11 * m33 ) * invd,
		( m20 * m11 * m03 - m10 * m21 * m03 - m20 * m01 * m13 + m00 * m21 * m13 + m10 * m01 * m23 - m00 * m11 * m23 ) * invd,
		a30 * invd,
		( m20 * m31 * m02 - m30 * m21 * m02 + m30 * m01 * m22 - m00 * m31 * m22 - m20 * m01 * m32 + m00 * m21 * m32 ) * invd,
		( m30 * m11 * m02 - m10 * m31 * m02 - m30 * m01 * m12 + m00 * m31 * m12 + m10 * m01 * m32 - m00 * m11 * m32 ) * invd,
		( m10 * m21 * m02 - m20 * m11 * m02 + m20 * m01 * m12 - m00 * m21 * m12 - m10 * m01 * m22 + m00 * m11 * m22 ) * invd);

}
//---------------------------------------------------------------------
function vec4_vmul_vM( v, M ) // 列優先 
//---------------------------------------------------------------------
{
	//					|	00	10	20	30	|		// 数学的表記
	//	| x y z w |	 X	|	01	11	21	31	|
	//					|	02	12	22	32	|
	//					|	03	13	23	33	|

	return vec4(
		v.x * M[0][0] +  v.y * M[0][1] +  v.z * M[0][2] +  v.w * M[0][3] ,
		v.x * M[1][0] +  v.y * M[1][1] +  v.z * M[1][2] +  v.w * M[1][3] ,
		v.x * M[2][0] +  v.y * M[2][1] +  v.z * M[2][2] +  v.w * M[2][3] ,
		v.x * M[3][0] +  v.y * M[3][1] +  v.z * M[3][2] +  v.w * M[3][3]
	);
}
//---------------------------------------------------------------------
function vmul_vM( v, M ) // 列優先 2021/05/23 バグ修正vec4->vec3 
//---------------------------------------------------------------------
{
	//					|	00	10	20	|			// 数学的表記
	//	| x y z 1 |	X	|	01	11	21	|
	//					|	02	12	22	|
	//					|	03	13	23	|

	return vec3(
		v.x * M[0][0] +  v.y * M[0][1] +  v.z * M[0][2] +  1 * M[0][3] ,
		v.x * M[1][0] +  v.y * M[1][1] +  v.z * M[1][2] +  1 * M[1][3] ,
		v.x * M[2][0] +  v.y * M[2][1] +  v.z * M[2][2] +  1 * M[2][3] ,
	);
}

//---------------------------------------------------------------------
function vec4_vmul_Mv( M, v ) // 列優先 
//---------------------------------------------------------------------
{
	//	|	00	10	20	30	|		| x |			// 数学的表記
	//	|	01	11	21	31	|		| y	|
	//	|	02	12	22	32	|	X	| z	|
	//	|	03	13	23	33	|		| w	|

	return vec4(
		M[0][0] * v.x +  M[1][0] * v.y +  M[2][0] * v.z +  M[3][0] * v.w,
		M[0][1] * v.x +  M[1][1] * v.y +  M[2][1] * v.z +  M[3][1] * v.w,
		M[0][2] * v.x +  M[1][2] * v.y +  M[2][2] * v.z +  M[3][2] * v.w,
		M[0][3] * v.x +  M[1][3] * v.y +  M[2][3] * v.z +  M[3][3] * v.w
	);
}
//---------------------------------------------------------------------
function vmul_Mv( M, v ) // 列優先 	2021/05/07 vec3
//---------------------------------------------------------------------
{
	//	|	00	10	20	30	|		| x |			// 数学的表記
	//	|	01	11	21	31	|	X	| y	|
	//	|	02	12	22	32	|		| z	|
	//								| 1	|

	return vec3(
		M[0][0] * v.x +  M[1][0] * v.y +  M[2][0] * v.z +  M[3][0] * 1,
		M[0][1] * v.x +  M[1][1] * v.y +  M[2][1] * v.z +  M[3][1] * 1,
		M[0][2] * v.x +  M[1][2] * v.y +  M[2][2] * v.z +  M[3][2] * 1,
	);
}
//-----------------------------------------------------------------------------
function mlookat( eye, at, up=vec3(0,1,0)  )	// V マトリクスを作成
//-----------------------------------------------------------------------------
{
	if(0)
	{
		let m = midentity();
		let v = vsub( at, eye );
		let ry = Math.atan2(v.x,-v.z);
		let xy = Math.sqrt(v.x*v.x+v.z*v.z);
		let rx = Math.atan2(-v.y,xy);

		m = mmul( m, mrotx( rx ) );
		m = mmul( m, mroty( ry ) );
		m = mmul( m, mtrans( vec3( -eye.x, -eye.y, -eye.z )) );
		return m;
	}
	else
	{	// カメラ行列を生成し、逆マトリクスにする。
		let	z = normalize( vsub( eye, at ) );
		let	x = normalize( cross( up, z  ) );
		let	y = cross( z, x );

		let m = mat4(
			x.x		,	x.y		,	x.z		,	0	,
			y.x		,	y.y		,	y.z		,	0	,
			z.x		,	z.y		,	z.z		,	0	,
			eye.x	,	eye.y	,	eye.z	,	1	
		);
		return minvers(m);
	}
}

////


// 2021/07/24 KEY追加
const	KEY_F1	= 112;
const	KEY_F2	= 113;
const	KEY_F3	= 114;
const	KEY_F4	= 115;
const	KEY_F5	= 116;
const	KEY_F6	= 117;
const	KEY_F7	= 118;
const	KEY_F8	= 119;
const	KEY_F9	= 121;
const	KEY_F10	= 122;
const	KEY_F11	= 123;
const	KEY_F12 = 124;
const	KEY_DEL	= 46;
const	KEY_ESC	= 27;
const	KEY_BS	= 8;
const	KEY_TAB	= 9;
const	KEY_CAPS	= 20;
const	KEY_SHIFT	= 16;
const	KEY_CTRL	= 17;
const	KEY_ALT		= 18;
const	KEY_CR	= 13;
const	KEY_SPC	= 32;
const	KEY_0	= 48;	//0x30
const	KEY_1	= 49;	//0x31
const	KEY_2	= 50;	//0x32
const	KEY_3	= 51;	//0x33
const	KEY_4	= 52;	//0x34
const	KEY_5	= 53;	//0x35
const	KEY_6	= 54;	//0x36
const	KEY_7	= 55;	//0x37
const	KEY_8	= 56;	//0x38
const	KEY_9	= 57;	//0x39
const	KEY_A	= 65;	//0x41
const	KEY_B	= 66;	//0x42
const	KEY_C	= 67;	//0x43
const	KEY_D	= 68;	//0x44
const	KEY_E	= 69;	//0x45
const	KEY_F	= 70;	//0x46
const	KEY_G	= 71;	//0x47
const	KEY_H	= 72;	//0x48
const	KEY_I	= 73;	//0x49
const	KEY_J	= 74;	//0x4a
const	KEY_K	= 75;	//0x4b
const	KEY_L	= 76;	//0x4c
const	KEY_M	= 77;	//0x4d
const	KEY_N	= 78;	//0x4e
const	KEY_O	= 79;	//0x4f
const	KEY_P	= 80;	//0x50
const	KEY_Q	= 81;	//0x51
const	KEY_R	= 82;	//0x52
const	KEY_S	= 83;	//0x53
const	KEY_T	= 84;	//0x54
const	KEY_U	= 85;	//0x55
const	KEY_V	= 86;	//0x56
const	KEY_W	= 87;	//0x57
const	KEY_X	= 88;	//0x58
const	KEY_Y	= 89;	//0x59
const	KEY_Z	= 90;	//0x5a

const	KEY_LEFT	= 37;
const	KEY_UP		= 38;
const	KEY_RIGHT	= 39;
const	KEY_DOWN	= 40;

//-----------------------------------------------------------------------------
function ene_create( cv )	// 2021/08/15 U K Eのエネルギーを算出して波形を描画
//-----------------------------------------------------------------------------
{
	let ene={};
	let gra = gra_create( cv );

	let count = 0;
	
	ene.valmax = 0;
	ene.prot_x = 0;
	ene.time_max = 0;
	ene.cnt_prots = 0;
	ene.K = 0;
	ene.U = 0;
	ene.tbl_k = [];

	let hash_plugs = 
	{
		'E':{p0:vec2(0,0), p1:vec2(0,0), cr:0,cg:0,cb:0, xx_flgActive:false ,p:vec2(0,0),m:0, name:"E=U+K"  		} ,	// 3黒	E
		'U':{p0:vec2(0,0), p1:vec2(0,0), cr:0,cg:0,cb:1, xx_flgActive:false ,p:vec2(0,0),m:0, name:"U位置ｴﾈﾙｷﾞｰ" 	} ,	// 1青	U
		'K':{p0:vec2(0,0), p1:vec2(0,0), cr:1,cg:0,cb:0, xx_flgActive:false ,p:vec2(0,0),m:0, name:"K運動ｴﾈﾙｷﾞｰ"  	} ,	// 2赤	K
	};
	
	let tbl_prots = [];

	let reqReset = true;
	let reqLoop = false;
	let start_x = 0;


	//-----------------------------------------------------------------------------
	ene.reset = function( valmax, time_max=5 )
	//-----------------------------------------------------------------------------
	{
		ene.valmax = valmax;
		ene.valtop = valmax*1.3;
		ene.valbtm = -valmax/4;
		reqReset = true;
		reqLoop = false;
		ene.time_max = time_max;
	}

/*
	//-----------------------------------------------------------------------------
	ene.prot_pos2 = function( num, p, v, m ) // prot_entryへ移行予定
	//-----------------------------------------------------------------------------
	{
		// 衝突が発生したときに正しく検出できないので速度を必要とする
		if ( ene.max_lines <= num ) 
		{
			alert("プロット数不足inene.prot_pos2()");
			return ;
		}
		tbl_prots[num].px = p.x;
		tbl_prots[num].py = p.y;
		tbl_prots[num].pz = 0;
		tbl_prots[num].vx = v.x;
		tbl_prots[num].vy = v.y;
		tbl_prots[num].vz = 0;
		tbl_prots[num].m = m;
	 	tbl_prots[num].flgActive = true;
	}
*/
	//-----------------------------------------------------------------------------
//	ene.prot_entry = function( px,py,pz, vx,vy,vz, m )
	ene.prot_entry2 = function( name, px,py,pz, vx,vy,vz, m )
	//-----------------------------------------------------------------------------
	{
		let num = ene.cnt_prots++;
		// 衝突が発生したときに正しく検出できないので速度を必要とする
		if ( num > 2000 ) 
		{
			alert("プロット数多すぎ。prot_entry()");
			return ;
		}
		if ( tbl_prots.length <= num ) 
		{
			tbl_prots.push( {name:"", px:px, py:py, pz:pz, vx:vx, vy:vy, vz:vz,m:0} );
			num = tbl_prots.length-1;
		}
		tbl_prots[num].name = name;
		tbl_prots[num].px = px;
		tbl_prots[num].py = py;
		tbl_prots[num].pz = pz;
		tbl_prots[num].vx = vx;
		tbl_prots[num].vy = vy;
		tbl_prots[num].vz = vz;
		tbl_prots[num].m = m;
	
	}

	//-----------------------------------------------------------------------------
	ene.calc = function( dt, g ) // dt:delta time , g:gravity (ex. 9.8m/s/s)
	//-----------------------------------------------------------------------------
	{
		ene.cnt_prots = 0;
		if ( reqReset ) 
		{
			count = 0;
			reqReset = false;
			reqLoop = true;
			start_x = gra.sx;
		}
		if ( reqLoop ) 
		{
			reqLoop = false;

			gra.window( 0,  ene.valtop, ene.time_max/dt, ene.valbtm );

			gra.setAspect(1,0);
			gra.cls();

			ene.prot_x = start_x;

			for ( let pl of Object.values(hash_plugs) )
			{
				pl.p0.x = gra.sx;
				pl.p0.y = pl.p1.y;
				pl.p1.x = gra.sx;
			}
			start_x = gra.sx+1;
			
			for ( let pl of Object.values(hash_plugs) )
			{
				gra.color( pl.cr, pl.cg, pl.cb );
				gra.print( pl.name );
			}

			gra.color(0.8,0.8,0.8);gra.line(gra.sx,0,gra.ex,0);
		}

		{		
			ene.U = 0;
			ene.K = 0;
			ene.tbl_k = [];
			for ( let it of tbl_prots )
			{
				{
					// 位置エネルギーの積算
					ene.U += (it.m * Math.abs(g) * it.py);

					// 運動エネルギーの積算
					{
						let vv = it.vx*it.vx + it.vy*it.vy + it.vz*it.vz;
						let k = 1/2*it.m*vv;
						ene.K += k;
						ene.tbl_k.push( {name:it.name,val:k} );
					}
				}
			}
			// 最大値自動調整
			if ( ene.valmax < ene.U+ene.K ) 
			{
				ene.valmax =  ene.U+ene.K;
				ene.valtop = ene.valmax*1.3;
				ene.valbtm = -ene.valmax/4;
			}

			hash_plugs['U'].p1 = vec2( ene.prot_x, ene.U );
			hash_plugs['K'].p1 = vec2( ene.prot_x, ene.K );
			hash_plugs['E'].p1 = vec2( ene.prot_x, ene.U+ene.K );
		}
		if ( ene.prot_x++ > gra.ex ) 
		{
			reqLoop = true;
		}
	}
	//-----------------------------------------------------------------------------
	ene.draw = function()
	//-----------------------------------------------------------------------------
	{

		for ( let pl of Object.values(hash_plugs) )
		{
			if ( count >=1 )
			{
				gra.color( pl.cr, pl.cg, pl.cb );
				gra.line( pl.p0.x, pl.p0.y, pl.p1.x, pl.p1.y );
			}
			pl.p0 = vcopy2(pl.p1);
		}
		count++;
	}
	//-----------------------------------------------------------------------------
	ene.drawK = function()
	//-----------------------------------------------------------------------------
	{
let cnt = 0;
		for ( let k of ene.tbl_k )
		{
			let pl = hash_plugs['K'];
			gra.color( 0,0,0 );
			gra.dot( pl.p1.x, pl.p1.y, 1/2);

			gra.color( 1,0,0 );
			gra.dot( pl.p1.x, k.val, 1/2);

cnt++;
		}
		count++;
//console.log(cnt);
	}

	return ene;
}


