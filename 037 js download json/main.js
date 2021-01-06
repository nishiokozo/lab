'use strict';
let g_out ="abcd";

function test1()
{
	let write_json=JSON.stringify(g_out);
	let blob=new Blob([write_json], {type: 'application/json'});
	let a=document.createElement("a");
	a.href=URL.createObjectURL(blob);
	document.body.appendChild(a); // Firefoxで必要
	a.download='out.json';
	a.click();
	document.body.removeChild(a); // Firefoxで必要
	URL.revokeObjectURL(a.href); 
}

