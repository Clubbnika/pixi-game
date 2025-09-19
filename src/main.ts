import * as PIXI from 'pixi.js';
import { PlayerShip } from './PlayerShip';
import { PlayerBullet } from './PlayerBullet';
import { Asteroid } from './Asteroid';
import { Boss } from './Boss';
import { BossBullet } from './BossBullet';
import { startLevel1, shootPlayerBullet, endGame, handleCollisions, updateBullets, updateAsteroids } from './gameLogic';
import { createStartButton } from './ui';
import { GAME_CONSTANTS } from './constants';

export interface GameState {
    app: PIXI.Application;
    gameStarted: boolean;
    keys: { [key: string]: boolean };
    gameLevel: number;
    bulletsLeft: number;
    gameTime: number;
    gameTimer: NodeJS.Timeout | null;
    totalAsteroidsSpawned: number;
    currentAsteroidBatch: number;
    player: PlayerShip;
    playerBullets: PlayerBullet[];
    asteroids: Asteroid[];
    boss: Boss | null;
    bossBullets: BossBullet[];
    muzzleFlash: PIXI.Graphics | null;
    timerText: PIXI.Text | null;
    bulletsText: PIXI.Text | null;
    messageText: PIXI.Text | null;
}

export const gameState: GameState = {
    app: new PIXI.Application(),
    gameStarted: false,
    keys: {},
    gameLevel: 1,
    bulletsLeft: 10,
    gameTime: 60,
    gameTimer: null,
    totalAsteroidsSpawned: 0,
    currentAsteroidBatch: 0,
    player: new PlayerShip(),
    playerBullets: [],
    asteroids: [],
    boss: null,
    bossBullets: [],
    muzzleFlash: null,
    timerText: null,
    bulletsText: null,
    messageText: null,
};

export const app = gameState.app;

export { endGame, shootBossBullet } from './gameLogic';

(async () => {
    await app.init({
        width: GAME_CONSTANTS.SCREEN.WIDTH,
        height: GAME_CONSTANTS.SCREEN.HEIGHT,
        backgroundColor: GAME_CONSTANTS.COLORS.BACKGROUND,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        preference: 'webgpu',
    });

    document.getElementById('game-container')!.appendChild(app.canvas);

    const startButton = createStartButton(() => {
        gameState.gameStarted = true;
        app.stage.removeChild(startButton);
        startLevel1();
    });
    app.stage.addChild(startButton);

    setupKeyboard();
    setupTicker();

    console.log('Game initialized');
})();

function setupKeyboard() {
    window.addEventListener('keydown', (e) => {
        if (gameState.gameStarted) {
            if (e.code === 'ArrowLeft') gameState.keys.ArrowLeft = true;
            if (e.code === 'ArrowRight') gameState.keys.ArrowRight = true;
            if (e.code === 'Space') {
                e.preventDefault();
                gameState.keys.Space = true;
                shootPlayerBullet();
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        if (gameState.gameStarted) {
            if (e.code === 'ArrowLeft') gameState.keys.ArrowLeft = false;
            if (e.code === 'ArrowRight') gameState.keys.ArrowRight = false;
            if (e.code === 'Space') gameState.keys.Space = false;
        }
    });
}

function setupTicker() {
    app.ticker.add((ticker: PIXI.Ticker) => {
        if (gameState.gameStarted) {
            updateGame(ticker.deltaTime);
        }
    });
}

function updateGame(delta: number) {
    if (!gameState.gameStarted) return;
    gameState.player.update(delta);

    if (gameState.gameLevel === 1) {
        updateAsteroids(delta);
        handleCollisions(delta);
    } else if (gameState.gameLevel === 2 && gameState.boss) {
        gameState.boss.update(delta);
        updateBullets(delta);
        handleCollisions(delta);
    }

    updateBullets(delta);
}