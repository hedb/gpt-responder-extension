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
});
