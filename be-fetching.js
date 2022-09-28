import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFetching extends EventTarget {
    #eventController;
    #fetchController;
    setUp({ self }) {
        const isFull = (self instanceof HTMLInputElement && self.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull
        };
    }
    setupInterpolate(pp) {
        const { self, on, proxy } = pp;
        this.#disconnect();
        this.#eventController = new AbortController();
        self.addEventListener(on, e => {
            if (!this.checkValidity(self))
                return;
            this.#interpolate(pp);
        }, { signal: this.#eventController.signal });
        if (this.checkValidity(self))
            this.#interpolate(pp);
        proxy.resolved = true;
    }
    checkValidity(self) {
        if (self instanceof HTMLInputElement) {
            return self.checkValidity();
        }
        return true;
    }
    setupFull({ self, on, proxy, urlProp }) {
        this.#disconnect();
        this.#eventController = new AbortController();
        self.addEventListener(on, e => {
            if (!this.checkValidity(self))
                return;
            proxy.url = self[urlProp];
        }, { signal: this.#eventController.signal });
        if (this.checkValidity(self))
            proxy.url = self[urlProp];
        proxy.resolved = true;
    }
    #interpolate({ pre, self, post, proxy, urlProp, baseLink }) {
        const base = baseLink !== undefined ? globalThis[baseLink].href : '';
        proxy.url = base + pre + self[urlProp] + post;
    }
    async onUrl({ url, proxy, debounceDuration }) {
        setTimeout(() => {
            proxy.urlEcho = url;
        }, debounceDuration);
    }
    async onStableUrl({ url, proxy, options }) {
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
        //const init = options?.init || {};
        init.signal = this.#fetchController.signal;
        const resp = await fetch(url);
        const respContentType = resp.headers.get('Content-Type');
        const as = respContentType === null ? 'html' : respContentType.includes('json') ? 'json' : 'html';
        switch (as) {
            case 'html':
                proxy.value = await resp.text();
                break;
            case 'json':
                proxy.value = await resp.json();
                break;
        }
    }
    #disconnect() {
        if (this.#eventController !== undefined)
            this.#eventController.abort();
    }
    finale(proxy, target, beDecor) {
        this.#disconnect();
    }
}
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
            finale: 'finale',
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
            onStableUrl: {
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
