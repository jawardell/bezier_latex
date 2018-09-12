window.onload = function() {


	var canvas = document.getElementById("thecanvas");
	var context = canvas.getContext("2d");
	canvas.addEventListener("mousedown", handleClick);

	var goButton = document.getElementById("go");
	var clearButton = document.getElementById("clear");

	const endPointLimit = 2;
	const ctlPointLimit = 2;

	var endPointsRemaining = endPointLimit;
	var controlPointsRemaining = ctlPointLimit;
	
	var inControlMode = null;
	var trolling = false;
	
	var ctrlPoints = [];
	var endPoints = [];

	function setPixel(x, y) {
		var clickNumber = inControlMode ?  ctlPointLimit - controlPointsRemaining : endPointLimit - endPointsRemaining;
		context.fillRect(x, y, 4, 4);
		context.fillText("("+ event.clientX +", " + event.clientY +")", event.clientX, event.clientY);
		context.fillText("p"+clickNumber, event.clientX, event.clientY + 10);
	}
	
	function updateColors(id) {
		switch (id) {
			case "control" : 
				document.getElementById('control').style.backgroundColor = "#ff0000";
				document.getElementById('custom').style.backgroundColor = "#e7e7e7";
				document.getElementById('endpoints').style.backgroundColor = "#e7e7e7";
			break; 
			case "custom" : 
				document.getElementById('control').style.backgroundColor = "#e7e7e7";
				document.getElementById('custom').style.backgroundColor = "#ff0000";
				document.getElementById('endpoints').style.backgroundColor = "#e7e7e7";
			break;
			case "endpoints" : 
				document.getElementById('control').style.backgroundColor = "#e7e7e7";
				document.getElementById('custom').style.backgroundColor = "#e7e7e7";
				document.getElementById('endpoints').style.backgroundColor = "#ff0000";
			break;
			default: 
				document.getElementById('control').style.backgroundColor = "#e7e7e7";
				document.getElementById('custom').style.backgroundColor = "#e7e7e7";
				document.getElementById('endpoints').style.backgroundColor = "#e7e7e7";
			
		}
		
	}
	
	document.getElementById('control').addEventListener('click', function () {
		if(trolling) {
			document.getElementById('msg').innerHTML = "clear current drawing";
			return;
		} 
		updateColors("control");
		document.getElementById('msg').innerHTML = "";
		if((inControlMode == null) || (endPointsRemaining == endPointLimit)) {
			document.getElementById('msg').innerHTML = "must select endpoints first";
			return;
		}
		if((endPointsRemaining > 0) && (endPointsRemaining < endPointLimit)) {
			document.getElementById('msg').innerHTML = "must select two endpoints";
			return;
		}
		inControlMode = true;
		context.fillStyle = 'red';
		
	});

	
	document.getElementById('custom').addEventListener('click', function() {
		if(trolling) {
			document.getElementById('msg2').innerHTML = "clear current drawing";
			return;
		} 
		document.getElementById('msg2').innerHTML = "";
		updateColors("custom");
		var form = document.getElementById('coords');
		if(form.style.display === "none") {
			form.style.display = "block";
		} else {
			form.style.display = "none";
		}
		
	}, false);


	document.getElementById('endpoints').addEventListener('click', function() {
		if(trolling) {
			document.getElementById('msg').innerHTML = "clear current drawing";
			return;
		} 
		updateColors("endpoints");
		document.getElementById('msg').innerHTML = "";
		inControlMode = false;
		context.fillStyle = 'orange';
		
	});
	
	function handleClick(event) {
		if(inControlMode == null) {
			return;
		}
		if(inControlMode && (controlPointsRemaining != 0)) {
			setPixel(event.clientX, event.clientY);
			ctrlPoints[ctlPointLimit - controlPointsRemaining] = {x: event.clientX, y:event.clientY};
			controlPointsRemaining--;
		} else if(!inControlMode && (endPointsRemaining != 0)) {
			setPixel(event.clientX, event.clientY);
			endPoints[endPointLimit - endPointsRemaining] = { x: event.clientX, y:event.clientY };
			endPointsRemaining--;
		}
		if(inControlMode && (ctrlPoints.length == ctlPointLimit)) {
			document.getElementById('msg').innerHTML = "";
		}
	}


	document.getElementById('clear').addEventListener('click', function() {
		var form = document.getElementById('coords');
		context.clearRect(0, 0, canvas.width, canvas.height);
		endPointsRemaining = endPointLimit;
		controlPointsRemaining = ctlPointLimit;
		inControlMode = null;
		document.getElementById('msg').innerHTML = "";
		form.style.display = "none";
		updateColors("clear");
		trolling = false;
		document.getElementById('msg2').innerHTML = "";
		endPoints = [];
		ctrlPoints = [];

    		var elements = form.getElementsByTagName("input");
    
		for (var i = 0; i < elements.length; i++) {
			elements[i].value = "";
		}
	}, false);

	document.getElementById('go').addEventListener('click', function() {
		if(trolling) {
			return;
		}
		if((ctrlPoints.length != ctlPointLimit) && (endPoints.length != endPointLimit)) {
			document.getElementById('msg').innerHTML = "choose 2 end points and 2 control points";
			return;
		}
		if(ctrlPoints.length != ctlPointLimit) {
			document.getElementById('msg').innerHTML = "must select two control points";
			return;
		}
		document.getElementById('msg2').innerHTML = "";
		updateColors("go");
		var notInitialized = (endPoints == null) 
					 || (ctrlPoints == null)  
					 || (ctrlPoints.length != ctlPointLimit)
					 || (endPoints.length != endPointLimit)
					 || (inControlMode == null)
					 || trolling;

		if(notInitialized) {
			var err;
			if(ctrlPoints == null) err = 0.1;
			if(endPoints == null) err = 0.2;
			if(ctrlPoints.length != ctlPointLimit) err = 1;
			if(endPoints.length != endPointLimit) err = 2;
			if(inControlMode == null) err = 3;
			if(trolling) err = 4;
			console.log("not initialized err:" + err);
			return;
		}
		
		context.beginPath();
		context.moveTo(endPoints[0].x, endPoints[1].y);
		context.bezierCurveTo(ctrlPoints[0].x, ctrlPoints[0].y,
					ctrlPoints[1].x, ctrlPoints[1].y, 
					endPoints[1].x, endPoints[1].y);
		context.closePath();
		context.lineWidth = 3;
		context.strokeStyle = 'black';
		context.stroke();
		trolling = true;
	});
}
