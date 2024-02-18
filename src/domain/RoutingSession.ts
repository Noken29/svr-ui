import {Customer} from "./Customer";
import {Vehicle} from "./Vehicle";
import {ColumnDef} from "@tanstack/react-table";

export class RoutingSession {
    id?: number
    description: string
    lastSaved: number
    vehicles: Vehicle[]
    customers: Customer[]

    constructor() {
        this.description = ''
        this.lastSaved = 0
        this.vehicles = []
        this.customers = []
    }

    setAll(description: string, lastSaved: number, vehicles: Vehicle[], customers: Customer[]) {
        this.description = description;
        this.lastSaved = lastSaved;
        this.vehicles = vehicles;
        this.customers = customers;
        return this
    }
}

export type RoutingSessionInfo = {
    id: number
    description: string
    numberOfSolutions: number
    lastSaved: number
}

export const routingSessionInfoColumns: ColumnDef<RoutingSessionInfo>[] = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'description',
        header: 'Назва',
    },
    {
        accessorKey: 'numberOfSolutions',
        header: 'Проведено Маршрутизацій',
    },
    {
        accessorKey: 'lastSaved',
        header: 'Дата Модифікації',
    }
]