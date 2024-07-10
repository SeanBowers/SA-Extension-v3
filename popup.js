document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("apiResponses", (data) => {
    const responses = data.apiResponses || {};
    console.log("Received apiResponses in popup:", responses);
    const buttonsContainer = document.getElementById("buttons");
    const responseTypes = Object.keys(responses);

    if (responseTypes.length === 0) {
      buttonsContainer.innerHTML = "No responses captured.";
    } else {
      responseTypes.forEach((type) => {
        if (responses[type].length > 0) {
          // Only create buttons for non-empty response types
          const button = document.createElement("button");
          button.innerText = `${type}`;
          button.onclick = () => {
            console.log(`Preparing to copy data for ${type}`);
            try {
              const csvData = responses[type].map((json) => jsonToCsv(json)).join("\n\n");
              console.log(`CSV data for ${type}:`, csvData);
              navigator.clipboard
                .writeText(csvData)
                .then(() => {
                  alert(`${type} copied to clipboard!`);
                })
                .catch((error) => {
                  console.error("Error copying CSV data:", error);
                  alert(`Failed to copy ${type} to clipboard.`);
                });
            } catch (error) {
              console.error("Error preparing CSV data:", error);
              alert(`Failed to prepare ${type} data.`);
            }
          };
          buttonsContainer.appendChild(button);
        }
      });
    }
  });
});

function jsonToCsv(json) {
  const items = Array.isArray(json) ? json : [json];
  if (items.length === 0) return ""; // Handle empty array case

  const replacer = (key, value) => (value === null ? "" : value);
  
  const headers = new Set();
  items.forEach((item) => extractHeaders(item, headers));
  const headerArray = Array.from(headers);

  const csv = [
    headerArray.join(","),
    ...items.map((row) => headerArray.map((fieldName) => JSON.stringify(getNestedValue(row, fieldName), replacer)).join(","))
  ].join("\r\n");

  return csv;
}

function extractHeaders(obj, headers, prefix = "") {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        extractHeaders(obj[key], headers, newPrefix);
      } else {
        headers.add(newPrefix);
      }
    }
  }
}

function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}


