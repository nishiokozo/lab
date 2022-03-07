"use strict";

//	列優先になると、行列同士は左右反対に掛けるか、列X行で掛ける必要がある。
//	列優先だと回転移動行列を4X3で作ることが出来て25%計算量を減らせるというメリットがある。
//	行列ライブラリコンセプト
//	①GLSLと同じ数式同じ行列がメインプログラムでも同様に機能する
//	②直感的な使い方が出来るか。vMVP が最も使いやすい。
//	③左手右手座標系、右ねじ左ねじ、DEPTHや奥の±は自由。GLSLでも動くのならOK

class vec3
{
	constructor( x, y, z )
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
};
class vec4
{
	constructor( x, y, z, w )
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
};

class mat4
{
	constructor( 
		m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
	{
/*
		this[0][0] = m00;	//GLSL風にこう書きたい
		this[0][1] = m01;
		this[0][2] = m02;
		this[0][3] = m03;
		this[1][0] = m10;
		this[1][1] = m11;
		this[1][2] = m12;
		this[1][3] = m13;
		this[2][0] = m20;
		this[2][1] = m21;
		this[2][2] = m22;
		this[2][3] = m23;
		this[3][0] = m30;
		this[3][1] = m31;
		this[3][2] = m32;
		this[3][3] = m33;
*/
		this[ 0] = m00;
		this[ 1] = m01;
		this[ 2] = m02;
		this[ 3] = m03;
		this[ 4] = m10;
		this[ 5] = m11;
		this[ 6] = m12;
		this[ 7] = m13;
		this[ 8] = m20;
		this[ 9] = m21;
		this[10] = m22;
		this[11] = m23;
		this[12] = m30;
		this[13] = m31;
		this[14] = m32;
		this[15] = m33;
	}
	log( str="" )
	{
		console.log( str );
		console.log( "%f %f %f %f",this[ 0],this[ 1],this[ 2],this[ 3] );
		console.log( "%f %f %f %f",this[ 4],this[ 5],this[ 6],this[ 7] );
		console.log( "%f %f %f %f",this[ 8],this[ 9],this[10],this[11] );
		console.log( "%f %f %f %f",this[12],this[13],this[14],this[15] );
	}
};
//------------------------------------------------------------------------------
function vrotYaw( v, th )
//------------------------------------------------------------------------------
{
   	let s = Math.sin(th);
	let c = Math.cos(th);
	// c,  0, -s,
	// 0,  1,  0,
    // s,  0,  c
	let nx = v.x*c			- v.z*s;
	let ny =		 v.y;
	let nz = v.x*s			+ v.z*c;

	return new vec3( nx, ny, nz );
}
//------------------------------------------------------------------------------
function vrotPitch( v, th )
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	// 1,  0,  0,
	// 0,  c,  s,
	// 0, -s,  c
	let nx = v.x;
	let ny =	 v.y*c + v.z*s;
	let nz =	-v.y*s + v.z*c;

	return new vec3( nx, ny, nz );
}
//------------------------------------------------------------------------------
function vrotRoll( v, th )
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	// c,  s,  0,
	//-s,  c,  0,
	// 0,  0,  1
	let nx = v.x*c + v.y*s;
	let ny =-v.x*s + v.y*c;
	let nz = 				v.z;

	return new vec3( nx, ny, nz );
}

