'use strict';

const cp = require('child_process');
const path = require('path');

let theme;

document.addEventListener('DOMContentLoaded', function(event)
{
	startTheme();
	addButtonEvents();
});

function getInputString()
{
	let fileInput = document.getElementById("fileInput").files[0];
	let folderPath = fileInput.path;
	let fileName = document.getElementById("fileName").value;
	folderPath = folderPath.replace(fileInput.name, "");
	return `-i "${folderPath + fileName}"`;
}

function getOutputString()
{
	let folderPath = document.getElementById("fileInput").files[0].path;
	let fileName = document.getElementById("fileInput").files[0].name;
	let outputString = folderPath.replace(fileName, "");
	outputString = outputString + replaceEnding(fileName, ".mp4");
	return outputString;
}

function flacToMp3()
{
	//ffmpeg -i input.flac -id3v2_version 3 out.mp3
}

function imagesToGif()
{
	//'-lavfi palettegen=stats_mode=diff[pal],[0:v][pal]paletteuse=new=1:diff_mode=rectangle'
}

function HEVCToMp4()
{
	//ffmpeg -i input -c:v libx264 -crf 18 -vf format=yuv420p -c:a copy output.mkv
	// https://superuser.com/questions/1380946/how-do-i-convert-10-bit-h-265-videos-to-h-264-without-quality-loss
}

function imagesToVideo()
{
	let inputString = getInputString();
	let outputString = getOutputString();

	let image = new Image();
	image.onload = function ()
	{
		let width = 2 * Math.round(this.width / 2);
		let height = 2 * Math.round(this.height / 2);
		let framerate = 30;
		// can't do input like this.
		//let command = `ffmpeg -framerate ${framerate} ${getInputStringFromArray(files)} -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
		// ffmpeg.exe -r 30 -f concat -safe 0 -i images.txt -c:v libx264 -pix_fmt yuv420p -vf "pad=width=640:height=640:x=0:y=0:color=black" video.mp4
		// WORKING: let command = `ffmpeg -framerate ${framerate} -i "C:\\Users\\simon\\Pictures\\testData\\subfolder\\images %d.png" -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
		// WORKING: let command = `ffmpeg -framerate ${framerate} -i "C:/Users/simon/Pictures/testData/subfolder/images %d.png" -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
		let command = `ffmpeg -framerate ${framerate} ${inputString} -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputString}"`;
		console.log(command);
		ffmpeg(command);
	}
	image.src = document.getElementById("fileInput").files[0].path;
}

/*
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
		//console.log(outputFileAndFolder);

		let image = new Image();
		image.onload = function ()
		{
			let width = 2 * Math.round(this.width / 2);
			let height = 2 * Math.round(this.height / 2);
			let framerate = 30;
			// can't do input like this.
			//let command = `ffmpeg -framerate ${framerate} ${getInputStringFromArray(files)} -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
			// ffmpeg.exe -r 30 -f concat -safe 0 -i images.txt -c:v libx264 -pix_fmt yuv420p -vf "pad=width=640:height=640:x=0:y=0:color=black" video.mp4
			// WORKING: let command = `ffmpeg -framerate ${framerate} -i "C:\\Users\\simon\\Pictures\\testData\\subfolder\\images %d.png" -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
			// WORKING: let command = `ffmpeg -framerate ${framerate} -i "C:/Users/simon/Pictures/testData/subfolder/images %d.png" -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
			//let command = `ffmpeg -framerate ${framerate} ${filepathAndName} -c:v libx264 -pix_fmt yuv420p -vf "pad=width=${width}:height=${height}:x=0:y=0:color=black" -y "${outputFileAndFolder}"`;
			console.log(command);
			ffmpeg(command);
		}
		image.src = files[0].path;
	}
}
*/

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

/*
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

function getFiles()
{
	let inputElement = document.getElementById("fileInput");
	let files = inputElement.files;
	return files;
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
*/

function replaceEnding(string, newEnding)
{
	string = string.substring(0, string.lastIndexOf("."));
	return string + newEnding;
}

function replaceNumbers(filename)
{
	// removing all numbers, set %d at last position. Most likely case? 
	let noNumbers = filename.replace(new RegExp("[0-9]", "g"), "");
	noNumbers =
	[
		noNumbers.slice(0, noNumbers.lastIndexOf(".")),
		'%d',
		noNumbers.slice(noNumbers.lastIndexOf("."))
	].join('');
	return noNumbers;
}

function addButtonEvents()
{
	document.getElementById("fileInput").onchange = function ()
	{
		document.getElementById("fileName").value = replaceNumbers(this.files[0].name);
		
	}
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