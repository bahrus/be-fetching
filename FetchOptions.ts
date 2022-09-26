import {ValObservePairs} from './types';
import {PropertyBag} from 'trans-render/lib/PropertyBag.js';

export class FetchOptions extends EventTarget {
    #propertyBag!: PropertyBag;
    constructor(public init: RequestInit, public valObservePairs: ValObservePairs){
        super();
        if(init === undefined){
            this.init = {};
        }
        
    }

    #absorbValsIntoInit(){

    }
    
}