<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="UTF-8">
		<title>editor</title>
	</head>

	<body style="overflow:hidden;" >
		<div align="center" >
			<h1><font color="#cccccc">yukizone editor</font></h1>
		</div>

<!--

		// 点線
		<div style="padding: 10px; margin-bottom: 10px; border: 1px dotted #333333;">

		// 破線
		<div style="padding: 10px; margin-bottom: 10px; border: 1px dashed #333333;">

		// 二重線
		<div style="padding: 10px; margin-bottom: 10px; border: 3px double #333333;">

		// 丸角
		<div style="padding: 10px; margin-bottom: 10px; border: 1px solid #333333; border-radius: 10px;">

		// 中塗
		<div style="padding: 10px; margin-bottom: 10px; border: 1px solid #333333; background-color: #ffff99;">


-->
						<?php
							$comment=$_POST["comment"];
							if ( $comment )
							{
								// 保存
							    $file = new SplFileObject('memo.txt', 'cb+');
						        $file->ftruncate(0);
						        $file->fwrite($_POST['comment']);
							}
						?>
		<div align="center" >
			<form action="<?=basename($_SERVER['SCRIPT_NAME'])?>" method="post">
				<textarea name="comment" cols="80" rows="25" style="padding: 10px; margin-bottom: 10px; border: 1px dashed #333333;" >
							<?php
								// memo.txtの中身を表示
								$filename = 'memo.txt';
								$fp = fopen($filename, 'r');
								while (!feof($fp)) 
								{
									$txt = fgets($fp);
									echo $txt;
								}
								fclose($fp);
							?>
				</textarea>

				<p><input type="submit" value="保存"></p>
			</form>

		</div>
	</body>
</html>

