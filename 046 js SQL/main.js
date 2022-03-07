"use strict";
//------------------------------------------------------------------------------
function html_click()
//------------------------------------------------------------------------------
{


	let a =				document.getElementById("html_sql").value;
	console.log(a);
	
	let sql;// = "select * from table1;";

sql = a;
	// データベースアクセス要求と返答待ち。
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "sql.php?sql="+sql, true);
		xhr.addEventListener("load",
			function(e) 
			{
				let data = JSON.parse(xhr.response);
				if ( data != null )
				{
console.log("--");
console.log(data);
					document.getElementById("html_result").innerHTML = "";
					for ( let j of data )
					{
						console.log( j );
					document.getElementById("html_result").innerHTML += j.ans1;
					document.getElementById("html_result").innerHTML += ",";
					document.getElementById("html_result").innerHTML += j.ans2;
					document.getElementById("html_result").innerHTML += "\n";
					}
/*
					console.log("json len     :" + json.length);

					for ( let i = 0 ; i < json.length ; i++ )
					{
						console.log("NAME     :" + json[i].NAME);
						console.log("RACE     :" + json[i].RACE);
						console.log("CLASS    :" + json[i].CLASS);
						console.log("STRENGTH :" + json[i].STRENGTH);
						console.log("IQ       :" + json[i].IQ);
						console.log("PIETY    :" + json[i].PIETY);
						console.log("VITALITY :" + json[i].VITALITY);
						console.log("AGILITY  :" + json[i].AGILITY);
						console.log("LUCK     :" + json[i].LUCK);
						for ( let j = 0 ; j< json[i].data.length ; j++ )
						{
							console.log("data["+j+"]:"+json[i].data[j]);
						}
					}
*/
				}

				// レンダリング開始
//				requestAnimationFrame( update_start );
			}
		);
		xhr.send();
	}


	// 最初のupdateをから回しすることでその他の情報が更新が遅れるのを防ぐ。


}
window.onload = function( e )
{
}