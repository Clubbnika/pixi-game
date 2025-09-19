import * as PIXI from 'pixi.js';
import { GAME_CONSTANTS } from './constants';
import { app, gameState } from './main';

export class PlayerShip extends PIXI.Graphics {
    private speed = GAME_CONSTANTS.PLAYER.SPEED;
    private shipWidth = GAME_CONSTANTS.PLAYER.WIDTH;
    private shipHeight = GAME_CONSTANTS.PLAYER.HEIGHT;

    constructor() {
        super();
        this.drawShip();
        this.x = GAME_CONSTANTS.PLAYER.START_X - this.shipWidth / 2;
        this.y = GAME_CONSTANTS.PLAYER.START_Y;
        this.visible = false;
    }

    private drawShip() {
        this.beginFill(GAME_CONSTANTS.COLORS.PLAYER_BODY);
        this.drawRect(0, 0, this.shipWidth, this.shipHeight);
        this.endFill();
        this.beginFill(GAME_CONSTANTS.COLORS.PLAYER_NOSE);
        this.moveTo(this.shipWidth / 2, 0);
        this.lineTo(0, this.shipHeight);
        this.lineTo(this.shipWidth, this.shipHeight);
        this.closePath();
        this.endFill();
    }

    update(delta: number) {
        if (gameState.keys.ArrowLeft && this.x > 0) this.x -= this.speed * delta;
        if (gameState.keys.ArrowRight && this.x < GAME_CONSTANTS.SCREEN.WIDTH - this.shipWidth) this.x += this.speed * delta;
    }

    getBounds(skipUpdate?: boolean, bounds?: PIXI.Bounds): PIXI.Bounds {
        return super.getBounds(skipUpdate, bounds);
    }

    getShipWidth(): number {
        return this.shipWidth;
    }

    showMuzzleFlash() {
        if (gameState.muzzleFlash) {
            app.stage.removeChild(gameState.muzzleFlash);
            gameState.muzzleFlash.destroy();
        }
        gameState.muzzleFlash = new PIXI.Graphics();
        gameState.muzzleFlash.beginFill(GAME_CONSTANTS.COLORS.MUZZLE_FLASH);
        gameState.muzzleFlash.drawRect(this.shipWidth / 2 - 5, -10, 10, 20);
        gameState.muzzleFlash.endFill();
        gameState.muzzleFlash.x = this.x;
        gameState.muzzleFlash.y = this.y;
        app.stage.addChild(gameState.muzzleFlash);

        setTimeout(() => {
            if (gameState.muzzleFlash) {
                app.stage.removeChild(gameState.muzzleFlash);
                gameState.muzzleFlash.destroy();
                gameState.muzzleFlash = null;
            }
        }, GAME_CONSTANTS.PLAYER.MUZZLE_FLASH_DURATION);
    }
}