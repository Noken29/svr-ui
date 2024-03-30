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
import {Tabulated} from "../../domain/Tabulated";

interface SelectionProps<TData> {
    multipleSelection: boolean
    canUnSelect: boolean
    selectionHandler: (item: TData) => void
}

interface DataTableProps<TData extends Tabulated> {
    columns: ColumnDef<TData>[]
    data: TData[]
    searchInputPlaceholder: string
    itemsPerTable: number
    selectedData?: TData[]
    selectionProps?: SelectionProps<TData>
    removingHandler?: (item: TData) => void
}

export function DataTable<TData extends Tabulated> ({
    columns,
    data,
    itemsPerTable,
    searchInputPlaceholder,
    selectedData,
    selectionProps,
    removingHandler,
}: DataTableProps<TData>) {

    const [globalFilter, setGlobalFilter] = React.useState('')
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
        if (!selectedData)
            return {}
        const initialSelectedRows: RowSelectionState = {}
        selectedData.forEach((item, index) => {
            initialSelectedRows[item.key()] = true
        })
        return initialSelectedRows
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: selectionProps !== undefined,
        enableMultiRowSelection: selectionProps !== undefined ? selectionProps.multipleSelection : false,
        getRowId: item => item.key(),
        state: {
            globalFilter,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: itemsPerTable
            }
        }
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
                    placeholder={searchInputPlaceholder}
                />
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
                            table.getRowModel().rows.map((row, index) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected()}
                                        backgroundColor={_calculateRowBackgroundColor(index, row.getIsSelected())}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} onClick={() => {
                                                if (selectionProps) {
                                                    if (row.getIsSelected() && selectionProps.canUnSelect)
                                                        row.toggleSelected(false)
                                                    else
                                                        row.toggleSelected(true)
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
                                )
                            })
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