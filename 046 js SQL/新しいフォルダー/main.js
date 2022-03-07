"use strict";
//------------------------------------------------------------------------------
function html_click()
//------------------------------------------------------------------------------
{


	let a =				document.getElementById("html_sql").innerHTML;
	console.log(a);
	
	let sql;// = "select * from table1;";

sql = a;
	// データベースアクセス要求と返答待ち。
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "sql.php?sql="+sql, true);
		xhr.responseType = "json";
		xhr.addEventListener("load",
			function(e) 
			{
				var data = xhr.response;
				if ( data != null )
				{

					document.getElementById("html_result").innerHTML = data.ans1;
					document.getElementById("html_result").innerHTML += ",";
					document.getElementById("html_result").innerHTML += data.ans2;
				}

				{
					let json = JSON.parse(xhr.response);
//					let json = xhr.response;
console.log("--");
console.log(json);
//					for ( let j of json )
					{
//						console.log( j );
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