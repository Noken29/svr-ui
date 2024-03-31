import {Tabulated} from "./Tabulated";
import uuid from "react-uuid";
import {Depot} from "./Depot";
import {Customer} from "./Customer";
import {Vehicle} from "./Vehicle";
import {ColumnDef} from "@tanstack/react-table";
import {Package} from "./Package";

export type SolutionBean = {
    id: number
    created: number
    data: string
}

export type SolutionDataBean = {
    depot: Depot
    customers: Customer[]
    vehicles: Vehicle[]
    routes: RouteBean[]
    totalLength: number
    totalCost: number
}

export type RouteBean = {
    vehicleId: number
    customersIds: number[]
    packagesIds: number[]
    length: number
    cost: number
}

export class Solution implements Tabulated {
    id: number
    created: number
    depot: Depot
    customers: Customer[]
    vehicles: Vehicle[]
    routes: Route[]
    totalLength: number
    totalCost: number
    deliveryCost: number
    private readonly _key: string

    constructor(bean: SolutionBean) {
        this.id = bean.id;
        this.created = bean.created;

        const solutionDataBean = JSON.parse(bean.data) as SolutionDataBean
        this.depot = new Depot(solutionDataBean.depot)
        this.customers = solutionDataBean.customers.map(c => new Customer(c))
        this.vehicles = solutionDataBean.vehicles.map(v => new Vehicle(v))
        this.routes = solutionDataBean.routes.map((r, index) => new Route(index, solutionDataBean))
        this.totalLength = solutionDataBean.totalLength
        this.totalCost = solutionDataBean.totalCost

        this._key = uuid()

        this.deliveryCost = solutionDataBean.customers.map(c => c.packages
            .map(p => p.cost).reduce((a, b) => a + b, 0))
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
        cell: ({ row }) => row.original.totalLength
    },
    {
        accessorKey: 'totalCost',
        header: 'Вартість Пального',
        cell: ({ row }) => row.original.totalCost
    },
    {
        accessorKey: 'deliveryCost',
        header: 'Вартість доставки',
    }
]

export class Route implements Tabulated {
    index: number
    vehicle: Vehicle
    customers: Customer[]
    packages: Package[]
    length: number
    cost: number
    private readonly _key: string

    constructor(index: number, bean: SolutionDataBean) {
        this.index = index

        const routeBean = bean.routes[index]
        this.vehicle = bean.vehicles.filter(v => v.id === routeBean.vehicleId)[0]
        this.customers = routeBean.customersIds.map(id => new Customer(bean.customers.filter(c => c.id === id)[0]))
        this.customers.forEach(c => c.packages = c.packages.filter(p => routeBean.packagesIds.indexOf(p.id ?? -1) !== -1))
        this.packages = routeBean.packagesIds
            .map(id => this.customers
                .map(c => c.packages
                    .filter(p => p.id === id)[0])).flat()
        this.length = routeBean.length
        this.cost = routeBean.cost

        this._key = uuid()
    }

    key(): string {
        return this._key;
    }
}

export const routeColumns: ColumnDef<Route>[] = [
    {
        accessorKey: 'index',
        header: 'Номер',
        cell: ({ row }) => row.original.index + 1
    },
    {
        accessorKey: 'vehicleDescription',
        header: 'ТЗ',
        cell: ({ row }) => row.original.vehicle.description
    },
    {
        accessorKey: 'numCustomers',
        header: 'Кількість клієнтів',
        cell: ({ row }) => row.original.customers.length
    },
    {
        accessorKey: 'length',
        header: 'Довжина Шляху'
    },
    {
        accessorKey: 'cost',
        header: 'Вартість Пального'
    }
]