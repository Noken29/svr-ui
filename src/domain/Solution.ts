import {Tabulated} from "./Tabulated";
import uuid from "react-uuid";
import {Depot} from "./Depot";
import {Customer} from "./Customer";
import {Vehicle} from "./Vehicle";
import {ColumnDef} from "@tanstack/react-table";

export type SolutionBean = {
    id: number
    created: number
    data: string
}

export type SolutionData = {
    depot: Depot
    customers: Customer[]
    vehicles: Vehicle[]
    routes: Route[]
    totalLength: number
    totalCost: number
}

export type Route = {
    vehicleId: number
    customersIds: number[]
    packagesIds: number[]
    length: number
    cost: number
}

export class Solution implements Tabulated {
    id: number
    created: number
    data: SolutionData
    numRoutes: number
    deliveryCost: number
    private readonly _key: string

    constructor(bean: SolutionBean) {
        this.id = bean.id;
        this.created = bean.created;
        this.data = JSON.parse(bean.data) as SolutionData
        this.data.depot = new Depot(this.data.depot)
        this.data.customers = this.data.customers.map(c => new Customer(c))
        this._key = uuid()

        this.numRoutes = this.data.routes.length
        this.deliveryCost = this.data.customers
            .map(c => c.packages
                .map(p => p.cost)
                .reduce((a, b) => a + b, 0))
            .reduce((a, b) => a + b, 0)
    }

    key(): string {
        return this._key;
    }
}

export const solutionColumns: ColumnDef<Solution>[] = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'numRoutes',
        header: 'Кількість маршрутів',
    },
    {
        accessorKey: 'totalLength',
        header: 'Довжина шляху',
        cell: ({ row }) => row.original.data.totalLength
    },
    {
        accessorKey: 'totalCost',
        header: 'Вартість Пального',
        cell: ({ row }) => row.original.data.totalCost
    },
    {
        accessorKey: 'deliveryCost',
        header: 'Вартість доставки',
    }
]