'use strict';
function time()
{
    let date = new Date();
    document.getElementById("html_timearea").innerHTML = date;

}
window.onload = function()
{ 
	time();
	setInterval('time()',1000);

};


