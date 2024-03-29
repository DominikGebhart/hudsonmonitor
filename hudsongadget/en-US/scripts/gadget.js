/* Set the event handlers */
System.Gadget.settingsUI = "Settings.html";
System.Gadget.onSettingsClosed = settingsClosed;
System.Gadget.onDock = resizeGadget;
System.Gadget.onUndock = resizeGadget;



/* Refresh project when Settings dialog is closed */
function settingsClosed(event)
{
	if (event.closeAction == event.Action.commit) 
	{
		currentProject = 0;
		getProjects();
	}
}

/* Rezise gadget when docked/undocked */
function resizeGadget() 
{
	
	if ( System.Gadget.docked == true )
	{
		document.body.style.background = "url('../themes/default/background.png') no-repeat";
		for ( var i = 0; i < 4; i++ )
			document.getElementById(i+'').className = "projectItemDocked";	
		message.style.width = '120px';
		navigation.style.marginLeft = '8px';
		//document.getElementById("titleLink").style.width = '72px';
		document.body.style.width = '132px';
	}
	else
	{
		document.body.style.background = "url('../themes/default/background-large.png') no-repeat";
		for ( var i = 0; i < 4; i++ )
			document.getElementById(i+'').className = "projectItemUndocked";
		message.style.width = '355px'; 
		navigation.style.marginLeft = '127px';
		//document.getElementById("titleLink").style.width = '308px';
		document.body.style.width = '368px';
	}
	
}

function JSONHealthReport(_description, _iconUrl, _score ){
	this.description;
	this.iconUrl;
	this.score;
	this.description = _description;
	this.iconUrl = _iconUrl;
	this.score = _score;
}

function JSONProject(projectjsonobject)
{
	this.name;
	this.link;
	this.description;
	this.color;
	this.lastbuild;
	this.healthReport;
	this.healthReport = new Array();
	this.name = projectjsonobject.displayName;
	this.link = projectjsonobject.url;
	this.description = projectjsonobject.description;
	this.lastbuild = projectjsonobject.lastbuild;
	this.color = projectjsonobject.color;
	for(var i=0;i<projectjsonobject.healthReport.length;i++)
{ 
	
		var _desc = projectjsonobject.healthReport[i].description;
		var _iconUrl = projectjsonobject.healthReport[i].iconUrl;
		var _score = projectjsonobject.healthReport[i].score;
		
		this.healthReport.push(new JSONHealthReport(_desc, _iconUrl, _score));
}
	
}


function ProjectItem(projectJSON){
	this.name;
	this.link;
	this.description;
	
	this.name = projectJSON.displayName;
	
	
}

function pausecomp(millis) 
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); } 
while(curDate-date < millis);
} 


/* Download (request) the projects from the URL */
function getProjects()
{
	
	clear();
	var n;

	var aux = System.Gadget.Settings.read("noProjects"); 
	//var aux =2;
	if ( aux == "" ) n = 0; else n = aux;
	projects = new Array();		
	currentPage = 1;
	var cur = 0;
	for ( var cur = 0; cur < n;cur++){ 
		var projectURL = System.Gadget.Settings.read("projectURL"+cur); 
		var useAuth = System.Gadget.Settings.read("projectUseAuthentification"+cur); 
		var userName = System.Gadget.Settings.read("projectUserName"+cur); 
		var passwordInput = System.Gadget.Settings.read("projectPassword"+cur); 
		GetProject(projectURL,useAuth,userName,passwordInput, cur);
	}
	var refreshTime = System.Gadget.Settings.read('refresh');
	if ( refreshTime > 0 ) setTimeout( "getProjects();", refreshTime );
	return;
}

function GetProject(projectURL, useAuth, userName, passwordInput,cur){
	
	projectURL = projectURL+"api/json";

					 var xmlhttp;
	if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
   xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

  }
   var auth = null;
    xmlhttp.open("GET", projectURL,true); 
    if (useAuth != null){
   if (useAuth == true) {
					auth = window.btoa((userName || '') + ':' + (passwordInput || ''));
				} else {
					auth = null;
				}
				if ( auth != null) {
						xhr.setRequestHeader('Authorization', 'Basic ' + auth);
					}
				}
					
    xmlhttp.onreadystatechange= function() {
  if (xmlhttp.readyState==4) {
  if (xmlhttp.status==200){
    var pos = cur;
  	var project =  new JSONProject(  eval('(' + xmlhttp.responseText + ')')  );
  	projects.push(project);
		showProjects(projects);
	
	  
	  	
  } 
  }else {
    	//shell.Popup(cur+' '+xmlhttp.status);
    	//showMessage("troto");
    }
  };  
   xmlhttp.send(null);
 
}



