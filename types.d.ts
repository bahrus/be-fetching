import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';

export interface EndUserProps{
    pre?: string,
    post?: string,
    on?: string,
    debounceDuration?: number,
    options?: FetchOptions,
    urlProp?: string,
    baseLink?: string,
}
export interface VirtualProps extends EndUserProps, MinimalProxy {
    value: any;
    interpolating: boolean;
    full: boolean;
    url: string;
    urlEcho: string;
}

export interface FetchOptions {

    init?: RequestInit,
    authorization?:{
        winObj?: 'sessionStorage' | 'localStorage',
        key?: string
        val?: string,

    }
    //headers?: {[key: string]: string},
    //headerFormSelector?: string,
    //headerFormSubmitOn?: string | string[],
    //valObservePairs: ValObservePairs;
}

// export interface ValObservePairs{
//     authorization?: IObserve,
//     authorizationVal?: string,
//     body?: IObserve,
//     bodyVal?: any,
//     cache?: IObserve<'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'>,
//     cacheVal?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached',
//     contentType?: IObserve,
//     contentTypeVal?: string,
//     credentials?: IObserve<'omit' | 'same-origin' | 'include'>,
//     credentialsVal?: 'omit' | 'same-origin' | 'include',
//     method?: IObserve<'GET' | 'POST' | 'PUT' | 'DELETE'>,
//     methodVal?: 'GET' | 'POST' | 'PUT' | 'DELETE',
//     mode?: IObserve<'cors' | 'no-cors' | 'same-origin' | 'navigate'>,
//     modeVal?: 'cors' | 'no-cors' | 'same-origin' | 'navigate',
//     redirect?: IObserve<'follow' | 'error' | 'manual'>,
//     redirectVal?: 'follow' | 'error' | 'manual',
//     referrerPolicy?: IObserve<'no-referrer' |  'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' |  'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'>,
//     referrerPolicyVal?: 'no-referrer' |  'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' |  'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url',
// }

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    finale(proxy: Proxy, target: Element, beDecor: BeDecoratedProps): void;
    setUp(pp: PP): void;
    setupInterpolate(pp: PP): void;
    setupFull(pp: PP): void;
    onUrl(pp: PP): void;
    onStableUrl(pp: PP): void;
}
