

var apiKey = null;

chrome.storage.sync.get('apiKey', (data) => {
    apiKey = data.apiKey;
  
    if (apiKey) {
      // Use the API key in your content script logic
      console.log('API key found');
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
        messages: [{"role": "user", "content": question}],
        temperature: 0.7,
        n: 1
    });

    const response = await fetch(apiUrl, { method: 'POST', headers, body });
    const data = await response.json();

    return data.choices[0].message.content.trim();
  };



  async function loadPrompts() {
    const response = await fetch(chrome.runtime.getURL('prompts.json'));
    const prompts = await response.json();
    return prompts;
  }
  
  function createMenu(prompts) {
    const menu = document.createElement('div');
    menu.id = 'my-extension-menu';
    menu.style.display = 'none';
    menu.style.position = 'absolute';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.zIndex = '1000';
  
    for (const item of prompts) {
      const button = document.createElement('button');
      button.textContent = item.ux_path;
      button.style.display = 'block';
      button.style.marginBottom = '5px';
      button.addEventListener('click', () => {
        handleButtonClick(menu,item.prompt);
      });
      menu.appendChild(button);
    }
    menu.style.zIndex = '10000'; 
    return menu;
  }
  

  async function handleButtonClick(menu,prompt) {
    email_content = menu.composeView.getSelectedBodyText();
    prompt = prompt + email_content;
    console.log('Button clicked with prompt:', prompt );
    var answer = await fetchAnswer(prompt);
    answer = answer.replaceAll('\n','\n<br/>');
    menu.composeView.setBodyHTML( answer );
  }

  
  var prompts = null;
  var menu = null;

  async function initialize_menu() {
    prompts = await loadPrompts();
    menu = createMenu(prompts);
    document.body.appendChild(menu);
  }

  initialize_menu();

  async function testClick(event) {
    debugger
    console.log(event.composeView.getSelectedBodyText());
  };
  
  function showMenu(event, buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    menu.style.left = `${buttonRect.left}px`;
    menu.style.top = `${buttonRect.bottom}px`;
    menu.composeView = event.composeView;
  }


InboxSDK.load(2, 'sdk_GmailResponder_71b9f89d6b').then(function(sdk){

  sdk.Compose.registerComposeViewHandler(function(composeView){
    composeView.addButton({
      title: "Ask the GPT",
      iconUrl: 'https://chat.openai.com/favicon-32x32.png',
      onClick: (event) => {
        const buttonElement = event.composeView.getElement();
        showMenu(event, buttonElement); // Pass the button element to the showMenu function
      }
    });
  });


  // sdk.Compose.registerComposeViewHandler(function(composeView){

  //   composeView.addButton({
  //     title: "Test",
  //     iconUrl: 'https://www.clipartmax.com/png/small/266-2660182_custom-solutions-favicon-32x32-gear.png',
  //     onClick : testClick      
  //   });
  // });

});