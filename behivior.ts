import {BeHive, EnhancementMountCnfg} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';

const base = 'be-fetching';
const emc: EnhancementMountCnfg = {
    base,
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.'
        }
    },
    enhPropKey: 'beFetching',
    importEnh: async () => {
        const {BeFetching} = await import('./behance.js');
        return BeFetching;
    }
};

const mose = document.createElement('script') as MOSE<EnhancementMountCnfg>;
mose.id = base;
mose.synConfig = emc;

MountObserver.synthesize(document, BeHive, mose);