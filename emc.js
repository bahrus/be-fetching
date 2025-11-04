// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-a-beacon/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-fetching',
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.'
        }
    },
    enhPropKey: 'beFetching',
    importEnh: async () => {
        const { BeFetching } = await import('./be-fetching.js');
        return BeFetching;
    }
};

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);