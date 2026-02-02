import {GameStatus} from "../enums/GameStatus";
import {Position} from "../value-objects/Position";
import {Direction} from "../enums/Direction";

export interface GameEngineConfig {
    initSnakePosition: Position;
    initSnakeDirection: Direction;

    initSnakeLength?: number;
    isWallCollide?: boolean;

    foodSpawnRate?: number; // 0.1 ~ 1.0
    poisonLifeTime?: number;
    growFoodRate?: number; // 0.1 ~ 1.0
}

export interface StepResult {
    status: GameStatus;
    event: 'MOVED' | 'ATE_GROW' | 'ATE_POISON' | 'WALL_COLLIDE' | 'NONE';
}