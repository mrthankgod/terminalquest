const assert = require('assert');
const path = require('path');
const { loadStory, validateStory } = require('../src/terminalquest.js');

function run() {
  const story = loadStory(path.join(__dirname, '..', 'stories', 'demo.json'));
  const errors = validateStory(story);
  assert.strictEqual(errors.length, 0, `demo story should be valid, got: ${errors.join(', ')}`);
  console.log('✔ terminalquest tests passed');
}

run();
