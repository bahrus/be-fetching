export class FetchOptions {
    fetchOptions;
    constructor(fetchOptions) {
        this.fetchOptions = fetchOptions;
    }
    async getInitObj() {
        const init = this.fetchOptions.init || {};
        return init;
    }
}
