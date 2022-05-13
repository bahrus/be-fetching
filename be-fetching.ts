import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {BeFetchingActions, BeFetchingProps, BeFetchingVirtualProps} from './types';

export class BeFetching implements BeFetchingActions{

}

export interface BeFetching extends BeFetchingProps{
}

const tagName = 'be-fetching';

const ifWantsToBe = 'fetching';

const upgrade = 'input[type="url"]';

define<BeFetchingProps & BeDecoratedProps<BeFetchingProps, BeFetchingActions>, BeFetchingActions>({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: [],

        }
    },
    complexPropDefaults: {
        controller: BeFetching,
    }
});

register(ifWantsToBe, upgrade, tagName);