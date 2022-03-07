var g=html_canvas.getContext('2d');

//-----------------------------------------------------------------------------
var circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	{
		g.beginPath();
		g.arc(x, y, r, 0, Math.PI * 2, true);
		g.closePath();
		g.stroke();
	}
}
//-----------------------------------------------------------------------------
var draw = function( e )
//-----------------------------------------------------------------------------
{

	html_clientX.textContent = e.clientX;
	html_clientY.textContent = e.clientY;
	html_movementX.textContent = e.movementX;
	html_movementY.textContent = e.movementY;
	html_offsetX.textContent = e.offsetX;
	html_offsetY.textContent = e.offsetY;
	html_pageX.textContent = e.pageX;
	html_pageY.textContent = e.pageY;
	html_screenX.textContent = e.screenX;
	html_screenY.textContent = e.screenY;
	html_x.textContent = e.x;
	html_y.textContent = e.y;
	html_button.textContent = 
   ":"
    + " ALT:" + e.altKey
    + " CTR:" + e.ctrlKey 
    + " SHIFT:" + e.shiftKey  
    + " button :" + e.button   
    + " buttons :" + e.buttons   
    ;
	if ( e.buttons==1 )
	{
		circle( e.offsetX, e.offsetY,8);
	}


}


// イベントリスナー
document.onmousedown = draw;
document.onmousemove = draw;
//document.body.addEventListener( "click", func_click ) ;
//document.body.addEventListener( "mousemove", draw ) ;


