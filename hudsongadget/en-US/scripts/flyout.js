/**********************************************
 *	Filename:	flyout.js
 *	Author:		Cristian Patrasciuc
 *	Email:		cristian.patrasciuc@gmail.com
 *	Date:		17-July-2007
 **********************************************/
 
/* Retrieves the content that must be displayed in the flyout */
function initFlyout()
{ 
	document.body.style.width = 400; // fixed width, variable height
	var ctom = /&lt;([^&]*)&gt;/g;
	  var projects = System.Gadget.document.parentWindow.projects;
	var i = System.Gadget.document.parentWindow.flyoutIndex;  
	/*  var projects =[{color:"red","name": "toot","description": "desc","link": "mylink","healthReport": [
        {"iconUrl": "PRIVMSG", "description": "90", "score": "90"},
        {"iconUrl": "PRIVMSG", "description": "deleteURI", "score": "10"},
        {"iconUrl": "PRIVMSG", "description": "randomURI", "score": "0"},
        {"iconUrl": "PRIVMSG", "description": "randomURI", "score": "0"}
    ]
}];
var i = 0; */

	
	
	
	flyoutTitle.innerHTML = projects[i].name;
	flyoutDescription.innerHTML = projects[i].description;
	
			var img= "";
		if ( projects[i].color == "red")
			img = '<img ALIGN="LEFT" src="themes/32x32/red.gif" class="centeredImage"/>';
		else if ( projects[i].color == "blue")
			img = '<img ALIGN="LEFT" src="themes/32x32/blue.gif" class="centeredImage"/>';
		else if ( projects[i].color == "yellow")
			img = '<img ALIGN="LEFT" src="themes/32x32/yellow.gif" class="centeredImage"/>';
		else if ( projects[i].color == "disabled")
			img = '<img ALIGN="LEFT" src="themes/32x32/grey.gif" class="centeredImage" />';
		else if ( projects[i].color == "aborted")
			img = '<img ALIGN="LEFT" src="themes/32x32/grey.gif" class="centeredImage" />';
	  else if ( projects[i].color == "red_anime")
			img = '<img ALIGN="LEFT" src="themes/32x32/red_anime.gif" class="centeredImage"/>';
		else if ( projects[i].color == "blue_anime")
			img = '<img ALIGN="LEFT" src="themes/32x32/blue_anime.gif" class="centeredImage"/>';
		else if ( projects[i].color == "yellow_anime")
			img = '<img ALIGN="LEFT" src="themes/32x32/yellow_anime.gif" class="centeredImage"/>';
		else if ( projects[i].color == "disabled_anime")
			img = '<img ALIGN="LEFT" src="themes/32x32/grey_anime.gif" class="centeredImage" />';
			else if ( projects[i].color == "aborted_anime")
			img = '<img ALIGN="LEFT" src="themes/32x32/grey_anime.gif" class="centeredImage" />';
	projectColour.innerHTML = img;
	
	flyoutLink.href = projects[i].link;
	
	
    
   
	
	var _innerHTML = '<table RULES="GROUPS"  FRAME="BOX"  style="width:100%; border: 1px solid #bbb;border-collapse: collapse;"><thead bgColor="#f0f0f0"><tr><th align="left">W</th><th align="left">Description</th><th align="right">%</th></tr></thead>';
	for (  var c = 0; c < projects[i].healthReport.length; c++ ) 
	{
		_innerHTML+= '<tbody><tr  bgColor="#ffffee"><td   align="left" ><img src="themes/'+projects[i].healthReport[c].iconUrl+'" 	alt="" title=""></td><td>'+projects[i].healthReport[c].description+'</td><td align="right">'+projects[i].healthReport[c].score+'</td></tr></tbody>';
	}
	 
	_innerHTML += '</table>';
	flyoutHealthReport.innerHTML = _innerHTML;
	self.focus();
	window.setTimeout("ResizeWindowTo('FlyoutContentDiv');", 1);
}

function ResizeWindowTo(sElemId) {
    document.body.leftMargin = 0;
    document.body.topMargin = 0;
    var oElem = document.getElementById(sElemId);
    var nHigh = oElem.offsetHeight;
    var nWide = oElem.offsetWidth;
    document.body.style.height = nHigh +20;
    document.body.style.width = nWide;
}