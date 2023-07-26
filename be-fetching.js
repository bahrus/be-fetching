import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeFetching extends BE {
    static get beConfig() {
        return {
            parse: true,
        };
    }
    setUp(self) {
        const isFull = (self instanceof HTMLInputElement && self.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        };
    }
}
const tagName = 'be-fetching';
const ifWantsToBe = 'fetching';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {}
    },
    superclass: BeFetching
});
register(ifWantsToBe, upgrade, tagName);
