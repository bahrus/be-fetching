# be-fetching

[![Playwright Tests](https://github.com/bahrus/be-fetching/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-fetching/actions/workflows/CI.yml)
<a href="https://nodei.co/npm/be-fetching/"><img src="https://nodei.co/npm/be-fetching.png"></a>
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-fetching?style=for-the-badge)](https://bundlephobia.com/result?p=be-fetching)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-fetching?compression=gzip">

```html
<input type=url be-fetching>
```

When a valid url is entered, fetches it.  Result goes to oInput.beDecorated.fetching.value.  oInput fires non bubbling event "enh-by-be-fetching-value-changed" when value changes.


TODO.  Support credentials like be-looking-up.

## Running locally

Any web server than can serve static files will do, but...

1.  Install git.
2.  Do a git clone or a git fork of repository https://github.com/bahrus/be-fetching
3.  Install node.js
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Using from ESM Module:

```JavaScript
import 'be-fetching/be-fetching.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-fetching';
</script>
```


