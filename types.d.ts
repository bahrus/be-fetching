import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeFetchingEndUserProps{

}
export interface BeFetchingVirtualProps extends BeFetchingEndUserProps, MinimalProxy<HTMLInputElement> {
    value: any;
}

export type Proxy = HTMLInputElement & BeFetchingVirtualProps;

export interface ProxyProps extends BeFetchingVirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface BeFetchingActions{
    intro(proxy: HTMLInputElement & BeFetchingVirtualProps, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
    finale(proxy: HTMLInputElement & BeFetchingVirtualProps, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
}
