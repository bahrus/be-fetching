import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';
import {Actions, Proxy, PP, PPP, PPE, VirtualProps, ProxyProps} from './types';

export class BeFetching extends EventTarget implements Actions {
    setUp({self}: PP){
        const isFull = (self instanceof HTMLInputElement && self.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        } as PPP;
    }

    setupInterpolate(pp: PP){
        const {self: of, on} = pp;
        return [{resolved: true}, {interpolateIfValid: {on, of, doInit}}] as PPE;
    }

    interpolateIfValid({pre, self, post, proxy, urlProp, baseLink}: PP) {
        if(!this.checkValidity) return;
        const base = baseLink !== undefined ? (<any>globalThis)[baseLink].href : '';
        const url = base + pre + (<any>self)[urlProp!] + post;
        return {
            url 
        } as PPP;
    }

    checkValidity(self: Element){
        if(self instanceof HTMLInputElement){
            return self.checkValidity();
        }
        return true;
    }

    setupFull({self: of, on, proxy, urlProp}: PP): PPE {
        return [{resolved: true}, {setUrlIfValid: {on, of, doInit}}] as PPE;
    }

    setUrlIfValid({self, urlProp}: PP){
        if(!this.checkValidity(self)) return;
        return {
            url: (<any>self)[urlProp!],
        } as PP;
    }

    #prevTimeout: string | number | NodeJS.Timeout | undefined;
    async onUrl({url, proxy, debounceDuration}: PP){
        if(this.#prevTimeout !== undefined) clearTimeout(this.#prevTimeout);
        this.#prevTimeout = setTimeout(() => {
            proxy.urlEcho = url;
        }, debounceDuration);
    }

    #fetchController: AbortController | undefined;
    async fetchWhenSettled({url, options}: PP){
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
        init.signal = this.#fetchController.signal;
        let resp: Response;
        try{
            resp = await fetch(url, init);
        }catch(e: any){
            console.warn(e);
            return;
        }
        const respContentType = resp.headers.get('Content-Type');
        const as = respContentType === null ? 'html' : respContentType.includes('json') ? 'json' : 'html';
        let value: any;
        switch(as){
            case 'html':
                value = await resp.text();
                break;
            case 'json':
                value = await resp.json();
                break;
        }
        return {value} as PPP; 
    }

}

const doInit = true;

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
                'value', 'pre', 'post', 'on', 'interpolating', 'full', 'url', 'debounceDuration', 'urlEcho',
                'urlProp'
            ],
            emitEvents: ['value'],
            proxyPropDefaults:{
                on: 'input',
                debounceDuration: 100,
                urlProp: 'value',
                pre:'',
                post: ''
            }
        },
        actions:{
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