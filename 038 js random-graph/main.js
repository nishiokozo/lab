const	KEY_CR	= 13;
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

let g=html_canvas.getContext('2d');
//-----------------------------------------------------------------------------
function rad( deg )
//-----------------------------------------------------------------------------
{
	return deg/180*Math.PI;
}
//-----------------------------------------------------------------------------
let box = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.stroke();

}
//-----------------------------------------------------------------------------
let fill= function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.fillStyle = "#000000";
	g.fill();
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
function cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffff";
	g.fillRect( 0, 0, html_canvas.width, html_canvas.height );
}




let g_cntErr = 0;
let g_algo ="r";
//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	cls();

	{
		let r_qnum	= 32;		// 量子化数
		let r_smp	= 100000;	// 振る回数
		let r_dice	= 3;		// 0～1のアナログさいころの数

		let g_tbl = new Array(r_qnum);
		g_tbl.fill(0);

		function rand( n ) // n=3以上が正規分布
		{
			let r = 0;
			for ( j = 0 ; j < n ; j++ ) r += Math.random();
			r/=n;

			return r;
		}

		for ( let i = 0 ; i < r_smp ; i++ )
		{
			let r = 0;

			switch( g_algo )
			{
				case "r"		:r = rand( 1 )				;break;
				case "(r+r)/2"	:r = rand( 2 )				;break;
				case "(r+r+r)/3":r = rand( 3 )				;break;
				case "(A+B)/2"	:r = (rand( 1 )+rand( 2 ))/2	;break;
				case "(A+C)/2"	:r = (rand( 1 )+rand( 3 ))/2	;break;
				case "(B+C)/2"	:r = (rand( 2 )+rand( 3 ))/2	;break;
				case "A*B"		:r = (rand( 1 )*rand( 2 ))	;break;
				case "A*C"		:r = (rand( 1 )*rand( 3 ))	;break;
				case "B*C"		:r = (rand( 2 )*rand( 3 ))	;break;
			}
//		r = Math.pow(r,0.5);

			let n = Math.floor( r*r_qnum );	// 量子化
			g_tbl[n]++;
		}	

		{	// グラフ表示
			print( 10,16*1, "      量子化数:"+r_qnum.toString() );
			print( 10,16*2, "サンプリング数:"+r_smp );
			print( 10,16*3, "  アルゴリズム:"+g_algo );

			let d_wide = 16;
			let d_sc = 1/40;
			let d_y = html_canvas.height -32;

			for ( let i = 0 ; i < r_qnum ; i++ ) 
			{
				let v = g_tbl[i];
				let x = i * d_wide;
				line( x+1,d_y-2-v*d_sc,x+d_wide-1,d_y-2-v*d_sc );
				print( x,d_y+16*1, i );
			}
		}
		
	}
	
	{ // ガウス分布表示

		function gauss( x,s  )
		{
			let u = 0; 
			// u: μミュー	平均
			// s: σシグマ	標準偏差
			return 	1/(Math.sqrt(2*Math.PI*s))*Math.exp( -((x-u)*(x-u)) / (2*s*s) );
		}
		let d_wide = 16;
		let d_y = html_canvas.height -32;
		let sc = 32;

		let sigma = 6;
		print( 10,16*5, "ガウス分布表示:ドット" );
		print( 10,16*6, "      標準偏差:"+sigma );

		for ( let x = -sc/2 ; x < sc/2 ; x++ )
		{
			let y = gauss(x,sigma);
			let px =     	 (x + sc/2) * d_wide;
			let py = d_y-    (y       ) * 70*d_wide;
			fill( px,py,px+1,py+1 );
		}
	}

	
	requestAnimationFrame( update );

}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;

}
	requestAnimationFrame( update );


//HTMLとのやり取り関連
//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	html_click()
}
//-----------------------------------------------------------------------------
function html_click()
//-----------------------------------------------------------------------------
{
	var list = document.getElementsByName( "html_radio" ) ;

	for ( let i = 0 ; i < list.length; i++ ) 
	{
		if ( list[i].checked ) 
		{
			g_algo = list[i].value;
			break;
		}
	}
}