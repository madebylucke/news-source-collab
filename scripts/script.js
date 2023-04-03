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