import { PrimaryColumn } from "typeorm";

export class AbstractEntityNoAutoId<T> {

    @PrimaryColumn()
    id: number;

    constructor(t: Partial<T>) {
        Object.assign(this, t);
    }

}