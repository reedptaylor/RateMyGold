
var cells      = document.getElementsByClassName("clcellprimary");
var length     = cells.length;
var professors = [];
var profCount  = 0;
var popup;
var firstName;

// Loop through to add buttons below professor names

if (document.URL == "https://my.sa.ucsb.edu/gold/ResultsFindCourses.aspx") {

	for (var i = 3; i < length; i += 18) {                   //only iterate through cells which contain a professor name	
		var profName = cells[i].innerText.slice(0,-1);        //slice '&nbsp;'' character		
		console.log(i);
		if (profName != 'T.B.A.' && profName != 'Cancel'){
		    professors.push(profName.slice(0,-1));               //slice remaining space at end & push to professor array
		    var div         = cells[i+9];                        //cell where the button will go
		    var searchName  = '';
		    var nameArray   = professors[profCount].split(' ');  //check if professor's last name is two words to include in search
		    if (nameArray.length == 1){                          //special case for single name on gold
				searchName    = nameArray[0];
				div.firstName = ' ';
		    } else if (nameArray[1].length > 1){ 
				searchName    = nameArray[0] + ' ' + nameArray[1]; 
				div.firstName = nameArray[2];
		    } else { 
				searchName    = nameArray[0];
				div.firstName = nameArray[1];
		    }
		    
		    div.searchURL = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+california+santa+barbara&queryoption=HEADER&query='
	                + searchName + '&facetSearch=true';
		    div.profURL   = '';
		    div.innerHTML = '<input class="ratingButton" type="button" value="SHOW RATING" />';
		    div.cell      = cells[i+10];                          //cell where the popup's html will be placed
		    div.clicked   = false;
		    div.addEventListener('click', openPopup);
		    profCount++;
		} //end if
	}  //end for

}

function openPopup() {
    if (this.clicked == true) {                              //happens when button was clicked while active
		this.cell.innerHTML = '';
		this.innerHTML      = '<input class="ratingButton" type="button" value="SHOW RATING" />';
		this.clicked        = false;
    } else {                                                  //happens when button was clicked while inactive

		this.clicked    = true;
		this.innerHTML  = '<input class="ratingButton" type="button" value="HIDE RATING" />';	
		popup       = document.createElement('div');
		popup.className = 'popup';
		popup.innerText = 'Loading...';
		firstName   = this.firstName;
		this.cell.style.position = 'relative';
		this.cell.appendChild(popup);
		var dataArray = [this.searchURL, "parseSearchResponseHTML"];
		safari.self.tab.dispatchMessage("parseSearchResponseHTML", dataArray); //end message
	} //end else
} //end openPopup()


// Called as the callback of the request to search RateMyProfessor
function parseSearchResponseHTML(messageEvent) {

	if (messageEvent.name == "parseSearchResponseHTML") {

		

		var responseText = messageEvent.message;

	    var tmp          = document.createElement('div');  //make a temp element so that we can search through its html
	    tmp.innerHTML  = responseText;
	    var foundProfs = tmp.getElementsByClassName('listing PROFESSOR'); 
	    
	    if (foundProfs.length == 0){             //if no results were returned, print this message
			var emptyPopup = popup;
			emptyPopup.className = 'notFoundPopup';
			var notFound         = document.createElement('div');
		    var idk              = document.createElement('div');  
			notFound.className   = 'heading';
			idk.className        = 'idk';
			notFound.innerText   = "Professor not found";
			idk.innerText        = "¯\\_(ツ)_/¯";   
			emptyPopup.innerHTML = '';
			emptyPopup.appendChild(notFound);
			emptyPopup.appendChild(idk);
		} else { //iterate through the search results and match by first letter of first name to verify identity
			var length = foundProfs.length;
	    	for (var i = 0; i < length; i++) {
		   		var tmp       = document.createElement('div');
		   		tmp.innerHTML = foundProfs[i].innerHTML;
		   		var name      = tmp.getElementsByClassName('main')[0].innerText;
				if (firstName.charAt(0) == name.split(',')[1].charAt(1)){ 
					break;
				} else if (i == length-1) {
	   		    	var emptyPopup       = popup;
			    	emptyPopup.className = 'notFoundPopup';
			    	var notFound         = document.createElement('div');
			    	var idk              = document.createElement('div');  
			    	notFound.className   = 'heading';
			    	idk.className        = 'idk';
				    notFound.innerText   = "Professor not found";
				    idk.innerText        = "¯\\_(ツ)_/¯";
				    emptyPopup.innerHTML = '';
		    		emptyPopup.appendChild(notFound);
	    			emptyPopup.appendChild(idk);
		    		return 0;
				} //end else if
	    	}  //end for loop

	    	//get the link for the actual professor page
	    	var link     = tmp.getElementsByTagName('a');
	    	this.profURL = 'http://www.ratemyprofessors.com/' + link[0].toString().slice(23); //this is the URL
	    	var dataArray = [this.profURL, "parseProfessorResponseHTML"];
			safari.self.tab.dispatchMessage("parseProfessorResponseHTML", dataArray);
		} //end else
	} // End if event name is correct
} // End function

