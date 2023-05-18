const pagesData = [];

// Search parser
window.onload = (event) => {
  fetch('../json/data.json')
    .then(response => response.json())
    .then(data => {
      pagesData.push(data.pages);

      const location = window.location.href;
      var urlSplit = location.split('?');

      if(urlSplit){
          var test = new URLSearchParams(urlSplit[1]);
          const searchWord = test.get('search');

          var search_content = document.getElementById('search-content');
          search_content.innerHTML = searchWord;

          function getSimilarityScore(searchWord, item) {
              const nameDistance = levenshteinDistance(searchWord, item.title.toLowerCase());
              const descriptionDistance = levenshteinDistance(searchWord, item.description.toLowerCase());
              const searchTermsDistance = levenshteinDistance(searchWord, item.search_terms.toLowerCase());
              const maxLength = Math.max(searchWord.length, item.description.length, item.title.length, item.search_terms.length);
              const weightedDistance = (nameDistance * 4) + (searchTermsDistance) + descriptionDistance; // weight name twice as much
              if (nameDistance === 0 || searchTermsDistance === 0) {
                  return 0; // exact match
              }
              return Math.abs(1 - (weightedDistance / maxLength)); // normalize distance to range [0, 1]
          }

          const pages = pagesData[0].filter((object) => {
              const similarityScore = getSimilarityScore(searchWord.toLowerCase(), object);
              console.log(similarityScore);
              return similarityScore < 0.25; // adjust threshold as needed
          }).map((object) => {
              object.similarityScore = getSimilarityScore(searchWord.toLowerCase(), object);
              return object;
          }).sort((a, b) => a.similarityScore - b.similarityScore);
          
          const search_parent = document.getElementById('search-result');
          search_parent.innerHTML = '';

          for(i = 0; i < pages.length; i++){
              search_parent.innerHTML += `
              <div class="col-xl-4 col-md-6 col-12">
                  <a href="${pages[i].href}" class="d-block overflow-hidden">
                      <img src="${pages[i].image}" alt="" width="100%">
                      <h2>${pages[i].title}</h2>
                      <p>${pages[i].description}</p>
                  </a>
              </div>`
          ;
          }
          console.log(pages);
      }
    })
    .catch(error => {
      console.error(error);
  });
    
};

// A function that calculates a strings closeness to another string, 0 closest and then increasing
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