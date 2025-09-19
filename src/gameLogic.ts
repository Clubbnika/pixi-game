import * as PIXI from 'pixi.js';
import { PlayerShip } from './PlayerShip';
import { PlayerBullet } from './PlayerBullet';
import { Asteroid } from './Asteroid';
import { Boss } from './Boss';
import { BossBullet } from './BossBullet';
import { createTimerText, createBulletsText, updateTimerText, updateBulletsText, createMessageText, createRestartButton, createNextLevelButton, createLevelText } from './ui';
import { GAME_CONSTANTS, intersects } from './constants';
import { app, gameState } from './main';

export function startLevel1() {
    resetLevelVars();
    gameState.gameLevel = GAME_CONSTANTS.GAME.LEVELS.ASTEROIDS;
    clearUI();
    gameState.gameTimer = setInterval(gameTick, 1000);
    spawnAsteroidBatch();
    createUI();
    gameState.player.visible = true;
    app.stage.addChild(gameState.player);
    gameState.gameStarted = true;
}

function resetLevelVars() {
    gameState.bulletsLeft = GAME_CONSTANTS.GAME.BULLETS_LEFT;
    gameState.gameTime = GAME_CONSTANTS.GAME.TIME_LIMIT;
    gameState.totalAsteroidsSpawned = 0;
    gameState.currentAsteroidBatch = 0;
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    clearGameObjects();
}

function gameTick() {
    if (!gameState.gameStarted) return;
    gameState.gameTime--;
    updateTimerText(gameState.timerText!, gameState.gameTime);
    if (gameState.gameTime <= 0) {
        if (gameState.asteroids.length > 0) {
            endGame('YOU LOSE');
        } else if (gameState.totalAsteroidsSpawned >= GAME_CONSTANTS.ASTEROID.TOTAL_ASTEROIDS) {
            displayWinScreen();
        }
    }
}

function spawnAsteroidBatch() {
    if (gameState.totalAsteroidsSpawned < GAME_CONSTANTS.ASTEROID.TOTAL_ASTEROIDS && gameState.currentAsteroidBatch < GAME_CONSTANTS.ASTEROID.TOTAL_BATCHES) {
        for (let i = 0; i < GAME_CONSTANTS.ASTEROID.BATCH_SIZE; i++) {
            const asteroid = new Asteroid(Math.random() * GAME_CONSTANTS.SCREEN.WIDTH, Math.random() * -100);
            gameState.asteroids.push(asteroid);
            app.stage.addChild(asteroid);
        }
        gameState.totalAsteroidsSpawned += GAME_CONSTANTS.ASTEROID.BATCH_SIZE;
        gameState.currentAsteroidBatch++;
    }
}

export function startLevel2() {
    if (!gameState.gameStarted) return;
    gameState.gameLevel = GAME_CONSTANTS.GAME.LEVELS.BOSS;
    gameState.bulletsLeft = GAME_CONSTANTS.GAME.BULLETS_LEFT;
    gameState.gameTime = GAME_CONSTANTS.GAME.TIME_LIMIT;
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    clearUI();
    gameState.gameTimer = setInterval(() => {
        gameState.gameTime--;
        updateTimerText(gameState.timerText!, gameState.gameTime);
        if (gameState.gameTime <= 0) endGame('YOU LOSE');
    }, 1000);

    createUI();
    gameState.player.visible = true;
    app.stage.addChild(gameState.player);
    gameState.boss = new Boss();
    app.stage.addChild(gameState.boss);
}

export function shootPlayerBullet() {
    if (gameState.bulletsLeft > 0) {
        gameState.bulletsLeft--;
        updateBulletsText(gameState.bulletsText!, gameState.bulletsLeft);
        gameState.player.showMuzzleFlash();
        const bullet = new PlayerBullet(gameState.player.x + gameState.player.getShipWidth() / 2 - GAME_CONSTANTS.BULLETS.WIDTH / 2, gameState.player.y - 10);
        gameState.playerBullets.push(bullet);
        app.stage.addChild(bullet);
    } else {
        endGame('YOU LOSE');
    }
}

export function shootBossBullet() {
    if (gameState.boss) {
        const bullet = new BossBullet(gameState.boss.x + GAME_CONSTANTS.BOSS.WIDTH / 2 - GAME_CONSTANTS.BULLETS.WIDTH / 2, gameState.boss.y + GAME_CONSTANTS.BOSS.HEIGHT);
        gameState.bossBullets.push(bullet);
        app.stage.addChild(bullet);
    }
}

function createUI() {
    gameState.timerText = createTimerText(gameState.gameTime);
    gameState.bulletsText = createBulletsText(gameState.bulletsLeft);
    gameState.messageText = createLevelText(gameState.gameLevel === GAME_CONSTANTS.GAME.LEVELS.ASTEROIDS ? 'Level 1' : 'Level: BOSS');
}

function clearUI() {
    if (gameState.timerText && gameState.timerText.parent) {
        app.stage.removeChild(gameState.timerText);
        gameState.timerText.destroy();
        gameState.timerText = null;
    }
    if (gameState.bulletsText && gameState.bulletsText.parent) {
        app.stage.removeChild(gameState.bulletsText);
        gameState.bulletsText.destroy();
        gameState.bulletsText = null;
    }
    if (gameState.messageText && gameState.messageText.parent) {
        app.stage.removeChild(gameState.messageText);
        gameState.messageText.destroy();
        gameState.messageText = null;
    }
}

