import * as PIXI from 'pixi.js';
import { GAME_CONSTANTS } from './constants';
import { app } from './main';

export class BossBullet extends PIXI.Graphics {
    private speed = GAME_CONSTANTS.BULLETS.BOSS_SPEED;

    constructor(x: number, y: number) {
        super();
        this.beginFill(GAME_CONSTANTS.COLORS.BOSS_BULLET);
        this.drawRect(0, 0, GAME_CONSTANTS.BULLETS.WIDTH, GAME_CONSTANTS.BULLETS.HEIGHT);
        this.endFill();
        this.x = x;
        this.y = y;
    }

    update(delta: number): boolean {
        this.y += this.speed * delta;
        if (this.y > GAME_CONSTANTS.SCREEN.HEIGHT) {
            this.destroySelf();
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