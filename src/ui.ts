import * as PIXI from 'pixi.js';
import { GAME_CONSTANTS } from './constants';
import { app } from './main';

export function createStartButton(onStart: () => void): PIXI.Container {
    const container = new PIXI.Container();
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.5);
    bg.lineStyle(4, 0xFFFFFF, 1);
    bg.drawRect(0, 0, 160, 60);
    bg.endFill();
    
    const button = new PIXI.Text({ text: 'START', style: createTextStyle(36) });
    button.x = 80 - button.width / 2;
    button.y = 30 - button.height / 2;
    
    container.addChild(bg, button);
    container.x = GAME_CONSTANTS.SCREEN.WIDTH / 2 - 80;
    container.y = GAME_CONSTANTS.SCREEN.HEIGHT / 2;
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.zIndex = 10;
    container.on('pointertap', onStart);
    app.stage.addChild(container);
    return container;
}

export function createRestartButton(onRestart: () => void): PIXI.Container {
    const container = new PIXI.Container();
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.5);
    bg.lineStyle(4, 0xFFFFFF, 1);
    bg.drawRect(0, 0, 200, 60);
    bg.endFill();
    
    const button = new PIXI.Text({ text: 'RESTART', style: createTextStyle(36) });
    button.x = 100 - button.width / 2;
    button.y = 30 - button.height / 2;
    
    container.addChild(bg, button);
    container.x = GAME_CONSTANTS.SCREEN.WIDTH / 2 - 100;
    container.y = GAME_CONSTANTS.SCREEN.HEIGHT / 2 + 50;
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.zIndex = 10;
    container.on('pointertap', onRestart);
    return container;
}

export function createNextLevelButton(onNextLevel: () => void): PIXI.Container {
    const container = new PIXI.Container();
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.5); 
    bg.lineStyle(4, 0xFFFFFF, 1);
    bg.drawRect(0, 0, 240, 60); 
    bg.endFill();
    
    const button = new PIXI.Text({ text: 'NEXT LEVEL', style: createTextStyle(36) });
    button.x = 120 - button.width / 2;
    button.y = 30 - button.height / 2;
    
    container.addChild(bg, button);
    container.x = GAME_CONSTANTS.SCREEN.WIDTH / 2 - 120;
    container.y = GAME_CONSTANTS.SCREEN.HEIGHT / 2 + 50;
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.zIndex = 10;
    container.on('pointertap', onNextLevel);
    app.stage.addChild(container);
    return container;
}

export function createTimerText(time: number): PIXI.Text {
    const text = new PIXI.Text({ text: `Time: ${time}s`, style: createTextStyle(24) });
    text.x = 10;
    text.y = 10;
    app.stage.addChild(text);
    return text;
}

export function createBulletsText(bullets: number): PIXI.Text {
    const text = new PIXI.Text({ text: `Bullets: ${bullets}`, style: createTextStyle(24) });
    text.x = 10;
    text.y = 40;
    app.stage.addChild(text);
    return text;
}

export function createLevelText(message: string): PIXI.Text {
    const text = new PIXI.Text({ text: message, style: createTextStyle(32) });
    text.x = GAME_CONSTANTS.SCREEN.WIDTH / 2 - text.width / 2;
    text.y = 70;
    text.zIndex = 5;
    app.stage.addChild(text);
    return text;
}

export function createMessageText(message: string): PIXI.Text {
    const text = new PIXI.Text({ text: message, style: createTextStyle(48) });
    text.x = GAME_CONSTANTS.SCREEN.WIDTH / 2 - text.width / 2;
    text.y = GAME_CONSTANTS.SCREEN.HEIGHT / 2 - 50;
    text.zIndex = 10;
    app.stage.addChild(text);
    return text;
}

export function updateTimerText(text: PIXI.Text, time: number) {
    text.text = `Time: ${time}s`;
}

export function updateBulletsText(text: PIXI.Text, bullets: number) {
    text.text = `Bullets: ${bullets}`;
}

export function createTextStyle(size: number): PIXI.TextStyle {
    return new PIXI.TextStyle({
        ...GAME_CONSTANTS.TEXT_STYLE,
        fontSize: size,
    });
}