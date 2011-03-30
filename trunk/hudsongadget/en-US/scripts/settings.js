

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

  
   
  var authentication = null;
  
   
 
    errorMessage.innerHTML = "ici";	
   if (auth.checked == true) {
   	
   				errorMessage.innerHTML = "la "+username.value +" "+ password_.value  ;	
   				authentication = make_base_auth(username.value,password_.value);
					
				//	errorMessage.innerHTML = authentication;	
				} else {
					errorMessage.innerHTML = "la2";	
					authentication = null;
				}
				
				if ( authentication != null) {
					 xmlhttp.open("GET", serverURL.value+"/j_security_check?j_username="+username.value +"&j_password="+password_.value ,false);   
					 xmlhttp.send();
				//	errorMessage.innerHTML = authentication +' '+auth.checked;	
					errorMessage.innerHTML = "not null";	
					errorMessage.innerHTML = "->"+authentication;	
						
							
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

function make_base_auth(user, passd) {
  var tok = user + ':' + passd;
  errorMessage.innerHTML = tok  ;
  var hash = base64.encode(tok);
   errorMessage.innerHTML = "in make_base_auth"  ;
   errorMessage.innerHTML = "Basic " + hash ;
  return "Basic " + hash;
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
					password_.disabled = false;
				} else {
					username.disabled = true;
					password_.disabled = true;
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
	System.Gadget.Settings.write("projectPassword"+n,  password_.value); 
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


////base64 encode/decoder

var base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

base64.makeDOMException = function() {
    // sadly in FF,Safari,Chrome you can't make a DOMException
    var e, tmp;

    try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    } catch (tmp) {
        // not available, just passback a duck-typed equiv
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
        var ex = new Error("DOM Exception 5");

        // ex.number and ex.description is IE-specific.
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";

        // Safari/Chrome output format
        ex.toString = function() { return 'Error: ' + ex.name + ': ' + ex.message; };
        return ex;
    }
}

base64.getbyte64 = function(s,i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw base64.makeDOMException();
    }
    return idx;
}

base64.decode = function(s) {
    // convert to string
    s = '' + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax === 0) {
        return s;
    }

    if (imax % 4 !== 0) {
        throw base64.makeDOMException();
    }

    pads = 0
    if (s.charAt(imax - 1) === base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
            (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
    case 1:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
        break;
    case 2:
        b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break;
    }
    return x.join('');
}

base64.getbyte = function(s,i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw base64.makeDOMException();
    }
    return x;
}

base64.encode = function(s) {
    if (arguments.length !== 1) {
        throw new SyntaxError("Not enough arguments");
    }
    errorMessage.innerHTML = "b64 s="+s;
    var padchar = base64.PADCHAR;
    var alpha   = base64.ALPHA;
    var getbyte = base64.getbyte;

    var i, b10;
    var x = [];

    // convert to string
    s = '' + s;

    var imax = s.length - s.length % 3;
errorMessage.innerHTML = "b64 imax="+imax;
    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
    	
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    errorMessage.innerHTML = "b64 imax="+s.length;
    switch (s.length - imax) {
    case 1:
        b10 = getbyte(s,i) << 16;
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               padchar + padchar);
        break;
    case 2:
        b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
        x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
               alpha.charAt((b10 >> 6) & 0x3f) + padchar);
        break;
    }
    return x.join('');
}
///
