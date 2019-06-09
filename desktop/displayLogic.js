'use strict';

document.addEventListener('DOMContentLoaded', function (event)
{
	setMenuBar();
	testProgressbar();
});

function testProgressbar()
{
	window.testProgress = 0;
	window.testProgressbar = window.setInterval(function()
	{
		setProgressbar(window.testProgress);
		window.testProgress ++;
		if (window.testProgress > 100)
		{
			window.testProgress = 0;
		}
	}, 100);
}

function setProgressbar(progress)
{
	let progressbar = document.getElementById("progressbar");
	
	let progressed = document.createElement("span");
	let progressHead = document.createElement("span");
	let unprogressed = document.createElement("span");

	progressed.className = "progressed";
	progressHead.className = "progressHead";
	unprogressed.className = "unprogressed";

	progressed.innerHTML = "-";
	progressHead.innerHTML = "-";
	unprogressed.innerHTML = "-";

	progressbar.innerHTML = "";
	for (let i = 0; i < 100; i++)
	{
		if (i < progress - 1)
		{
			progressbar.appendChild(progressed.cloneNode(true));
		}
		else if (i == progress - 1)
		{
			progressbar.appendChild(progressHead.cloneNode(true));
		}
		else
		{
			progressbar.appendChild(unprogressed.cloneNode(true));
		}
	}
}

function setMenuBar()
{
	let menuBar = document.getElementById("menuBar");
	menuBar.innerText = "";
	for (let i = 0; i < 97; i++)
	{
		menuBar.appendChild(getInvisibleSpace());
	}

	let minimize = document.createElement("span");
	minimize.innerText = "▼";

	let close = document.createElement("span");
	close.innerText = "■";

	menuBar.appendChild(minimize);
	menuBar.appendChild(getInvisibleSpace());
	menuBar.appendChild(close);
}

function getInvisibleSpace()
{
	let space = document.createElement("span");
	space.className = "invisibleSpace";
	space.innerText = "∙";

	return space;
}