export function clearGameObjects() {
    gameState.playerBullets.forEach(destroyAndRemove);
    gameState.playerBullets = [];
    gameState.asteroids.forEach(destroyAndRemove);
    gameState.asteroids = [];
    gameState.bossBullets.forEach(destroyAndRemove);
    gameState.bossBullets = [];
    if (gameState.boss) {
        gameState.boss.clearTimers();
        if (gameState.boss.parent) app.stage.removeChild(gameState.boss);
        gameState.boss.destroyHpBar();
        gameState.boss.destroy();
        gameState.boss = null;
    }
    if (gameState.player && gameState.player.parent) {
        app.stage.removeChild(gameState.player);
        gameState.player.destroy();
    }
    gameState.player = new PlayerShip();
}

function destroyAndRemove(obj: any) {
    if (obj && obj.parent) app.stage.removeChild(obj);
    if (obj) obj.destroy();
}

export function endGame(message: string) {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    app.ticker.stop();
    gameState.gameStarted = false;
    clearGameObjects();
    gameState.keys = {};
    clearUI();
    gameState.messageText = createMessageText(message);
    app.stage.addChild(gameState.messageText);
    const restartButton = createRestartButton(() => {
        gameState.gameStarted = true;
        app.stage.removeChild(restartButton, gameState.messageText!);
        gameState.messageText = null;
        app.ticker.start();
        startLevel1();
    });
    app.stage.addChild(restartButton);
    if (!app.ticker.started) app.ticker.start();
}

function displayWinScreen() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    app.ticker.stop();
    gameState.gameStarted = false;
    clearGameObjects();
    gameState.keys = {};
    clearUI();
    gameState.messageText = createMessageText('YOU WIN');
    app.stage.addChild(gameState.messageText);
    const nextLevelButton = createNextLevelButton(() => {
        gameState.gameStarted = true;
        app.stage.removeChild(nextLevelButton, gameState.messageText!);
        gameState.messageText = null;
        app.ticker.start();
        startLevel2();
    });
    app.stage.addChild(nextLevelButton);
    if (!app.ticker.started) app.ticker.start();
}

export function handleCollisions(delta: number) {
    if (!gameState.gameStarted) return;
    if (gameState.gameLevel === GAME_CONSTANTS.GAME.LEVELS.ASTEROIDS) {
        handleAsteroidCollisions();
        
        if (gameState.asteroids.length === 0 && gameState.totalAsteroidsSpawned < GAME_CONSTANTS.ASTEROID.TOTAL_ASTEROIDS) {
            spawnAsteroidBatch();
        }

        if (gameState.asteroids.length === 0 && gameState.totalAsteroidsSpawned >= GAME_CONSTANTS.ASTEROID.TOTAL_ASTEROIDS) {
            displayWinScreen();
        }
    } else if (gameState.gameLevel === GAME_CONSTANTS.GAME.LEVELS.BOSS && gameState.boss) {
        handleBossCollisions();
    }
}

function handleAsteroidCollisions() {
    for (let b = gameState.playerBullets.length - 1; b >= 0; b--) {
        const bullet = gameState.playerBullets[b];
        for (let a = gameState.asteroids.length - 1; a >= 0; a--) {
            const asteroid = gameState.asteroids[a];
            if (intersects(bullet.getBounds(), asteroid.getBounds())) {
                destroyAndRemove(bullet);
                destroyAndRemove(asteroid);
                gameState.playerBullets.splice(b, 1);
                gameState.asteroids.splice(a, 1);
                break;
            }
        }
    }
}

function handleBossCollisions() {
    for (let p = gameState.playerBullets.length - 1; p >= 0; p--) {
        const bullet = gameState.playerBullets[p];
        if (intersects(bullet.getBounds(), gameState.boss!.getBounds())) {
            gameState.boss!.takeDamage();
            destroyAndRemove(bullet);
            gameState.playerBullets.splice(p, 1);
            break;
        }
    }
    for (let b = gameState.bossBullets.length - 1; b >= 0; b--) {
        const bossBullet = gameState.bossBullets[b];
        if (intersects(bossBullet.getBounds(), gameState.player.getBounds())) {
            endGame('YOU LOSE');
            return;
        }
        for (let p = gameState.playerBullets.length - 1; p >= 0; p--) {
            const playerBullet = gameState.playerBullets[p];
            if (intersects(bossBullet.getBounds(), playerBullet.getBounds())) {
                destroyAndRemove(bossBullet);
                destroyAndRemove(playerBullet);
                gameState.bossBullets.splice(b, 1);
                gameState.playerBullets.splice(p, 1);
                break;
            }
        }
    }
}

export function updateBullets(delta: number) {
    for (let i = gameState.playerBullets.length - 1; i >= 0; i--) {
        if (!gameState.playerBullets[i].update(delta)) {
            gameState.playerBullets.splice(i, 1);
        }
    }
    if (gameState.boss) {
        for (let i = gameState.bossBullets.length - 1; i >= 0; i--) {
            if (!gameState.bossBullets[i].update(delta)) {
                gameState.bossBullets.splice(i, 1);
            }
        }
    }
}

export function updateAsteroids(delta: number) {
    for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
        if (!gameState.asteroids[i].update(delta)) {
            gameState.asteroids.splice(i, 1);
        }
    }
}