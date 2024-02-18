import {Package} from "./Package";
import {ColumnDef} from "@tanstack/react-table";

export type Customer = {
    id: number | null
    name: string
    phoneNumber: string
    addressLines: string
    specialRequirements: string
    packages: Package[]
    latitude?: number
    longitude?: number
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