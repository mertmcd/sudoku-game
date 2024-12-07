# Sudoku Game Server

This is the backend server for the Sudoku Game project. It provides APIs to manage and play Sudoku games.

## Features

- Save and load game scores


## Getting Started

### Prerequisites

- Docker
- Node.js
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/mertmcd/sudoku-game.git
    ```
2. Navigate to the server directory:
    ```sh
    cd sudoku-game/server
    ```
3. Dcoker-compose up
    ```sh
    docker-compose up
    ```

The server will be running at `http://localhost:3000`.

## API Endpoints


### Save Game Scores

- **URL:** `/api/scores/new`
- **Method:** `POST`
- **Description:** Saves the user's game state.
- **Body Parameters:**
    - `name`: The name of the player.
    - `score`: The score of the player.
    - `level`: The level of the game.

### Load Game State

- **URL:** `/api/scores/all`
- **Method:** `GET`
- **Description:** Loads all game scores.