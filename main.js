const generator = require('./util/generator')
const baseTempDir = './templates/',
    postDir = './posts/',
    destDir = './build/',
    title = 'wonderful';
generator.generate(baseTempDir, postDir, destDir, title);