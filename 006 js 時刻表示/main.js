"use strict";
function time()
{
    let date = new Date();
    document.getElementById("timearea1").innerHTML = date;
/*
    document.getElementById("timearea2").innerHTML = date.toString();
    document.getElementById("timearea3").innerHTML = date.toLocaleString();
    document.getElementById("timearea4").innerHTML = date.toUTCString();
    document.getElementById("timearea5").innerHTML = date.toDateString();
    document.getElementById("timearea6").innerHTML = date.toLocaleDateString();
    document.getElementById("timearea7").innerHTML = date.toTimeString();
    document.getElementById("timearea8").innerHTML = date.toLocaleTimeString();
*/

//	let table = document.getElementById('targetTable');

//	table.rows[ 0 ].cells[ 0 ].firstChild.tbl = "XXX";

}
function makeTable()
{

	let tbl = new Array(8);
	for( let y = 0; y < tbl.length; y++) 
	{
		tbl[y] = new Array(2);
	}

	{
	    let date = new Date();
		let y = 0;
		tbl[y][0] ="new Date()"				;tbl[y++][1] = "表示結果";
		tbl[y][0] ="toString()"				;tbl[y++][1] = date.toString();
		tbl[y][0] ="toLocaleString()"		;tbl[y++][1] = date.toLocaleString();
		tbl[y][0] ="toUTCString()"			;tbl[y++][1] = date.toUTCString();
		tbl[y][0] ="toDateString()"			;tbl[y++][1] = date.toDateString();
		tbl[y][0] ="toLocaleDateString()"	;tbl[y++][1] = date.toLocaleDateString();
		tbl[y][0] ="toTimeString()"			;tbl[y++][1] = date.toTimeString();
		tbl[y][0] ="toLocaleTimeString()"	;tbl[y++][1] = date.toLocaleTimeString();
	}

	// 表の作成開始
	let rows=[];
	let table = document.createElement("table");

	// 表に2次元配列の要素を格納
	for( let i = 0; i < tbl.length; i++)
	{
		rows.push(table.insertRow(-1));  // 行の追加
		for( let j = 0; j < tbl[0].length; j++)
		{
			let cell=rows[i].insertCell(-1);
			cell.appendChild(document.createTextNode(tbl[i][j]));
			// 背景色の設定
			if(i==0)
			{
				cell.style.backgroundColor = "#bbb"; // ヘッダ行
			}
			else
			{
				cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
			}
		}
	}
	// 指定したdiv要素に表を加える
	document.getElementById("html_table").appendChild(table);
}

window.onload = function()
{ 
	makeTable();
	time();
	setInterval('time()',1000);
};


