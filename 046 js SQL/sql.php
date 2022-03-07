<?php
	# SQL-DBから読みだしたものをjsonで出力する

	$sql=$_GET['sql'];

#$sql = "select * from table1;";

	$db = new SQLite3('tst.db');

	$result = $db->query($sql); # SELECT はquery()


	while ($row = $result->fetchArray()) 
	{
		$array[] = array(
			 "ans1" => $row['id']
			,"ans2" => $row['name']
		);


	}

	header("Content-Type: text/javascript; charset=utf-8");
	echo json_encode($array);

?>
