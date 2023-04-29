document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton');
  const apiKeyInput = document.getElementById('apiKey');

  // Load the stored API key and set it as the input value
  chrome.storage.sync.get('apiKey', (data) => {
    apiKeyInput.value = data.apiKey || '';
  });

  // Save the API key when the Save button is clicked
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ apiKey }, () => {
      console.log('API key saved:', apiKey);
    });
  });

  // Function to load prompts.json, populate the text area, and display a nicely formatted JSON
  async function loadPrompts() {
    const response = await fetch(chrome.runtime.getURL('prompts.json'));
    const prompts = await response.json();
    const formattedPrompts = JSON.stringify(prompts, null, 2);
    chrome.storage.sync.get('prompts', (data) => {
      const jsonData = data.prompts || formattedPrompts;
      jsonTextArea.value = jsonData;

      // Use json-formatter-js to create a nicely formatted JSON display
      const jsonDisplay = document.getElementById('jsonDisplay');
      const formatter = new JSONFormatter(JSON.parse(jsonData), 2);
      jsonDisplay.innerHTML = ''; // Clear the previous content
      jsonDisplay.appendChild(formatter.render());
    });
  }

  // Call the loadPrompts function
  loadPrompts();

  // Save the JSON when the Save JSON button is clicked
  saveJsonButton.addEventListener('click', () => {
    const jsonText = jsonTextArea.value;
    try {
      JSON.parse(jsonText);
      chrome.storage.sync.set({ prompts: jsonText }, () => {
        console.log('JSON saved:', jsonText);
      });
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Invalid JSON. Please check the JSON formatting and try again.');
    }
  });

});
