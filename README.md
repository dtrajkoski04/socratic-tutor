# Code Didactic Tutor

A VS Code extension that acts as a Socratic AI tutor to foster code understanding — instead of handing out solutions, it asks targeted follow-up questions.

## Requirements

- [Node.js](https://nodejs.org/) (>= 18)
- [VS Code](https://code.visualstudio.com/) (>= 1.85)
- A valid [OpenAI API Key](https://platform.openai.com/api-keys)

## Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/dtrajkoski04/socratic-tutor.git
cd socratic-tutor

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run compile
```

## Run the Extension

1. Open the project folder in VS Code.
2. Press `F5` or start it manually in  `RUN AND DEBUG` → a new **Extension Development Host** window will launch.
3. In the new window, open the settings (`Cmd/Ctrl + ,`) and configure under **Code Didactic Tutor**:
   - `codeTutor.openaiApiKey` – your OpenAI API key
   - `codeTutor.model` – model to use (default: `gpt-4o`)
   - `codeTutor.language` – `de` or `en`

## Usage

1. Open a file containing code.
2. Select the code snippet you want explained.
3. Start the tutor via one of:
   - Shortcut: `Cmd+Shift+E` (macOS) or `Ctrl+Shift+E` (Windows/Linux)
   - Right-click → **Code Tutor: Code erklären**
   - Command Palette (`Cmd/Ctrl+Shift+P`) → **Code Tutor: Code erklären**
4. The tutor opens a chat panel and begins with a Socratic follow-up question.

## Project Structure

```
src/
├── extension.ts      # Entry point, registers the command
├── ChatPanel.ts      # Webview panel for the chat
├── openaiClient.ts   # OpenAI API communication
└── prompts.ts        # Socratic system prompt
```
