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
  