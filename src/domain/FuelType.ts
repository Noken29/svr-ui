import { ColumnDef } from "@tanstack/react-table"
import {Tabulated} from "./Tabulated";
import uuid from 'react-uuid';

export type FuelTypeBean = {
    id?: number
    description: string
    cost: number
}

export class FuelType implements Tabulated {
    id?: number
    description: string
    cost: number
    private readonly _key: string

    constructor(bean: FuelTypeBean) {
        this.id = bean.id
        this.description = bean.description;
        this.cost = bean.cost;
        this._key = uuid()
    }

    key(): string {
        return this._key;
    }

}

export const fuelTypeColumns: ColumnDef<FuelType>[] = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'description',
        header: 'Тип',
    },
    {
        accessorKey: 'cost',
        header: 'Вартість',
    },
]