<?php
echo "receive(get):";
$comment=$_GET["comment"];
echo $comment;

echo "receive(post):";
$comment=$_POST["comment"];
echo $comment;
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
	<input type = "text" name ="comment"><br/>
	<input type = "submit" value ="GET送信">
	</form>

	<h1>php POST テスト</h1>
	<form action = "index.php" method = "post">
	<input type = "text" name ="comment"><br/>
	<input type = "submit" value ="POST送信">
	</form>
</body>
</html>