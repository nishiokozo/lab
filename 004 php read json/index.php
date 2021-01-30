<?php
	echo "<h2>PHP でjson読み込み</h2><br>";

	$url="data.json";
	$json=file_get_contents($url);
	$tblChar=json_decode($json,true);
	
	$cntChar = count($tblChar);
	
	for ( $ch = 0 ; $ch < $cntChar ; $ch++ )
	{
		echo "---<br>";

		$cntElem = count($tblChar[$ch]);

		foreach( $tblChar[$ch] as $key => $val )
		{
			$cnt	=  count($val);
			if ( $cnt == 1 )
			{
				echo $key ." : " . $val . "<br>";
			}
			else
			{
				for ( $i = 0 ; $i < $cnt ; $i++ )
				{
					echo "data[" . $i . "] : " . $val[$i] . "<br>";
				}
			}
		}
	}

?>