"use strict";

//	行列ライブラリコンセプト
//	GLSLと同じ数式同じ行列がメインプログラムでも同様に機能する



///// geom 2021/05/06 mrotate 追加

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
/*
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
*/

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

	return vec3( nx, ny, nz );
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

	return vec3( nx, ny, nz );
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

	return vec3( nx, ny, nz );
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


function mat4(
		m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
{
	return [		// 2021/05/06 二次元配列化
		[m00,m01,m02,m03],
		[m10,m11,m12,m13],
		[m20,m21,m22,m23],
		[m30,m31,m32,m33]
	];
}
/*
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
*/
/*
class mat4
{
	constructor( 
		m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
	{
if (0)
{
		this[0] = [m00,m01,m02,m03];
		this[1] = [m10,m11,m12,m13];
		this[2] = [m20,m21,m22,m23];
		this[3] = [m30,m31,m32,m33];
}
else
if (0)
{
		this[0] = new Array(4);
		this[1] = new Array(4);
		this[2] = new Array(4);
		this[3] = new Array(4);
		this[0][0] = m00;
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
}
else
{
		this[ 0] = m00;	this[ 1] = m01;	this[ 2] = m02;	this[ 3] = m03;
		this[ 4] = m10;	this[ 5] = m11;	this[ 6] = m12;	this[ 7] = m13;
		this[ 8] = m20;	this[ 9] = m21;	this[10] = m22;	this[11] = m23;
		this[12] = m30;	this[13] = m31;	this[14] = m32;	this[15] = m33;
}

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
*/

//---------------------------------------------------------------------
function mperspective( fovy, aspect, n, f ) // 2021/05/04 GLに準拠
//---------------------------------------------------------------------
{
	// 参考) https://www.khronos.org/opengl/wiki/GluPerspective_code
	// OpenGL® Programming Guide: The Official Guide 
	// https://www.cs.utexas.edu/users/fussell/courses/cs354/handouts/Addison.Wesley.OpenGL.Programming.Guide.8th.Edition.Mar.2013.ISBN.0321773039.pdf

	// n : ニアクリップ、必ず正の値を指定	= 視点から投影面までの距離
	// f : ファークリップ、必ず正の値を指定
	// 視点はz=0にあると考える。
	// 紛らわしいがZ奥がマイナス

    let y = n * Math.tan(fovy * Math.PI / 360.0);
    let x = y * aspect;

	return mfrustum( -x, x, -y, y, n, f );
}

//---------------------------------------------------------------------
function mfrustum( l, r, b, t, n, f ) //2021/05/04 GLに準拠
//---------------------------------------------------------------------
{
	// 参考)https://www.scratchapixel.com/code.php?id=4&origin=/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix&src=1
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
	// 参考) http://www.songho.ca/opengl/gl_transform.html
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
	return mat4(
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		v.x	,	v.y	,	v.z	,	1	
	);
}
//---------------------------------------------------------------------
function mrotX( th )
//---------------------------------------------------------------------
{
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
function mrotY( th )
//---------------------------------------------------------------------
{
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
function mrotZ( th )
//---------------------------------------------------------------------
{
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
function mrotate( M, th, axis )
//---------------------------------------------------------------------
{

	let x = axis.x;
	let y = axis.y;
	let z = axis.z;
	let len = Math.sqrt( x*x+y*y+z*z );

	if ( len < 1e-6 )return null;
	x *= len = 1/len
	y *= len;
	z *= len;
	let sn = Math.sin(th);
	let cs = Math.cos(th);
	let ic = 1-cs;

	let i = x*x*ic+cs;
	let j = y*x*ic+z*sn;
	let k = z*x*ic-y*sn;

	let l = x*y*ic-z*sn;
	let m = y*y*ic+cs;
	let n = z*y*ic+x*sn;

	let o = x*z*ic+y*sn;
	let p = y*z*ic-x*sn;
	let q = z*z*ic+cs;

	const	_00=0*4+0;
	const	_01=0*4+1;
	const	_02=0*4+2;
	const	_03=0*4+3;
	const	_10=1*4+0;
	const	_11=1*4+1;
	const	_12=1*4+2;
	const	_13=1*4+3;
	const	_20=2*4+0;
	const	_21=2*4+1;
	const	_22=2*4+2;
	const	_23=2*4+3;
	const	_30=3*4+0;
	const	_31=3*4+1;
	const	_32=3*4+2;
	const	_33=3*4+3;

	return mat4(
		M[0][0]*i+M[1][0]*j+M[2][0]*k	,	M[0][1]*i+M[1][1]*j+M[2][1]*k	,	M[0][2]*i+M[1][2]*j+M[2][2]*k	,	M[0][3]*i+M[1][3]*j+M[2][3]*k	,
		M[0][0]*l+M[1][0]*m+M[2][0]*n	,	M[0][1]*l+M[1][1]*m+M[2][1]*n	,	M[0][2]*l+M[1][2]*m+M[2][2]*n	,	M[0][3]*l+M[1][3]*m+M[2][3]*n	,
		M[0][0]*o+M[1][0]*p+M[2][0]*q	,	M[0][1]*o+M[1][1]*p+M[2][1]*q	,	M[0][2]*o+M[1][2]*p+M[2][2]*q	,	M[0][3]*o+M[1][3]*p+M[2][3]*q	,
		M[3][0]							,	M[3][1]							,	M[3][2]							,	M[3][3]	
	);
}

/*
//---------------------------------------------------------------------
function mrotate( M, th, v )
//---------------------------------------------------------------------
{
//a b c d		c
//e f g h
//i j k 		ijk
//l m n
//o p q r		opq
//s t u v		s
//w x y z		xyz


	let e = Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );

	if ( e < 1e-6 ) return null;
	e = 1/e;
	v.x *= e;
	v.y *= e;
	v.z *= e;
	let s = Math.sin( th );
	let c = Math.cos( th );
	let a = 1-c;

	let o = v.x * v.x *a + c;
	let p = v.x * v.y *a - v.z * s;
	let q = v.x * v.z *a + v.y * s;

	let l = v.y * v.x *a + v.z * s;
	let m = v.y * v.y *a + c;
	let n = v.y * v.z *a - v.x * s;

	let i = v.z * v.x *a - v.y * s;
	let j = v.z * v.y *a + v.x * s;
	let k = v.z * v.z *a +c;
	return mat4(
		M[0]*o+M[4]*l+M[8]*i,	M[1]*o+M[5]*l+M[9]*i,	M[2]*o+M[6]*l+M[10]*i,	M[3]*o+M[7]*l+M[11]*i,
		M[0]*p+M[4]*m+M[8]*j,	M[1]*p+M[5]*m+M[9]*j,	M[2]*p+M[6]*m+M[10]*j,	M[3]*p+M[7]*m+M[11]*j,
		M[0]*q+M[4]*n+M[8]*k,	M[1]*q+M[5]*n+M[9]*k,	M[2]*q+M[6]*n+M[10]*k,	M[3]*q+M[7]*n+M[11]*k,
		M[12],					M[13],					M[14],					M[15]		);
	
}
*/

//---------------------------------------------------------------------
function mmul( A, B )  //  A X B 列優先
//---------------------------------------------------------------------
{


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
//	行優先
//	|	a	b	|		|	e	f	|		|	ae+bg	af+bh	|
//	|	c	d	|	X	|	g	h	|	=	|	ce+dg	cf+dh	|

//	列優先
//	|	a	c	|		|	e	g	|		|	ae+	bg	ce+dg
//	|	b	d	|	X	|	f	h	|	=	|	
//

//---------------------------------------------------------------------
function vec4_vmul_vM( v, M ) // 列優先 
//---------------------------------------------------------------------
{
	//	| x |		|	 0	 1	 2	 3	|
	//	| y |		|	 4	 5	 6	 7	|
	//	| z |	X	|	 8	 9	10	11	|
	//	| w |		|	12	13	14	15	|

	return vec4(
/*
		v.x * M[ 0] +  v.y * M[ 1] +  v.z * M[ 2] +  v.w * M[ 3],
		v.x * M[ 4] +  v.y * M[ 5] +  v.z * M[ 6] +  v.w * M[ 7],
		v.x * M[ 8] +  v.y * M[ 9] +  v.z * M[10] +  v.w * M[11],
		v.x * M[12] +  v.y * M[13] +  v.z * M[14] +  v.w * M[15]
*/
		v.x * M[0][0] +  v.y * M[0][1] +  v.z * M[0][2] +  v.w * M[0][3] ,
		v.x * M[1][0] +  v.y * M[1][1] +  v.z * M[1][2] +  v.w * M[1][3] ,
		v.x * M[2][0] +  v.y * M[2][1] +  v.z * M[2][2] +  v.w * M[2][3] ,
		v.x * M[3][0] +  v.y * M[3][1] +  v.z * M[3][2] +  v.w * M[3][3]
	);
}
//---------------------------------------------------------------------
function vmul_vM( v, M ) // 列優先 
//---------------------------------------------------------------------
{
	//	| x |		|	 0	 1	 2	 3	|
	//	| y |		|	 4	 5	 6	 7	|
	//	| z |	X	|	 8	 9	10	11	|
	//	| 1 |		|	12	13	14	15	|

	return vec4(
/*
		v.x * M[ 0] +  v.y * M[ 4] +  v.z * M[ 8] +  1 * M[12],
		v.x * M[ 1] +  v.y * M[ 5] +  v.z * M[ 9] +  1 * M[13],
		v.x * M[ 2] +  v.y * M[ 6] +  v.z * M[10] +  1 * M[14],
		v.x * M[ 3] +  v.y * M[ 7] +  v.z * M[11] +  1 * M[15]
*/
		v.x * M[0][0] +  v.y * M[0][1] +  v.z * M[0][2] +  1 * M[0][3] ,
		v.x * M[1][0] +  v.y * M[1][1] +  v.z * M[1][2] +  1 * M[1][3] ,
		v.x * M[2][0] +  v.y * M[2][1] +  v.z * M[2][2] +  1 * M[2][3] ,
		v.x * M[3][0] +  v.y * M[3][1] +  v.z * M[3][2] +  1 * M[3][3]
	);
//	let m = mmul( mtrans( v ), M ); // 

//	return vec4( m[3], m[7], m[11] );
}

//---------------------------------------------------------------------
function vec4_vmul_Mv( M, v ) // 列優先 
//---------------------------------------------------------------------
{
	//	|	 0	 1	 2	 3	| 		
	//	|	 4	 5	 6	 7	| 		
	//	|	 8	 9	10	11	| 	X	| x y z w |
	//	|	12	13	14	15	| 	 	

	return vec4(
		M[0][0] * v.x +  M[1][0] * v.y +  M[2][0] * v.z +  M[3][0] * v.w,
		M[0][1] * v.x +  M[1][1] * v.y +  M[2][1] * v.z +  M[3][1] * v.w,
		M[0][2] * v.x +  M[1][2] * v.y +  M[2][2] * v.z +  M[3][2] * v.w,
		M[0][3] * v.x +  M[1][3] * v.y +  M[2][3] * v.z +  M[3][3] * v.w
	);
/*		
	return vec4(
		M[ 0] * v.x +  M[ 4] * v.y +  M[ 8] * v.z +  M[12] * v.w,
		M[ 1] * v.x +  M[ 5] * v.y +  M[ 9] * v.z +  M[13] * v.w,
		M[ 2] * v.x +  M[ 6] * v.y +  M[10] * v.z +  M[14] * v.w,
		M[ 3] * v.x +  M[ 7] * v.y +  M[11] * v.z +  M[15] * v.w
	);
*/
}
//---------------------------------------------------------------------
function vmul_Mv( M, v ) // 列優先 	
//---------------------------------------------------------------------
{
	//	|	 0	 1	 2	 3	|	
	//	|	 4	 5	 6	 7	|	
	//	|	 8	 9	10	11	|	X	| x y z 1 |
	//	|	12	13	14	15	|	

	return vec3(
		M[0][0] * v.x +  M[1][0] * v.y +  M[2][0] * v.z +  M[3][0] * 1,
		M[0][1] * v.x +  M[1][1] * v.y +  M[2][1] * v.z +  M[3][1] * 1,
		M[0][2] * v.x +  M[1][2] * v.y +  M[2][2] * v.z +  M[3][2] * 1,
		M[0][3] * v.x +  M[1][3] * v.y +  M[2][3] * v.z +  M[3][3] * 1
	);
}

//-----------------------------------------------------------------------------
function mlookat( vecEye, vecAt )	
//-----------------------------------------------------------------------------
{

	//-----------------------------------------------------------------------------
//	void lookAt( vect3 pos, vect3 at, vect3 up )
	//-----------------------------------------------------------------------------
	{
		let	up = vec3(0,1,0);
		let	z = normalize( vsub( vecEye, vecAt ) );
		let	x = cross( up, z );
		let	y = cross( z, x );

		return mat4(
//			x.x	,	x.y	,	x.z	,	 0.0,
//			y.x	,	y.y	,	y.z	,	 0.0,
//			z.x	,	z.y	,	z.z	,	 0.0,
			x.x	,	y.x	,	z.x	,	 0.0,
			x.y	,	y.y	,	z.y	,	 0.0,
			x.z	,	y.z	,	z.z	,	 0.0,
			-vecEye.x,	-vecEye.y,	-vecEye.z,	 1.0
		)
	}
}


/////
var cubeRotation = 0.0;


//-----------------------------------------------------------------------------
function model_create( gl )
//-----------------------------------------------------------------------------
{
	let model = {};
	{
		const vsSource = 
			 "	 attribute vec4 Pos;"
			+"	 attribute vec2 Uv;"
			+"		uniform mat4 M;"
			+"	 uniform mat4 P;"
			+"		varying highp vec2 uv;"
			+"		void main( void ) {"
			+"		 gl_Position = P * M * Pos;"
			+"		 uv = Uv;"
			+"	 }";


		const fsSource = 
			 "	 varying highp vec2 uv;"
			+"		uniform sampler2D Tex0;"
			+"		void main( void ) {"
			+"		 gl_FragColor = texture2D( Tex0, uv );"
			+"	 }";


		const prog = gl.createProgram();
		{
			function compile( gl, type, source ) 
			{
				const hdl = gl.createShader( type );
				gl.shaderSource( hdl, source );
				gl.compileShader( hdl );
				if ( !gl.getShaderParameter( hdl, gl.COMPILE_STATUS ) ) 
				{
					alert( 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog( hdl ) );
					gl.deleteShader( hdl );
					return null;
				}
				return hdl;
			}
			const vs = compile( gl, gl.VERTEX_SHADER, vsSource );
			const fs = compile( gl, gl.FRAGMENT_SHADER, fsSource );

			gl.attachShader( prog, vs );
			gl.attachShader( prog, fs );
			gl.linkProgram( prog );


			if ( !gl.getProgramParameter( prog, gl.LINK_STATUS ) ) 
			{
				alert( 'Unable to initialize the shader prog: ' + gl.getProgramInfoLog( prog ) );
				return null;
			}
		}

		model.hdlProg	= prog;
		model.hdlPos	= gl.getAttribLocation( prog, 'Pos' );
		model.hdlUv		= gl.getAttribLocation( prog, 'Uv' );
		model.hdlP		= gl.getUniformLocation( prog, 'P' );
		model.hdlM		= gl.getUniformLocation( prog, 'M' );
		model.hdlTex0	= gl.getUniformLocation( prog, 'Tex0' );
	}

	{

		const tblPos = [
			-1.0, -1.0	,	0.0,
			 1.0, -1.0	,	0.0,
			 1.0,	1.0	,	0.0,
			-1.0,	1.0	,	0.0,

		];

		const tblUv = [
			0.0,	0.0,
			1.0,	0.0,
			1.0,	1.0,
			0.0,	1.0,
		];

		const indices = [
			0,	1,	2,		 0,	2,	3,
		];


		const hdlpos = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, hdlpos );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblPos ), gl.STATIC_DRAW );

		const hdluv = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, hdluv );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblUv ), gl.STATIC_DRAW );

		const hdlindices = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, hdlindices );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );

		model.hdlBufpos		= hdlpos; 
		model.hdlBufuv		= hdluv; 
		model.hdlBufindex	= hdlindices;
		model.cntIndex		= indices.length;
		model.drawtype		= gl.TRIANGLES
	}

	model.texture = gl.createTexture();
	{
		gl.bindTexture( gl.TEXTURE_2D, model.texture );

		const level = 0;
		const internalFormat = gl.RGB;
		const width = 4;
		const height = 4;
		const border = 0;
		const srcFormat = gl.RGB;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array( [
			255	,	0	,	0,		0,	255	,	0	,		0,	0,	255	,		0	,	255	,	255	,	
			0	,	255	,	0,		0,	0	,	255	,		0,	0,	0	,		255	,	0	,	255	,
			255	,	0	,	255	,	0,		0,	0	,	255	,		0,	0,	0	,		255	,	0	,
			255	,	255	,	0	,	255	,	0,		0,	0	,	255	,		0,	0,	0	,		255	,
		  ] );	

		gl.bindTexture( gl.TEXTURE_2D, model.texture );
		gl.texImage2D( gl.TEXTURE_2D, level, internalFormat,width,height,0,srcFormat, srcType, pixel );
		gl.generateMipmap( gl.TEXTURE_2D );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );

	}
	return model;
}

