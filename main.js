function main() {
	var cells = document.getElementsByClassName('clcellprimary');
	var professors = [];
	var profCount = 0;

	//increment list to retrieve professor name only
	for (var i=3; i<cells.length; i+=18) {
		//slice off &nbsp; character
		var profName = cells[i].innerText.slice(0,-1);	
		if (profName != 'T.B.A.' && profName != 'Cancel'){

			//slice off remaining space at end and push to professor array
			professors.push(profName.slice(0,-1));
		
			//create link to professor rating
			link = document.createElement('a');
			var searchName = professors[profCount].split(' ')[0];
			var address = 'http://www.ratemyprofessors.com/SelectTeacher.jsp?searchName=' + searchName + '&search_submit1=Search&sid=1077';
			link.href = address;
			link.innerHTML = '<input class="rating" type="button" value="Rating" />';

			cells[i+9].appendChild(link);

			profCount++;
		}
	}

	var xhr = new XMLHttpRequest();
	var url = 'http://www.ratemyprofessors.com/SelectTeacher.jsp?sid=1077';
	xhr.open('GET', url, true);

	xhr.onreadystatechange=function() {
  		if (xhr.readyState==4 && xhr.status==200)
   		{
   			var data = xhr.response;
   			cells[3].innerHTML = data;
    	}
    	else{
   		}
  	}
  	xhr.send();

	//handler(callback, 'http://www.ratemyprofessors.com/SelectTeacher.jsp?sid=1077');
};
/*
function handler(callback, url) {
var xhr = new XMLHttpRequest();
//var url = 'http://www.ratemyprofessors.com/SelectTeacher.jsp?sid=1077';
xhr.open('GET', url, true);

xhr.onreadystatechange=function() {
	if (xhr.readyState==4 && xhr.status==200)
	{
 	  	callback(xhr.responseText)
    }
}
  	xhr.send();
};

function callback(text){
cells[3].innerHTML = text;
}
*/
main();







