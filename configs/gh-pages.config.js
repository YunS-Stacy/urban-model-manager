const ghpages = require('gh-pages');
const path = require('path');

const REMOTE = 'origin';
const OUT_DIR = 'build';

ghpages.publish(path.join(__dirname, `../${OUT_DIR}`), {
  remote: REMOTE,
});

console.log(`Publishing "${OUT_DIR}" dir to gh-pages on ${REMOTE}`);
