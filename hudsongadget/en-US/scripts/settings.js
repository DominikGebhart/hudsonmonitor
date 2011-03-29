

/* Set the event handlers */
System.Gadget.onSettingsClosing = settingsClosing;



/* Saves the settings when Settings dialog is closed */
function settingsClosing(event)
{
    if (event.closeAction == event.Action.commit)
    {
        System.Gadget.Settings.write( "refresh", projectRefresh.options[projectRefresh.selectedIndex].value );
         event.cancel = false;
         
    }
}


function savesettingstofile() {

}

var downloadedProjects;

/* Loads the existing settings when the Settings dialog is shown */
function loadSettings() 
{
	markDirty();
	buildProjectsToDelete();
	var refresh = System.Gadget.Settings.read("refresh");

	switch ( refresh ) {
		case 60000:
			projectRefresh[0].selected = "1";
			break;
		case 900000:
			projectRefresh[1].selected = "1";
			break;
		default:
			projectRefresh[4].selected = "1";
	}	
	
	buildProjectList();
	var current = System.Gadget.Settings.read("currentProject");
	if ( current == "" ) current = 0;
	projects.options[current].selected = "1";
	
	buildProjectsToDelete();
}


/* Builds the project list */
function buildProjectList()
{
	var n;
	var aux = System.Gadget.Settings.read("noProjects");
	if ( aux == "" ) n = 0; else n = aux;
	
	for ( var i = 0; i < projects.options.length; i++ ) projects.options[i] = null;
	
	for ( var i = 0; i < n; i++ )
	{
		var text = System.Gadget.Settings.read("projectName"+i);
		projects.options[i] = new Option(text,i+'');
	}
	
}

/* Add a new project */
function retrieveProjects()
{
	if ( serverURL.value.replace(/^\s+|\s+$/, '') == "" ) 
	{
		errorMessage.innerHTML = "Server URL is empty.";
		return true;
	}
	if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
 
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  
  }

   xmlhttp.open("GET", serverURL.value+"/api/json",true);   
   
  
 xmlhttp.onreadystatechange=function() {
  if (xmlhttp.readyState==4) {
  if (xmlhttp.status==200){
  	  buildProjectsList(eval('(' + xmlhttp.responseText + ')'));
  } 
    else
      projectsFromHudson.disabled=true;
    
     
  }
  }
 
	 xmlhttp.send(null);
}


function buildProjectsList(hudsonjsonobject){

  for ( var i = 0; i < projectsFromHudson.options.length; i++ )
		projectsFromHudson.options[i] = null;
	for(var i=0;i<hudsonjsonobject.jobs.length;i++)
	{ 
	 var text = hudsonjsonobject.jobs[i].name;
		projectsFromHudson.options[i] = new Option(text,i+'');
		
		
	}
	if (projectsFromHudson.options.length>0)
		projectsFromHudson.disabled=false;
	
}

function markDirty() {
				
				if (auth.checked == true) {
					username.disabled = false;
					password.disabled = false;
				} else {
					username.disabled = true;
					password.disabled = true;
				}			
			}

/* Add a new project */
function addProject()
{
	
	if ( serverURL.value.replace(/^\s+|\s+$/, '') == "" ) 
	{
		errorMessage.innerHTML = "Server URL is empty.";
		return true;
	}
	
	var projectName = projectsFromHudson.options[projectsFromHudson.selectedIndex].text;
	if ( projectName.replace(/^\s+|\s+$/, '') == "" ) 
	{
		errorMessage.innerHTML = "Project Name is empty.";
		return true;
	}

	
	
	if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
 
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  
  }  
   xmlhttp.open("GET", serverURL.value+"/job/"+projectName+"/api/json",true);   
   
  
 xmlhttp.onreadystatechange=function() {
  if (xmlhttp.readyState==4) {
  if (xmlhttp.status==200){
  	 var projectJSON = eval('(' + xmlhttp.responseText + ')');
  	
	var n;
	
	var aux = System.Gadget.Settings.read("noProjects");
	
	if ( aux == "" ) n = 0; else n = aux;

	System.Gadget.Settings.write( "projectName"+n, projectName );	
	System.Gadget.Settings.write( "projectServer"+n, serverURL.value );	
	System.Gadget.Settings.write( "projectURL"+n, projectJSON.url );	
	
	/*++ Add Authentification ++*/

	System.Gadget.Settings.write( "projectUseAuthentification"+n,  auth.checked);
	System.Gadget.Settings.write("projectUserName"+n,  username.value);
	System.Gadget.Settings.write("projectPassword"+n,  password.value); 
	/*-- Add Authentification --*/
	
  
	n++;
	System.Gadget.Settings.write("noProjects",n);
	buildProjectsToDelete();
  
  } 
  
  }
  }
 
	 xmlhttp.send(null);
}


function buildProjectsToDelete(){
	var n;
	
	var aux = System.Gadget.Settings.read("noProjects");
	
	if ( aux == "" ) n = 0; else n = aux;
	
	for ( var i = 0; i < projectsToDelete.options.length; i++ )
		projectsToDelete.options[i] = null;
	for ( var i = 0; i < n; i++ )	
	{
		var name = System.Gadget.Settings.read("projectName"+i);		
		projectsToDelete.options[i] = new Option(name,i+'');
	}
}

/* Deletes an existing project */
function deleteExistingProject()
{
	var n;

	var aux = System.Gadget.Settings.read("noProjects");

	if ( aux == "" ) n = 0; else n = aux;
	
	for ( var i = projectsToDelete.selectedIndex; i < n; i++ )	
	{
		var URL = System.Gadget.Settings.read("projectURL"+(i+1));
		var name = System.Gadget.Settings.read("projectName"+(i+1));
		var server = System.Gadget.Settings.read( "projectServer"+(i+1));	
		var useAuthentification = System.Gadget.Settings.read( "projectUseAuthentification"+(i+1));	
		var username = System.Gadget.Settings.read( "projectUserName"+(i+1));	
		var passwordInput = System.Gadget.Settings.read( "projectPassword"+(i+1));	
		debugger;
		System.Gadget.Settings.write("projectURL"+i,  URL);
		System.Gadget.Settings.write("projectName"+i,  name);
		System.Gadget.Settings.write("projectServer"+i, server);
			/*++ Add Authentification ++*/	
		System.Gadget.Settings.write("projectUseAuthentification"+i, useAuthentification);
		System.Gadget.Settings.write("projectUserName"+i, username);
		System.Gadget.Settings.write("projectPassword"+i, passwordInput);
			/*-- Add Authentification --*/
	}
	
	if ( n > 0 ) n--; else n = 0;
	System.Gadget.Settings.write("noProjects",n);
	buildProjectsToDelete();
	
}