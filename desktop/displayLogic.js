'use strict';

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
testProgressbar();

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