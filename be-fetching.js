import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFetching {
    #target;
    intro(proxy, target, beDecor) {
        this.#target = target;
        proxy.addEventListener('input', this.handleInput);
        this.handleInput();
    }
    async handleInput() {
        if (!this.#target.checkValidity())
            return;
        const value = this.#target.value;
        if (!value)
            return;
        const resp = await fetch(value);
        const respContentType = resp.headers.get('Content-Type');
        const as = respContentType === null ? 'html' : respContentType.includes('json') ? 'json' : 'html';
        const proxy = this.proxy;
        switch (as) {
            case 'html':
                proxy.innerHTML = await resp.text();
                break;
            case 'json':
                proxy.value = await resp.json();
                break;
        }
    }
    finale(proxy, target, beDecor) {
        proxy.removeEventListener('input', this.handleInput);
    }
}
const tagName = 'be-fetching';
const ifWantsToBe = 'fetching';
const upgrade = 'input[type="url"]';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: [],
        }
    },
    complexPropDefaults: {
        controller: BeFetching,
    }
});
register(ifWantsToBe, upgrade, tagName);
