# be-fetching [WIP]

[![Playwright Tests](https://github.com/bahrus/be-fetching/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-fetching/actions/workflows/CI.yml)
<a href="https://nodei.co/npm/be-fetching/"><img src="https://nodei.co/npm/be-fetching.png"></a>
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-fetching?style=for-the-badge)](https://bundlephobia.com/result?p=be-fetching)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-fetching?compression=gzip">

*be-fetch* provides fetch support to the adorned element in a number of different ways:

## Example 1 - Enhancing the input element with type url


```html
<input type=url be-fetching>
```

When a valid url is entered, *be-fetching* fetches it.  Result goes to oInput.beEnhanced.beFetching.value.  oInput fires non bubbling event "enh-by-be-fetching.value-changed" when value changes.  While fetch is in progress, adds css class "be-fetching-fetch-in-progress" to the adorned element.

## Example 2 - Same as example 1, but specifying the url before and after the input element.

Suppose we want the input element *be-fetching* adorns to use the input element to only provide a part of the url it should fetch?

*be-fetching* supports that as well:

```html
<input be-fetching='{
    "pre": "https://cdn.jsdelivr.net/npm",
    "post": "/dist/custom-elements.json"
}' value=/@shoelace-style/shoelace>
```

## Example 3 Web Component At Your Service [TODO]

*be-fetching* can be trained to interact with more than one input (or form-associated) element, however.

Like [*be-kvetching*](https://github.com/bahrus/be-kvetching), *be-fetching* can dynamically turn an unknown element into a web component, where that web component serves as a non visible "web component as a service".  But *be-fetching* adds a few bells and whistles on top of what *be-kvetching* provides:

```html
<label for=operation>Operation:</label>
<input id=operation value=integrate>
<label for=expression>Expression:</label>
<input id=expression value="x^2">
<newton-microservice 
    for="operation expression" 
    be-fetching oninput="({operation, expression}) => ({
        url: `https://newton.now.sh/api/v2/${operation}/${expression}`
    })"
    target=json-viewer[-object]
    onerror="console.error(href)"
></newton-microservice>
<json-viewer -object aria-live=polite></json-viewer>
```

This will recalculate the integral (in this case) as the user types the expression.

To only recalculate it when focus is lost, and the onchange attribute:

```html
<label for=operation>Operation:</label>
<input id=operation value=integrate>
<label for=expression>Expression:</label>
<input id=expression value="x^2">
<newton-microservice 
    for="operation expression" 
    oninput="({operation, expression}) => ({
        url: `https://newton.now.sh/api/v2/${operation}/${expression`}`
    })"
    be-fetching onchange
    target=json-viewer[-object]
    onerror="console.error(href)"
></newton-microservice>
<json-viewer -object aria-live=polite></json-viewer>
```



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


