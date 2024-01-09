import {register} from 'be-hive/register.js';
import {tagName } from './be-fetching.js';
import './be-fetching.js';

const ifWantsToBe = 'fetching';
const upgrade = '*';

register(ifWantsToBe, upgrade, tagName);