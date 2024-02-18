import { ColumnDef } from "@tanstack/react-table"

export type FuelType = {
    id: number | null,
    description: string,
    cost: number
}

export const fuelTypeColumns: ColumnDef<FuelType>[] = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'description',
        header: 'Тип',
    },
    {
        accessorKey: 'cost',
        header: 'Вартість',
    },
]