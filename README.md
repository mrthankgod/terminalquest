# 🗝️ terminalquest

![CI](https://img.shields.io/github/actions/workflow/status/YOUR_ORG/terminalquest/ci.yml?branch=main&label=CI)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Release](https://img.shields.io/github/v/release/YOUR_ORG/terminalquest?include_prereleases)

A lightweight **text adventure game engine** that runs entirely in your
terminal. Stories are plain JSON — no build step, no external dependencies.

## ✨ Features

- Simple JSON story format: scenes, choices, inventory items, gated choices (`requires`)
- Built-in validator catches broken links (choices pointing to missing scenes) before you play
- Ships with a complete demo story (`stories/demo.json`) — "The Lost Key"
- Zero dependencies — pure Node.js `readline`

## 📦 Install

```bash
git clone https://github.com/YOUR_ORG/terminalquest.git
cd terminalquest
bash scripts/setup.sh
npm install
```

## 🚀 Usage

Play the built-in demo story:

```bash
node src/terminalquest.js play stories/demo.json
```

```
=== The Lost Key ===
You wake up in a dim stone room with no memory of how you got here.

A cold stone room. There's a wooden door to the north and a small chest in the corner.

  1. Open the chest
  2. Try the door

>
```

Validate a story file for structural errors (missing scenes, bad links):

```bash
node src/terminalquest.js validate stories/demo.json
```

### Writing your own story

Stories are JSON with this shape:

```json
{
  "title": "My Story",
  "intro": "Optional intro text",
  "start": "scene_id",
  "scenes": {
    "scene_id": {
      "text": "What the player sees.",
      "give": ["optional item"],
      "choices": [
        { "label": "Do a thing", "goto": "next_scene_id" },
        { "label": "Locked choice", "goto": "vault", "requires": "optional item" }
      ]
    }
  }
}
```

An empty `choices` array (or omitting it) ends the game at that scene.

## 🧰 npm scripts

| Script | Description |
|---|---|
| `npm start` | Play the demo story (`src/terminalquest.js play stories/demo.json`) |
| `npm test` | Run the unit tests |
| `npm run tracker` | Show achievement badge progress |
| `npm run roadmap` | Show the Day 1 → Month 1 roadmap |

## 🏆 GitHub achievement scripts

```bash
bash scripts/unlock-all.sh
bash scripts/quickdraw.sh
bash scripts/yolo.sh
bash scripts/publicist.sh
bash scripts/pull-shark.sh 16
bash scripts/pair-extraordinaire.sh "Zork Implementors" "zork@example.com"
```

All scripts require [`gh`](https://cli.github.com/) authenticated (`gh auth login`) and auto-detect your repo.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

[MIT](LICENSE)
