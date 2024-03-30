import {Customer, CustomerBean} from "./Customer";
import {ColumnDef} from "@tanstack/react-table";
import {Tabulated} from "./Tabulated";
import uuid from 'react-uuid';
import {Depot, DepotBean} from "./Depot";

export type RoutingSessionMainInfoBean = {
    description: string
    depot: DepotBean
}

export type RoutingSessionBean = {
    id?: number
    description: string
    lastSaved: number
    depot: DepotBean
    vehicleIds: number[]
    customers: CustomerBean[]
    haveSolutions: boolean
}

export class RoutingSession {
    id?: number
    description: string
    lastSaved: number
    depot: Depot
    vehicleIds: Set<number>
    customers: Customer[]

    constructor(bean: RoutingSessionBean) {
        this.id = bean.id
        this.description = bean.description
        this.lastSaved = bean.lastSaved
        this.depot = new Depot(bean.depot)
        this.vehicleIds = new Set(bean.vehicleIds)
        this.customers = bean.customers.map((c) => new Customer(c))
    }
}

export type RoutingSessionInfoBean = {
    id: number
    description: string
    numberOfSolutions: number
    lastSaved: number
}

export class RoutingSessionInfo implements Tabulated {
    id: number
    description: string
    numberOfSolutions: number
    lastSaved: number
    private readonly _key: string

    constructor(bean: RoutingSessionInfoBean) {
        this.id = bean.id;
        this.description = bean.description;
        this.numberOfSolutions = bean.numberOfSolutions;
        this.lastSaved = bean.lastSaved;
        this._key = uuid()
    }

    key(): string {
        return this._key;
    }
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