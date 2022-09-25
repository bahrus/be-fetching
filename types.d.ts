import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    start?: string,
    end?: string,
    on?: string,
}
export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLInputElement> {
    value: any;
    interpolating: boolean;
    full: boolean;
    url: string;
}

export type Proxy = HTMLInputElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    //intro(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
    finale(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
    setUp(pp: PP): void;
    setupInterpolate(pp: PP): void;
    setupFull(pp: PP): void;
    onUrl(pp: PP): void;
}
