setUpVersionNumberLink();

document.getElementById("do-it").addEventListener("click", function () {
  createConsoleLog();
  window.close();
});

function setUpVersionNumberLink() {
  document.getElementById(
    "version-number-message"
  ).innerHTML = `You're using version <a id="releases" href="https://github.com/hchiam/console-log-element/releases" target="_blank"
  title="See release notes">${browser.runtime.getManifest().version}</a>`;

  document.getElementById("releases").addEventListener("click", function () {
    window.open(
      "https://github.com/hchiam/console-log-element/releases",
      "_blank"
    );
    window.close();
  });
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
        shouldCreateConsoleLogElement: true,
      })
      .catch(onError);
  }
}
