import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{

}
export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLInputElement> {
    value: any;
}

export type Proxy = HTMLInputElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    intro(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
    finale(proxy: Proxy, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
}
