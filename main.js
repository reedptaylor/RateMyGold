var cells = document.getElementsByClassName('clcellprimary');
var professors = [];

//increment list to retrieve professor name only
for (var i=3; i<cells.length; i+=18) {
	//if (cells[i].innerText != 'T.B.A. &nbsp'){
		cells[i].style.color = 'red'; //test
		professors.push(cells[i].innerText);
		cells[i].innerText = professors[0]; //test
		cells[i+9].innerText = 'Rating:';
	//}

}





/*
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.ratemyprofessors.com/SelectTeacher.jsp?sid=1077', false);
xhr.getElementsByClassName('searchBox').value = professors[0];
*/
