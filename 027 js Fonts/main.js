{
	var canvas = document.getElementById('sample');
	if (canvas.getContext) {
	var g = canvas.getContext('2d');
	g.fillStyle = "blue";
	g.font = "30px 'ＭＳ ゴシック'";
	g.textAlign = "left";
	g.textBaseline = "top";

	g.fillText("abcABCあいう漢字", 20, 75, 200);
}
