import * as PIXI from 'pixi.js';

export const GAME_CONSTANTS = {
    SCREEN: {
        WIDTH: 1280,
        HEIGHT: 720,
    },
    PLAYER: {
        SPEED: 5,
        WIDTH: 50,
        HEIGHT: 30,
        START_X: 640,
        START_Y: 600,
        MUZZLE_FLASH_DURATION: 200,
    },
    BULLETS: {
        PLAYER_SPEED: 10,
        WIDTH: 5,
        HEIGHT: 10,
        BOSS_SPEED: 5,
    },
    ASTEROID: {
        SPEED_MIN: 0.5,
        SPEED_MAX: 2.5,
        RADIUS: 20,
        BATCH_SIZE: 5,
        TOTAL_BATCHES: 2,
        TOTAL_ASTEROIDS: 10,
    },
    BOSS: {
        HP: 4,
        WIDTH: 100,
        HEIGHT: 100,
        START_X: 590,
        START_Y: 100,
        MOVE_INTERVAL: 3000,
        SHOOT_INTERVAL: 2000,
        MOVE_SPEED: 2,
        HP_BAR_HEIGHT: 10,
    },
    GAME: {
        TIME_LIMIT: 60,
        BULLETS_LEFT: 10,
        LEVELS: { ASTEROIDS: 1, BOSS: 2 },
    },
    COLORS: {
        BACKGROUND: 0x000000,
        PLAYER_BODY: 0x00FF00,
        PLAYER_NOSE: 0xFFFFFF,
        PLAYER_BULLET: 0xFFFF00,
        MUZZLE_FLASH: 0xFFFF00,
        ASTEROID: 0x8B4513,
        BOSS: 0xFF0000,
        BOSS_BULLET: 0xFF0000,
        HP_BAR: 0x00FF00,
    },
    TEXT_STYLE: {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xFFFFFF,
        align: 'center',
    } as PIXI.TextStyle,
} as const;

export function intersects(a: PIXI.Bounds, b: PIXI.Bounds): boolean {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}