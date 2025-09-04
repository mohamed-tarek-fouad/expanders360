import { readFileSync } from 'fs';
import { resolve } from 'path';

const packageJsonPath = resolve(__dirname, '../../../../package.json');
const packageJSON = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

export default packageJSON;
