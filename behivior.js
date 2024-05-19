import './behance.js';
import { BeHive } from 'be-hive/be-hive.js';
BeHive.registry.register({
    base: 'be-fetching',
    enhPropKey: 'beFetching',
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.'
        }
    },
    do: {
        mount: {
            import: async () => {
                const { BeFetching } = await import('./be-fetching.js');
                return BeFetching;
            }
        }
    }
});
