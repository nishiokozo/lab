const btn_open  = document.querySelector("#html_btn-open");
const btn_close = document.querySelector("#html_btn_close");
const obj_picture = document.querySelector("#html_picture"); 

//-----------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------
{

	btn_open.addEventListener("click", fullscreen_open );
	btn_close.addEventListener("click", fullscreen_close );

	function callback()
	{
		function get_obj()
		{
			const obj = 
				   document.fullscreenElement 
				|| document.mozFullScreenElement 
				|| document.webkitFullscreenElement 
				|| document.msFullscreenElement
			;
			return obj;
		}
		
		// ボタンの入れ替え
		if( get_obj() )
		{
			btn_open.style.display  = "none";
			btn_close.style.display = "block";
		}
		else
		{
			btn_close.style.display = "none";
			btn_open.style.display  = "block";
		}
	}
	document.addEventListener("fullscreenchange", callback, false);
	document.addEventListener("webkitfullscreenchange", callback, false);
	document.addEventListener("mozfullscreenchange", callback, false);
	document.addEventListener("MSFullscreenChange", callback, false);
};


//-----------------------------------------------------------------
function fullscreen_open()
//-----------------------------------------------------------------
{
	function is_active()
	{
		return(
			   document.fullscreenEnabled 
			|| document.mozFullScreenEnabled 
			|| document.documentElement.webkitRequestFullScreen 
			|| document.msFullscreenEnabled
		);
	}

	if( is_active() )
	{
		let hdl = 
			   obj_picture.requestFullscreen 
			|| obj_picture.mozRequestFullScreen 
			|| obj_picture.webkitRequestFullScreen 
			|| obj_picture.msRequestFullscreen
		;
		hdl.call(obj_picture);
	}
	else
	{
		alert("フルスクリーンに対応していません");
	}
}

//-----------------------------------------------------------------
function fullscreen_close()
//-----------------------------------------------------------------
{
	const hdl = 
		   document.exitFullscreen 
		|| document.mozCancelFullScreen 
		|| document.webkitExitFullscreen 
		|| document.msExitFullscreen
	;
	hdl.call(document);
}
