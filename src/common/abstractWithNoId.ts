import { PrimaryColumn } from "typeorm";

export class AbstractWithNoId<T> {

    constructor(t: Partial<T>) {
        Object.assign(this, t);
    }

}