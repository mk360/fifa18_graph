var svgNS = "http://www.w3.org/2000/svg";
var svg = document.querySelector("svg");

function createSVGPoint(x, y, attribute) {
	let pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	return pt;
}

function getDeepValue(circleCoord) {
  return circleCoord.baseVal.value;
}

function getAxisCoeff(start, end) {
	if (getDeepValue(end.cx) === getDeepValue(start.cx)) return 0;
	return (getDeepValue(end.cy) - getDeepValue(start.cy)) / (getDeepValue(end.cx) - getDeepValue(start.cx));
}

function getB(a) {
	return 100 - 100 * a;
}

function solveX(y, a, b) {
	return (y - b) / a;
}

function generatePoint(x, y, attribute) {
	let pt = createSVGPoint(x, y, attribute);
	return generateCircle(Math.round(pt.x), Math.round(pt.y), 0, "black", "black", attribute);
}

function createAxis(endpoint) {
	let line = document.createElementNS(svgNS, "line");
	line.setAttributeNS(null, "x1", 100);
	line.setAttributeNS(null, "y1", 100);
	line.setAttributeNS(null, "x2", getDeepValue(endpoint.cx));
	line.setAttributeNS(null, "y2", getDeepValue(endpoint.cy));
	line.setAttributeNS(null, "stroke-width", "0.2px");
	line.setAttributeNS(null, "stroke", "rgb(109, 107, 118)");
	return line;
}

function generateCircle(cx, cy, r, fill, stroke, attribute) {
	let circle = document.createElementNS(svgNS, "circle");
	circle.setAttributeNS(null, "cx", cx);
	circle.setAttributeNS(null, "cy", cy);
	circle.setAttributeNS(null, "r", r);
	circle.setAttributeNS(null, "fill", fill);
	circle.setAttributeNS(null, "stroke", stroke);

	if (["Shooting", "Physical", "Pace", "Defending", "Passing", "Dribbling"].indexOf(attribute) !== -1) {
		let text = document.createElementNS(svgNS, "text");
		text.textContent = attribute;
		text.setAttributeNS(null, "x", placeAttributeText(attribute).x);
		text.setAttributeNS(null, "y", placeAttributeText(attribute).y);
		text.setAttributeNS(null, "font-size", "12px");
		svg.appendChild(text);
	}
	let axis = createAxis(circle);
	svg.appendChild(axis);
	svg.appendChild(circle);
	return circle;
}

var center = generateCircle(100, 100, 1, "black", "black");
var Pace = generatePoint(75, 57, "Pace"); // Pace
var Shooting = generatePoint(125, 57, "Shooting"); // Shooting
var Passing = generatePoint(150, 100, "Passing"); // Passing
var Dribbling = generatePoint(125, 143, "Dribbling"); // Dribbling
var Defending = generatePoint(75, 143, "Defending"); // Defending
var Physical = generatePoint(50, 100, "Physical"); // Physical

var globalCircle = generateCircle(100, 100, 50, "rgb(112, 111, 119)", "");
globalCircle.setAttributeNS(null, "opacity", "0.7");

function showResults(stats) {
	if (svg.getElementById("removeable")) {
		svg.removeChild(svg.getElementById("removeable"));
	}
	for (stat in stats) {
		spawnPoint(stat, stats[stat]);
	}	
	renderGraph();
}

function spawnPoint(stat, value) {
	let playerStat = value;
	let dynamicX, dynamicY, b;
	let extremityCircle = window[stat];
	let coeff = getAxisCoeff(center, extremityCircle);
	obj[stat] = value;
	switch (stat) {
		case "Physical" :
		dynamicX = 100 - (50 * playerStat / 99);
		dynamicY = 100;
		break;
		case "Passing" :
		dynamicX = 100 + (50 * playerStat / 99);
		dynamicY = 100;
		break;
		default :
		switch (stat) {
			case "Defending" :
      		case "Dribbling" :
      			dynamicY = 100 + (43 * playerStat / 99);
      		break;
      		case "Shooting" :
      		case "Pace": 
      			dynamicY = 100 - (43 * playerStat / 99);
      		break;
      	}
      	let b = getB(coeff);
      	dynamicX = solveX(dynamicY, coeff, b);
	} 
	let newPt = document.createElementNS(svgNS, "circle");
	newPt.id = "attribute";
	newPt.setAttributeNS(null, "cx", dynamicX);
	newPt.setAttributeNS(null, "cy", dynamicY);
	newPt.setAttributeNS(null, "r", 1);
	svg.appendChild(newPt);
}

function renderGraph() {
	let oldPoints = document.querySelectorAll("#attribute");
	if (oldPoints.length) {
		let polygon = document.createElementNS(svgNS, "polygon");
		let pointsStr = [];
		oldPoints.forEach((point) => {
			pointsStr.push(getDeepValue(point.cx) + "," + getDeepValue(point.cy));
			svg.removeChild(point);
		});
		polygon.setAttributeNS(null, "points", pointsStr.join(" "));
		polygon.setAttributeNS(null, "style", "fill: transparent; stroke: rgb(35, 29, 73); stroke-width:1px");
		polygon.id = "removeable";
		svg.appendChild(polygon);
		return;
	};
	showResults(obj);
}

function placeAttributeText(attr) {
	let x, y;
	switch (attr) {
		case "Physical" :
			x = 0;
			y = 100;
		break;
		case "Pace" :
			x = 60;
			y = 46;
		break;
		case "Defending" :
			x = 50;
			y = 162;
		break;
		case "Dribbling" :
			x = 120;
			y = 162;
		break;
		case "Passing" :
			x = 155;
			y = 100;
		break;
		case "Shooting" :
			x = 120;
			y = 46;
		break;
		default :
			x = 100;
			y = 100;
	}
	return {
		x: x,
		y: y
	}
}
