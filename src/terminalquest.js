#!/usr/bin/env node
/**
 * terminalquest — a text adventure game engine that runs in the terminal.
 *
 * Stories are plain JSON files describing rooms/scenes with choices. Ships
 * with a demo story at stories/demo.json.
 *
 * Usage:
 *   node src/terminalquest.js play stories/demo.json
 *   node src/terminalquest.js validate stories/demo.json
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function loadStory(file) {
  if (!fs.existsSync(file)) {
    console.error(`Story file not found: ${file}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Invalid JSON in story file: ${e.message}`);
    process.exit(1);
  }
}

function validateStory(story) {
  const errors = [];
  if (!story.start) errors.push('Missing "start" scene id.');
  if (!story.scenes || typeof story.scenes !== 'object') errors.push('Missing "scenes" object.');
  else {
    for (const [id, scene] of Object.entries(story.scenes)) {
      if (!scene.text) errors.push(`Scene "${id}" is missing "text".`);
      if (scene.choices) {
        for (const c of scene.choices) {
          if (!c.label) errors.push(`Scene "${id}" has a choice missing "label".`);
          if (c.goto && !story.scenes[c.goto] && c.goto !== 'END') {
            errors.push(`Scene "${id}" choice goes to unknown scene "${c.goto}".`);
          }
        }
      }
    }
  }
  return errors;
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function play(story) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const inventory = new Set(story.startingInventory || []);
  let currentId = story.start;

  console.log(`\n=== ${story.title || 'terminalquest'} ===`);
  if (story.intro) console.log(`${story.intro}\n`);

  while (currentId && currentId !== 'END') {
    const scene = story.scenes[currentId];
    if (!scene) {
      console.log(`\n[Error: unknown scene "${currentId}", ending game]`);
      break;
    }

    console.log(`\n${scene.text}\n`);

    if (scene.give) {
      for (const item of scene.give) {
        inventory.add(item);
        console.log(`(You picked up: ${item})`);
      }
    }

    if (!scene.choices || scene.choices.length === 0) {
      console.log('[The End]');
      break;
    }

    let available = scene.choices.filter((c) => !c.requires || inventory.has(c.requires));
    available.forEach((c, i) => console.log(`  ${i + 1}. ${c.label}`));

    let choiceIdx = -1;
    while (choiceIdx < 0 || choiceIdx >= available.length) {
      const answer = await ask(rl, '\n> ');
      const n = parseInt(answer.trim(), 10);
      if (!Number.isNaN(n) && n >= 1 && n <= available.length) choiceIdx = n - 1;
      else console.log(`Please enter a number between 1 and ${available.length}.`);
    }

    currentId = available[choiceIdx].goto;
  }

  console.log('\nThanks for playing terminalquest!\n');
  rl.close();
}

function main() {
  const [, , cmd, file] = process.argv;

  if (cmd === 'validate') {
    const story = loadStory(file || 'stories/demo.json');
    const errors = validateStory(story);
    if (errors.length === 0) {
      console.log('✔ Story is valid.');
    } else {
      console.log(`✘ Found ${errors.length} issue(s):`);
      errors.forEach((e) => console.log(`  - ${e}`));
      process.exit(1);
    }
    return;
  }

  if (cmd === 'play') {
    const story = loadStory(file || 'stories/demo.json');
    const errors = validateStory(story);
    if (errors.length) {
      console.warn('Warning: story has validation issues:');
      errors.forEach((e) => console.warn(`  - ${e}`));
    }
    play(story);
    return;
  }

  console.log('terminalquest — a text adventure game engine\n');
  console.log('Usage:');
  console.log('  play <story.json>       play a story (defaults to stories/demo.json)');
  console.log('  validate <story.json>   check a story file for structural errors');
}

if (require.main === module) main();
module.exports = { loadStory, validateStory };
