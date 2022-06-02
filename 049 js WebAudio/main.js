"use strict";



//-----------------------------------------------------------------------------
function html_onclick()
//-----------------------------------------------------------------------------
{
	play_coin(g_analyser, audioCtx.currentTime);

}
//-----------------------------------------------------------------------------
function play_coin(destination, playbackTime) 
//-----------------------------------------------------------------------------
{
	//-----------------------------------------------------------------------------
	function midi2freq(midi) 
	//-----------------------------------------------------------------------------
	{
		return 440 * Math.pow(2, (midi - 69) / 12);
		//MIDIノート番号が +12 で 1オクターブ 上がる（周波数が 2倍 になる）
		//MIDIノート番号が -12 で 1オクターブ 下がる（周波数が 1/2倍 になる）
		//69 が 「ラ」の 440Hz
	}

	//-----------------------------------------------------------------------------
	function duration(tempo, length) 
	//-----------------------------------------------------------------------------
	{
		return (60 / tempo) * (4 / length);

		//テンポ120 のとき 四分音符 は 0.5秒 である
		//テンポが 2倍 になると 長さは 1/2倍 になる
		//八分音符 は 四分音符 の 1/2倍 の長さ 0.25秒 である
		//二分音符 は 四分音符 の 2倍 の長さ 1.0秒 である

		// テンポ180 16分音符
	}

	let t0 = playbackTime;
	let t1 = t0 + duration(180, 16);
	let t2 = t0 + duration(180, 4) * 3;
	let si = midi2freq(83);	//440 × 2^((83 - 69) ÷ 12) = 987.766602512
	let mi = midi2freq(88); //440 × 2^((88 - 69) ÷ 12) = 1318.51022765
	let audioContext = destination.context;

	let oscillator = audioContext.createOscillator();
	let gain = audioContext.createGain();

	oscillator.type = "sawtooth";
	oscillator.type = "triangle";
	oscillator.type = "sine";
	oscillator.type = "square";
	oscillator.frequency.setValueAtTime(si, t0);
	oscillator.frequency.setValueAtTime(mi, t1);
	oscillator.start(t0);
	oscillator.stop(t2);
	oscillator.connect(gain);

	gain.gain.setValueAtTime(0.5, t0);
	gain.gain.setValueAtTime(0.5, t1);
	gain.gain.linearRampToValueAtTime(0, t2);
	gain.connect(destination);
}
//-----------------------------------------------------------------------------
function drawSound(analyser) 
//-----------------------------------------------------------------------------
{
	analyser.fftSize = 256;

	let canvas = document.getElementById("canvas");

	canvas.width = 360;
	canvas.height = 240;

	let uint8 = new Uint8Array(analyser.fftSize);
	let context = canvas.getContext("2d");
	let width = context.canvas.width;
	let height = context.canvas.height;

	context.strokeStyle = "#1abc9c";
	context.fillStyle = "rgba(0, 0, 0, 0.8)";

	//-----------------------------------------------------------------------------
	function loop() 
	//-----------------------------------------------------------------------------
	{  
		//-----------------------------------------------------------------------------
		function linlin(value, inMin, inMax, outMin, outMax) 
		//-----------------------------------------------------------------------------
		{
			return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
		}

		analyser.getByteTimeDomainData(uint8);

		context.fillRect(0, 0, width, height);
		context.beginPath();

		for (let i = 0, imax = analyser.fftSize; i < imax; i++) 
		{
			let x = linlin(i, 0, imax, 0, width);
			let y = linlin(uint8[i], 0, 255, height, 0);

			context.lineTo(x, y);
		}
		context.stroke();

		requestAnimationFrame(loop);
	}

	loop();
}

//let AudioContext;
//let audioCtx;

let	AudioContext = window.AudioContext || window.webkitAudioContext;
let	audioCtx = new AudioContext();
let g_analyser;


//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_analyser = audioCtx.createAnalyser();
	g_analyser.connect(audioCtx.destination);

html_onclick();
	drawSound(g_analyser);

}
