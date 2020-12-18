'use strict';

let g_context = html_canvas.getContext('2d');
let gra = g_context.createImageData( 640, 200 );
g_context.imageSmoothingEnabled = g_context.msImageSmoothingEnabled = 0; // スムージングOFF




//-----------------------------------------------------------------------------
gra.cls = function( col )
//-----------------------------------------------------------------------------
{
	for (let x=0; x<gra.width ; x++ )
	for (let y=0; y<gra.height ; y++ )
	{
		let adr = (y*gra.width+x)*4;
		gra.data[ adr +0 ] = (col>>16)&0xff;
		gra.data[ adr +1 ] = (col>> 8)&0xff;
		gra.data[ adr +2 ] = (col>> 0)&0xff;
		gra.data[ adr +3 ] = 255;
	}
}

//-----------------------------------------------------------------------------
gra.pset = function( ox, oy, col )
//-----------------------------------------------------------------------------
{
	let x = Math.floor(ox);
	let y = Math.floor(oy);

	if ( x < 0 ) return;
	if ( y < 0 ) return;
	if ( x >= gra.width ) return;
	if ( y >= gra.height ) return;

	let adr = (y*gra.width+x)*4;
	gra.data[ adr +0 ] = (col>>16)&0xff;
	gra.data[ adr +1 ] = (col>> 8)&0xff;
	gra.data[ adr +2 ] = (col>> 0)&0xff;
	gra.data[ adr +3 ] = 255;
}



//-----------------------------------------------------------------------------
gra.line = function(  x1, y1, x2, y2, col ) 
//-----------------------------------------------------------------------------
{
	//ブレセンハムの線分発生アルゴリズム

	// 二点間の距離
	let dx = ( x2 > x1 ) ? x2 - x1 : x1 - x2;
	let dy = ( y2 > y1 ) ? y2 - y1 : y1 - y2;

	// 二点の方向
	let sx = ( x2 > x1 ) ? 1 : -1;
	let sy = ( y2 > y1 ) ? 1 : -1;

	if ( dx > dy ) 
	{
		// 傾きが1より小さい場合
		let E = -dx;
		for ( let i = 0 ; i <= dx ; i++ ) 
		{
			gra.pset( x1,y1, col );
			x1 += sx;
			E += 2 * dy;
			if ( E >= 0 ) 
			{
				y1 += sy;
				E -= 2 * dx;
			}
		}
	}
	else
	{
		// 傾きが1以上の場合
		let E = -dy;
		for ( let i = 0 ; i <= dy ; i++ )
		{
			gra.pset( x1, y1, col );
			y1 += sy;
			E += 2 * dx;
			if ( E >= 0 )
			{
				x1 += sx;
				E -= 2 * dy;
			}
		}
	}
}

//-----------------------------------------------------------------------------
gra.rgb = function( r,g,b )
//-----------------------------------------------------------------------------
{
	return (r<<16)|(g<<8)|b;
}

//-----------------------------------------------------------------------------
gra.point = function( x, y )
//-----------------------------------------------------------------------------
{
	let adr = (y*gra.width+x)*4;
	let r = gra.data[ adr +0 ];
	let g = gra.data[ adr +1 ];
	let b = gra.data[ adr +2 ];
//	let a = gra.data[ adr +3 ];
	return gra.rgb(r,g,b);
}


