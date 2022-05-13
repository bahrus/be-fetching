import {BeDecoratedProps} from 'be-decorated/types';


export interface BeFetchingVirtualProps {
    value: any;
}

export interface BeFetchingProps extends BeFetchingVirtualProps{
    proxy: HTMLInputElement & BeFetchingVirtualProps;
}

export interface BeFetchingActions{
    intro(proxy: HTMLInputElement & BeFetchingVirtualProps, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
    finale(proxy: HTMLInputElement & BeFetchingVirtualProps, target: HTMLInputElement, beDecor: BeDecoratedProps): void;
}
