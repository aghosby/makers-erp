import {
  Component, Input, Output, EventEmitter, OnChanges, AfterViewInit,
  AfterContentInit, SimpleChanges, ViewChild, ContentChildren, QueryList,
  TemplateRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { TableColumn } from '@shared/models/table-columns';
import { FilterConfig } from '@shared/models/table-filter';
import { CellTemplateDirective } from './cell-template.directive';

export interface TablePageEvent {
  page: number;
  size: number;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnChanges, AfterViewInit, AfterContentInit {

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20];

  @Input() isLoading: boolean = false;
  @Input() emptyIcon: string = 'folderOpen';
  @Input() emptyMessage: string = 'No records found';
  @Input() emptyHeight: string = '15rem';

  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() showSelection: boolean = false;
  @Input() filters: FilterConfig[] = [];

  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<{ [key: string]: any }>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() rowClick = new EventEmitter<any>();

  @ContentChildren(CellTemplateDirective) cellTemplates: QueryList<CellTemplateDirective>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];
  showFilters = false;
  private templateMap = new Map<string, TemplateRef<any>>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.dataSource.data = this.data || [];
    }
    if (changes.columns || changes.showSelection) {
      this.buildDisplayedColumns();
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    }
  }

  ngAfterContentInit(): void {
    this.buildTemplateMap();
    this.cellTemplates.changes.subscribe(() => this.buildTemplateMap());
  }

  private buildDisplayedColumns(): void {
    const keys = (this.columns || []).map(c => c.key);
    this.displayedColumns = this.showSelection ? ['__select__', ...keys] : keys;
  }

  private buildTemplateMap(): void {
    this.templateMap.clear();
    this.cellTemplates.forEach(t => this.templateMap.set(t.columnKey, t.templateRef));
  }

  getTemplate(key: string): TemplateRef<any> | null {
    return this.templateMap.get(key) || null;
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length
      && this.dataSource.data.length > 0;
  }

  isIndeterminate(): boolean {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: any): void {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  clearSelection(): void {
    this.selection.clear();
    this.selectionChange.emit([]);
  }

  onSearch(term: string): void {
    this.searchChange.emit(term);
  }

  onFiltersChange(filters: { [key: string]: any }): void {
    this.filtersChange.emit(filters);
  }

  onPaginatorPage(event: PageEvent): void {
    this.pageChange.emit({ page: event.pageIndex + 1, size: event.pageSize });
  }

  getRangeDisplayText = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) return `Page 0 of ${length}`;
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `Page ${startIndex + 1} to ${endIndex} of ${length}`;
  };
}
