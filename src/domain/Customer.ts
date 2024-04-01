import {Package, PackageBean} from "./Package";
import {ColumnDef} from "@tanstack/react-table";
import {Tabulated} from "./Tabulated";
import uuid from 'react-uuid';
import {Position} from "google-map-react";

export type CustomerBean = {
    id?: number
    name: string
    phoneNumber: string
    addressLines: string
    specialRequirements: string
    packages: PackageBean[]
    latitude: number
    longitude: number
}

export class Customer implements Tabulated {
    id?: number
    name: string
    phoneNumber: string
    addressLines: string
    specialRequirements: string
    packages: Package[]
    latitude: number
    longitude: number
    private _key: string

    constructor(bean: CustomerBean) {
        this.id = bean.id
        this.name = bean.name
        this.phoneNumber = bean.phoneNumber
        this.addressLines = bean.addressLines
        this.specialRequirements = bean.specialRequirements
        this.packages = bean.packages.map((p) => new Package(p))
        this.latitude = bean.latitude
        this.longitude = bean.longitude
        this._key = uuid()
    }

    asBean() {
        return {
            id: this.id,
            name: this.name,
            phoneNumber: this.phoneNumber,
            addressLines: this.addressLines,
            specialRequirements: this.specialRequirements,
            packages: this.packages.map((p) => p.asBean()),
            latitude: this.latitude,
            longitude: this.longitude
        } as CustomerBean
    }

    asPosition() {
        return {
            lat: this.latitude,
            lng: this.longitude
        } as Position
    }

    key(): string {
        return this._key;
    }
}

export const customerColumns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'name',
        header: 'Ім\'я',
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Номер Телефону',
    },
    {
        accessorKey: 'addressLines',
        header: 'Адреса',
    },
    {
        accessorKey: 'specialRequirements',
        header: 'Вимоги',
    },
    {
        id: 'numberOfPackages',
        header: 'Кількість Вантажів',
        cell: ({ row }) => row.original.packages.length
    },
]