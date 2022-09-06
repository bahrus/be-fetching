import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {Actions, Proxy, PP, VirtualProps} from './types';

export class BeFetching extends EventTarget implements Actions {
    #abortController: AbortController | undefined;

    intro(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps){
        this.#abortController = new AbortController();
        proxy.addEventListener('input', e => {
            this.handleInput(proxy);
        }, {
            signal: this.#abortController.signal,
        });
        this.handleInput(proxy);
    }



    async handleInput(proxy: Proxy){
        if(!proxy.checkValidity()) return;
        const value = proxy.self.value;
        if(!value) return;
        const resp = await fetch(value);
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
        proxy.resolved = true;
    }

    disconnect(){
        if(this.#abortController !== undefined) this.#abortController.abort();
    }

    finale(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps){
        this.disconnect();
    }
}


const tagName = 'be-fetching';

const ifWantsToBe = 'fetching';

const upgrade = 'input[type="url"]';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['value'],
            intro: 'intro',
            finale: 'finale',
            emitEvents: ['value'],
        }
    },
    complexPropDefaults: {
        controller: BeFetching,
    }
});

register(ifWantsToBe, upgrade, tagName);