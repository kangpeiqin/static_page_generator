const generator = require('./util/generator')
const baseTempDir = './templates/',
    postDir = './posts/',
    destDir = './build/',
    title = 'SUNNY';
generator.generate(baseTempDir, postDir, destDir, title);