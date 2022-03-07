var g=html_canvas.getContext('2d');
var	prev_buttons=0;
var	now_buttons=0;
var	g_x;
var	g_y;
function onmousedown( e )
{
	now_buttons=e.buttons;
}
function onmousemove( e )
{
	now_buttons=e.buttons;
	g_x=e.offsetX;
	g_y=e.offsetY;
}
document.body.onmousedown = onmousedown;
document.body.onmousemove = onmousemove;

(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var start = 0;//window.mozAnimationStartTime;  // Firefoxのみ対応している関数です。 その他のブラウザでは Date.now() などの関数を使うことができます。
var prev_time;
function step(timestamp) 
{
	draw();
	window.requestAnimationFrame(step);
}

var g_cntDraw=0;
var g_flgLine=true;
const	MAX=1000;

var flgFirst=true;
var	tx=[MAX];
var	ty=[MAX];
var	to=[MAX];
var cnt = 0;
//-----------------------------------------------------------------------------
function on_flgLine()
//-----------------------------------------------------------------------------
{
	g_flgLine=!g_flgLine;
}
//-----------------------------------------------------------------------------
function onload()
//-----------------------------------------------------------------------------
{
		for ( var i = 0 ; i < 1000 ; i++ )
		{
//			tx[i] = Math.floor(Math.random()*320);
//			ty[i] = Math.floor(Math.random()*320);
			tx[i] = (Math.random()*320);
			ty[i] = (Math.random()*320);
		}

		redraw();

step(0);
//		setInterval('draw()',16.7); 

}
//-----------------------------------------------------------------------------
function redraw()
//-----------------------------------------------------------------------------
{

	if ( g_flgLine )	
	{
		for ( var i = 0 ; i < MAX ; i++ )
		{
			to[i]=i;
		}
		for ( var i = 0 ; i < MAX ; i++ )
		{
			ax=tx[i];
			ay=ty[i];
			m=99999;
			t=i;
			for ( var j = 0 ; j < MAX ; j++ )
			{
				bx=tx[j];
				by=ty[j];
//				if ( i!=j && to[j]!=i )
				if ( i!=j )
				{
					x=ax-bx;
					y=ay-by;
					l= Math.sqrt(x*x+y*y);
					if ( m>l ) 
					{
						m=l;
						t=j;
					}
				}
			}
			to[i]=t;
		}

		g.beginPath();
		g.clearRect(0,0,320,320);

		for ( var i = 0 ; i < MAX ; i++ )
		{
			x1 = tx[i];
			y1 = ty[i];
			x2 = tx[to[i]];
			y2 = ty[to[i]];
			g.moveTo(x1,y1);
			g.lineTo(x2,y2);
		}
		g.closePath();
		g.stroke();
	}
	else
	{
		g.beginPath();
		g.clearRect(0,0,320,320);

		for ( var i = 0 ; i < MAX ; i++ )
		{
			x1 = tx[i];
			y1 = ty[i];
			g.fillRect(x1,y1,1,1);
		}
		g.closePath();
		g.stroke();
	}
	

	g_cntDraw++;
}
var g_reqRedraw=false;
//-----------------------------------------------------------------------------
function draw()
//-----------------------------------------------------------------------------
{
	html_offsetX.textContent = g_x;
	html_offsetY.textContent = g_y;
	html_button.textContent = now_buttons;


	g.beginPath();


	if ( now_buttons==4 && prev_buttons!=4 ) 
	{
		g_flgLine=!g_flgLine;
		g_reqRedraw=true;
	}

	if ( now_buttons==1 )//&& prev_buttons!=1  )
	{
		g.fillRect(g_x, g_y, 1,1);

		{
			var nx=[MAX];
			var ny=[MAX];
			for ( var j = 0 ; j < MAX ; j++ )
			{
				nx[j]=0;
				ny[j]=0;
			}
			t=0;
			ax=g_x;
			ay=g_y;
			m=99999;
			for ( var j = 0 ; j < MAX ; j++ )
			{
				bx=tx[j];
				by=ty[j];
				{
					x=ax-bx;
					y=ay-by;
					l= Math.sqrt(x*x+y*y);



					if ( m>l ) 
					{
						m=l;
						t=j;
					}


						s = 20/(l*l);
						if (s>1) s=1;
						nx[j]=x*s;
						ny[j]=y*s;

				}
			}
			cnt=t;
			for ( var j = 0 ; j < MAX ; j++ )
			{
				tx[j]+=nx[j]*0.91;
				ty[j]+=ny[j]*0.91;
			}
		}
		


//		tx[cnt]=g_x;
//		ty[cnt]=g_y;

		cnt++;
		if ( cnt>=MAX ) cnt=0;
//		g_reqRedraw=true;

			redraw();
	}
	else
	if (g_reqRedraw )
	{
		g_reqRedraw=false
			redraw();
	}
		cnt++;

	g.closePath();
	g.stroke();
	prev_buttons=now_buttons;

}




