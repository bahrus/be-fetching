import {FetchOptions as FO} from '../ts-refs/be-fetching/types';
export class FetchOptions{
    constructor(public fetchOptions: FO){

    }
    async getInitObj(): Promise<RequestInit>{
        const init = this.fetchOptions.init || {};
        return init;
    }
}