import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {BeFetchingActions, BeFetchingProps, BeFetchingVirtualProps} from './types';

export class BeFetching extends EventTarget implements BeFetchingActions {
    intro(proxy: HTMLInputElement & BeFetchingVirtualProps, target: HTMLInputElement, beDecor: BeDecoratedProps){
        proxy.addEventListener('input', this.handleInput);
        this.handleInput();
    }

    handleInput = async () => {
        if(!this.proxy.self.checkValidity()) return;
        const value = this.proxy.self.value;
        if(!value) return;
        const resp = await fetch(value);
        const respContentType = resp.headers.get('Content-Type');
        const as = respContentType === null ? 'html' : respContentType.includes('json') ? 'json' : 'html';
        const proxy = this.proxy;
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

    finale(proxy: HTMLInputElement & BeFetchingVirtualProps, target: HTMLInputElement, beDecor: BeDecoratedProps){
        proxy.removeEventListener('input', this.handleInput);
    }
}

export interface BeFetching extends BeFetchingProps{}

const tagName = 'be-fetching';

const ifWantsToBe = 'fetching';

const upgrade = 'input[type="url"]';

define<BeFetchingProps & BeDecoratedProps<BeFetchingProps, BeFetchingActions>, BeFetchingActions>({
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