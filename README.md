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

Example 3 -- specify a target [TODO]

```html
<input be-fetching='{
    "pre": "https://cdn.jsdelivr.net/npm",
    "post": "/dist/custom-elements.json",
    "target": "json-viewer[-object]"
}' value=/@shoelace-style/shoelace>
...

<json-viewer -object aria-live=polite></json-viewer>
```

When a target is specified (as above), it will automatically set the target's aria-busy to true until the fetch is complete, and also set aria-live=polite if no other value is specified.

## Example 4 Web Component At Your Service [TODO]

*be-fetching* can be trained to interact with more than one input (or form-associated) element, however.

Like [*be-kvetching*](https://github.com/bahrus/be-kvetching), *be-fetching* can dynamically turn an unknown element into a web component, where that web component serves as a non visible "web component as a service".  But *be-fetching* adds a few bells and whistles on top of what *be-kvetching* provides:

1.  It can integrate near-by input or form associated elements, in order to formulate the url, as well as the (POST) body.

Okay, one bell and whistle. 

Sample markup:

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
<json-viewer -object></json-viewer>
```

This will recalculate the integral (in this case) as the user types the expression.

To only recalculate it when focus is lost, add the onchange attribute.

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

In addition to *be-fetching* dynamically extending the same base class, [k-fetch](https://github.com/bahrus/k-fetch), as the one *be-kvetching* uses, it shares some additional key features.  So at the risk of [plagiarizing myself](https://github.com/bahrus/be-kvetching?tab=readme-ov-file#using-a-custom-web-component-to-extend-untested):

The *k-fetch* web component is a fairly non-opinionated web component.  But often times any particular app will want to make particular choices as far as how to define the base url for all the fetch requests, credentials, JWT headers, etc.  k-fetch provides [many small methods](https://github.com/bahrus/k-fetch/blob/baseline/k-fetch.ts) that can be overridden to allow this to be customized according to such needs.

Such apps with these particular needs can define their own web component, extending k-fetch, which adopts whatever common practices the application calls for.

*be-fetching* can then be instructed to use this custom web component definition, instead of the default *k-fetch*, via two alternate ways (or combine as needs warrant):

### The DRY Way [TODO]

Somewhere in the document (ideally, perhaps, within the head tag at the top), add a "link" tag (or any other tag really) with id be-fetching, and attribute data-inherits.  For example:

```html
<html>
    <head>
        <link rel=modulepreload id=be-fetching data-inherits=my-custom-base-fetch-element href=https://myapp.com/resources/be-fetching.js >
    </head>
</html>
```

### Being Explicit [TODO]

We can also/alternatively specify the custom element name to inherit from within the adorned tag itself, without affecting others:


```html
<medical-prescriptions zero=name
    enh-be-kvetching 
    inherits=my-custom-base-fetch-element
    onerror
    href="https://my-website.com/prescriptions/patient/zero">
<medical-prescriptions>





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


