# Bookmarklet backup alternative

Right now, most experimental add-ons are disabled for _**Firefox**_ on mobile.

So instead, a [bookmarklet](https://github.com/hchiam/learning-js/tree/main/bookmarklets#bookmarklets) for _**Chrome**_ on mobile might work.

## Usage

Set up the bookmarklet:

1. Go to https://console-log-element-bookmarklet-backup.surge.sh
2. Find the link on the page, and long press on that link.
3. Copy the link address.
4. Hit the 3 dots in the browser controls, and then the star icon, to create a bookmark.
5. Edit that bookmark: long press inside the URL field to select all, and then paste the link you copied earlier. Now you've created a bookmarklet!

Use the bookmarklet:

1. Go to a page that you want to run the "Console Log Element" on.
2. Tap inside the URL box.
3. Start typing `javascript:` (make sure to type `:` to let Chrome to know that you're _not_ entering a Google search). Autocomplete should bring up bookmark suggestions.
4. Select the bookmark you created earlier.

Now you can use the "Console Log Element"! :)

## Development notes

```sh
bash deploy # https://console-log-element-bookmarklet-backup.surge.sh
```

```js
javascript:fetch(
  "https://raw.githubusercontent.com/hchiam/console-log-element/master/bookmarklet/console-log-element.js"
)
  .then(x=>x.text())
  .then(x=>eval(x));
```

The `"`s need to be encoded to `%22` for the URL in the HTML of the `surge` page:

```html
<a href="javascript:fetch(
    %22https://raw.githubusercontent.com/hchiam/console-log-element/master/bookmarklet/console-log-element.js%22
  )
    .then(x=>x.text())
    .then(x=>eval(x));" rel="noreferrer noopener">Use this link to create a bookmarklet in Chrome mobile.</a>
```
