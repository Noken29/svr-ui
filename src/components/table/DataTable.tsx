import {
    ColumnDef,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    RowSelectionState,
    useReactTable
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell, TableControlButton, TableControlCell,
    TableFooter,
    TableHead,
    TableHeader, TableHeaderRow,
    TableRow,
    TableWrapper
} from "./table.styled";
import React, {useState} from "react";
import {ColorScheme} from "../../styles/global";
import {ControlButton, Input, RemoveButton} from "../../styles/controls.styled";
import {Control, SectionItem} from "../../styles/page.styled";

interface SelectionProps<TData> {
    multipleSelection: boolean
    selectionHandler: (item: TData) => void
    selectedItems?: TData[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    itemsPerTable: number
    selectionProps?: SelectionProps<TData>
    removingHandler?: (item: TData) => void
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             itemsPerTable,
                                             selectionProps,
                                             removingHandler,
                                         }: DataTableProps<TData, TValue>) {

    const [globalFilter, setGlobalFilter] = React.useState('')
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: selectionProps !== undefined,
        enableMultiRowSelection: selectionProps !== undefined ? selectionProps.multipleSelection : false,
        state: {
            globalFilter,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: itemsPerTable
            },
            rowSelection: {}
        },
    })


    function _calculateRowBackgroundColor (index: number, selected: boolean) {
        if (selected)
            return ColorScheme.LIGHTCYAN
        return (index % itemsPerTable) % 2 === 0 ? ColorScheme.WHITE_ACTIVE : ColorScheme.GRAY
    }

    function _calculateFooterRowBackgroundColor () {
        if (table.getPaginationRowModel().rows.length === 0)
            return ColorScheme.GRAY
        if (table.getPaginationRowModel().rows.length < itemsPerTable)
            return (table.getPaginationRowModel().rows.length) % itemsPerTable % 2 === 0 ? ColorScheme.WHITE_ACTIVE : ColorScheme.GRAY
        return (itemsPerTable % 2 === 0 ? ColorScheme.WHITE_ACTIVE : ColorScheme.GRAY)
    }

    return (
        <SectionItem>
            <Control>
                <Input
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder={'Фільтр Тип/Вартість/...'}
                />
                <ControlButton>Імпорт з CSV</ControlButton>
            </Control>
            <TableWrapper>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableHeaderRow
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                                {removingHandler !== undefined && <TableControlCell/>}
                            </TableHeaderRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    backgroundColor={_calculateRowBackgroundColor(index, row.getIsSelected())}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} onClick={() => {
                                            row.toggleSelected()
                                            if (selectionProps) {
                                                selectionProps.selectionHandler(row.original)
                                            }
                                        }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {removingHandler !== undefined && (
                                        <TableControlCell>
                                            <RemoveButton onClick={() => {
                                                setRowSelection({})
                                                removingHandler(row.original)
                                            }}/>
                                        </TableControlCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow
                                backgroundColor={ColorScheme.WHITE_ACTIVE}
                            >
                                <TableCell
                                    colSpan={columns.length + (removingHandler !== undefined ? 1 : 0)}
                                >
                                    Немає результатів
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TableFooter
                    backgroundColor={_calculateFooterRowBackgroundColor()}
                >
                    <TableControlButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Попередня
                    </TableControlButton>
                    <TableControlButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Наступна
                    </TableControlButton>
                </TableFooter>
            </TableWrapper>
        </SectionItem>
    )
}