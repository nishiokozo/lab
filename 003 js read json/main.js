let xhr = new XMLHttpRequest();
xhr.open('GET', "data.json");

xhr.onload = () => 
{
	let json = JSON.parse(xhr.response);

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
}
xhr.send();
