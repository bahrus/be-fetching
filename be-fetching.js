import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeFetching extends EventTarget {
    setUp({ self }) {
        const isFull = (self instanceof HTMLInputElement && self.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        };
    }
    setupInterpolate(pp) {
        const { self: of, on } = pp;
        return [{ resolved: true }, { interpolateIfValid: { on, of, doInit } }];
    }
    interpolateIfValid({ pre, self, post, proxy, urlProp, baseLink }) {
        if (!this.checkValidity)
            return;
        const base = baseLink !== undefined ? globalThis[baseLink].href : '';
        const url = base + pre + self[urlProp] + post;
        return {
            url
        };
    }
    checkValidity(self) {
        if (self instanceof HTMLInputElement) {
            return self.checkValidity();
        }
        return true;
    }
    setupFull({ self: of, on, proxy, urlProp }) {
        return [{ resolved: true }, { setUrlIfValid: { on, of, doInit } }];
    }
    setUrlIfValid({ self, urlProp }) {
        if (!this.checkValidity(self))
            return;
        return {
            url: self[urlProp],
        };
    }
    #prevTimeout;
    async onUrl({ url, proxy, debounceDuration }) {
        if (this.#prevTimeout !== undefined)
            clearTimeout(this.#prevTimeout);
        this.#prevTimeout = setTimeout(() => {
            proxy.urlEcho = url;
        }, debounceDuration);
    }
    #fetchController;
    async fetchWhenSettled({ url, options }) {
        if (this.#fetchController !== undefined) {
            this.#fetchController.abort();
        }
        this.#fetchController = new AbortController();
        let init = {};
        if (options !== undefined) {
            const { FetchOptions } = await import('./FetchOptions.js');
            const fo = new FetchOptions(options);
            init = await fo.getInitObj();
        }
        init.signal = this.#fetchController.signal;
        let resp;
        try {
            resp = await fetch(url, init);
        }
        catch (e) {
            console.warn(e);
            return;
        }
        const respContentType = resp.headers.get('Content-Type');
        const as = respContentType === null ? 'html' : respContentType.includes('json') ? 'json' : 'html';
        let value;
        switch (as) {
            case 'html':
                value = await resp.text();
                break;
            case 'json':
                value = await resp.json();
                break;
        }
        return { value };
    }
}
const doInit = true;
const tagName = 'be-fetching';
const ifWantsToBe = 'fetching';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: [
                'value', 'pre', 'post', 'on', 'interpolating', 'full', 'url', 'debounceDuration', 'urlEcho',
                'urlProp'
            ],
            emitEvents: ['value'],
            proxyPropDefaults: {
                on: 'input',
                debounceDuration: 100,
                urlProp: 'value',
                pre: '',
                post: ''
            }
        },
        actions: {
            setUp: 'on',
            setupInterpolate: {
                ifAllOf: ['interpolating', 'pre'],
                ifKeyIn: ['post']
            },
            setupFull: 'full',
            onUrl: 'url',
            fetchWhenSettled: {
                ifAllOf: ['url'],
                ifEquals: ['url', 'urlEcho']
            }
        }
    },
    complexPropDefaults: {
        controller: BeFetching,
    }
});
register(ifWantsToBe, upgrade, tagName);
