import {FuelType} from "./FuelType";
import {ColumnDef} from "@tanstack/react-table";
import {Persistable} from "./Persistable";

export class Vehicle implements Persistable {
    id: number | null;
    description: string;
    carryingCapacity: number;
    volume: number;
    fuelType: FuelType;
    fuelConsumption: number;

    constructor(description: string, carryingCapacity: number, volume: number, fuelType: FuelType, fuelConsumption: number) {
        this.id = null;
        this.description = description;
        this.carryingCapacity = carryingCapacity;
        this.volume = volume;
        this.fuelType = fuelType;
        this.fuelConsumption = fuelConsumption;
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