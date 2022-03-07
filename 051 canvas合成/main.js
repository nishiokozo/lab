//-----------------------------------------------------------------------------
function update_scene(time)
//-----------------------------------------------------------------------------
{
	let y = 50*Math.cos(time/300);

	// キャンバス２
	{
		const ctx = html_canvas2.getContext("2d");
		ctx.clearRect(0, 0, html_canvas2.width, html_canvas2.height);
		ctx.font = "40px monospace";
		ctx.fillStyle = "#00F";
		ctx.fillText("画面２", 75, 120+y);
	}

	// 合成
	{
		const ctx = html_canvas3.getContext("2d");
		ctx.clearRect(0, 0, html_canvas3.width, html_canvas3.height);
		ctx.drawImage(html_canvas1, 0, 0, html_canvas3.width, html_canvas3.height);
		ctx.drawImage(html_canvas2, 0, 0, html_canvas3.width, html_canvas3.height);
	}

	requestAnimationFrame( update_scene );

}
//-----------------------------------------------------------------------------
window.onload = function(e)
//-----------------------------------------------------------------------------
{
	// キャンバス１
	{
		const ctx = html_canvas1.getContext("2d");
		ctx.fillStyle = "#0F0";
		ctx.fillRect( 40, 40, 120,120 );
	}
	update_scene(); 	

}

