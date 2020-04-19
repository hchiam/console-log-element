# Console Log Element

![version](https://img.shields.io/github/release/hchiam/console-log-element) [![HitCount](http://hits.dwyl.com/hchiam/console-log-element.svg)](http://hits.dwyl.com/hchiam/console-log-element)

Firefox Add-on page: <https://addons.mozilla.org/en-US/firefox/addon/console-log-element>

[![icon](https://raw.githubusercontent.com/hchiam/console-log-element/master/console-log-element.png)](https://addons.mozilla.org/en-US/firefox/addon/console-log-element)

Sometimes I wish I could just open the console log right on a mobile device.

This simple add-on enables you to send commands to the console log without having to open the dev tools, even on mobile.

Once installed, you can bring up the console log interface by clicking on the add-on icon and button. You can also:

- Use `$()` as a shortcut for `document.querySelector()`, which works like jQuery's `$()`.
- Use `$$()` as a shortcut for `document.querySelectorAll()`.
- Use `clear()` to clear the output.
- Submit `"x"` to hide the interface.
- Hit the up arrow to use your previous command.
- To submit, hit the "Send command" button, or `Shift+Enter` or `Ctrl+Enter`.
- Click on the output to expand/collapse it.

## Other links

Live CodePen demo: <https://codepen.io/hchiam/pen/ZEbYgQG>

GitHub backup code (_note: may be out of date_): <https://github.com/hchiam/learning-js/blob/master/consoleLogElement.js>

Learn to make your own Firefox add-on: <https://github.com/hchiam/learning-firefox-extension>

Useful pages to use when debugging the project itself locally:

- [about:addons](about:addons)

- [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
