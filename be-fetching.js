// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-fetching/types' */;

/**
 * @implements {Actions}
 */
class BeFetching extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement>}
     */
    static config = {
        compacts:{
            echo_url_to_urlEcho_after: 'debounceDuration',
            when_eventName_changes_call_setUp: 0
        },
        hitch:{
            when_enhancedElement_emits_eventName_inc_eventCount_by: 1
        },
        propDefaults:{
            eventName: 'input',
            debounceDuration: 100,
            urlProp: 'value',
            pre: '',
            post: '',
            eventCount: 1,
            full: false,
            interpolating: false,
        },
        propInfo: {
            ...propInfo,
            url:{},
            urlEcho:{},
            value: {
                ro: true,
            }
        },
        positractions: [resolved, rejected],
        actions:{
            interpolateIfValid: {
                ifAllOf: ['eventCount', 'interpolating']
            },
            setFullUrlIfValid: {
                ifAllOf: ['eventCount', 'full']
            },
            
        }
    }

    de = de;

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    setUp(self){
        const {enhancedElement} = self;
        const isFull = (enhancedElement instanceof HTMLInputElement && enhancedElement.type === 'url');
        return /** @type {PAP} */ ({
            full: isFull,
            interpolating: !isFull,
        });
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    interpolateIfValid(self) {
        const {pre, enhancedElement, post, urlProp, baseLink} = self;
        if(!this.checkValidity(self)) return;
        const base = baseLink !== undefined ? /** @type {any} */(globalThis)[baseLink].href : '';
        const url = base + pre + /** @type {any} */(enhancedElement)[urlProp] + post;
        return  /** @type {PAP} */ ({
            url 
        });
    }


    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    checkValidity(self){
        const {enhancedElement} = self;
        if(enhancedElement instanceof HTMLInputElement){
            return enhancedElement.checkValidity();
        }
        return true;
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    setFullUrlIfValid(self){
        const {enhancedElement, urlProp} = self;
        if(!this.checkValidity(self)) return;
        return /** @type {PAP} */ ({
            url: /** @type {any} */(enhancedElement)[urlProp],
        });
    }

}

await BeFetching.bootUp();
export { BeFetching };