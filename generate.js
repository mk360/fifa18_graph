var svgNS = "http://www.w3.org/2000/svg"
var svg = document.querySelector("svg")

var center = generateCircle(100, 100, 1, "black", "black")

var Pace = generatePoint(75, 57, "Pace"); // Pace
var Shooting = generatePoint(125, 57, "Shooting"); // Shooting
var Passing = generatePoint(150, 100, "Passing"); // Passing
var Dribbling = generatePoint(125, 143, "Dribbling"); // Dribbling
var Defending = generatePoint(75, 143, "Defending"); // Defending
var Physical = generatePoint(50, 100, "Physical"); // Physical

var globalCircle = generateCircle(100, 100, 50, "rgb(112, 111, 119)", "").setAttributeNS(null, "opacity", "0.7")

function generateBoundsCoordinates(stat, playerStat) {
	let extremityCircle = window[stat]
	let coeff = getAxisCoeff(center, extremityCircle)
	let dynamicX, dynamicY
	switch (true) {
		case (stat === "Physical" || stat === "Passing") :
			dynamicX = statLine(stat === "Physical" ? "-" : "+", length(50, playerStat))
			dynamicY = 100
			break
		case (stat === "Defending" || stat === "Dribbling") :
			dynamicY = statLine("+", length(43, playerStat))
			break
		default: 
			dynamicY = statLine("-", length(43, playerStat))
	}

	if (!dynamicX) {
		let b = getB(coeff)
  		dynamicX = solveX(dynamicY, coeff, b)
	}
	return [dynamicX, dynamicY]
}

function generateCircle(cx, cy, r, fill, stroke, attribute) {
	let circle = spawnSVGElement(document.createElementNS(svgNS, "circle"), {
		cx,
		cy,
		r,
		fill,
		stroke
	})

	if (attribute) {
		let text = document.createElementNS(svgNS, "text")
		text.textContent = attribute
		text = spawnSVGElement(text, {
			x: placeAttributeText(attribute).x,
			y: placeAttributeText(attribute).y,
			"font-size": "12px"
		})

		svg.appendChild(text)
	}
	
	let axis = createAxis(circle)
	svg.appendChild(axis)
	svg.appendChild(circle)
	return circle
}

function placeAttributeText(attr) {
	return {
		Physical: {
			x: 0,
			y: 100
		},
		Pace: {
			x: 60,
			y: 46
		},
		Defending: {
			x: 50,
			y: 162
		},
		Passing: {
			x: 155,
			y: 100
		},
		Shooting: {
			x: 120,
			y: 46
		},
		Dribbling: {
			x: 120,
			y: 162
		}
	}[attr] 
}

function renderGraph() {
	let oldPoints = document.querySelectorAll("#attribute")
	if (oldPoints.length) {
		let pointsStr = []
		oldPoints.forEach((point) => {
			pointsStr.push(getDeepValue(point.cx) + "," + getDeepValue(point.cy))
			svg.removeChild(point)
		})

		let polygon = spawnSVGElement(document.createElementNS(svgNS, "polygon"), {
			points: pointsStr.join(" "),
			style: "fill: transparent; stroke: rgb(35, 29, 73); stroke-width:1px"
		})

		polygon.id = "removeable"
		svg.appendChild(polygon)
		return
	}
	showResults(obj)
}

function spawnPoint(stat, value) {
	obj[stat] = value
	let [dynamicX, dynamicY] = generateBoundsCoordinates(stat, value)

	let newPt = spawnSVGElement(document.createElementNS(svgNS, "circle"), {
		cx: dynamicX,
		cy: dynamicY,
		r: 1
	})
	newPt.id = "attribute"
	svg.appendChild(newPt)
}

function createAxis(endpoint) {
	return spawnSVGElement(document.createElementNS(svgNS, "line"), {
		"x1": 100,
		"y1": 100,
		"x2": getDeepValue(endpoint.cx),
		"y2": getDeepValue(endpoint.cy),
		"stroke-width": "0.2px",
		stroke: "rgb(109, 107, 118)"
	})
}

function createSVGPoint(x, y, attribute) {
	let pt = svg.createSVGPoint()
	pt.x = x
	pt.y = y
	return pt
}

function getDeepValue(circleCoord) {
  return circleCoord.baseVal.value
}

function getAxisCoeff(start, end) {
	if (getDeepValue(end.cx) === getDeepValue(start.cx)) return 0
	return (getDeepValue(end.cy) - getDeepValue(start.cy)) / (getDeepValue(end.cx) - getDeepValue(start.cx))
}

function getB(a) {
	return 100 - 100 * a
}

function solveX(y, a, b) {
	return (y - b) / a
}

function generatePoint(x, y, attribute) {
	let pt = createSVGPoint(x, y, attribute)
	return generateCircle(Math.round(pt.x), Math.round(pt.y), 0, "black", "black", attribute)
}

function showResults(stats) {
	if (svg.getElementById("removeable")) {
		svg.removeChild(svg.getElementById("removeable"))
	}
	for (stat in stats) {
		spawnPoint(stat, stats[stat])
	}	
	renderGraph()
}

function spawnSVGElement(ctx, obj) {
	for (prop in obj) {
		ctx.setAttributeNS(null, prop, obj[prop])
	}
	return ctx
}

function length(maxLength, stat) {
	return maxLength * stat / 99
}

function statLine(sign, stat) {
	return 100 + +(sign + stat)
}
