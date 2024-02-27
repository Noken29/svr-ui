import {FuelType} from "./FuelType";
import {ColumnDef} from "@tanstack/react-table";
import {Tabulated} from "./Tabulated";
import uuid from 'react-uuid';

export type VehicleBean = {
    id?: number
    description: string
    carryingCapacity: number
    volume: number
    fuelType: FuelType
    fuelConsumption: number
}

export class Vehicle implements Tabulated {
    id?: number
    description: string
    carryingCapacity: number
    volume: number
    fuelType: FuelType
    fuelConsumption: number
    private readonly _key: string

    constructor(bean: VehicleBean) {
        this.id = bean.id
        this.description = bean.description;
        this.carryingCapacity = bean.carryingCapacity;
        this.volume = bean.volume;
        this.fuelType = bean.fuelType;
        this.fuelConsumption = bean.fuelConsumption;
        this._key = uuid()
    }

    asBean() {
        return {
            id: this.id,
            description: this.description,
            carryingCapacity: this.carryingCapacity,
            volume: this.volume,
            fuelType: this.fuelType,
            fuelConsumption: this.fuelConsumption,
        } as VehicleBean
    }

    key(): string {
        return this._key;
    }
}

export const vehicleColumns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: 'description',
        header: 'Марка/Модель',
    },
    {
        accessorKey: 'carryingCapacity',
        header: 'Вантажопідйомність',
    },
    {
        accessorKey: 'volume',
        header: 'Об\'єм Кузова',
    },
    {
        accessorKey: 'fuelType',
        header: 'Тип Пального',
        cell: ({ row }) => row.original.fuelType.description
    },
    {
        accessorKey: 'fuelConsumption',
        header: 'Споживання Пального',
    }
]