var cells = document.getElementsByClassName('clcellprimary');
var professors = [];
//increment list to retrieve professor name only
for (var i=3; i<cells.length; i+=6) {
	cells[i].style.color = 'red'; //test
	professors.push(cells[i].innerText);
	cells[i].innerText = professors[0]; //test
}

