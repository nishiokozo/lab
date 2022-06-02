'use strict';
function time()
{
    let text = (new Date()).toLocaleTimeString()
    let text_a = text+"\nだよ";
    let text_b = text+"<br>だよ";

    document.getElementById("html_1").innerHTML		= text_a;
    document.getElementById("html_2").innerText		= text_a;
    document.getElementById("html_3").textContent	= text_a;
    document.getElementById("html_4").value			= text_a;

    document.getElementById("html_5").innerHTML		= text_a;
    document.getElementById("html_6").innerText		= text_a;
    document.getElementById("html_7").textContent	= text_a;
    document.getElementById("html_8").value			= text_a;

    document.getElementById("html_9").innerHTML		= text_a;
    document.getElementById("html_10").innerText	= text_a;
    document.getElementById("html_11").textContent	= text_a;
    document.getElementById("html_12").value		= text_a;

    document.getElementById("html_5b").innerHTML	= text_b;
    document.getElementById("html_6b").innerText	= text_b;
    document.getElementById("html_7b").textContent	= text_b;
    document.getElementById("html_8b").value		= text_b;

    document.getElementById("html_5b").innerHTML	= text_b;
    document.getElementById("html_6b").innerText	= text_b;
    document.getElementById("html_7b").textContent	= text_b;
    document.getElementById("html_8b").value		= text_b;

    document.getElementById("html_9b").innerHTML	= text_b;
    document.getElementById("html_10b").innerText	= text_b;
    document.getElementById("html_11b").textContent	= text_b;
    document.getElementById("html_12b").value		= text_b;
}
window.onload = function()
{ 
	time();
	setInterval('time()',1000);

};


