let canvas = document.getElementById('html_canvas');
gl = canvas.getContext('experimental-webgl');

let vertices = [ -1,-1,-1, 1,-1,-1, 1, 1,-1 ];
let colors = [ 1,0.5,0.2, 0.5,0.2,1, 0.2,1,0.5 ];
let indices = [ 0,1,2 ];

let bufVertex = gl.createBuffer ();
gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

let bufColor = gl.createBuffer ();
gl.bindBuffer(gl.ARRAY_BUFFER, bufColor);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

let bufIndex = gl.createBuffer ();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufIndex);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

/*==========================Shaders=========================*/

let vs = 'attribute vec3 pos;'
	+'uniform mat4 P;'
	+'uniform mat4 V;'
	+'uniform mat4 M;'
	+'attribute vec3 col;'
	+'varying vec3 vColor;'
	+'void main(void)'
	+'{'
	+   'gl_Position = P*V*M*vec4(pos, 1.);'
	+   'vColor = col;'
	+'}';

let fs =
	  'precision mediump float;'
	+'varying vec3 vColor;'
	+'void main(void)'
	+'{'
	+	'gl_FragColor = vec4(vColor, 1.);'
	+'}';

let bin_vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(bin_vs, vs);
gl.compileShader(bin_vs);
	
let bin_fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(bin_fs, fs);
gl.compileShader(bin_fs);

let shader = gl.createProgram();
gl.attachShader(shader, bin_vs);
gl.attachShader(shader, bin_fs);
gl.linkProgram(shader);

let matP = gl.getUniformLocation(shader, "P");
let matV = gl.getUniformLocation(shader, "V");
let matM = gl.getUniformLocation(shader, "M");
gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex);
	
let position = gl.getAttribLocation(shader, "pos");
gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ;
gl.enableVertexAttribArray(position);
gl.bindBuffer(gl.ARRAY_BUFFER, bufColor);
	
let color = gl.getAttribLocation(shader, "col");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;
gl.enableVertexAttribArray(color);
gl.useProgram(shader);

//---------------------------------------------------------------------
function get_projection(angle, a, zMin, zMax) 
//---------------------------------------------------------------------
{
	let ang = Math.tan((angle*.5)*Math.PI/180);
	return [
	   0.5/ang, 0 , 0, 0,
	   0, 0.5*a/ang, 0, 0,
	   0, 0, -(zMax+zMin)/(zMax-zMin), -1,
	   0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
	];
}

//---------------------------------------------------------------------
function rotateZ(m, angle) 
//---------------------------------------------------------------------
{
	let c = Math.cos(angle);
	let s = Math.sin(angle);
	let mv0 = m[0];
	let mv4 = m[4];
	let mv8 = m[8]; 
		
	m[0] = c*m[0]-s*m[1];
	m[4] = c*m[4]-s*m[5];
	m[8] = c*m[8]-s*m[9];
	m[1] = c*m[1]+s*mv0;
	m[5] = c*m[5]+s*mv4;
	m[9] = c*m[9]+s*mv8;
}

let time_old = 0;
let grot = 0;
//---------------------------------------------------------------------
function	update(time)
//---------------------------------------------------------------------
{
	let matProj = get_projection(40, canvas.width/canvas.height, 1, 100);
	let matView = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	let matModel = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

	matView[14] = matView[14]-6;

	let dt = time-time_old;
	grot += dt;
	rotateZ(matModel, grot*0.002);
	time_old = time;
		
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clearColor(0.5, 0.5, 0.5, 0.9);
	gl.clearDepth(1.0);
	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(matP, false, matProj);
	gl.uniformMatrix4fv(matV, false, matView);
	gl.uniformMatrix4fv(matM, false, matModel);
		
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufIndex);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);


	window.requestAnimationFrame(update);

	html_fps.textContent = Math.floor(dt,2);	// fps表示
}

update(0);

