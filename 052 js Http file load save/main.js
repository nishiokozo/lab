'use strict';

let g_text="(none)";
//------------------------------------------------------------------------------
function html_load()
//------------------------------------------------------------------------------
{
	
	let xhr = new XMLHttpRequest();
	xhr.open('GET', "sample.txt");

	xhr.onload = () => 
	{
		g_text = xhr.response;
		document.getElementById( "html_xmin" ).value = g_text;
	}
	xhr.send();
}
//------------------------------------------------------------------------------
function html_save()
//------------------------------------------------------------------------------
{
	let blob = new Blob([g_text], {type: 'text/plain'});
	{
		let a = document.createElement("a");
		a.href = URL.createObjectURL( blob );
		a.download = 'out.txt';
		a.click();
		URL.revokeObjectURL(a.href); 
	}
}

