# Tetris App (Tauri + React + Typescript)

This is a simple Tetris game built using Tauri (Rust backend), React, and Typescript (Vite frontend).

## About

- The app is a playable Tetris clone with keyboard controls and a score counter.
- Built as a desktop application using Tauri for the backend and React for the frontend UI.
- Features a helper section for keybinds and improved rotation logic with wall kicks.

## How this app was built

This app was created in just two prompts using GitHub Copilot and GPT-4.1:

1. `#codebase I have setup the project using rust, tauri and react\nPlease create a tetris app using these frameworks`
2. `Remove all components from the initial hello screen\nDisplay a helper for the keybinds, the rotating does not seem to work correctly`

## Controls

- **←**: Move Left
- **→**: Move Right
- **↓**: Move Down
- **↑**: Rotate (with wall kick)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
