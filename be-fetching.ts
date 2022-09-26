import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';

export class BeFetching extends EventTarget implements Actions {
    #abortController: AbortController | undefined;

    setUp({self}: PP){
        return {
            full: self.type === 'url',
            interpolating: self.type !== 'url'
        }
    }

    setupInterpolate(pp: PP): void {
        const {self, on, proxy} = pp;
        this.#disconnect();
        this.#abortController = new AbortController();
        self.addEventListener(on!, e => {
            if(!self.checkValidity()) return;
            this.#interpolate(pp);
        }, {signal: this.#abortController.signal});
        if(self.checkValidity()) this.#interpolate(pp);
        proxy.resolved = true;
    }

    setupFull({self, on, proxy}: PP): void {
        this.#disconnect();
        this.#abortController = new AbortController();
        self.addEventListener(on!, e => {
            if(!self.checkValidity()) return;
            proxy.url = self.value;
        }, {signal: this.#abortController.signal});
        if(self.checkValidity()) proxy.url = self.value;
        proxy.resolved = true;

    }

    #interpolate({start, self, end, proxy}: PP){
        proxy.url = start + self.value + end;
    }

    async onUrl({url, proxy, debounceDuration}: PP){
        setTimeout(() => {
            proxy.urlEcho = url;
        }, debounceDuration);
    }

    async onStableUrl({url, proxy}: PP){
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
        if(this.#abortController !== undefined) this.#abortController.abort();
    }

    finale(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps){
        this.#disconnect();
    }
}


const tagName = 'be-fetching';

const ifWantsToBe = 'fetching';

const upgrade = 'input';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['value', 'start', 'end', 'on', 'interpolating', 'full', 'url', 'debounceDuration', 'urlEcho'],
            finale: 'finale',
            emitEvents: ['value'],
            proxyPropDefaults:{
                on: 'input',
                debounceDuration: 100,
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