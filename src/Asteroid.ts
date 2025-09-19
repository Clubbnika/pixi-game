import * as PIXI from 'pixi.js';
import { GAME_CONSTANTS } from './constants';
import { app, endGame } from './main';

export class Asteroid extends PIXI.Graphics {
    private speed = Math.random() * (GAME_CONSTANTS.ASTEROID.SPEED_MAX - GAME_CONSTANTS.ASTEROID.SPEED_MIN) + GAME_CONSTANTS.ASTEROID.SPEED_MIN;

    constructor(x: number, y: number) {
        super();
        this.beginFill(GAME_CONSTANTS.COLORS.ASTEROID);
        this.drawCircle(0, 0, GAME_CONSTANTS.ASTEROID.RADIUS);
        this.endFill();
        this.x = x;
        this.y = y;
    }

    update(delta: number): boolean {
        this.y += this.speed * delta;
        if (this.y > GAME_CONSTANTS.SCREEN.HEIGHT) {
            this.destroySelf();
            endGame('YOU LOSE');
            return false;
        }
        return true;
    }

    getBounds(skipUpdate?: boolean, bounds?: PIXI.Bounds): PIXI.Bounds {
        return super.getBounds(skipUpdate, bounds);
    }

    private destroySelf() {
        if (this.parent) app.stage.removeChild(this);
        this.destroy();
    }
}