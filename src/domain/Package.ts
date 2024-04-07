import {ColumnDef} from "@tanstack/react-table";
import {Tabulated} from "./Tabulated";
import uuid from 'react-uuid';

export type PackageBean = {
    id?: number
    type: string
    weight: number
    volume: number
    cost: number
}

export class Package implements Tabulated {
    id?: number
    type: string
    weight: number
    volume: number
    cost: number
    private readonly _key: string

    constructor(bean: PackageBean) {
        this.id = bean.id
        this.type = bean.type;
        this.weight = bean.weight;
        this.volume = bean.volume;
        this.cost = bean.cost;
        this._key = uuid()
    }

    asBean() {
        return {
            type: this.type,
            weight: this.weight,
            volume: this.volume,
            cost: this.cost,
        } as PackageBean
    }

    key(): string {
        return this._key;
    }
}

export const packageColumns: ColumnDef<Package>[] = [
    {
        accessorKey: 'type',
        header: 'Тип'
    },
    {
        accessorKey: 'weight',
        header: 'Вага(кг)/Об\'єм(л)',
        cell: ({ row }) => row.original.weight + '/' + row.original.volume
    },
    {
        accessorKey: 'cost',
        header: 'Вартість Доставки(грн)',
    },
]