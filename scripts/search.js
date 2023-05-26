window.onload = (event) => {
  fetch('../json/data.json')
    .then(response => response.json())
    .then(data => {
      const location = window.location.href;
      var urlSplit = location.split('?');

      if(urlSplit){
        const searchWord = new URLSearchParams(urlSplit[1]).get('search');

        const options = {
          includeScore: true,
          keys: [
            {
              name: 'title',
              weight: 0.3
            }
          ]
        }
        
        const fuse = new Fuse(data.pages, options)
        
        const result = fuse.search(searchWord)
        
        var search_content = document.getElementById('search-content');
        const search_parent = document.getElementById('search-result');
        search_parent.innerHTML = '';

        if(result.length === 0){
          
          search_content.innerHTML = 'No results found for: "' + searchWord + '"';
          search_content.insertAdjacentHTML("afterend", '<h2 style="font-size:26px;margin-top:1.5em; margin-bottom: .5em;">Check out these other articles instead:</h2>');
          for(i = 0; i < 4; i++){
            search_parent.innerHTML += `
            <div class="col-xl-4 col-md-6 col-12 pb-3">
                <a href="${data.pages[i].href}" class="d-block overflow-hidden article-page">
                    <img src="${data.pages[i].image}" alt="" width="100%">
                    <div class="info">
                      <h2>${data.pages[i].title}</h2>
                      <p>${data.pages[i].description}</p>
                    </div>
                </a>
            </div>`;
          }
          return;
        }
        
        search_content.innerHTML = 'Results for: "' + searchWord + '"';

        for(i = 0; i < result.length; i++){
          search_parent.innerHTML += `
          <div class="col-xl-4 col-md-6 col-12">
              <a href="${result[i].item.href}" class="d-block overflow-hidden article-page">
                  <img src="${result[i].item.image}" alt="" width="100%">
                  <div class="info">
                    <h2>${result[i].item.title}</h2>
                    <p>${result[i].item.description}</p>
                  </div>
              </a>
          </div>`;
        }
      }
      
    })
    .catch(error => {
      console.error(error);
  });
    
};