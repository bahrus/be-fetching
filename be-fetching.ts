import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';

export class BeFetching extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
        } as BEConfig;
    }

    setUp(self: this){
        const {enhancedElement} = self;
        const isFull = (enhancedElement instanceof HTMLInputElement && enhancedElement.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        } as PAP;
    }

    setupInterpolate(self: this){
        const {enhancedElement, on} = self;
        return [{resolved: true}, {interpolateIfValid: {on, of: enhancedElement, doInit: true}}] as POA;
    }

    interpolateIfValid(self: this) {
        const {pre, enhancedElement, post, urlProp, baseLink} = self;
        if(!this.checkValidity(self)) return;
        const base = baseLink !== undefined ? (<any>globalThis)[baseLink].href : '';
        const url = base + pre + (<any>enhancedElement)[urlProp!] + post;
        return {
            url 
        } as PAP;
    }

    checkValidity(self: this){
        const {enhancedElement} = self;
        if(enhancedElement instanceof HTMLInputElement){
            return enhancedElement.checkValidity();
        }
        return true;
    }

    setupFull(self: this)  {
        const {enhancedElement, on, urlProp} = self;
        return [{resolved: true}, {setUrlIfValid: {on, of: enhancedElement, doInit: true}}] as POA;
    }

    setUrlIfValid(self: this){
        const {enhancedElement, urlProp} = self;
        if(!this.checkValidity(self)) return;
        return {
            url: (<any>enhancedElement)[urlProp!],
        } as PAP;
    }

    #prevTimeout: string | number | NodeJS.Timeout | undefined;
    async onUrl(self: this){
        const {url, debounceDuration} = self;
        if(this.#prevTimeout !== undefined) clearTimeout(this.#prevTimeout);
        this.#prevTimeout = setTimeout(() => {
            self.urlEcho = url;
        }, debounceDuration);
    }

    #fetchController: AbortController | undefined;
    async fetchWhenSettled(self: this){
        const {url, options, enhancedElement} = self;
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
        const className = 'be-fetching-fetch-in-progress';
        enhancedElement.classList.add(className);
        try{
            resp = await fetch(url, init);
        }catch(e: any){
            console.warn(e);
            enhancedElement.classList.remove(className);
            return;
        }
        enhancedElement.classList.remove(className);
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
        return {value} as PAP; 
    }
}

export interface BeFetching extends AllProps{}

export const tagName = 'be-fetching';


const xe = new XE<AP, Actions>({
    config:{
        tagName,
        isEnh: true,
        propDefaults:{
            ...propDefaults,
            on: 'input',
            debounceDuration: 100,
            urlProp: 'value',
            pre:'',
            post: ''
        },
        propInfo:{
            ...propInfo,
            value:{
                notify:{
                    dispatch: true,
                    dispatchFromEnhancedElement: true
                }
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
    superclass: BeFetching
});
