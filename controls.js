var inputs = document.querySelectorAll("input")

inputs.forEach((field) => {
	field.value = obj[field.dataset.attr]
	field.onkeyup = function() {
		if (this.value < 1) this.value = 1
		if (this.value > 99) this.value = 99
		let attribute = this.dataset.attr
		obj[attribute] = this.value
		showResults(obj)
	}
	field.onchange = field.onkeyup
})

showResults(obj)
