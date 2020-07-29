# [![icon](https://raw.githubusercontent.com/hchiam/console-log-element/master/console-log-element.png)](https://addons.mozilla.org/en-US/firefox/addon/console-log-element) Console Log Element

[![version](https://img.shields.io/github/release/hchiam/console-log-element?style=flat-square)](https://github.com/hchiam/console-log-element/releases) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/hchiam/console-log-element/blob/master/LICENSE) [![HitCount](http://hits.dwyl.com/hchiam/console-log-element.svg)](http://hits.dwyl.com/hchiam/console-log-element)

Firefox Add-on page: <https://addons.mozilla.org/en-US/firefox/addon/console-log-element>

Mobile device demo: <https://drive.google.com/open?id=1azFuTrUgoU6IBHb1BLJCQJlyYscMtdSS>

Laptop demo: <https://drive.google.com/open?id=14s2YO8iKGH9RbK1AkUGLlHreGoV9Pcsn>

Sometimes I wish I could just open the console log right on a mobile device.

This simple add-on enables you to send commands to the console log without having to open the dev tools, even on mobile.

Once installed, you can bring up the console log interface by clicking on the add-on icon and button. You can also:

- Use `$()` as a shortcut for `document.querySelector()`, which works like jQuery's `$()`.
- Use `$$()` as a shortcut for `document.querySelectorAll()`.
- Use `clear()` to clear the output.
- Submit `"x"` to hide the interface.
- You can tap any previous (valid) input to quickly reuse it, and type less on mobile.
- The input is a multiline textarea, so you can hit `Enter` to input multiple lines of code.
- To submit, hit the "Send command" button, or `Shift+Enter` or `Ctrl+Enter`.
- Click on the output to expand/collapse it.

## Other links

Live CodePen demo: <https://codepen.io/hchiam/pen/ZEbYgQG>

GitHub backup code (_note: may be out of date_): <https://github.com/hchiam/learning-js/blob/master/consoleLogElement.js>

Learn to make your own Firefox add-on: <https://github.com/hchiam/learning-firefox-extension>

Useful pages to use when debugging the project itself locally:

- [about:addons](about:addons)

- [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
