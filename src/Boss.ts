import * as PIXI from 'pixi.js';
import { GAME_CONSTANTS } from './constants';
import { app, endGame, shootBossBullet } from './main';

export class Boss extends PIXI.Graphics {
    private hp = GAME_CONSTANTS.BOSS.HP;
    private speed = 0;
    private isMoving = false;
    private moveTimer: NodeJS.Timeout;
    private shootTimer: NodeJS.Timeout;
    private hpBar: PIXI.Graphics;

    constructor() {
        super();
        this.beginFill(GAME_CONSTANTS.COLORS.BOSS);
        this.drawRect(0, 0, GAME_CONSTANTS.BOSS.WIDTH, GAME_CONSTANTS.BOSS.HEIGHT);
        this.endFill();
        this.x = GAME_CONSTANTS.BOSS.START_X;
        this.y = GAME_CONSTANTS.BOSS.START_Y;

        this.hpBar = this.createHpBar();
        app.stage.addChild(this.hpBar);

        this.moveTimer = setInterval(() => {
            this.isMoving = !this.isMoving;
            this.speed = this.isMoving ? (Math.random() > 0.5 ? 1 : -1) * GAME_CONSTANTS.BOSS.MOVE_SPEED : 0;
        }, GAME_CONSTANTS.BOSS.MOVE_INTERVAL);

        this.shootTimer = setInterval(shootBossBullet, GAME_CONSTANTS.BOSS.SHOOT_INTERVAL);
    }

    private createHpBar() {
        const hpBar = new PIXI.Graphics();
        hpBar.beginFill(GAME_CONSTANTS.COLORS.HP_BAR);
        hpBar.drawRect(0, 0, GAME_CONSTANTS.BOSS.WIDTH, GAME_CONSTANTS.BOSS.HP_BAR_HEIGHT);
        hpBar.endFill();
        hpBar.x = this.x;
        hpBar.y = this.y - 15;
        return hpBar;
    }

    update(delta: number) {
        if (this.isMoving) {
            this.x += this.speed * delta;
            this.x = Math.max(0, Math.min(GAME_CONSTANTS.SCREEN.WIDTH - GAME_CONSTANTS.BOSS.WIDTH, this.x));
        }
        this.updateHpBar();
        if (this.hp <= 0) {
            this.clearTimers();
            if (this.parent) app.stage.removeChild(this);
            this.destroyHpBar();
            this.destroy();
            endGame('YOU WIN');
        }
    }

    private updateHpBar() {
        this.hpBar.clear();
        this.hpBar.beginFill(GAME_CONSTANTS.COLORS.HP_BAR);
        this.hpBar.drawRect(0, 0, (this.hp / GAME_CONSTANTS.BOSS.HP) * GAME_CONSTANTS.BOSS.WIDTH, GAME_CONSTANTS.BOSS.HP_BAR_HEIGHT);
        this.hpBar.endFill();
        this.hpBar.x = this.x;
        this.hpBar.y = this.y - 15;
    }

    takeDamage() {
        this.hp--;
    }

    clearTimers() {
        clearInterval(this.moveTimer);
        clearInterval(this.shootTimer);
    }

    destroyHpBar() {
        if (this.hpBar.parent) app.stage.removeChild(this.hpBar);
        this.hpBar.destroy();
    }

    getBounds(skipUpdate?: boolean, bounds?: PIXI.Bounds): PIXI.Bounds {
        return super.getBounds(skipUpdate, bounds);
    }
}