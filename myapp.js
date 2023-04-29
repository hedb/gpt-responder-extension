

var apiKey = null;

chrome.storage.sync.get('apiKey', (data) => {
    apiKey = data.apiKey;
  
    if (apiKey) {
      // Use the API key in your content script logic
      console.log('API key:', apiKey);
    } else {
      console.log('No API key found');
    }
  });


async function fetchAnswer(question) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const body = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": "Say this is a test!"}],
        temperature: 0.7,
        n: 1
    });

    const response = await fetch(apiUrl, { method: 'POST', headers, body });
    const data = await response.json();

    return data.choices[0].message.content.trim();
  };

  async function buttonClick(event) {
    // debugger
    question = "what is the time?"
    const answer = await fetchAnswer(question);
    event.composeView.insertTextIntoBodyAtCursor( answer );
  };

InboxSDK.load(2, 'sdk_GmailResponder_71b9f89d6b').then(function(sdk){

  sdk.Compose.registerComposeViewHandler(function(composeView){
    composeView.addButton({
      title: "Ask the GPT",
      iconUrl: 'https://chat.openai.com/favicon-32x32.png',
      onClick : buttonClick,
    });
  });
});