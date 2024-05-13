import {BeFetching} from './be-fetching.js';
import {def} from 'trans-render/lib/def.js';

await BeFetching.bootUp();

def('be-fetching', BeFetching);