//Called as the callback of the request to get the professor's page
function parseProfessorResponseHTML(messageEvent) {


	if (messageEvent.name == "parseProfessorResponseHTML") {

		var responseText = messageEvent.message;


		var tmp = document.createElement('div');
	    tmp.innerHTML = responseText;
	    
	  var tmp2 = document.createElement('span');
	    tmp2.innerHTML = responseText;
	    
	    if (tmp.getElementsByClassName('pfname').length == 0) { // check to see if there are ay reviews
    	  var emptyPopup = popup;
        emptyPopup.className = 'notFoundPopup';
        var notFound = document.createElement('div');
        var idk = document.createElement('div');
        notFound.className = 'heading';
        idk.className = 'idk';
        notFound.innerText = "Professor not found";
        idk.innerText = "¯\\_(ツ)_/¯";
        emptyPopup.innerHTML = '';
        emptyPopup.appendChild(notFound);
        emptyPopup.appendChild(idk);
    	  return;
    }
	   
	    var proffName = tmp.getElementsByClassName('pfname')[0].innerText;
	    var proflName = tmp.getElementsByClassName('plname')[0].innerText;
	    var ratingInfo = tmp.getElementsByClassName('left-breakdown')[0];
	    var numRatings = tmp.getElementsByClassName('table-toggle rating-count active')[0].innerText;
	    tmp.innerHTML = ratingInfo.innerHTML;

	    //get the raw rating data
	    var overallAndAvg = tmp.getElementsByClassName('grade');
	    var otherRatings = tmp2.getElementsByClassName('tag-box-choosetags');
	    var scale = " / 5.0";
	    
	    var overall       = overallAndAvg[0];
	    var takeAgain      = overallAndAvg[1];
	    var levelOfDif      = overallAndAvg[2];
	    //add top 3 comments
	    var topComs = [otherRatings[0], otherRatings[1], otherRatings[2]];
	    tmp.remove();
	    tmp2.remove();

	    //create the ratings divs
	  var profNameDiv         = document.createElement('div');
		var overallDiv          = document.createElement('div');
		var overallTitleDiv     = document.createElement('div');
		var overallTextDiv      = document.createElement('div');
		var takeAgainDiv         = document.createElement('div');
		var takeAgainTitleDiv    = document.createElement('div');
		var takeAgainTextDiv     = document.createElement('div');
		var levelOfDifDiv      = document.createElement('div');
		var levelOfDifTitleDiv = document.createElement('div');
		var levelOfDifTextDiv  = document.createElement('div');
		var numRatingsDiv      = document.createElement('div');
		
		var topComsSpan = document.createElement('span');
		var topComsTitleSpan = document.createElement('span');
		var topComsTextSpan = document.createElement('span');


		//put rating data in divs and span
		profNameDiv.innerHTML         = '<a href="'+ this.profURL + '" target="_blank">'+ proffName + " " + proflName; + '</a>';
		overallTitleDiv.innerText     = 'Overall Quality';
		overallTextDiv.innerText      = overall.innerHTML.trim().concat(scale);
		takeAgainTitleDiv.innerText    = 'Would Take Again';
		takeAgainTextDiv.innerText     = takeAgain.innerHTML.trim();
		levelOfDifTitleDiv.innerText = 'Level of Difficulty';
		levelOfDifTextDiv.innerText  = levelOfDif.innerHTML.trim().concat(scale);
		topComsTitleSpan.innerText = 'Top 3 Comments';
		console.log(topComs[2]);
		if (typeof topComs[2] !== 'undefined') {
      topComsTextSpan.innerText  = "\n" + topComs[0].innerHTML.split('<')[0].concat("\n" + topComs[1].innerHTML.split('<')[0].concat("\n" + topComs[2].innerHTML.split('<')[0])); 
}
    else {
      topComsTextSpan.innerText = "\nNot available."
    }
		
		numRatings = numRatings.slice(9).split(' ')[0] //check to see if "ratings" is singular or plural
    if (numRatings == '1') {
        numRatingsDiv.innerHTML = '<a href="' + this.profURL + '" target="_blank">' + numRatings + ' rating</a>';
    } else {
        numRatingsDiv.innerHTML = '<a href="' + this.profURL + '" target="_blank">' + numRatings + ' ratings</a>';
    }


		//add divs to popup
		popup.innerHTML = ''; //remove 'loading...' text

		overallTitleDiv.appendChild(overallTextDiv);
		overallDiv.appendChild(overallTitleDiv);          
		takeAgainTitleDiv.appendChild(takeAgainTextDiv);
		takeAgainDiv.appendChild(takeAgainTitleDiv);
		levelOfDifTitleDiv.appendChild(levelOfDifTextDiv);
		levelOfDifDiv.appendChild(levelOfDifTitleDiv);
		topComsTitleSpan.appendChild(topComsTextSpan);
		topComsSpan.appendChild(topComsTitleSpan);
		
		popup.appendChild(profNameDiv);
	    popup.appendChild(overallDiv);
	    popup.appendChild(takeAgainDiv);
	    popup.appendChild(levelOfDifDiv);
	    popup.appendChild(numRatingsDiv);
	    popup.appendChild(topComsSpan);
	    
	  profNameDiv.className         = 'heading';
		overallDiv.className          = 'overall';
		overallTitleDiv.className     = 'title';
		overallTextDiv.className      = 'text';
		takeAgainDiv.className         = 'takeagain';
		takeAgainTitleDiv.className    = 'title';
		takeAgainTextDiv.className     = 'text';
		levelOfDifDiv.className      = 'difficulty';
		levelOfDifTitleDiv.className = 'title';
		levelOfDifTextDiv.className  = 'text';
		numRatingsDiv.className          = 'numRatings';
		topComsSpan.className            = 'topcoms';
		topComsTitleSpan.className       = 'title';
    topComsTextSpan.className        = 'text';
	 }
}

safari.self.addEventListener("message", parseProfessorResponseHTML, false);
safari.self.addEventListener("message", parseSearchResponseHTML, false);





