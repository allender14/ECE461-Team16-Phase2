import { Config } from 'jest';
const config: Config = {
    reporters: [
        'default',
        [ 'jest-junit', {
            outputDirectory: './test',
            outputName: 'report',
        } ]
    ]    
};

export default config;
