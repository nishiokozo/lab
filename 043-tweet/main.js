'use strict';
function time()
{
    let date = new Date();
    document.getElementById("html_timearea").innerHTML = date;
	document.getElementById("html_title").innerHTML = date;

}
window.onload = function()
{ 
	time();
	setInterval('time()',1000);

};


