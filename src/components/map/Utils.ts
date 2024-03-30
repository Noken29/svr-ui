import {Depot} from "../../domain/Depot";
import {Customer} from "../../domain/Customer";

export type Position = {
    lat: number,
    lng: number,
    addressLines?: string
}

export const KyivPosition: Position = {
    lat: 50.4567406605353,
    lng: 30.525140703293182
}

export const mapRouteCustomers = (
    customers: Customer[],
    customersIds: number[]
) => {
    return customersIds.map(id => customers.filter(c => c.id === id)[0])
}

export const mapRoutePositions = (
    depot: Depot,
    customers: Customer[],
    customersIds: number[]
) => {
    const positions: Position[] = [depot.asPosition()]
    positions.push(...customersIds.map(id => customers.filter(c => c.id === id)[0].asPosition()))
    positions.push(depot.asPosition())
    return positions
}