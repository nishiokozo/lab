<html>
<head><title>PHP TEST</title></head>
<body>

<?php

	# DB 読みだし
	$db = new SQLite3('tst.db');
	$sql = "select * from  table1";
	$result = $db->query($sql); # SELECT はquery()
	while ($row = $result->fetchArray()) 
	{
	    echo 'column1 : ' . $row['id'] . "\n";
	    echo 'column2 : ' . $row['name'] . "\n";
	}
?>
</body>
</html>