//------------------------------------------------------------------------------
function cross( a, b )
//------------------------------------------------------------------------------
{
	return new vec3(
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
	return new vec3(
		v.x * s,
		v.y * s,
		v.z * s
	);
}
//------------------------------------------------------------------------------
function vadd( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x +b.x,
		a.y +b.y,
		a.z +b.z
	);
}
//------------------------------------------------------------------------------
function vsub( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x -b.x,
		a.y -b.y,
		a.z -b.z
	);
}
//------------------------------------------------------------------------------
function vmul( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x *b.x,
		a.y *b.y,
		a.z *b.z
	);
}
//------------------------------------------------------------------------------
function vdiv( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x /b.x,
		a.y /b.y,
		a.z /b.z
	);
}
//------------------------------------------------------------------------------
function vmax( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		Math.max(a.x,b.x),
		Math.max(a.y,b.y),
		Math.max(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function vmin( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		Math.min(a.x,b.x),
		Math.min(a.y,b.y),
		Math.min(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function vreflect( I, N )
//------------------------------------------------------------------------------
{
	let a = 2*dot(I,N);
 	return vsub( I , vmul( new vec3(a,a,a), N ) );
}
//------------------------------------------------------------------------------
function vrefract( I, N, eta )
//------------------------------------------------------------------------------
{

	let R = new vec3(0,0,0);
	let k = 1.0 - eta * eta * (1.0 - dot(N, I) * dot(N, I));
	if ( k < 0.0 )
	{
		R = new vec3(0,0,0);
	}
	else
	{
//		R = eta * I - (eta * dot(N, I) + sqrt(k)) * N;

		let ve = new vec3(eta,eta,eta);
		let a = vmul( ve , I ); 
		let b = eta * dot(N, I);
		let c = b + Math.sqrt(k);
		let d = vmul( new vec3(c,c,c) , N);
		R = vsub(a , d);

//console.log(11, I,ve,a,b,c,d,R);

	}
	return R;
}

//------------------------------------------------------------------------------
function dot( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.x + a.y*b.y + a.z*b.z;
}


/*
//---------------------------------------------------------------------
function mperspective_gl( f, aspect, near, far ) 
//---------------------------------------------------------------------
{
	// 参考)http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20090829
	// f = 1/tan(fovy)

	// GLと等価	Zの奥がマイナス（Xの右がプラスYの上がプラス）
	// gluPerspectiveと等価
	return [
	  f/aspect		, 0				, 0							, 0	,
	   0			, f				, 0							, 0	,
	   0			, 0				, -(  far+near)/(far-near)	, -1,
	   0			, 0				, -(2*far*near)/(far-near)	, 0
	];
}
*/
//---------------------------------------------------------------------
function mperspective( sc, aspect, n, f ) 
//---------------------------------------------------------------------
{
	// 参考)http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20090829
	// f = 1/tan(fovy)

	// D3DXMatrixPerspectiveFovLH と等価だが、奥行きが２倍レンジのマイナス
	// Zの奥がマイナス DEPTHも奥がマイナス

	//	左手座標系
	//	Z奥がマイナス(-1～1)
	//	DEPTHも奥がマイナス(-1～1)
	//	X右がプラス
	//	Y上がプラス

	return new mat4(	// usable on GLSL
		sc/aspect,     0,            0,                0,
		        0,    sc,            0,                0,
		        0,     0, -(f+n)/(f-n), -(2.0*f*n)/(f-n),
		        0,     0,           -1,                0);
}

//---------------------------------------------------------------------
function mrotX(th)
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	return new mat4( 
		1	,	0	,	0	,	0	,
		0	,	c	,	s	,	0	,
		0	,	-s	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotY(th)
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	return new mat4( 
		c	,	0	,	-s	,	0	,
		0	,	1	,	0	,	0	,
		s	,	0	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotZ(th)
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	return new mat4( 
		c	,	s	,	0	,	0	,
		-s	,	c	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function midentity() 
//---------------------------------------------------------------------
{
	return new mat4(
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
}
/*
//---------------------------------------------------------------------
function mtrans_row( v )
//---------------------------------------------------------------------
{
	return new mat4( // 行優先移動行列
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		v.x	,	v.y	,	v.z	,	1	
	);

}
*/

//---------------------------------------------------------------------
function mtrans( v ) // as GL
//---------------------------------------------------------------------
{
	return new mat4(
		1	,	0	,	0	,	v.x	,
		0	,	1	,	0	,	v.y	,
		0	,	0	,	1	,	v.z	,
		0	,	0	,	0	,	1	
	);
}
/*
//---------------------------------------------------------------------
function mtrans_gl2( m, v ) // as GL
//---------------------------------------------------------------------
{
	let mv = new mat4(
		1	,	0	,	0	,	v.x	,
		0	,	1	,	0	,	v.y	,
		0	,	0	,	1	,	v.z	,
		0	,	0	,	0	,	1	
	);
	return mmul_old( m, mv );
}
*/
/*
//---------------------------------------------------------------------
function mmul_old( A, B ) //  A X B 行優先
//---------------------------------------------------------------------
{
//	a0 *b0+a1 *b4+a2 *b8+a3 *b12,	a0 *b1+a1 *b5+a2 *b9 +a3*b13,	a0 *b2+a1 *b6+A 2*b10+a3 *b14,	a0 *b3+a1 *b7+a2 *b11+a3 *b15,
//	a4 *b0+a5 *b4+a6 *b8+a7 *b12,	a4 *b1+a5 *b5+a6 *b9 +a7*b13,	a4 *b2+a5 *b6+A 6*b10+a7 *b14,	a4 *b3+a5 *b7+a6 *b11+a7 *b15,
//	a8 *b0+a9 *b4+a10*b8+a11*b12,	a8 *b1+a9 *b5+a10*b9+a11*b13,	a8 *b2+a9 *b6+a10*b10+a11*b14,	a8 *b3+a9 *b7+a10*b11+a11*b15,
//	a12*b0+a13*b4+a14*b8+a15*b12,	a12*b1+a13*b5+a14*b9+a15*b13,	a12*b2+a13*b6+a14*b10+a15*b14,	a12*b3+a13*b7+a14*b11+a15*b15
	
	return new mat4(	// as 行優先

		A[ 0]*B[ 0] + A[ 1]*B[ 4] + A[ 2]*B[ 8] + A[ 3]*B[12],
		A[ 0]*B[ 1] + A[ 1]*B[ 5] + A[ 2]*B[ 9] + A[ 3]*B[13],
		A[ 0]*B[ 2] + A[ 1]*B[ 6] + A[ 2]*B[10] + A[ 3]*B[14],
		A[ 0]*B[ 3] + A[ 1]*B[ 7] + A[ 2]*B[11] + A[ 3]*B[15],

		A[ 4]*B[ 0] + A[ 5]*B[ 4] + A[ 6]*B[ 8] + A[ 7]*B[12],
		A[ 4]*B[ 1] + A[ 5]*B[ 5] + A[ 6]*B[ 9] + A[ 7]*B[13],
		A[ 4]*B[ 2] + A[ 5]*B[ 6] + A[ 6]*B[10] + A[ 7]*B[14],
		A[ 4]*B[ 3] + A[ 5]*B[ 7] + A[ 6]*B[11] + A[ 7]*B[15],

		A[ 8]*B[ 0] + A[ 9]*B[ 4] + A[10]*B[ 8] + A[11]*B[12],
		A[ 8]*B[ 1] + A[ 9]*B[ 5] + A[10]*B[ 9] + A[11]*B[13],
		A[ 8]*B[ 2] + A[ 9]*B[ 6] + A[10]*B[10] + A[11]*B[14],
		A[ 8]*B[ 3] + A[ 9]*B[ 7] + A[10]*B[11] + A[11]*B[15],

		A[12]*B[ 0] + A[13]*B[ 4] + A[14]*B[ 8] + A[15]*B[12],
		A[12]*B[ 1] + A[13]*B[ 5] + A[14]*B[ 9] + A[15]*B[13],
		A[12]*B[ 2] + A[13]*B[ 6] + A[14]*B[10] + A[15]*B[14],
		A[12]*B[ 3] + A[13]*B[ 7] + A[14]*B[11] + A[15]*B[15]
	);
}
*/

//---------------------------------------------------------------------
function mmul( A, B )  //  A X B 列優先
//---------------------------------------------------------------------
{
	return new mat4(
		A[ 0] * B[ 0] +  A[ 4] * B[ 1] +  A[ 8] * B[ 2] +  A[12] * B[ 3],
		A[ 1] * B[ 0] +  A[ 5] * B[ 1] +  A[ 9] * B[ 2] +  A[13] * B[ 3],
		A[ 2] * B[ 0] +  A[ 6] * B[ 1] +  A[10] * B[ 2] +  A[14] * B[ 3],
		A[ 3] * B[ 0] +  A[ 7] * B[ 1] +  A[11] * B[ 2] +  A[15] * B[ 3],

		A[ 0] * B[ 4] +  A[ 4] * B[ 5] +  A[ 8] * B[ 6] +  A[12] * B[ 7],
		A[ 1] * B[ 4] +  A[ 5] * B[ 5] +  A[ 9] * B[ 6] +  A[13] * B[ 7],
		A[ 2] * B[ 4] +  A[ 6] * B[ 5] +  A[10] * B[ 6] +  A[14] * B[ 7],
		A[ 3] * B[ 4] +  A[ 7] * B[ 5] +  A[11] * B[ 6] +  A[15] * B[ 7],

		A[ 0] * B[ 8] +  A[ 4] * B[ 9] +  A[ 8] * B[10] +  A[12] * B[11],
		A[ 1] * B[ 8] +  A[ 5] * B[ 9] +  A[ 9] * B[10] +  A[13] * B[11],
		A[ 2] * B[ 8] +  A[ 6] * B[ 9] +  A[10] * B[10] +  A[14] * B[11],
		A[ 3] * B[ 8] +  A[ 7] * B[ 9] +  A[11] * B[10] +  A[15] * B[11],

		A[ 0] * B[12] +  A[ 4] * B[13] +  A[ 8] * B[14] +  A[12] * B[15],
		A[ 1] * B[12] +  A[ 5] * B[13] +  A[ 9] * B[14] +  A[13] * B[15],
		A[ 2] * B[12] +  A[ 6] * B[13] +  A[10] * B[14] +  A[14] * B[15],
		A[ 3] * B[12] +  A[ 7] * B[13] +  A[11] * B[14] +  A[15] * B[15]
	);

}

/*
//---------------------------------------------------------------------
function vmul_vM_old( v, M ) 
//---------------------------------------------------------------------
{
	//	0	1	2	3		=		1	0	0	tx
	//	4	5	6	7		=		0	1	0	ty
	//	8	9	10	11		=		0	0	1	tz
	//	12	13	14	15		=		0	0	0	1

	let m = mmul_old( M, mtrans_row( v ) ); // 

	return new vec3( m[12], m[13], m[14] );

	return new vec3(
		v.x * M[ 0] +  v.y * M[ 1] +  v.z * M[ 2] +  1 * M[ 3],
		v.x * M[ 4] +  v.y * M[ 5] +  v.z * M[ 6] +  1 * M[ 7],
		v.x * M[ 8] +  v.y * M[ 9] +  v.z * M[10] +  1 * M[11],
		v.x * M[12] +  v.y * M[13] +  v.z * M[14] +  1 * M[15],
	);

}
*/
/*
//---------------------------------------------------------------------
function vmul_Mv( M, v ) // 
//---------------------------------------------------------------------
{
	let m = mmul_old( M, mtrans_row( v ) ); // 

	return new vec3( m[12], m[13], m[14] );

	// 最適化版
	return new vec3(
		M[ 0] * v.x +  M[ 4] * v.y +  M[ 8] * v.z +  M[12] * 1,
		M[ 1] * v.x +  M[ 5] * v.y +  M[ 9] * v.z +  M[13] * 1,
		M[ 2] * v.x +  M[ 6] * v.y +  M[10] * v.z +  M[14] * 1,
		M[ 3] * v.x +  M[ 7] * v.y +  M[11] * v.z +  M[15] * 1
	);
}
*/

//---------------------------------------------------------------------
function vmul_vM( v, M ) // as GL V*M
//---------------------------------------------------------------------
{
	//	0	1	2	3		=		1	0	0	tx
	//	4	5	6	7		=		0	1	0	ty
	//	8	9	10	11		=		0	0	1	tz
	//	12	13	14	15		=		0	0	0	1

	
	let m = mmul( mtrans( v ), M ); // 

	return new vec4( m[3], m[7], m[11], m[15] );

	return new vec4(
		v.x * M[ 0] +  v.y * M[ 1] +  v.z * M[ 2] +  v.w * M[ 3],
		v.x * M[ 4] +  v.y * M[ 5] +  v.z * M[ 6] +  v.w * M[ 7],
		v.x * M[ 8] +  v.y * M[ 9] +  v.z * M[10] +  v.w * M[11],
		v.x * M[12] +  v.y * M[13] +  v.z * M[14] +  v.w * M[15],
	);

}
/*

//---------------------------------------------------------------------
function mrotx_gl( m, th )  
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	let mv = new mat4(
		1	,	0	,	0	,	0	,		// as GL
		0	,	c	,  -s	,	0	,
		0	,   s	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
	
	return mmul_old( m, mv );
}
//---------------------------------------------------------------------
function mroty_gl( m, th )  	
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	let mv = new mat4(
		c	,	0   ,   s	,	0	,	// as GL
		0	,	1	,	0	,	0	,
		-s	,	0	,	c	,	0	,
		0	,	0	,	0	,	1	
	);

	return mmul_old( m, mv );
}
//---------------------------------------------------------------------
function mrotz_gl( m, th ) 	
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	let mv = new mat4(
		c	,	-s	,	0	,	0	,	// as GL
		s	,	c	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
	
	return mmul_old( m, mv );
}
*/
//-----------------------------------------------------------------------------
function mlookat( vecEye, vecAt )	// as GL
//-----------------------------------------------------------------------------
{
	let mv = midentity();
	// 視点・注視点から、viewマトリクスの生成
	let [rx,ry] = function(v)
	{
		let yz =  Math.sqrt(v.x*v.x+v.z*v.z);
		let ry = -Math.atan2( v.x , -v.z ); 
		let rx =  Math.atan2( v.y, yz ); 
		return [rx,ry];
	}( vsub(vecAt, vecEye) ); 
	mv = mtrans( new vec3( -vecEye.x, -vecEye.y, -vecEye.z ) );
	mv = mroty_gl( mv, ry );
	mv = mrotx_gl( mv, rx );
	return mv;
}


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
///////////////



let gl = html_canvas.getContext('webgl');
if ( gl == null )
{
	alert("ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。");
}
let g=html_canvas2.getContext('2d');

//-----------------------------------------------------------------------------
function print( tx, ty, str )
//-----------------------------------------------------------------------------
{
	g.font = "12px monospace";
	g.fillStyle = "#000000";
	g.fillText( str, tx, ty );
}

//-----------------------------------------------------------------------------
let circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.arc(x, y, r, 0, Math.PI * 2, true);
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
	g.lineWidth = 1.0;
	g.moveTo( sx, sy );
	g.lineTo( ex, ey );
	g.closePath();
	g.stroke();
}
let g_flg1 = 0;

//-----------------------------------------------------------------------------
function cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffff";
	g.fillRect( 0, 0, html_canvas.width, html_canvas.height );
}

class Model
{
	hdlIndexbuf;
	hdlVertexbuf;
	hdlColorbuf;
	hdlP;
	hdlV;
	hdlM;
	hdlShader;

	tblIndex = [];
	tblVertex = [];
	tblColor = [];
	vecOfs;
	flg = false;	

	//-----------------------------------------------------------------------------
	constructor( vecOfs, tblIndex, tblVertex, tblColor, drawtype )
	//-----------------------------------------------------------------------------
	{
		this.tblIndex = tblIndex;
		this.drawtype = drawtype;
		this.tblVertex = tblVertex;	// cpu描画用
		this.tblColor = tblColor;	// cpu描画用

		this.flg = true;	
		this.vecOfs = vecOfs;
		this.matModel = mtrans( this.vecOfs );

		this.hdlIndexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.tblIndex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	    }
	    
		this.hdlVertexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblVertex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		this.hdlColorbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblColor ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		// シェーダーコンパイル
		this.bin_vs = gl.createShader( gl.VERTEX_SHADER );	
		{
			let src = 
				 "attribute vec3 pos;"//左手座標系 奥がマイナス、右ねじ回転 columnは列 rowは行
				+"uniform mat4 V;"
				+"uniform mat4 M;"
				+"uniform mat4 P;"
				+"attribute vec3 col;"
				+"varying vec3 vColor;"
				+"void main(void)"
				+"{"
				+   "mat4 S = mat4(0.5,  0.0,  0.0,  0.0,"
				+   "              0.0,  0.5,  0.0,  0.0,"
				+   "              0.0,  0.0,  0.5,  0.0,"
				+   "              0.0,  0.0,  0.0,  1.0);"
				+   "float th = radians(15.0);"
				+   "float c = cos(th);"
				+   "float s = sin(th);"
				+   "mat4 Rx = mat4(1.0,  0.0,  0.0,  0.0,"
				+   "               0.0,    c,   -s,  0.0,"
				+   "               0.0,    s,    c,  0.0,"
				+   "               0.0,  0.0,  0.0,  1.0);"
				+   "mat4 Ry = mat4(  c,  0.0,    s,  0.0,"
				+   "               0.0,  1.0,  0.0,  0.0,"
				+   "                -s,  0.0,    c,  0.0,"
				+   "               0.0,  0.0,  0.0,  1.0);"
				+   "mat4 Rz = mat4(  c,   -s,  0.0,  0.0,"
				+   "                 s,    c,  0.0,  0.0,"
				+   "               0.0,  0.0,  1.0,  0.0,"
				+   "               0.0,  0.0,  0.0,  1.0);"
				+   "mat4 Tx = mat4(1.0,  0.0,  0.0, -1.0,"
				+   "               0.0,  1.0,  0.0,  0.0,"
				+   "               0.0,  0.0,  1.0,  0.0,"
				+   "               0.0,  0.0,  0.0,  1.0);"
				+   "mat4 Ty = mat4(1.0,  0.0,  0.0,  0.0,"
				+   "               0.0,  1.0,  0.0,  1.0,"
				+   "               0.0,  0.0,  1.0,  0.0,"
				+   "               0.0,  0.0,  0.0,  1.0);"
				+   "mat4 Tz = mat4(1.0,  0.0,  0.0,  0.0,"
				+   "               0.0,  1.0,  0.0,  0.0,"
				+   "               0.0,  0.0,  1.0, -9.0,"
				+   "               0.0,  0.0,  0.0,  1.0);"
				+   "mat4 T = Rz;         "
				+   "float fovy=radians(45.0);     "
				+   "float sc=1.0/tan(fovy/2.0);   "
				+   "float n=0.0;                  "
				+   "float f=-1.0;                 "
				+   "float aspect=1.0;             "
				+	"mat4 Pm = mat4(               "
				+	"	sc/aspect,     0.0,          0.0,              0.0,"
				+	"	      0.0,      sc,          0.0,              0.0,"
				+	"	      0.0,     0.0, -(f+n)/(f-n), -(2.0*f*n)/(f-n),"
				+	"	      0.0,     0.0,         -1.0,              0.0);"
				+   "gl_Position = vec4(pos, 1.0)*M*V*P;"
				+   "vColor = col;"
				+"}"
			;
			gl.shaderSource( this.bin_vs, src );
			gl.compileShader( this.bin_vs );
			if(gl.getShaderParameter(this.bin_vs, gl.COMPILE_STATUS) == false )
			{
				console.log(gl.getShaderInfoLog(this.bin_vs));
			}

		}

		this.bin_fs = gl.createShader( gl.FRAGMENT_SHADER );
		{
			let src =
				 "precision mediump float;"
				+"varying vec3 vColor;"
				+"void main(void)"
				+"{"
				+	"gl_FragColor = vec4(vColor, 1.0);"
				+"}"
			;
			gl.shaderSource( this.bin_fs, src );
			gl.compileShader( this.bin_fs );
		}

		// シェーダー構成
		{
			this.hdlShader = gl.createProgram();			//WebGLProgram オブジェクトを作成、初期化
			gl.attachShader( this.hdlShader, this.bin_vs );	//シェーダーを WebGLProgram にアタッチ
			gl.attachShader( this.hdlShader, this.bin_fs );	//シェーダーを WebGLProgram にアタッチ
			gl.linkProgram( this.hdlShader );				//WebGLProgram に接続されたシェーダーをリンク

			this.hdlP = gl.getUniformLocation( this.hdlShader, "P" );
			this.hdlV = gl.getUniformLocation( this.hdlShader, "V" );
			this.hdlM = gl.getUniformLocation( this.hdlShader, "M" );

			this.hdl_pos = gl.getAttribLocation( this.hdlShader, "pos" );
			gl.enableVertexAttribArray( this.hdl_pos );

			this.hdl_col = gl.getAttribLocation( this.hdlShader, "col" );
			gl.enableVertexAttribArray( this.hdl_col );
		}
	}

	//-----------------------------------------------------------------------------
	drawModel( matProj, matView )
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		// 描画
		gl.useProgram( this.hdlShader );
		{
			gl.uniformMatrix4fv( this.hdlP, false, Object.values(matProj) );
			gl.uniformMatrix4fv( this.hdlV, false, Object.values(matView) );
			gl.uniformMatrix4fv( this.hdlM, false, Object.values(this.matModel) );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.vertexAttribPointer( this.hdl_pos, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.vertexAttribPointer( this.hdl_col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
			
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.drawElements( this.drawtype, this.tblIndex.length, gl.UNSIGNED_SHORT, 0 );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
		}
	}
	//-----------------------------------------------------------------------------
	drawModel_canvas( matProj, matView )
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		let tmp = [];
		{
			let aspect = html_canvas2.width/html_canvas2.height;	// 縦に対するよこ幅
			let nz = 1; 					// 視点から投影面までの距離。1で固定
			let s = nz / Math.tan( g_fovy/2 );

			for ( let i = 0 ; i < this.tblVertex.length/3 ; i++ )
			{
				let v = new vec4(0,0,0,1);
				v.x = this.tblVertex[i*3+0];
				v.y = this.tblVertex[i*3+1];
				v.z = this.tblVertex[i*3+2];
			
				// 透視変換	//gl_Position = vec4(pos, 1.0)*M*V*P;
				v = vmul_vM( v, this.matModel );
				v = vmul_vM( v, matView );
				if (0)
				{
					// 投影変換
					v.x = -v.x*s / (v.z+nz);	// as GL座標系
					v.y =  v.y*s / (v.z+nz);
					v.z =  v.z*s / (v.z+nz);
					v.x /= aspect;
				}
				else
				{
					v = vmul_vM( v, matProj );
					v.x /= v.w;
					v.y /= -v.w;
				}
				tmp.push( v );
			}
		}

		// 描画
		{
			let sx = html_canvas2.width/2;
			let sy = html_canvas2.height/2;

			for ( let v of tmp )
			{
				let x = v.x*sx+sx;
				let y = v.y*sy+sy;
				circle( x,y, 3 );
			}

			if ( this.drawtype == gl.LINES )
			{
				for ( let i = 0 ; i< this.tblIndex.length/2 ; i++ )
				{
					let v = tmp[this.tblIndex[i*2+0]];
					let w = tmp[this.tblIndex[i*2+1]];					
					let x1 = v.x*sx+sx;
					let y1 = v.y*sy+sy;
					let x2 = w.x*sx+sx;
					let y2 = w.y*sy+sy;
					line( x1, y1,x2, y2 );
				}
			}
			
		}


	}

};
//---------------------------------------------------------------------
function	update_gl(time)
//---------------------------------------------------------------------
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	cls();

	{
		let matProj = mperspective( 1/Math.tan(g_fovy/2), html_canvas.width/html_canvas.height, 0.0, -1.0);

		g_yaw+=radians(0.263);

		let matView = midentity();
		matView = mmul( matView, mrotY( g_yaw )  );
		matView = mmul( matView, mtrans( g_posEye ) );

		for ( let m of g_tblModel )
		{
			m.matModel = mmul( m.matModel, mrotX( radians(-1.5) )  );
			m.drawModel( matProj, matView );
			m.drawModel_canvas( matProj, matView );
		}
	}
	g_reqId = window.requestAnimationFrame( update_gl );
}

//-----------------------------------------------------------------------------
function init_gl()
//-----------------------------------------------------------------------------
{

	//-----------------------------------------------------------------------------
	function makeWireBox( s )
	//-----------------------------------------------------------------------------
	{
		let tblVertex = 
		[
			-s,-s,-s,
			 s,-s,-s,
			 s, s,-s,
			-s, s,-s,

			-s,-s, s,
			 s,-s, s,
			 s, s, s,
			-s, s, s,
		];

		let tblColor = 
		[
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,

			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,

		]

		let tblIndex = 
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

		return [ tblIndex, tblVertex, tblColor, gl.LINES];
	}
	
	//-----------------------------------------------------------------------------
	function makePolyBox( s )
	//-----------------------------------------------------------------------------
	{
		let tblVertex = 
		[
			-s,-s,-s,
			 s,-s,-s,
			-s, s,-s,
			 s, s,-s,

		];

		let tblColor = 
		[
			1.0 , 0.0 , 0.0 , 	
			1.0 , 0.0 , 0.0 , 
			1.0 , 0.0 , 0.0 , 
			1.0 , 0.0 , 0.0 , 
		]

		let tblIndex = 
		[
			0,1,2,3
		];

		return [ tblIndex, tblVertex, tblColor, gl.TRIANGLE_STRIP];
	}
		
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireBox( 1.0 );
		let m = new Model( new vec3( 0,0,0), tblIndex, tblVertex, tblColor, drawtype );
		g_tblModel.push( m );
	}
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireBox( 1.0 );
		let m = new Model( new vec3( 1,1,1), tblIndex, tblVertex, tblColor, drawtype );
		g_tblModel.push( m );
	}
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makePolyBox( 1.0 );
//		g_tblModel.push( new Model( new vec3( 1,1,0), tblIndex, tblVertex, tblColor, drawtype ) );
	}

	//---
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clearDepth( 1.0 );
	gl.viewport( 0.0, 0.0, html_canvas.width, html_canvas.height );

}

let g_yaw = 0;
let g_tblModel = [];
let g_posEye;
let g_fovy;
let g_matCam;
let g_prevButtons;
let g_reqId;
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_posEye = new vec3( 0,-0.5,-12.5);
	g_fovy = radians(45);
	g_reqId = null;

	init_gl();
	
	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = window.requestAnimationFrame( update_gl );
}

// HTML制御