function showProjects(projects)
{
	clear();
	
	//alert(projects.healthReport.length);
	for ( var i = ((currentPage*4) - 4); (i < (currentPage*4)) && (i<projects.length); i++ ) 
	{
			var img= "";
		if ( projects[i].color == "red")
			img = '<img ALIGN="LEFT" src="themes/red.gif" class="centeredImage"/>';
		else if ( projects[i].color == "blue")
			img = '<img ALIGN="LEFT" src="themes/blue.gif" class="centeredImage"/>';
		else if ( projects[i].color == "yellow")
			img = '<img ALIGN="LEFT" src="themes/yellow.gif" class="centeredImage"/>';
		else if ( projects[i].color == "disabled")
			img = '<img ALIGN="LEFT" src="themes/grey.gif" class="centeredImage" />';
		else if ( projects[i].color == "aborted")
			img = '<img ALIGN="LEFT" src="themes/grey.gif" class="centeredImage" />';
		else	if ( projects[i].color == "red_anime")
			img = '<img ALIGN="LEFT" src="themes/red_anime.gif" class="centeredImage"/>';
		else if ( projects[i].color == "blue_anime")
			img = '<img ALIGN="LEFT" src="themes/blue_anime.gif" class="centeredImage"/>';
		else if ( projects[i].color == "yellow_anime")
			img = '<img ALIGN="LEFT" src="themes/yellow_anime.gif" class="centeredImage"/>';
		else if ( projects[i].color == "disabled_anime")
			img = '<img ALIGN="LEFT" src="themes/grey_anime.gif" class="centeredImage" />';
		else if ( projects[i].color == "aborted_anime")
			img = '<img ALIGN="LEFT" src="themes/grey_anime.gif" class="centeredImage" />';
		var item_html = img+'<p><a ';
		item_html += (projects[i].link == null) ? "" : 'href="javascript:void(0)" onclick="flyoutIndex = ' + i + '; showFlyout()">';		
		item_html += (projects[i].name == null ) ? "(no title)</a>" : projects[i].name + "</a>";
		item_html += (projects[i].description == null) ? "<br>no desc" : "<br>" + decodeHTML(projects[i].description);				
		document.getElementById((i%4)+'' ).innerHTML = item_html;
	}
	
	var remainder = projects.length % 4;

  var pages = (  projects.length - remainder ) / 4;
    
  if (remainder >0)
  	pages = pages+1;  

	
	var posText = currentPage +'/'+pages+'';
	position.innerHTML = posText;


	showMessage("");
	return true;
}

/* Display a message to the user */
function showMessage( msg )
{
	document.getElementById("message").style.visibility = "visible";
	 document.getElementById("messageText").innerHTML = msg;
	if ( msg == "" ) document.getElementById("message").style.visibility = "hidden";
}


/* Show the flyout when mouse is over an item */
function showFlyout()
{
	if ( flyoutIndex >= projects.length )
	{
		System.Gadget.Flyout.show = false;
		return true;
	}
	System.Gadget.Flyout.file = "Flyout.html";
	System.Gadget.Flyout.show = true;
}

/* Clear the contents of the gadget */
function clear()
{
	for ( var i = 0; i < 4; i++ ){
		document.getElementById(i+'').innerHTML = '';
	}
}



/* Converts &lt; and &gt; into < and > */
function decodeHTML(text)
{
	var ctom = /&lt;([^&]*)&gt;/g;
    return text.replace(ctom,"<$1>");
}

function checkDisplay(cpt, projects){
	
	if (cpt   == projects.length){
		showProjects(projects);
	}
}


/* Current page in the projects list */
var currentPage = 1;

/* The index of the item that must be displayed in the flyout */
var flyoutIndex = 0;

var projects;
var shell = new ActiveXObject("WScript.Shell");

var auth;