const category = {
    NULL : 0,
    ENVIRONMENT: 1,
    FACTORY: 2,
    ENERGY: 3,
}
const article = {
    name: "", 
    description: "", 
    category: category.NULL,
}

window.onload = (event) => {
    const location = window.location.href;
    var urlSplit = location.split('?');

    if(urlSplit){
        var test = new URLSearchParams(urlSplit[1]);
        const searchWord = test.get('search');;

        var search_content = document.getElementById('search-content');
        search_content.innerHTML = searchWord;

        const arrayToFilter = [
            { name: "Fusion", description: "En typ av kärnkraft", category: "renew" },
            { name: "Fission", description: "En typ av kärnkraft", category: ""  },
            { name: "Vattenkraft", description: "Vattenkraft är kraftigt vatten", category: ""  },
            
        ];
          
        const filteredArray = arrayToFilter.filter((object) => {
            const textToCompare = object.name.toLowerCase() + object.description.toLowerCase();
            const similarityScore = getSimilarityScore(searchWord.toLowerCase(), textToCompare);
            return similarityScore > 0.1; // adjust threshold as needed
        });
        
        function getSimilarityScore(searchWord, textToCompare) {
            const distance = levenshteinDistance(searchWord, textToCompare);
            const maxLength = Math.max(searchWord.length, textToCompare.length);
            return 1 - (distance / maxLength); // normalize distance to range [0, 1]
        }
        console.log(filteredArray);

    }
};

const search_bar = document.getElementById('search-bar');

search_bar.addEventListener('keydown', function(event) {
    if (event.code == 'Enter') {
        event.preventDefault();
        search();
    }
});

function search(){

    if(!search_bar.value){
        return;
    }
    console.log(window.location.hostname);
    
    const location = window.location.origin + "/html/search.html";

    window.location.href = location + '?search=' + search_bar.value;
}

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

function levenshteinDistance(s, t) {
    // create empty matrix of size (s.length + 1) x (t.length + 1)
    const matrix = Array(s.length + 1).fill(null).map(() => Array(t.length + 1).fill(null));
    
    // initialize first row and column to consecutive integers
    for (let i = 0; i <= s.length; i++) {
      matrix[i][0] = i;
    }
    
    for (let j = 0; j <= t.length; j++) {
      matrix[0][j] = j;
    }
    
    // fill in the rest of the matrix using recurrence relation
    for (let i = 1; i <= s.length; i++) {
      for (let j = 1; j <= t.length; j++) {
        const cost = s[i - 1] === t[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    // return bottom-right element of matrix (distance between s and t)
    return matrix[s.length][t.length];
  }
  