createConsoleLog(); // to view previous logs, it'll track console log in the background

browser.runtime.onMessage.addListener((results) => {
  const showConsoleLogElement = results.showConsoleLogElement;
  if (showConsoleLogElement) {
    showConsoleLog();
  }
});

function showConsoleLog() {
  var widgetDefaultStyle =
    "z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important; visibility: visible;";

  var theWholeThingDiv = document.getElementById(
    "firefox-extension-console-log-element"
  );
  theWholeThingDiv.hidden = false;
  theWholeThingDiv.style = widgetDefaultStyle;
}

/* This creates an interactive console log that you can view without opening the actual web dev tools console log. */
function createConsoleLog() {
  (function () {
    // use an IIFE to isolate variables

    var elementAlreadyExists = document.getElementById(
      "firefox-extension-console-log-element"
    );
    var widgetDefaultStyle =
      "z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important;";
    if (elementAlreadyExists) {
      elementAlreadyExists.hidden = false;
      elementAlreadyExists.style = widgetDefaultStyle;
      elementAlreadyExists.scrollIntoView();
      document
        .getElementById("inputBox_firefox-extension-console-log-element")
        .focus();
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

    var inputGroupDiv = document.createElement("div");
    inputGroupDiv.style =
      "border-radius: 0.3rem !important; display: inline-block !important; border: 2px solid lightgrey !important; padding: 0 !important;";

    var inputBox = document.createElement("input");
    inputBox.id = "inputBox_firefox-extension-console-log-element";
    inputBox.placeholder = "console log input here";
    inputBox.title = "enter x to hide this widget";
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
    inputButton.title = "enter x to hide this widget";
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
      "margin-top: 1px !important; max-height: 100px !important; overflow: scroll !important; width: 100% !important; background: black !important; color: white !important; border: none !important; border-radius: 0.3rem !important; padding: 0 !important;";

    // put the elements together:
    var theWholeThingDiv = document.createElement("div");
    theWholeThingDiv.id = "firefox-extension-console-log-element";
    theWholeThingDiv.style = widgetDefaultStyle + "visibility: hidden;";
    inputGroupDiv.appendChild(inputBox);
    inputGroupDiv.appendChild(inputButton);
    theWholeThingDiv.appendChild(inputGroupDiv);
    theWholeThingDiv.appendChild(consoleOutput);
    document.body.appendChild(theWholeThingDiv);

    inputBox.focus();

    redefineConsoleLog();

    function redefineConsoleLog() {
      var oldConsoleLog = console.log;
      console.log = function (...inputs) {
        var input = inputs[0]; // only one input from input box
        var output = "";
        try {
          output = eval(input);
          oldConsoleLog.apply(this, inputs);
          oldConsoleLog.apply(this, output);
          if (isElement(output)) {
            output = output.outerHTML
              .replace(/</g, "&lt;")
              .replace(/\\\//g, "/");
          } else if (typeof output === "object") {
            output = JSON.stringify(output, null, 4);
          }
        } catch (e) {}
        consoleOutput.innerHTML +=
          '<span style="background: black; color: lime;">' +
          input +
          "</span><br/>" +
          '<span style="background: black; color: white;">' +
          output +
          "</span><br/><br/>";
      };
    }

    function isElement(element) {
      return element instanceof Element || element instanceof HTMLDocument;
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
        return;
      }
      // handle special custom command x:
      if (
        stringInput === "x" ||
        stringInput === '"x"' ||
        stringInput === "'x'"
      ) {
        var confirmed = confirm("Do you want to hide this console log widget?");
        if (!confirmed) return; // (cancelled)
        theWholeThingDiv.hidden = true;
        theWholeThingDiv.style = widgetDefaultStyle + "visibility: hidden;";
        return;
      }
      console.log(stringInput);
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