//-----------------------------------------------------------------------------
function model_draw( gl, model, P, M )
//-----------------------------------------------------------------------------
{
	gl.bindBuffer( gl.ARRAY_BUFFER, model.hdlBufpos );
	gl.vertexAttribPointer( model.hdlPos, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( model.hdlPos );

	gl.bindBuffer( gl.ARRAY_BUFFER, model.hdlBufuv );
	gl.vertexAttribPointer( model.hdlUv, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( model.hdlUv );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, model.hdlBufindex );

	gl.useProgram( model.hdlProg );
	gl.uniformMatrix4fv(  model.hdlP, false, P.flat() );
	gl.uniformMatrix4fv(  model.hdlM, false, M.flat() );

	gl.activeTexture( gl.TEXTURE0 );

	gl.bindTexture( gl.TEXTURE_2D, model.texture );

	gl.uniform1i( model.hdlTex0, 0 );

	gl.drawElements( model.drawtype, model.cntIndex, gl.UNSIGNED_SHORT, 0 );
}

//-----------------------------------------------------------------------------
window.onload = function( e )
//function main() 
//-----------------------------------------------------------------------------
{
	const gl = html_canvas.getContext( 'webgl' );

	if ( !gl ) 
	{
		alert( 'Unable to initialize WebGL. Your browser or machine may not support it.' );
		return;
	}


	let model = model_create( gl );

	var then = 0;

	//-----------------------------------------------------------------------------
	function update_paint( now ) 
	//-----------------------------------------------------------------------------
	{
		const deltaTime = (now - then)/1000;
		then = now;

		{
			gl.clearColor( 0.0, 0.0, 0.0, 1.0 );	
			gl.clearDepth( 1.0 );					
			gl.enable( gl.DEPTH_TEST );			
			gl.depthFunc( gl.LEQUAL );			

			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

			let P = mperspective( 45, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000.0 );
			let M = mtrans( vec3(0.0, 0.0, -8.0 ) );
			M = mrotate( M, cubeRotation * .7,	normalize( vec3(0, 1, 1) ) );				// axis to rotate around ( X )

			model_draw( gl, model, P, M );

			cubeRotation += deltaTime;
		}

		requestAnimationFrame( update_paint );
	}
	requestAnimationFrame( update_paint );
}

