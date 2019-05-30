'use strict';

const shellExec = require('shell-exec');
const cp = require('child_process');
let theme;

document.addEventListener('DOMContentLoaded', function(event)
{
	startTheme();
});

function getFiles()
{
	let inputElement = document.getElementById("fileInput");
	let files = inputElement.files;
	return files;
}

function flacToMp3()
{
	//ffmpeg -i input.flac -id3v2_version 3 out.mp3
}

function imagesToGif()
{
	//'-lavfi palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle'
}

function imagesToVideo()
{
	//ffmpeg -framerate 30 -i "..." -i "..." -c:v libx264 -pix_fmt yuv420p -vf "pad=width=640:height=640:x=0:y=0:color=black" output.mp4
	let files = filterFiles(getFiles(), "image");
	if (files.length == 0)
	{
		writeProgress({error: "no Files selected"});
		return;
	}
	else
	{
		let path = files[0].path;
		path = path.substr(0, path.lastIndexOf(files[0].name));

		let videoName = files[0].name;
		videoName = videoName.substr(0, videoName.lastIndexOf("."));
		videoName += ".mp4";
		let outputFileAndFolder = videoName;
		console.log(outputFileAndFolder);

		let image = new Image();
		image.onload = function ()
		{
			let width = 2 * Math.round(this.width / 2);
			let height = 2 * Math.round(this.height / 2);
			let framerate = 30;
			// can't do input like this.
			let command = `ffmpeg -framerate ${framerate} ${getInputStringFromArray(files)} -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
			console.log(command);
			ffmpeg(command);
		}
		image.src = files[0].path;
	}
}

function ffmpeg(command)
{
	//let shell = cp.exec(`ffmpeg -framerate 30 -i "C:\\Users\\simon\\Pictures\\testData\\images 0.png" -c:v libx264 -vf "format=yuv420p,pad=width=640:height=640:x=0:y=0:color=black" test.mp4`);
	let shell = cp.exec(command);
	shell.stdin.setEncoding('utf-8');

	shell.stdout.on('data', (data) =>
	{
		console.log(`stdout: ${data}`);
		//writeProgress({cmd: data});
	});
	shell.stderr.on('data', (data) =>
	{
		console.log(`stderr: ${data}`);
		//writeProgress({error: data});
	});
	shell.on('close', (code) =>
	{
		console.log(`child process exited with code ${code}`);
	});
}

function writeProgress(obj)
{
	let progressDiv = document.getElementById("progressDiv");
	let progress = document.createElement("progress");
	progress.id = "progress";
	progress.value = 0;
	progress.max = 100;

	if (obj.error)
	{
		progressDiv.classList.add("b_inv");
		progressDiv.classList.add("f_inv");
		progressDiv.innerHTML = "";
		if (obj.cmd)
		{
			progressDiv.innerHTML += obj.cmd;
		}
		progressDiv.innerHTML += "<br/>";
		if (obj.error)
		{
			progressDiv.innerHTML += obj.error;
		}
	}
	else
	{
		progressDiv.classList.remove("b_inv");
		progressDiv.classList.remove("f_inv");
		progressDiv.append(progress);
	}
}

function filterFiles(fileList, type)
{
	let filteredObjects = [];

	for (let i = 0; i < fileList.length; i++)
	{
		if (fileList[i].type.includes(type))
		{
			filteredObjects.push(fileList[i]);
		}
	}

	return filteredObjects;
}

function getInputStringFromArray(arr)
{
	let input = ``;

	for (let i = 0; i < arr.length; i++)
	{
		input += `-i "${arr[i].path}" `;
	}

	return input;
}

function startTheme()
{
	// set obsidian as default theme
	theme = new Theme(
		{
			background:"#22282a",
			f_high:"#f1f2f3",
			f_med:"#ec7600",
			f_low:"#93c763",
			f_inv:"#963a46",
			b_high:"#678cb1",
			b_med:"#4f6164",
			b_low:"#42464C",
			b_inv:"#ffcd22"
		});
	theme.install(document.getElementById("themedragArea"));
	theme.start();
}