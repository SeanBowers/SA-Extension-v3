chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (request.request.url.includes("spacealpha.net")) {
      request.getContent((body, encoding) => {
        const contentType = request.response.content.mimeType;
  
        if (contentType.includes("application/json") && isJSON(body)) {
          try {
            const parsedBody = JSON.parse(body);
  
            // Process and store the responses based on the URL
            if (request.request.url.includes("/api/allOwnedPlanets")) {

              chrome.storage.local.set({ allOwnedPlanets: parsedBody.planets }, () => {

                chrome.storage.local.get("allOwnedPlanets", (data) => {

                });
              });
            }
          } catch (error) {
          }
        } else {
        }
      });
    }
  });
    
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  