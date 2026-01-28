import { Snake } from '../domain/Snake'

export interface Item {
    onConsume(snake: Snake): void;
}