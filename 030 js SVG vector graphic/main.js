let val = 1;
let col = 0;

let svg  = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
rect.setAttribute('width', '100%');
rect.setAttribute('height', '100%');
rect.setAttribute('fill', 'red');
svg.appendChild(rect);
	svg.appendChild(line);

document.body.appendChild(svg);

let myCircle = document.querySelector("#myCircle");
function animate() 
{
	requestAnimationFrame(() => 
	{
		rect.fill = `hsl(0, 100%, ${col}%)`;
		
		line.setAttribute('x1',0);
		line.setAttribute('y1',0);
		line.setAttribute('x2',100);
		line.setAttribute('y2',100);
		line.setAttribute('stroke','black');

		col += val;
		myCircle.style.fill = `hsl(0, 100%, ${col}%)`;
		let x = 70 * Math.cos( col*3.14/100*2 )+192;
		let y = 70 * Math.sin( col*3.14/100*2 )+128;
		myCircle.style.cx = `${x}`;
		myCircle.style.cy = `${y}`;
		myCircle.style.r = `${50}`;
		if (col >= 100 || col <=0 ) 
		{
			val = -val;
		}
		animate();
	});
}
animate();

window.onload = function(){
    //selectedStyleSheetSetメソッドを使って代替スタイルに変更する．
    document.selectedStyleSheetSet="sub";
};