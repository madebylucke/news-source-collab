function toggleSearchPanel(){
    panel = document.getElementById('search-lower-panel');
    toggleActive(panel);
}

function getRandomElements(arr, numElements, excludedElement) {
  if (numElements > arr.length) {
    throw new Error("Cannot select more elements than available in the array");
  }
  
  const randomElements = [];
  const cloneArr = [...arr]; // Create a clone of the array to avoid modifying the original array
  
  while (randomElements.length < numElements) {
    const randomIndex = Math.floor(Math.random() * cloneArr.length);
    const randomElement = cloneArr[randomIndex];
    
    if (randomElement !== excludedElement) {
      randomElements.push(randomElement);
      cloneArr.splice(randomIndex, 1); // Remove the selected element from the clone array
    }
  }
  
  return randomElements;
}

window.onload = (event) => {
    fetch('../json/data.json')
      .then(response => response.json())
      .then(data => {
        link = location.pathname;
        const lastPart = link.substring(link.lastIndexOf("/") + 1);
        console.log(lastPart);
        for(let i = 0; i < data.pages.length; i++){
            if(data.pages[i].href.includes(lastPart)){
                const selectedElements = getRandomElements(data.pages, 3, data.pages[i]);
                console.log(selectedElements);
                var article_parent = document.getElementById('related-article-parent');
                article_parent.innerHTML = '';
                for(i = 0; i < selectedElements.length; i++){
                    article_parent.innerHTML += `
                    <div class="col-xl-4 col-md-6 col-12 p-4 overflow-hidden">
                        <a class="related-article" href="${selectedElements[i].href}">
                            <div class="cover">
                            <img src="${selectedElements[i].image}" alt="">
                            </div>
                            <div class="info p-1 pl-3">
                            <h3>${selectedElements[i].title}</h3>
                            <p>${selectedElements[i].description}</p>
                            </div>
                        </a>
                    </div>
                    `
                ;
                }
                break;
            }
        }
        
        
      })
      .catch(error => {
        console.error(error);
    });
      
};

function dropdownToggle(){
    document.getElementById('settings-button').classList.toggle('active');
    document.getElementById('settings').classList.toggle('active');
}

function toggleActive(e){
    e.classList.toggle('active');
}
function addActive(e){
    e.classList.add('active');
}
function removeActive(e){
    e.classList.remove('active');
}

var isTouchDevice = false;

// Feature detection
if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
  isTouchDevice = true;
}

// User agent analysis to exclude Firefox Developer Tools
if (isTouchDevice && navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 && window.matchMedia) {
  var mq = window.matchMedia('(pointer: fine)');
  if (mq.matches) {
    isTouchDevice = false;
  }
}

const lower_nav = document.getElementById('lower-nav');
const back_top = document.getElementById('back-to-top'); 
const search_panel = document.getElementById('search-lower-panel');
var lastScrollPosition = window.pageYOffset;
window.addEventListener("scroll", function() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if(scrollTop > 220){
        addActive(back_top);
    }else{
        removeActive(back_top)
    }

    if(window.innerWidth < 600 || isTouchDevice){
        var currentScrollPosition = window.pageYOffset;
        var threshold = 110; // Adjust this value as needed

        if (scrollTop < threshold) {
            removeActive(lower_nav);
            return;
        }
  
        if (currentScrollPosition > lastScrollPosition) {
          addActive(lower_nav);
          search_panel.classList.add('hidden');
          
        } else if(currentScrollPosition < lastScrollPosition){
          removeActive(lower_nav);
          search_panel.classList.remove('hidden');
        }
        
        lastScrollPosition = currentScrollPosition;
    }
  
});
window.addEventListener("resize", function() {
    if(window.innerWidth > 600){
        removeActive(lower_nav);
    }
});
document.getElementById("back-to-top").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const search_bar = document.getElementById('search-bar');
const search_form = document.getElementById('search-form');
search_bar.addEventListener('keydown', function(event) {
    if (event.code == 'Enter') {
        event.preventDefault();
        search();
    }
});
search_bar.addEventListener("blur", function() {
    removeActive(search_form);
});

function search(){

    if(!search_bar.value){
        return;
    }

    var currentURL = window.location.href; // Get the current URL
    var location = currentURL.substring(0, currentURL.lastIndexOf('/'));

    window.location.href = location + '/search.html?search=' + search_bar.value;
}

const search_bar_lower = document.getElementById('search-bar-panel-lower');
search_bar_lower.addEventListener('keydown', function(event) {
    if (event.code == 'Enter') {
        event.preventDefault();
        searchLower();
    }
});
function searchLower(){

    if(!search_bar_lower.value){
        return;
    }

    var currentURL = window.location.href; // Get the current URL
    var location = currentURL.substring(0, currentURL.lastIndexOf('/'));

    window.location.href = location + '/search.html?search=' + search_bar_lower.value;
}

// dark-/lightmode activator
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if(readCookie('darkmode') != 'true' && readCookie('darkmode') != 'false'){
        document.documentElement.setAttribute('data-theme', 'dark');
    }else if(readCookie('darkmode') == 'true'){
        eraseCookie('darkmode');
        document.documentElement.setAttribute('data-theme', 'dark');
    }else if(readCookie('darkmode') == 'false'){
        document.documentElement.setAttribute('data-theme', 'light');
    }
}else{
    if(readCookie('darkmode') != 'true' && readCookie('darkmode') != 'false'){
        document.documentElement.setAttribute('data-theme', 'light');
    }else if(readCookie('darkmode') == 'false'){
        eraseCookie('light');
        document.documentElement.setAttribute('data-theme', 'light');
    }else if(readCookie('darkmode') == 'true'){
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function darkToggle(){
    let theme = document.documentElement.getAttribute('data-theme');
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        if(theme == 'dark'){
            createCookie('darkmode', 'false' ,'365');
            document.documentElement.setAttribute('data-theme', 'light');
        }else{
            eraseCookie('darkmode')
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }else{
        if(theme == 'dark'){
            eraseCookie('darkmode')
            document.documentElement.setAttribute('data-theme', 'light');
        }else{
            createCookie('darkmode', 'true' ,'365');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
}

// Code for creating, reading and erasing cookies
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = '; expires='+date.toGMTString();
	}
	else var expires = '';
	document.cookie = name+'='+value+expires+'; SameSite=Strict; Secure; path=/';
}

function readCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,'',-1);
}


  