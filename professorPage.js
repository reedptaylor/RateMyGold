


var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.ratemyprofessors.com/SelectTeacher.jsp?sid=1077)', true);
var arr = xhr.getElementsByClassName('profDept').innerText;