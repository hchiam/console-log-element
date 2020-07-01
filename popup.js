setUpVersionNumberLink();

document.getElementById("do-it").addEventListener("click", function () {
  createConsoleLog();
});

function setUpVersionNumberLink() {
  document.getElementById(
    "version-number"
  ).firstChild.nodeValue = chrome.runtime.getManifest().version;
}

function createConsoleLog() {
  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then(sendMessageToTabs)
    .catch(onError);
}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs
      .sendMessage(tab.id, {
        showConsoleLogElement: true,
      })
      .then(window.close)
      .catch(onError);
  }
}
