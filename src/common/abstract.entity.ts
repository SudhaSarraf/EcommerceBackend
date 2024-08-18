// import { PrimaryColumn } from "typeorm";

import { PrimaryGeneratedColumn } from "typeorm";

export class AbstractEntity<E> {
    @PrimaryGeneratedColumn()
    id: number;

    constructor(entity: Partial<E>) {
        Object.assign(this, entity);
    }
}