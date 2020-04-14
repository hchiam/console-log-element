browser.runtime.onMessage.addListener((results) => {
  const showConsoleLogElement = results.showConsoleLogElement;
  if (showConsoleLogElement) {
    createConsoleLog();
  }
});

function createConsoleLog() {
  var script = document.createElement("script");
  script.innerHTML = `
  /* This creates an interactive console log that you can view without opening the actual web dev tools console log. */

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

    // create elements:
    var inputBox = createInputBox();
    var inputButton = createInputButton();
    var consoleOutput = createConsoleOutput();
    var theWholeThingDiv = createConsoleLogWidget();

    inputBox.focus();

    redefineConsoleActions();

    function redefineConsoleActions() {
      var oldConsoleLog = console.log;
      var oldConsoleInfo = console.info;
      var oldConsoleWarn = console.warn;
      var oldConsoleError = console.error;
      var oldConsoleDebug = console.debug;

      console.log = function () {
        oldConsoleLog.call(console, ...arguments);
        outputToWidget(arguments[0]);
      };
      console.info = function () {
        oldConsoleInfo.call(console, ...arguments);
        outputToWidget(arguments[0]);
      };
      console.warn = function () {
        oldConsoleWarn.call(console, ...arguments);
        outputToWidget(arguments[0]);
      };
      console.error = function () {
        oldConsoleError.call(console, ...arguments);
        outputToWidget(arguments[0]);
      };
      console.debug = function () {
        oldConsoleDebug.call(console, ...arguments);
        outputToWidget(arguments[0]);
      };
    }

    function outputToWidget(input) {
      // (only one input from input box)
      var output = "";
      output = eval(input);
      if (isElement(output)) {
        output = output.outerHTML.replace(/</g, "&lt;").replace(/\\\//g, "/");
      } else if (typeof output === "object") {
        output = JSON.stringify(output, null, 4);
      }
      // NOTE: by NOT wrapping the preceding lines in a try-catch, invalid input will NOT submit
      consoleOutput.innerHTML +=
        '<span style="background: black; color: lime;">' +
        input +
        "</span><br/>" +
        '<span style="background: black; color: white;">' +
        output +
        "</span><br/><br/>";
    }

    function createInputBox() {
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
      return inputBox;
    }

    function createInputButton() {
      var inputButton = document.createElement("button");
      inputButton.id = "inputButton_firefox-extension-console-log-element";
      inputButton.innerText = "Send command";
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
      return inputButton;
    }

    function createConsoleOutput() {
      var consoleOutput = document.createElement("pre");
      consoleOutput.id = "output_firefox-extension-console-log-element";
      consoleOutput.style =
        "margin-top: 1px !important; max-height: 100px !important; overflow: scroll !important; width: 90vw !important; background: black !important; color: white !important; border: none !important; border-radius: 0.3rem !important; padding: 0 !important;";
      return consoleOutput;
    }

    function createConsoleLogWidget() {
      // put the elements together:
      var theWholeThingDiv = document.createElement("div");
      theWholeThingDiv.id = "firefox-extension-console-log-element";
      theWholeThingDiv.style = widgetDefaultStyle;
      inputGroupDiv.appendChild(inputBox);
      inputGroupDiv.appendChild(inputButton);
      theWholeThingDiv.appendChild(inputGroupDiv);
      theWholeThingDiv.appendChild(consoleOutput);
      document.body.appendChild(theWholeThingDiv);
      return theWholeThingDiv;
    }

    function isElement(element) {
      return (
        element &&
        (element instanceof Element || element instanceof HTMLDocument)
      );
    }

    function triggerInputToConsole() {
      var consoleInput = inputBox.value;
      try {
        inputToConsole(consoleInput);
        clearInput();
      } catch (e) {
        makeInputGroupWobble();
      }
    }

    function inputToConsole(stringInput) {
      lastInput = stringInput;
      if (stringInput === "") return; // ignore empty input
      if (handledClear(stringInput) || handledCustomCommandX(stringInput)) {
        return;
      }

      console.log(stringInput);
      // auto-scroll to last output:
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
      consoleOutput.scrollIntoView();
    }

    function handledClear(stringInput) {
      if (stringInput === "clear()") {
        consoleOutput.innerHTML = "";
        return true;
      }
      return false;
    }

    function handledCustomCommandX(stringInput) {
      stringInput = stringInput.toLowerCase();
      if (
        stringInput === "x" ||
        stringInput === '"x"' ||
        stringInput === "'x'"
      ) {
        var confirmed = confirm("Do you want to hide this console log widget?");
        if (!confirmed) return false; // (cancelled)
        theWholeThingDiv.hidden = true;
        theWholeThingDiv.style = widgetDefaultStyle + "visibility: hidden;";
        return true;
      }
      return false;
    }

    function clearInput() {
      inputBox.value = "";
    }

    function makeInputGroupWobble() {
      var wobbleCss = document.createTextNode(\`.wobble {
        animation: wobble 0.5s;
      }
      
      @keyframes wobble {
        0% { transform: rotate(-3deg); }
        50% {transform: rotate(3deg); }
        100% { transform: rotate(0deg); }
      }\`);
      var style = document.createElement("style");
      style.id = "wobble-css";
      style.type = "text/css";
      style.appendChild(wobbleCss);
      document.body.appendChild(style);
      inputGroupDiv.classList.add("wobble");
      setTimeout(() => {
        inputGroupDiv.classList.remove("wobble");
      }, 500);
    }

    function enterLastInput() {
      inputBox.value = lastInput;
    }

    function $(selector, el) {
      // $(...) is a web console helper
      if (!el) {
        el = document;
      }
      return el.querySelector(selector);
    }

    function $$(selector, el) {
      // $$(...) is a web console helper
      if (!el) {
        el = document;
      }
      return el.querySelectorAll(selector);
    }
  })();
  `;
  document.body.appendChild(script);
}
