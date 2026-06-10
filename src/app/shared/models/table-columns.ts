export interface TableColumn {
    key: string,
    label: string,
    order: number,
    columnWidth: any,
    cellStyle?: string,
    sortable: boolean,
    isSticky?: boolean,
    hideLabel?: boolean
}