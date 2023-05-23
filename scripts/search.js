window.onload = (event) => {
  fetch('../json/data.json')
    .then(response => response.json())
    .then(data => {
      const location = window.location.href;
      var urlSplit = location.split('?');

      if(urlSplit){
        const searchWord = new URLSearchParams(urlSplit[1]).get('search');
        
        var search_content = document.getElementById('search-content');
        search_content.innerHTML = 'Results for: "' + searchWord + '"';

        const options = {
          includeScore: true,
          keys: [
            {
              name: 'title',
              weight: 0.3
            },
            {
              name: '',
              weight: 0.7
            }
          ]
        }
        
        // Create a new instance of Fuse
        const fuse = new Fuse(data.pages, options)
        
        // Now search for 'Man'
        const result = fuse.search(searchWord)
        console.log(searchWord);
        console.log(result);

        const search_parent = document.getElementById('search-result');
        search_parent.innerHTML = '';

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
          </div>`
      ;
      }
      }
      
    })
    .catch(error => {
      console.error(error);
  });
    
};