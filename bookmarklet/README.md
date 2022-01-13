# Bookmarklet backup

Because, right now, experimental add-ons are disabled on Android.

https://bookmarklet-generator.surge.sh

```js
javascript:(function () {
  createConsoleLog();

  showConsoleLog();

  function showConsoleLog() {
    (function () {
      var widgetDefaultStyle =
        "all: initial; z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important; left: 0 !important; visibility: visible; font-family: avenir, arial, tahoma, monospace !important; font-size: 16px !important; margin-left: 5px !important; transition: 0.25s !important;";

      var theWholeThingDiv = document.getElementById(
        "firefox-extension-console-log-element"
      );
      theWholeThingDiv.hidden = false;
      theWholeThingDiv.style = widgetDefaultStyle;
      theWholeThingDiv.scrollIntoView();
      var inputBox = document.getElementById(
        "inputBox_firefox-extension-console-log-element"
      );
      inputBox.value = "";
      inputBox.setAttribute("rows", 1);
      setTimeout(() => {
        inputBox.focus();
      }, 100);
    })();
  }

  function createConsoleLog() {
    var scriptAlreadyExists = document.getElementById(
      "script_firefox-extension-console-log-element"
    );
    if (scriptAlreadyExists) return;

    var script = document.createElement("script");
    script.id = "script_firefox-extension-console-log-element";
    script.innerHTML = `

  (function () {

    var elementAlreadyExists = document.getElementById(
      "firefox-extension-console-log-element"
    );
    var widgetDefaultStyle =
    "all: initial; z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important; visibility: visible; font-family: avenir, arial, tahoma, monospace !important; font-size: 1.5rem !important; margin-left: 5px !important; transition: 0.25s !important;";
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
    var inputHoverStyle = "background: lime; color: black !important;";

    var inputGroupDiv = document.createElement("div");
    inputGroupDiv.id = "inputGroup_firefox-extension-console-log-element";
    inputGroupDiv.style =
      "border-radius: 0.3rem !important; display: grid !important; grid-template: auto %2F auto 15ch; border: 2px solid lightgrey !important; padding: 0 !important;";

    var inputBox = createInputBox();
    var inputButton = createInputButton();
    var consoleOutput = createConsoleOutput();
    var theWholeThingDiv = createConsoleLogWidget();

    inputBox.focus();

    var isFromInterface = false;

    redefineConsoleActions();

    function redefineConsoleActions() {
      var oldConsoleLog = console.log;
      var oldConsoleInfo = console.info;
      var oldConsoleWarn = console.warn;
      var oldConsoleError = console.error;
      var oldConsoleDebug = console.debug;

      console.log = function () {
        oldConsoleLog.call(console, ...arguments);
        if (isFromInterface) outputToWidget(arguments[0]);
        isFromInterface = false;
      };
      console.info = function () {
        oldConsoleInfo.call(console, ...arguments);
        if (isFromInterface) outputToWidget(arguments[0]);
        isFromInterface = false;
      };
      console.warn = function () {
        oldConsoleWarn.call(console, ...arguments);
        if (isFromInterface) outputToWidget(arguments[0]);
        isFromInterface = false;
      };
      console.error = function () {
        oldConsoleError.call(console, ...arguments);
        if (isFromInterface) outputToWidget(arguments[0]);
        isFromInterface = false;
      };
      console.debug = function () {
        oldConsoleDebug.call(console, ...arguments);
        if (isFromInterface) outputToWidget(arguments[0]);
        isFromInterface = false;
      };
    }

    function outputToWidget(input) {
      var temp = document.getElementById("firefox-extension-console-log-element");
      document.getElementById("firefox-extension-console-log-element").remove();
      var output = "";
      try {
        output = eval(input);
        if (isElement(output)) {
          output = output.outerHTML.replace(%2F<%2Fg, "&lt;").replace(%2F\\\%2F%2Fg, "%2F");
        } else if (typeof output === "object") {
          output = JSON.stringify(output, null, 4);
        } else if (typeof output === "string") {
          output = output.replace(%2F<%2Fg, "&lt;").replace(%2F\\\%2F%2Fg, "%2F");
        }
        input = String(input).replace(%2F<%2Fg, "&lt;").replace(%2F\\\%2F%2Fg, "%2F");
        consoleOutput.innerHTML +=
          '<button style="background: black; color: lime; text-align: left;" onclick="document.getElementById(\\'inputBox_firefox-extension-console-log-element\\').value=this.innerText;">' +
          input +
          "<%2Fbutton><br%2F>" +
          '<span style="background: black; color: white;">' +
          output +
          "<%2Fspan><br%2F><br%2F>";
        clearInput();
      } catch(e) {
        inputBox.value = input;
        updateInputRows();
        consoleOutput.innerHTML +=
          '<span style="background: black; color: lime;">' +
          input +
          "<%2Fspan><br%2F>" +
          '<span style="background: black; color: white;">' +
          "<small><em>" + e + "<%2Fem><%2Fsmall>" +
          "<%2Fspan><br%2F><br%2F>";
        makeInputGroupWobble();
      }
      document.body.appendChild(temp);
      inputBox.focus();
    }

    function createInputBox() {
      var inputBox = document.createElement("textarea");
      inputBox.id = "inputBox_firefox-extension-console-log-element";
      inputBox.placeholder = "console log input here";
      inputBox.title = "enter x to hide this widget";
      inputBox.style = inputBoxDefaultStyle;
      inputBox.setAttribute("autocapitalize", "none");
      inputBox.setAttribute("rows", 1);
      inputBox.onkeyup = function (event) {
        var holdingShiftOrCtrl = event.shiftKey === true || event.ctrlKey === true;
        var hitEnter = event.key === "Enter" || event.keyCode === 13;
        var hitDelete = event.key === "Delete" || event.keyCode === 8 || event.keyCode === 46;
        var hitArrowUp = event.key === "ArrowUp" || event.keyCode === 38;
        if (holdingShiftOrCtrl && hitEnter) {
          triggerInputToConsole();
        } else if (hitEnter || hitDelete) {
          updateInputRows();
        } else if (inputBox.value === "" && hitArrowUp) {
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
        updateInputRows();
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
      inputButton.onfocus = function () {
        inputButton.style = inputButtonDefaultStyle + inputHoverStyle;
      };
      inputButton.onblur = function () {
        inputButton.style = inputButtonDefaultStyle;
      };
      return inputButton;
    }

    function createConsoleOutput() {
      var defaultOutputStyle = 
      "margin-top: 1px !important; max-height: 100px !important; overflow: scroll !important; width: 90vw !important; background: black !important; color: white !important; border: none !important; border-radius: 0.3rem !important; padding: 5px !important;";
      var consoleOutput = document.createElement("pre");
      consoleOutput.id = "output_firefox-extension-console-log-element";
      consoleOutput.style = defaultOutputStyle;
      consoleOutput.onclick = function (e) {
        if (e.target !== consoleOutput) return;
        var expandedHeight = "90vh";
        var shouldCollapse = (consoleOutput.style.height === expandedHeight || consoleOutput.innerText === "");
        if (shouldCollapse) {
          consoleOutput.style = defaultOutputStyle;
        } else {
          consoleOutput.style.height = "90vh";
          consoleOutput.style.maxHeight = "90vh";
          consoleOutput.style.opacity = 0.9;
        }
      };
      return consoleOutput;
    }

    function createConsoleLogWidget() {
      var theWholeThingDiv = document.createElement("div");
      theWholeThingDiv.id = "firefox-extension-console-log-element";
      theWholeThingDiv.style = widgetDefaultStyle + "visibility: hidden;";
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

    function updateInputRows() {
      var newLineCharCount = (inputBox.value.match(%2F\\n%2Fg) || []).length;
      inputBox.setAttribute("rows", 1 + newLineCharCount);
    }

    function triggerInputToConsole() {
      var consoleInput = inputBox.value;
      if (consoleInput === "") makeInputGroupWobble();
      try {
        inputToConsole(consoleInput);
      } catch (e) {
        makeInputGroupWobble();
      }
    }

    function inputToConsole(stringInput) {
      stringInput = stringInput.trim();
      lastInput = stringInput;
      if (stringInput === "") return;
      if (handledClear(stringInput) || handledCustomCommandX(stringInput)) {
        return;
      }

      isFromInterface = true;
      console.log(stringInput);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
      consoleOutput.scrollIntoView();
    }

    function handledClear(stringInput) {
      if (stringInput === "clear()") {
        consoleOutput.innerHTML = "";
        clearInput();
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
        if (!confirmed) return false;
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

      var styleAlreadyExists = document.getElementById("wobble-css");
      if (!styleAlreadyExists) {
        var style = document.createElement("style");
        style.id = "wobble-css";
        style.type = "text%2Fcss";
        style.appendChild(wobbleCss);
        document.body.appendChild(style);
      }

      inputGroupDiv.classList.add("wobble");
      setTimeout(() => {
        inputGroupDiv.classList.remove("wobble");
      }, 500);
    }

    function enterLastInput() {
      inputBox.value = lastInput;
    }

    function $(selector, el) {
      if (!el) {
        el = document;
      }
      return el.querySelector(selector);
    }

    function $$(selector, el) {
      if (!el) {
        el = document;
      }
      return el.querySelectorAll(selector);
    }
  })();
  `;
    document.body.appendChild(script);
  }
})();
```
