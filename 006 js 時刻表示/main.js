"use strict";
//-----------------------------------------------------------------------------
function time()
//-----------------------------------------------------------------------------
{
    let date = new Date();
    document.getElementById("timearea1").innerHTML = date;

}
//-----------------------------------------------------------------------------
function makeTable2()
//-----------------------------------------------------------------------------
{
    let date = new Date();
	let table = html_addTable( "html_table" );
	{
		html_addCells( table, ["#"	, "new Date()"				, "表示結果"				]	,["#bbb","#bbb"] );
		let cnt = 1;
		html_addCells( table, [cnt++, "toString()"				, date.toString() 			]	,["#ddd"] );
		html_addCells( table, [cnt++, "toLocaleString()"		, date.toLocaleString() 	]	,["#ddd"] );
		html_addCells( table, [cnt++, "toUTCString()"			, date.toUTCString() 		]	,["#ddd"] );
		html_addCells( table, [cnt++, "toDateString()"			, date.toDateString()		]	,["#ddd"] );
		html_addCells( table, [cnt++, "toLocaleDateString()"	, date.toLocaleDateString() ]	,["#ddd"] );
		html_addCells( table, [cnt++, "toTimeString()"			, date.toTimeString() 		]	,["#ddd"] );
		html_addCells( table, [cnt++, "toLocaleTimeString()"	, date.toLocaleTimeString() ]	,["#ddd"] );
	}
}

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{ 
	makeTable2();
	time();
	setInterval('time()',1000);
};


