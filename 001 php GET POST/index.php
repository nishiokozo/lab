<?php
	echo "receive(get):";
	$param=isset( $_GET["param"] )?$_GET["param"]:"";
	echo $param;

    echo "<br>";

	echo "receive(post):";
	$param=isset( $_POST["param"] )?$_POST["param"]:"";
	echo $param;

	echo "<br>";
	echo "--";
	echo "<br>";
?>

<!DOCTYPE html>
<html lang = "ja">
	<head>
		<meta charset="UTF-8">
		<title>test</title>
	</head>
	<body>
		<h1>php GET テスト</h1>
		<form action = "index.php" method = "get">
			param:<input type = "text" name ="param">
			<input type = "submit" value ="GET送信">
		(urlにコマンドを付けて送信 2000文字くらいまで。ブラウザによって違う)
		</form>
		
		<br>

		<h1>php POST テスト</h1>
		<form action = "index.php" method = "post">
			param:<input type = "text" name ="param">
			<input type = "submit" value ="POST送信">
		</form>
	</body>
</html>