import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, ProPAP, PAP} from '../ts-refs/be-fetching/types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';
import {dispatchEvent} from 'trans-render/positractions/dispatchEvent.js';

export class BeFetching extends BE implements Actions{
    static override config: BEConfig<AllProps & BEAllProps, Actions & IEnhancement, any> = {
        compacts:{
            echo_url_to_urlEcho_after: 'debounceDuration'
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
        propInfo:{
            ...(beCnfg.propInfo),
            url:{},
            urlEcho:{},
            value: {
                ro: true,
            }
        },
        positractions: [
            {
                do: 'de',
                ifKeyIn: ['value'],
                pass: ['$0', 'value']
            }
        ],
        actions:{
            setUp: {
                ifAllOf:['eventName']
            },
            setFullUrlIfValid:{
                ifAllOf: ['eventCount', 'full'],
            },
            interpolateIfValid: {
                ifAllOf: ['eventCount', 'interpolating']
            },
            fetchWhenSettled: {
                ifAllOf: ['url'],
                ifEquals: ['url', 'urlEcho']
            }
        }
        
    };
    de = dispatchEvent;
    setUp(self: this){
        const {enhancedElement} = self;
        const isFull = (enhancedElement instanceof HTMLInputElement && enhancedElement.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        } as PAP;
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

    setFullUrlIfValid(self: this){
        const {enhancedElement, urlProp} = self;
        if(!this.checkValidity(self)) return;
        return {
            url: (<any>enhancedElement)[urlProp!],
        } as PAP;
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

export interface BeFetching extends AP{}