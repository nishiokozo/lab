<?php
	echo "<body align='center'>";
	echo "<h2>SQL DBからPHPで読みだして表示</h2>";

	# DB 読みだし
	$db = new SQLite3('tst.db');
	$sql = "select * from  table1";
	$result = $db->query($sql); # SELECT はquery()

	while ($row = $result->fetchArray()) 
	{

	    echo 'id : ' . $row['id'] . "\n";
	    echo 'name : ' . $row['name'] . "\n";
		echo "<br>";
	}

	echo "</body>";

?>