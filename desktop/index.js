'use strict';

const shellExec = require('shell-exec');
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

		let image = new Image();
		image.onload = function ()
		{
			let width = 2 * Math.round(this.width / 2);
			let height = 2 * Math.round(this.height / 2);
			let command = `ffmpeg -framerate 30 ${getInputStringFromArray(files)} -c:v libx264 -pix_fmt yuv420p -vf 'pad=width=${width}:height=${height}:x=0:y=0:color=black' '${outputFileAndFolder}'`;
			//command = command.replace(/\\/g,"/");
			ffmpegCommand(`cd ${path}`);
			ffmpegCommand("echo " + command);
			ffmpegCommand(command);
		}
		image.src = files[0].path;
	}
}

function ffmpegCommand(command)
{
	//console.log(command);
	shellExec(command)
		.then(output =>
		{
			let stdout = output.stdout;
			if (output.code == 0)
			{
				console.log(output, stdout);
			}
			else
			{
				writeProgress({cmd: output.cmd, error: output.stderr});
			}
		})
		.catch(err =>
		{
			writeProgress({cmd: err.cmd, error: err.stderr});
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
		input += ` -i '${arr[i].path}'`;
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