//-----------------------------------------------------------------------------
gra.paint = function(  x0, y0, colsPat, colsRej  ) 
//-----------------------------------------------------------------------------
{
	class Painted
	{
		constructor()
		{
			this.sx = 0;
			this.ex = 0;
			this.y = 0;
		}
	};
	const l_MAXPAINTBUF = 1000;
	let l_cntPaintBuf = 0;
	let painted = new Array(l_MAXPAINTBUF);
	for ( let i = 0 ; i < l_MAXPAINTBUF ; i++ )
	{
		painted[i] = new Painted();
	}

	class Buff
	{
		constructor()
		{
			this.x = 0;
			this.y = 0;
			this.fLower = true;	// false:空き true:壁がある
			this.fUpper = true;	// false:空き true:壁がある
		}
	}
	const l_MAXBUF = 1000;
	let l_cntBuf = 0;
	let l_fPrevLower = false;
	let l_fPrevUpper = false;
	let buff = new Array(l_MAXBUF);
	for ( let i = 0 ; i < l_MAXBUF ; i++ )
	{
		buff[i] = new Buff();
	}


	//-----------------------------------------------------------------------------
	function isPainted( x0, y0 )
	//-----------------------------------------------------------------------------
	{
		for ( let i = 0 ; i < l_cntPaintBuf ; i++ )
		{
			if ( painted[i].y == y0 )
			{
				if ( painted[i].sx <= x0 && x0 <= painted[i].ex )
				{
					return true; //既にペイント済み
				}
			}
		}
		return false;
	}

	//-----------------------------------------------------------------------------
	function addPos( x0, y0, colsRej )
	//-----------------------------------------------------------------------------
	{
		if ( l_cntBuf >= l_MAXBUF ) return;

		let fLower = false;
		let fUpper = false;
		
		if ( y0+1 < gra.height )
		{
			let c = gra.point( x0, y0+1 );
			if ( colsRej.indexOf(c) != -1 )  fLower = true;
			if ( isPainted( x0, y0+1 ) ) fLower = true;

		}
		else
		{
			fLower = true;
		}

		if ( y0-1 >= 0 )
		{
			let c = gra.point( x0, y0-1 );
			if ( colsRej.indexOf(c) != -1 )  fUpper = true;
			if ( isPainted( x0, y0-1 ) ) fUpper = true;
		}
		else
		{
			fUpper = true;
		}

		if (( fLower == false && fLower != l_fPrevLower ) 
		||	( fUpper == false && fUpper != l_fPrevUpper ) 
		)	
		{
			buff[l_cntBuf].x = x0;
			buff[l_cntBuf].y = y0;
			buff[l_cntBuf].fLower = fLower;
			buff[l_cntBuf].fUpper = fUpper;

			l_cntBuf++;
		}

		l_fPrevLower = fLower;
		l_fPrevUpper = fUpper;
		

	}

	//-----------------------------------------------------------------------------
	function linepaint( x0, y0, colsPat, colsRej )
	//-----------------------------------------------------------------------------
	{
		if ( x0 < 0 || x0 > gra.width ) return;
		if ( y0 < 0 || y0 > gra.height ) return;
		{
			let c = gra.point(x0,y0);
			if ( colsRej.indexOf(c) != -1 )  return;	// 境界検出
		}
		if ( isPainted( x0, y0 ) ) return; //既にペイント済み
		if ( l_cntPaintBuf >= l_MAXPAINTBUF ) return;

		let y = y0;
		l_fPrevLower = true;
		l_fPrevUpper = true;


		// 左端検出
		let x = x0;
		for ( ; x > 0 ; x-- )
		{
			let c = gra.point(x-1,y);
			if ( colsRej.indexOf(c) != -1 )  break;	// 左境界検出
		}
		painted[l_cntPaintBuf].sx = x;

		// 右端までペイント
		for ( ; x < gra.width ; x++ )
		{
			let c = gra.point( x, y );
			if ( colsRej.indexOf(c) != -1 )  break;	// 右境界検出
			addPos( x, y, colsRej );

			{
				let ix = x % colsPat[0].length;
				let iy = y % colsPat.length;
				gra.pset( x, y , colsPat[iy][ix] );
			}
		}
		painted[l_cntPaintBuf].ex = x-1;
		painted[l_cntPaintBuf].y = y;
		
		l_cntPaintBuf++;

	}

	{
		l_cntPaintBuf = 0;
		// 最初の一本
		linepaint( x0, y0, colsPat, colsRej );
	}

	{
		let st = 0;
		while( st < l_cntBuf )
		{
			let en = l_cntBuf-1;
			for ( let i = st ; i <= en ; i++ )
			{
				if ( buff[i].fLower == false )
				{
					linepaint(  buff[i].x, buff[i].y+1, colsPat, colsRej );
				}
				if ( buff[i].fUpper == false )
				{
					linepaint(  buff[i].x, buff[i].y-1, colsPat, colsRej );
				}
			}
			st = en+1;

		}
	}
}

gra.cls( 0xffffff );			


{
	let sx = 200;
	let sy =  50;
	let ex = 400;
	let ey = 150;
	gra.line( sx,sy,ex,sy,0xff0000 );
	gra.line( sx,ey,ex,ey,0xff0000 );
	gra.line( sx,sy,sx,ey,0xff0000 );
	gra.line( ex,sy,ex,ey,0xff0000 );

	gra.line( sx+20,sy+20,sx+110,sy+80,0xff0000 );
	gra.line( sx+160,sy+20,sx+100,sy+60,0xffff00 );

	{
		let colsPat=
		[
			[0xff0000,0xff0000,0xff0000,0x000000,0x000000],
			[0xff0000,0xff0000,0xff0000,0x000000,0x000000],
			[0x000000,0x000000,0xff0000,0xff0000,0xff0000],
			[0x000000,0x000000,0xff0000,0xff0000,0xff0000],
		];
		gra.paint( (sx+ex)/2, (sy+ey)/2, colsPat,[0xff0000,0xffff00] );
	}

}


// 引き伸ばして表示
{
    let cv=document.createElement('canvas');				// 新たに<canvas>タグを生成
    cv.width=640;
    cv.height=200;
	cv.getContext("2d").putImageData(gra,0,0);				// 作成したcanvasにImageDataをコピー
	{
		let sx = 0;
		let sy = 0;
		let sw = 640;
		let sh = 200;
		let dx = 0;
		let dy = 0;
		let dw = 640;
		let dh = 400;
		g_context.drawImage( cv,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる
	}
	
}
