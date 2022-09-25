import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFetching extends EventTarget {
    #abortController;
    setUp({ self }) {
        return {
            full: self.type === 'url',
            interpolating: self.type !== 'url'
        };
    }
    setupInterpolate(pp) {
        const { self, on } = pp;
        this.#disconnect();
        this.#abortController = new AbortController();
        self.addEventListener(on, e => {
            if (!self.checkValidity())
                return;
            this.#interpolate(pp);
        }, { signal: this.#abortController.signal });
        if (self.checkValidity())
            this.#interpolate(pp);
    }
    setupFull({ self, on, proxy }) {
        this.#disconnect();
        this.#abortController = new AbortController();
        self.addEventListener(on, e => {
            if (!self.checkValidity())
                return;
            proxy.url = self.value;
        }, { signal: this.#abortController.signal });
        if (self.checkValidity())
            proxy.url = self.value;
    }
    #interpolate({ start, self, end, proxy }) {
        proxy.url = start + self.value + end;
    }
    async onUrl({ url, proxy, debounceDuration }) {
        setTimeout(() => {
            proxy.urlEcho = url;
        }, debounceDuration);
    }
    async onStableUrl({ url, proxy }) {
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
        if (this.#abortController !== undefined)
            this.#abortController.abort();
    }
    finale(proxy, target, beDecor) {
        this.#disconnect();
    }
}
const tagName = 'be-fetching';
const ifWantsToBe = 'fetching';
const upgrade = 'input';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['value', 'start', 'end', 'on', 'interpolating', 'full', 'url', 'debounceDuration', 'urlEcho'],
            finale: 'finale',
            emitEvents: ['value'],
            proxyPropDefaults: {
                on: 'input',
                debounceDuration: 100,
            }
        },
        actions: {
            setUp: 'on',
            setupInterpolate: {
                ifAllOf: ['interpolating', 'start'],
                ifKeyIn: ['end']
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
