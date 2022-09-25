import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';

export class BeFetching extends EventTarget implements Actions {
    #abortController: AbortController | undefined;

    // intro(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps){
    //     this.#abortController = new AbortController();
    //     proxy.addEventListener('input', e => {
    //         this.handleInput(proxy);
    //     }, {
    //         signal: this.#abortController.signal,
    //     });
    //     this.handleInput(proxy);
    // }

    setUp({self, proxy}: PP){
        return {
            full: self.type === 'url',
            interpolating: self.type !== 'url'
        }
    }

    setupInterpolate(pp: PP): void {
        const {self, on} = pp;
        this.#disconnect();
        this.#abortController = new AbortController();
        self.addEventListener(on!, e => {
            if(!self.checkValidity()) return;
            this.#interpolate(pp);
        }, {signal: this.#abortController.signal});
        if(self.checkValidity()) this.#interpolate(pp);
    }

    setupFull({self, on, proxy}: PP): void {
        this.#disconnect();
        this.#abortController = new AbortController();
        self.addEventListener(on!, e => {
            if(!self.checkValidity()) return;
            proxy.url = self.value;
        }, {signal: this.#abortController.signal});
        if(self.checkValidity()) proxy.url = self.value;

    }

    #interpolate({start, self, end, proxy}: PP){
        proxy.value = start + self.value + end;
    }

    async onUrl({url, proxy}: PP){
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
            virtualProps: ['value', 'start', 'end', 'on', 'interpolating', 'full', 'url'],
            //intro: 'intro',
            finale: 'finale',
            emitEvents: ['value'],
            proxyPropDefaults:{
                on: 'input'
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
        }
    },
    complexPropDefaults: {
        controller: BeFetching,
    }
});

register(ifWantsToBe, upgrade, tagName);