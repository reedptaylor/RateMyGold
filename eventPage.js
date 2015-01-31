chrome.runtime.onMessage.addListener(function(request, sender, callback) { 
	
	var xhr = new XMLHttpRequest();

	xhr.onload = function() {
    	callback(xhr.responseText);
    };
	xhr.onerror = function() {
		callback();
 	};

  	xhr.open('GET', request.url, true);
   	xhr.send();
   	return true; // prevents the callback from being called too early on return   
});
/*
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				//var data = xhr.responseText;
   				//xhr.popup.innerHTML = "test";
   				alert(xhr.responseXML);
			}
		}*/