chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (request.request.url.includes("spacealpha.net")) {
      request.getContent((body, encoding) => {
        const contentType = request.response.content.mimeType;
        if (contentType.includes("application/json") && isJSON(body)) {
            const parsedBody = JSON.parse(body);
            if (request.request.url.includes("/api/allOwnedPlanets")) {
              chrome.storage.local.set({ allOwnedPlanets: parsedBody.planets }, () => {
                chrome.storage.local.get("allOwnedPlanets", (data) => {
                });
              });
            }
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
  
