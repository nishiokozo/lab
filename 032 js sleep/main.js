const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

async function main()
{
	document.getElementById("message").innerHTML = "2秒スリープ";
	await sleep(2000);
	document.getElementById("message").innerHTML = "起きた";
}

main();
