window.onload = (event) => {
    const location = window.location.href;
    urlSplit = location.split('?');

    if(urlSplit){
        test = new URLSearchParams(urlSplit[1]);
        console.log(test.get('search'));
    }
};

const search_bar = document.getElementById('search-bar');

search_bar.addEventListener("keydown", function(event) {
    if (event.code == 'Enter') {
        event.preventDefault();
        search();
    }
});

function search(){

    if(!search_bar.value){
        return;
    }
    const location = window.location.href;

    urlSplit = location.split('?');
    window.location.href = urlSplit[0] + '?search=' + search_bar.value;
}

if(readCookie("darkmode") != "true" && readCookie("darkmode") != "false"){
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', "dark");
        createCookie("darkmode","true","365");
    }else{
        createCookie("darkmode","false","365");
        document.documentElement.setAttribute('data-theme', "light");
    }

}else{
    if(readCookie("darkmode") == "true"){
        document.documentElement.setAttribute('data-theme', "dark");
    }else{
        document.documentElement.setAttribute('data-theme', "light");
    }
}

function darkToggle(){
    let theme = document.documentElement.getAttribute('data-theme');
    if(theme == "dark"){ 
        createCookie("darkmode", "false" ,"365");
        document.documentElement.setAttribute('data-theme', "light");
    }else if(theme == "light"){
        createCookie("darkmode", "true" ,"365");
        document.documentElement.setAttribute('data-theme', "dark");
    }
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; SameSite=Strict; Secure; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}