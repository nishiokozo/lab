'use strict';
function makeTable( tbl )
{

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
	document.getElementById("table").appendChild(table);
}

window.onload = function()
{ 
	// 配列作成
	let data = [];
	data.push( ["new Date()"			,"表示結果"] );
	data.push( ["toString()"			,"tbl,toString()"] );
	data.push( ["toLocaleString()"		,"tbl,toLocaleString()"] );
	data.push( ["toUTCString()"			,"tbl,toUTCString()"] );
	data.push( ["toDateString()"		,"tbl,toDateString()"] );
	data.push( ["toLocaleDateString()"	,"tbl,toLocaleDateString()"] );
	data.push( ["toTimeString()"		,"tbl,toTimeString()"] );
	data.push( ["toLocaleTimeString()"	,"tbl,toLocaleTimeString()"] );

	makeTable( data );
};


