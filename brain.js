browser.runtime.onMessage.addListener((results) => {
  const toldToCreateConsoleLogElement = results.shouldCreateConsoleLogElement;
  if (toldToCreateConsoleLogElement) {
    createConsoleLog();
  }
});

/* This creates an interactive console log that you can view without opening the actual web dev tools console log. */
function createConsoleLog() {
  (function () {
    // use an IIFE to isolate variables

    var elementAlreadyExists = document.getElementById(
      "firefox-extension-console-log-element"
    );
    if (elementAlreadyExists) {
      elementAlreadyExists.scrollIntoView();
      return;
    }

    var lastInput = "";

    var darkMode = "background: #333; color: lime;";
    var defaultStyle =
      darkMode + "padding: 0.3rem !important; border: none !important;";
    var inputBoxDefaultStyle =
      defaultStyle +
      "margin-right: 0 !important; border-radius: 0.2rem 0 0 0.2rem !important; background: black;";
    var inputButtonDefaultStyle =
      defaultStyle +
      "margin-left: 0 !important; border-radius: 0 0.2rem 0.2rem 0 !important;";
    var inputHoverStyle = "background: lime; color: black;";

    var inputGroupdDiv = document.createElement("div");
    inputGroupdDiv.style =
      "border-radius: 0.3rem !important; display: inline-block !important; border: 2px solid lightgrey !important; padding: 0 !important;";

    var inputBox = document.createElement("input");
    inputBox.id = "inputBox_firefox-extension-console-log-element";
    inputBox.placeholder = "console log input here";
    inputBox.title = "enter x to remove this widget";
    inputBox.style = inputBoxDefaultStyle;
    inputBox.onkeyup = function (event) {
      if (event.key === "Enter" || event.keyCode === 13) {
        triggerInputToConsole();
      } else if (event.key === "ArrowUp" || event.keyCode === 38) {
        enterLastInput();
      }
    };
    inputBox.onmouseenter = function () {
      inputBox.style = inputBoxDefaultStyle + inputHoverStyle;
      inputBox.focus();
    };
    inputBox.onmouseleave = function () {
      inputBox.style = inputBoxDefaultStyle;
    };

    var inputButton = document.createElement("button");
    inputButton.id = "inputButton_firefox-extension-console-log-element";
    inputButton.innerText = "Send to console log";
    inputButton.title = "enter x to remove this widget";
    inputButton.style = inputButtonDefaultStyle;
    inputButton.onclick = function () {
      triggerInputToConsole();
      inputBox.focus();
    };
    inputButton.onmouseenter = function () {
      inputButton.style = inputButtonDefaultStyle + inputHoverStyle;
      if (inputBox.value === "") {
        inputBox.focus();
      }
    };
    inputButton.onmouseleave = function () {
      inputButton.style = inputButtonDefaultStyle;
    };

    var consoleOutput = document.createElement("pre");
    consoleOutput.id = "output_firefox-extension-console-log-element";
    consoleOutput.style =
      "margin-top: 1px !important; max-height: 100px !important; overflow: scroll !important; background: black !important; color: white !important; border: none !important; border-radius: 0.3rem !important; padding: 0 !important;";

    // put the elements together:
    var theWholeThingDiv = document.createElement("div");
    theWholeThingDiv.id = "firefox-extension-console-log-element";
    theWholeThingDiv.style =
      "z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important;";
    inputGroupdDiv.appendChild(inputBox);
    inputGroupdDiv.appendChild(inputButton);
    theWholeThingDiv.appendChild(inputGroupdDiv);
    theWholeThingDiv.appendChild(consoleOutput);
    document.body.appendChild(theWholeThingDiv);

    redefineConsoleLog();

    function redefineConsoleLog() {
      var oldLog = console.log;
      console.log = function (...items) {
        oldLog.apply(this, items);
        items.forEach(function (item, i) {
          if (typeof item === "object") {
            items[i] = JSON.stringify(item, null, 4);
          } else {
            items[i] = item;
          }
        });
        consoleOutput.innerHTML += items.join(" ") + "<br />";
      };
    }

    function triggerInputToConsole() {
      var consoleInput = inputBox.value;
      inputToConsole(consoleInput);
      clearInput();
    }

    function inputToConsole(stringInput) {
      lastInput = stringInput;
      // ignore empty input:
      if (stringInput === "") return;
      // handle clear():
      if (stringInput === "clear()") {
        consoleOutput.innerHTML = "";
        // console.log(eval(stringInput));
        return;
      }
      // handle special custom command x:
      if (
        stringInput === "x" ||
        stringInput === '"x"' ||
        stringInput === "'x'"
      ) {
        var confirmed = confirm(
          "Do you want to remove this console log widget?"
        );
        if (!confirmed) return; // (cancelled)
        consoleOutput.innerHTML = "";
        inputGroupdDiv.innerHTML = "";
        document.body.removeChild(theWholeThingDiv);
        return;
      }
      // display input:
      console.log(
        '<span style="background: black; color: lime;">' +
          stringInput +
          "</span>"
      );
      try {
        // display evaluated output:
        var evaluatedOutput = eval(stringInput);
        if (evaluatedOutput === undefined) {
          console.log("undefined");
        } else {
          console.log(evaluatedOutput);
        }
      } catch (e) {
        // display error stack:
        console.log(e.stack);
      }
      // extra line for separation (a personal choice):
      console.log();
      // auto-scroll to last output:
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
      consoleOutput.scrollIntoView();
    }

    function enterLastInput() {
      inputBox.value = lastInput;
    }

    function clearInput() {
      inputBox.value = "";
    }
  })();
}
