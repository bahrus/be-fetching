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
        const { enhancedElement } = self;
        const isFull = (enhancedElement instanceof HTMLInputElement && enhancedElement.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        };
    }
    setupInterpolate(self) {
        const { enhancedElement, on } = self;
        return [{ resolved: true }, { interpolateIfValid: { on, of: enhancedElement, doInit: true } }];
    }
    interpolateIfValid(self) {
        const { pre, enhancedElement, post, urlProp, baseLink } = self;
        if (!this.checkValidity(self))
            return;
        const base = baseLink !== undefined ? globalThis[baseLink].href : '';
        const url = base + pre + self[urlProp] + post;
        return {
            url
        };
    }
    checkValidity(self) {
        const { enhancedElement } = self;
        if (enhancedElement instanceof HTMLInputElement) {
            return enhancedElement.checkValidity();
        }
        return true;
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
