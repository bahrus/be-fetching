//@ts-check
/** @import {Actions, PAP, AllProps, AP, BAP, FetchOptions as FO} from './ts-refs/be-fetching/types' */;
export class FetchOptions {
    fetchOptions;
    /**
     * 
     * @param {FO} fetchOptions 
     */
    constructor(fetchOptions) {
        this.fetchOptions = fetchOptions;
    }
    async getInitObj() {
        const init = this.fetchOptions.init || {};
        return init;
    }
}
