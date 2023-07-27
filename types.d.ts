import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE{
    pre?: string,
    post?: string,
    on?: string,
    debounceDuration?: number,
    options?: FetchOptions,
    urlProp?: string,
    baseLink?: string,
}
export interface AllProps extends EndUserProps {
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

export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    setUp(self: this): PAP;
    setupInterpolate(self: this): POA;
    interpolateIfValid(self: this): PAP | void;
    setupFull(self: this): POA;
    onUrl(self: this): void;
    setUrlIfValid(self: this): PAP | void;
    fetchWhenSettled(self: this): Promise<PAP | void>;
}
