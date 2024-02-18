import {ColumnDef} from "@tanstack/react-table";

export type Package = {
    id: number | null
    type: string
    weight: number
    volume: number
    cost: number
}

export const packageColumns: ColumnDef<Package>[] = [
    {
        accessorKey: 'type',
        header: 'Тип'
    },
    {
        accessorKey: 'weight',
        header: 'Вага/Об\'єм',
        cell: ({ row }) => row.original.weight + '/' + row.original.volume
    },
    {
        accessorKey: 'cost',
        header: 'Вартість Доставки',
    },
]