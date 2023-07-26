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
        const isFull = (self instanceof HTMLInputElement && self.type === 'url');
        return {
            full: isFull,
            interpolating: !isFull,
        } as PAP;
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