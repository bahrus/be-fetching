import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeFetching extends BE<AP, Actions, HTMLInputElement> implements Actions{
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
        const url = base + pre + (<any>self)[urlProp!] + post;
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
}

export interface BeFetching extends AllProps{}

const tagName = 'be-fetching';
const ifWantsToBe = 'fetching';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults:{
            ...propDefaults
        },
        propInfo:{
            ...propInfo
        },
        actions:{

        }
    },
    superclass: BeFetching
});

register(ifWantsToBe, upgrade, tagName);