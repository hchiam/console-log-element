javascript:(function () {
  createConsoleLog();

  showConsoleLog();

  function showConsoleLog() {
    (function () {
      var widgetDefaultStyle =
        %22all: initial; z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important; left: 0 !important; visibility: visible; font-family: avenir, arial, tahoma, monospace !important; font-size: 16px !important; margin-left: 5px !important; transition: 0.25s !important;%22;

      var theWholeThingDiv = document.getElementById(
        %22firefox-extension-console-log-element%22
      );
      theWholeThingDiv.hidden = false;
      theWholeThingDiv.style = widgetDefaultStyle;
      theWholeThingDiv.scrollIntoView();
      var inputBox = document.getElementById(
        %22inputBox_firefox-extension-console-log-element%22
      );
      inputBox.value = %22%22;
      inputBox.setAttribute(%22rows%22, 1);
      setTimeout(() => {
        inputBox.focus();
      }, 100);
    })();
  }

  function createConsoleLog() {
    var scriptAlreadyExists = document.getElementById(
      %22script_firefox-extension-console-log-element%22
    );
    if (scriptAlreadyExists) return;

    var script = document.createElement(%22script%22);
    script.id = %22script_firefox-extension-console-log-element%22;
    script.innerHTML = `

  (function () {

    var elementAlreadyExists = document.getElementById(
      %22firefox-extension-console-log-element%22
    );
    var widgetDefaultStyle =
    %22all: initial; z-index: 99999 !important; padding: 0 !important; position: fixed !important; bottom: 0 !important; visibility: visible; font-family: avenir, arial, tahoma, monospace !important; font-size: 1.5rem !important; margin-left: 5px !important; transition: 0.25s !important;%22;
    if (elementAlreadyExists) {
      elementAlreadyExists.hidden = false;
      elementAlreadyExists.style = widgetDefaultStyle;
      elementAlreadyExists.scrollIntoView();
      document
        .getElementById(%22inputBox_firefox-extension-console-log-element%22)
        .focus();
      return;
    }

    var lastInput = %22%22;

    var darkMode = %22background: #333; color: lime;%22;
    var defaultStyle =
      darkMode + %22padding: 0.3rem !important; border: none !important;%22;
    var inputBoxDefaultStyle =
      defaultStyle +
      %22margin-right: 0 !important; border-radius: 0.2rem 0 0 0.2rem !important; background: black;%22;
    var inputButtonDefaultStyle =
      defaultStyle +
      %22margin-left: 0 !important; border-radius: 0 0.2rem 0.2rem 0 !important;%22;
    var inputHoverStyle = %22background: lime; color: black !important;%22;

    var inputGroupDiv = document.createElement(%22div%22);
    inputGroupDiv.id = %22inputGroup_firefox-extension-console-log-element%22;
    inputGroupDiv.style =
      %22border-radius: 0.3rem !important; display: grid !important; grid-template: auto %2F auto 15ch; border: 2px solid lightgrey !important; padding: 0 !important;%22;

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
      var temp = document.getElementById(%22firefox-extension-console-log-element%22);
      document.getElementById(%22firefox-extension-console-log-element%22).remove();
      var output = %22%22;
      try {
        output = eval(input);
        if (isElement(output)) {
          output = output.outerHTML.replace(%2F<%2Fg, %22&lt;%22).replace(%2F\\\%2F%2Fg, %22%2F%22);
        } else if (typeof output === %22object%22) {
          output = JSON.stringify(output, null, 4);
        } else if (typeof output === %22string%22) {
          output = output.replace(%2F<%2Fg, %22&lt;%22).replace(%2F\\\%2F%2Fg, %22%2F%22);
        }
        input = String(input).replace(%2F<%2Fg, %22&lt;%22).replace(%2F\\\%2F%2Fg, %22%2F%22);
        consoleOutput.innerHTML +=
          '<button style=%22background: black; color: lime; text-align: left;%22 onclick=%22document.getElementById(\\'inputBox_firefox-extension-console-log-element\\').value=this.innerText;%22>' +
          input +
          %22<%2Fbutton><br%2F>%22 +
          '<span style=%22background: black; color: white;%22>' +
          output +
          %22<%2Fspan><br%2F><br%2F>%22;
        clearInput();
      } catch(e) {
        inputBox.value = input;
        updateInputRows();
        consoleOutput.innerHTML +=
          '<span style=%22background: black; color: lime;%22>' +
          input +
          %22<%2Fspan><br%2F>%22 +
          '<span style=%22background: black; color: white;%22>' +
          %22<small><em>%22 + e + %22<%2Fem><%2Fsmall>%22 +
          %22<%2Fspan><br%2F><br%2F>%22;
        makeInputGroupWobble();
      }
      document.body.appendChild(temp);
      inputBox.focus();
    }

    function createInputBox() {
      var inputBox = document.createElement(%22textarea%22);
      inputBox.id = %22inputBox_firefox-extension-console-log-element%22;
      inputBox.placeholder = %22console log input here%22;
      inputBox.title = %22enter x to hide this widget%22;
      inputBox.style = inputBoxDefaultStyle;
      inputBox.setAttribute(%22autocapitalize%22, %22none%22);
      inputBox.setAttribute(%22rows%22, 1);
      inputBox.onkeyup = function (event) {
        var holdingShiftOrCtrl = event.shiftKey === true || event.ctrlKey === true;
        var hitEnter = event.key === %22Enter%22 || event.keyCode === 13;
        var hitDelete = event.key === %22Delete%22 || event.keyCode === 8 || event.keyCode === 46;
        var hitArrowUp = event.key === %22ArrowUp%22 || event.keyCode === 38;
        if (holdingShiftOrCtrl && hitEnter) {
          triggerInputToConsole();
        } else if (hitEnter || hitDelete) {
          updateInputRows();
        } else if (inputBox.value === %22%22 && hitArrowUp) {
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
      var inputButton = document.createElement(%22button%22);
      inputButton.id = %22inputButton_firefox-extension-console-log-element%22;
      inputButton.innerText = %22Send command%22;
      inputButton.title = %22enter x to hide this widget%22;
      inputButton.style = inputButtonDefaultStyle;
      inputButton.onclick = function () {
        triggerInputToConsole();
        updateInputRows();
        inputBox.focus();
      };
      inputButton.onmouseenter = function () {
        inputButton.style = inputButtonDefaultStyle + inputHoverStyle;
        if (inputBox.value === %22%22) {
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
      %22margin-top: 1px !important; max-height: 100px !important; overflow: scroll !important; width: 90vw !important; background: black !important; color: white !important; border: none !important; border-radius: 0.3rem !important; padding: 5px !important;%22;
      var consoleOutput = document.createElement(%22pre%22);
      consoleOutput.id = %22output_firefox-extension-console-log-element%22;
      consoleOutput.style = defaultOutputStyle;
      consoleOutput.onclick = function (e) {
        if (e.target !== consoleOutput) return;
        var expandedHeight = %2290vh%22;
        var shouldCollapse = (consoleOutput.style.height === expandedHeight || consoleOutput.innerText === %22%22);
        if (shouldCollapse) {
          consoleOutput.style = defaultOutputStyle;
        } else {
          consoleOutput.style.height = %2290vh%22;
          consoleOutput.style.maxHeight = %2290vh%22;
          consoleOutput.style.opacity = 0.9;
        }
      };
      return consoleOutput;
    }

    function createConsoleLogWidget() {
      var theWholeThingDiv = document.createElement(%22div%22);
      theWholeThingDiv.id = %22firefox-extension-console-log-element%22;
      theWholeThingDiv.style = widgetDefaultStyle + %22visibility: hidden;%22;
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
      inputBox.setAttribute(%22rows%22, 1 + newLineCharCount);
    }

    function triggerInputToConsole() {
      var consoleInput = inputBox.value;
      if (consoleInput === %22%22) makeInputGroupWobble();
      try {
        inputToConsole(consoleInput);
      } catch (e) {
        makeInputGroupWobble();
      }
    }

    function inputToConsole(stringInput) {
      stringInput = stringInput.trim();
      lastInput = stringInput;
      if (stringInput === %22%22) return;
      if (handledClear(stringInput) || handledCustomCommandX(stringInput)) {
        return;
      }

      isFromInterface = true;
      console.log(stringInput);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
      consoleOutput.scrollIntoView();
    }

    function handledClear(stringInput) {
      if (stringInput === %22clear()%22) {
        consoleOutput.innerHTML = %22%22;
        clearInput();
        return true;
      }
      return false;
    }

    function handledCustomCommandX(stringInput) {
      stringInput = stringInput.toLowerCase();
      if (
        stringInput === %22x%22 ||
        stringInput === '%22x%22' ||
        stringInput === %22'x'%22
      ) {
        var confirmed = confirm(%22Do you want to hide this console log widget?%22);
        if (!confirmed) return false;
        theWholeThingDiv.hidden = true;
        theWholeThingDiv.style = widgetDefaultStyle + %22visibility: hidden;%22;
        return true;
      }
      return false;
    }

    function clearInput() {
      inputBox.value = %22%22;
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

      var styleAlreadyExists = document.getElementById(%22wobble-css%22);
      if (!styleAlreadyExists) {
        var style = document.createElement(%22style%22);
        style.id = %22wobble-css%22;
        style.type = %22text%2Fcss%22;
        style.appendChild(wobbleCss);
        document.body.appendChild(style);
      }

      inputGroupDiv.classList.add(%22wobble%22);
      setTimeout(() => {
        inputGroupDiv.classList.remove(%22wobble%22);
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
