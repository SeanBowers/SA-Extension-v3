let apiResponses = {
    investments: [],
    api: [],
    api_planet: [],
    sell_transaction: [],
    buy_transactions: [],
    leaders: [],
    training: [],
    sell_offers: [],
    buy_offers: [],
    alliance: [],
    factory_production: [],
    allOwnedPlanets: [],
  };
  
  chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (request.request.url.includes("spacealpha.net")) {
      request.getContent((body, encoding) => {
        const contentType = request.response.content.mimeType;
  
        if (contentType.includes("application/json") && isJSON(body)) {
          try {
            const parsedBody = JSON.parse(body);
            console.log("Captured network response:", parsedBody);
  
            // Process and store the responses based on the URL
            switch (request.request.url) {
              case "https://spacealpha.net/api/market/buy_transactions":
                apiResponses.buy_transactions.push(parsedBody);
                break;
              case "https://spacealpha.net/api/market/sell_transactions":
                apiResponses.sell_transaction.push(parsedBody);
                break;
              case "https://spacealpha.net/api/training":
                apiResponses.training.push(parsedBody);
                break;
              case "https://spacealpha.net/api":
                if (parsedBody.user) {
                  apiResponses.api.push(parsedBody.user);
                }
                if (parsedBody.planet) {
                  apiResponses.api_planet.push(parsedBody.planet);
                }
                break;
              case "https://spacealpha.net/api/market/sell_offers":
                apiResponses.sell_offers.push(parsedBody);
                break;
              case "https://spacealpha.net/api/market/buy_offers":
                apiResponses.buy_offers.push(parsedBody);
                break;
              case "https://spacealpha.net/openapi/investments":
                apiResponses.investments.push(parsedBody);
                break;
              case "https://spacealpha.net/api/allOwnedPlanets":
                apiResponses.allOwnedPlanets.push(...parsedBody.planets);
                break;
              case "https://spacealpha.net/api/factory_production":
                apiResponses.factory_production.push(parsedBody);
                break;
              case "https://spacealpha.net/api/alliances":
                apiResponses.alliance.push(parsedBody);
                break;
            }
  
            console.log("Updated apiResponses:", apiResponses);
            chrome.storage.local.set({ apiResponses }, () => {
              if (chrome.runtime.lastError) {
                console.error("Error storing apiResponses:", chrome.runtime.lastError);
              } else {
                console.log("apiResponses successfully stored.");
              }
            });
          } catch (error) {
            console.error("Error parsing network response:", error);
          }
        } else {
          console.log("Skipped non-JSON response or invalid JSON:", request.request.url);
        }
      });
    }
  });
  
  // Function to check if a string is valid JSON
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  