<!DOCTYPE html>
<html lang="ja">
	<head>
	    <meta charset="utf-8">
	</head>
	<body  >
	    <h1>js 現在の時刻表示</h1>
	    <h1 id="timearea1"></h1>
	    <h1 id="timearea3"></h1>
	    <script>
		    time();
		    function time()
		    {

		        var date = new Date();
		        document.getElementById("timearea1").innerHTML = date;
		        document.getElementById("timearea3").innerHTML = date.toLocaleString()
		    }
		    setInterval('time()',1000);

	    </script>

	</body>
</html>