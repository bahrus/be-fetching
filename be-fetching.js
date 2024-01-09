import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
export class BeFetching extends BE {
    static get beConfig() {
        return {
            parse: true,
        };
    }
    setUp(self) {
        const { enhancedElement } = self;
        const isFull = (enhancedElement instanceof HTMLInputElement && enhancedElement.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        };
    }
    setupInterpolate(self) {
        const { enhancedElement, on } = self;
        return [{ resolved: true }, { interpolateIfValid: { on, of: enhancedElement, doInit: true } }];
    }
    interpolateIfValid(self) {
        const { pre, enhancedElement, post, urlProp, baseLink } = self;
        if (!this.checkValidity(self))
            return;
        const base = baseLink !== undefined ? globalThis[baseLink].href : '';
        const url = base + pre + enhancedElement[urlProp] + post;
        return {
            url
        };
    }
    checkValidity(self) {
        const { enhancedElement } = self;
        if (enhancedElement instanceof HTMLInputElement) {
            return enhancedElement.checkValidity();
        }
        return true;
    }
    setupFull(self) {
        const { enhancedElement, on, urlProp } = self;
        return [{ resolved: true }, { setUrlIfValid: { on, of: enhancedElement, doInit: true } }];
    }
    setUrlIfValid(self) {
        const { enhancedElement, urlProp } = self;
        if (!this.checkValidity(self))
            return;
        return {
            url: enhancedElement[urlProp],
        };
    }
    #prevTimeout;
    async onUrl(self) {
        const { url, debounceDuration } = self;
        if (this.#prevTimeout !== undefined)
            clearTimeout(this.#prevTimeout);
        this.#prevTimeout = setTimeout(() => {
            self.urlEcho = url;
        }, debounceDuration);
    }
    #fetchController;
    async fetchWhenSettled(self) {
        const { url, options, enhancedElement } = self;
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
        const className = 'be-fetching-fetch-in-progress';
        enhancedElement.classList.add(className);
        try {
            resp = await fetch(url, init);
        }
        catch (e) {
            console.warn(e);
            enhancedElement.classList.remove(className);
            return;
        }
        enhancedElement.classList.remove(className);
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
export const tagName = 'be-fetching';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
            on: 'input',
            debounceDuration: 100,
            urlProp: 'value',
            pre: '',
            post: ''
        },
        propInfo: {
            ...propInfo,
            value: {
                notify: {
                    dispatch: true,
                    dispatchFromEnhancedElement: true
                }
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
    superclass: BeFetching
});
