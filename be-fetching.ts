import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';

export class BeFetching extends EventTarget implements Actions {
    #eventController: AbortController | undefined;
    #fetchController: AbortController | undefined;
    setUp({self}: PP){
        const isFull = (self instanceof HTMLInputElement && self.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull
        }
    }

    setupInterpolate(pp: PP): void {
        const {self, on, proxy} = pp;
        this.#disconnect();
        this.#eventController = new AbortController();
        self.addEventListener(on!, e => {
            if(!this.checkValidity(self)) return;
            this.#interpolate(pp);
        }, {signal: this.#eventController.signal});
        if(this.checkValidity(self)) this.#interpolate(pp);
        proxy.resolved = true;
    }

    checkValidity(self: Element){
        if(self instanceof HTMLInputElement){
            return self.checkValidity();
        }
        return true;
    }

    setupFull({self, on, proxy, urlProp}: PP): void {
        this.#disconnect();
        this.#eventController = new AbortController();
        self.addEventListener(on!, e => {
            if(!this.checkValidity(self)) return;
            proxy.url = (<any>self)[urlProp!];
        }, {signal: this.#eventController.signal});
        if(this.checkValidity(self)) proxy.url = (<any>self)[urlProp!];
        proxy.resolved = true;

    }

    #interpolate({start, self, end, proxy, urlProp, baseLink}: PP){
        const base = baseLink !== undefined ? (<any>globalThis)[baseLink].href : '';
        proxy.url = base + start + (<any>self)[urlProp!] + end;
    }

    async onUrl({url, proxy, debounceDuration}: PP){
        setTimeout(() => {
            proxy.urlEcho = url;
        }, debounceDuration);
    }

    async onStableUrl({url, proxy, options}: PP){
        if(this.#fetchController !== undefined){
            this.#fetchController.abort();
        }
        this.#fetchController = new AbortController();
        let init: RequestInit = {};
        if(options !== undefined){
            const {FetchOptions} = await import('./FetchOptions.js');
            const fo = new FetchOptions(options);
            init = await fo.getInitObj();
        }
        //const init = options?.init || {};
        init.signal = this.#fetchController.signal;
        const resp = await fetch(url);
        const respContentType = resp.headers.get('Content-Type');
        const as = respContentType === null ? 'html' : respContentType.includes('json') ? 'json' : 'html';
        switch(as){
            case 'html':
                proxy.value = await resp.text();
                break;
            case 'json':
                proxy.value = await resp.json();
                break;
        } 
    }


    #disconnect(){
        if(this.#eventController !== undefined) this.#eventController.abort();
    }

    finale(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps){
        this.#disconnect();
    }
}


const tagName = 'be-fetching';

const ifWantsToBe = 'fetching';

const upgrade = '*';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: [
                'value', 'start', 'end', 'on', 'interpolating', 'full', 'url', 'debounceDuration', 'urlEcho',
                'urlProp'
            ],
            finale: 'finale',
            emitEvents: ['value'],
            proxyPropDefaults:{
                on: 'input',
                debounceDuration: 100,
                urlProp: 'value'
            }
        },
        actions:{
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