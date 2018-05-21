const prUrlRegex = /https:\/\/github.com\/.+\/pull\/.+\/files/;

chrome.tabs.onUpdated.addListener(function(tabId, changeinfo, tab) {
  if (changeinfo.status === 'complete') {
    chrome.tabs.get(tabId, tab => {
      if (prUrlRegex.test(tab.url)) {
        chrome.tabs.executeScript(tabId, {file: 'content.js'});
        console.info('COMPLETED', changeinfo, tab.url);
      }
    });
  }
});

