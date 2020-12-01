import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatSort, MatSortHeader, MatSortHeaderIntl } from '@angular/material/sort';
import { MatColumnDef, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ResizeEvent } from 'angular-resizable-element';
import { orderBy as _orderBy } from 'lodash-es';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { CellTemplatesComponent } from './cell-templates/cell-templates.component';
import { CellClickEvent } from './interfaces/cell-click-event.interface';
import { DataTableColumnDefinition } from './interfaces/data-table-column-definition.interface';
import { RowClickEvent } from './interfaces/row-click-event.interface';
import { RowKeyDownEvent } from './interfaces/row-key-down-event.interface';
import { ServerSideDataSource } from './server-side/server-side-data-source';

/**
 *
 * ```xml
<ic-data-table
  [columnSettings]="columnSettings"
  [detailTemplate]="detailTemplate"
  [dataSource]="dataSource"
  [showDetails]="showDetails"
  [useSelection]="useSelection"
  [showColumnMenu]="showColumnMenu"
  [hasSorting]="hasSorting"
  [fixedHeader]="fixedHeader"
></ic-data-table>
 * ```
 */

let localeLabels = {};

@Component({
  selector: 'ic-data-table',
  templateUrl: 'data-table.component.html',
  styleUrls: ['data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  // cell template holder
  @ViewChild('cellTemplates', { static: true }) public cellTemplates: CellTemplatesComponent;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  get rowCount(): number {
    let numRows: number;
    if (Array.isArray(this.dataSource)) {
      numRows = this.dataSource.length;
    } else {
      numRows = this.dataSource?.data?.length ?? 0;
    }
    return numRows;
  }
  /**
   * Native table indentifier.
   */
  /* tslint:disable */
  @Input('id') public customId: string;
  /**
   * Flag indicating to render with *detail* rows.
   */
  @Input() public showDetails: boolean = false;
  /**
   * Flag to render column menu.
   */
  @Input() public showColumnMenu: boolean = true;
  /**
   * Flag to render with checkboxes for multiselect rows.
   */
  @Input() public useSelection: boolean = false;
  /**
   * Use this palette for mat elements
   */
  @Input() public color: ThemePalette = 'primary';
  /**
   * Flag to enable sorting.
   */
  @Input() public hasSorting: boolean = false;
  /**
   * Flag to have sticky header.
   */
  @Input() public fixedHeader: boolean = false;

  private _dataSource: any[] | MatTableDataSource<any> | ServerSideDataSource;
  /**
   * DataSource.
   */
  public get dataSource(): any[] | MatTableDataSource<any> | ServerSideDataSource {
    return this._dataSource;
  }
  @Input() public set dataSource(value: any[] | MatTableDataSource<any> | ServerSideDataSource) {
    // If simple array passed make it sortable datasource
    if (Array.isArray(value)) {
      const tmpDataSource = [...value];
      this._dataSource = new MatTableDataSource(tmpDataSource);
    } else {
      this._dataSource = value;
    }
    if (this._dataSource instanceof MatTableDataSource) {
      this._dataSource.sort = this.sort;
      if (this.showDetails) {
        this._dataSource.data.forEach((item: any) => {
          if (item.$detail === undefined) item.$detail = true;
        });
      }
    }
  }
  /**
   * Name of the table.
   */
  @Input() public name: string;
  /**
   * Caption of the table.
   */
  @Input() public caption: string;
  /**
   * Column settings.
   */
  @Input() public columnSettings: DataTableColumnDefinition[] = [];

  /**
   * Custom user defined *detail* view.
   */
  @Input() public detailTemplate: TemplateRef<any>;

  /**
   * Icon to use for closed details.
   */
  @Input() public detailClosedIcon: string = 'chevron-right';
  /**
   * Icon to use for opened details.
   */
  @Input() public detailOpenIcon: string = 'chevron-down';

  /**
   * Icon to use for no sort active.
   */
  @Input() public sortingNoSort: string = 'sort';
  /**
   * Icon to use for sort ascending.
   */
  @Input() public sortingAsc: string = 'sort-ascending';
  /**
   * Icon to use for sort descending.
   */
  @Input() public sortingDesc: string = 'sort-descending';

  /**
   * Row tabIndex, default 0.
   */
  @Input() public tabIndex: number = 0;

  /**
   * Dynamically set per-row CSS class
   */
  @Input() public rowClass: (data: any) => string = () => '';

  /**
   * Emitted row click event.
   * @emits (RowClickEvent)
   */
  @Output() public rowClick: EventEmitter<RowClickEvent> = new EventEmitter<RowClickEvent>();
  /**
   * Emitted cell click event.
   * @emits (CellClickEvent)
   */
  @Output() public cellClick: EventEmitter<CellClickEvent> = new EventEmitter<CellClickEvent>();
  /**
   * Emitted row onkeydown event.
   * @emits (RowKeyDownEvent)
   */
  @Output() public rowKeyDown: EventEmitter<RowKeyDownEvent> = new EventEmitter<RowKeyDownEvent>();
  /**
   * @returns True if table is loading data.
   */
  public isLoading(): Observable<boolean> {
    if (this.dataSource && (this.dataSource as ServerSideDataSource).loading$) {
      return (this.dataSource as ServerSideDataSource).loading$;
    }
    return of(false);
  }

  public parsedColumnSettings: any[];
  public originalColumnSettings: DataTableColumnDefinition[];
  public actualColumns: string[];
  public isResizing: boolean;

  private destroyedSignal: ReplaySubject<boolean> = new ReplaySubject(1);
  private onLangChange: Subscription;

  expandedRow: any;

  public columnSelection: SelectionModel<any> = new SelectionModel<any>(true, [], true);
  public rowSelection: SelectionModel<any> = new SelectionModel<any>(true, [], true);

  constructor(
    public trans: TranslateService,
    public changeDetect: ChangeDetectorRef,
    public elementRef: ElementRef,
    private matSortService: MatSortHeaderIntl,
    private localStorage: LocalStorageService,
    private cdRef: ChangeDetectorRef
  ) {}

  public sortButtonLabel(id: string) {
    if (!localeLabels[id]) {
      return;
    }
    return this.trans.instant('ICELL_DATA_TABLE.SORT_BUTTON_LABEL', {
      id: this.trans.instant(localeLabels[id]),
      direction: `ICELL_DATA_TABLE.SORT_${this.getSortDirection(id) === '' ? 'NONE' : this.getSortDirection(id).toUpperCase()}`,
    });
  }

  ngOnDestroy() {
    this.destroyedSignal.next(true);
    this.destroyedSignal.complete();
    this.onLangChange.unsubscribe();
  }

  ngAfterViewInit() {
    this.matSortService.sortButtonLabel = this.sortButtonLabel.bind(this);
    // debug localization
    // this.trans.set('ICELL_DATA_TABLE.SORT_BUTTON_LABEL', 'Change sorting for {{id}}, {{direction}}', 'en');
    // this.trans.set('ICELL_DATA_TABLE.SORT_BUTTON_LABEL', '{{id}} oszlop sorrendjének megváltoztatása, {{direction}}', 'hu');
  }

  ngOnInit() {
    this.setDisplayedColumns();
    this.onLangChange = this.trans.onLangChange.subscribe(() => this.matSortService.changes.next());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columnSettings) {
      this.loadColumnSettings();
      if (!changes.columnSettings.previousValue) {
        localeLabels = {
          ...localeLabels,
          ...this.columnSettings.reduce((prev, curr) => ({ ...prev, [curr.orderName || curr.field]: curr.label }), {}),
        };
        this.originalColumnSettings = [...this.columnSettings];
      }
      this.columnSelection = new SelectionModel<any>(
        true,
        this.columnSettings.filter((c) => c.visible),
        true
      );
      this.columnSelection.changed.subscribe((chg) => {
        const origCols = [...this.columnSettings];
        if (chg.added.length > 0) {
          chg.added.forEach((added) => {
            origCols.find((col) => col.field === added.field).visible = true;
          });
        }
        if (chg.removed.length > 0) {
          chg.removed.forEach((removed) => {
            origCols.find((col) => col.field === removed.field).visible = false;
          });
        }
        this.columnSettings = origCols;
        this.saveColumnSettings();
        this.setDisplayedColumns();
      });
    }
  }

  setDisplayedColumns() {
    this.actualColumns = _orderBy(this.columnSettings, ['sticky', 'stickyEnd'], ['asc', 'desc'])
      .filter((c) => c.visible)
      .map((c) => c.field);
    if (this.showDetails) {
      this.actualColumns.unshift('$masterDetail'); // masodik
    }
    if (this.useSelection) {
      this.actualColumns.unshift('$selectBoxes'); // elso
    }
    if (this.showColumnMenu) {
      this.actualColumns.push('$columnMenu'); // utolso
    }
  }

  loadColumnSettings() {
    const storedColumnSettings = this.localStorage.retrieve(`table-settings-${this.name}`);

    try {
      this.parsedColumnSettings = JSON.parse(storedColumnSettings);
    } catch (e) {
      console.error(`couldn't parse table settings`, e);
    }

    if (this.parsedColumnSettings) {
      const currentSettings = [...this.columnSettings];
      currentSettings.forEach((cs) => {
        cs = Object.assign(
          cs,
          this.parsedColumnSettings.find((pcs) => pcs.field === cs.field)
        );
      });
      this.columnSettings = currentSettings;
    }
  }

  saveColumnSettings() {
    this.localStorage.store(
      `table-settings-${this.name}`,
      JSON.stringify(this.columnSettings.map((cs) => ({ field: cs.field, visible: cs.visible })))
    );
  }

  resetDefaultColumnSettings() {
    this.localStorage.clear(`table-settings-${this.name}`);
    this.saveColumnSettings();
  }

  // custom sorting
  isSorted(id: string) {
    const sortInfo = (this.dataSource as MatTableDataSource<any> | ServerSideDataSource)?.sort;
    if (!sortInfo) {
      return;
    }
    if (!sortInfo.sortables.has(id)) {
      const sortHeader = new MatSortHeader(this.matSortService, this.cdRef, this.sort, <MatColumnDef>{ name: id });
      sortHeader.id = id;
      sortInfo.sortables.set(id, sortHeader);
    }
    return sortInfo.active === id && sortInfo.direction !== '';
  }

  getSortDirection(id: string) {
    const sortInfo = (this.dataSource as MatTableDataSource<any> | ServerSideDataSource)?.sort;
    return this.isSorted(id) ? sortInfo?.direction : '';
  }

  applySort(id: string) {
    const sortInfo = (this.dataSource as MatTableDataSource<any> | ServerSideDataSource)?.sort;
    const sortable = sortInfo?.sortables.get(id);
    if (sortInfo) {
      sortInfo.sort(sortable);
    }
  }

  // cell template handling
  getTemplate(templateName: string): TemplateRef<any> {
    return this.cellTemplates.getTemplate(templateName);
  }

  // detail
  expandRow(row: any) {
    row.$expanded = !row.$expanded;
    this.expandedRow = row.$expanded ? row : null;
  }

  hasDetailRow(i: number, row: any) {
    return row.$detail;
  }

  // not displayed column properties
  getHiddenProps(cols: string[], row: any) {
    const res = Object.keys(row)
      .map((p) => (!['$expanded', '$detail', ...cols].includes(p) ? p : null))
      .filter((p) => !!p);
    return res;
  }

  // column definition for default detail view
  generateDefaultColDefs(cols: string[]) {
    const res = cols.map((c) => ({ label: c, field: c }));
    return res;
  }

  // column resize
  onResizeStart(event: ResizeEvent) {
    this.isResizing = true;
  }

  onResizeEnd(event: ResizeEvent, column: any): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const col = document.getElementsByClassName(`mat-column-${column.field}`);
      for (let i = 0; i < col.length; i++) {
        const cur = col[i] as any;
        cur.style.width = cssValue;
      }
    }
    this.isResizing = false;
  }

  // selection checkboxes
  isAllSelected() {
    const numSelected = this.rowSelection.selected.length;
    return numSelected === this.rowCount;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.rowSelection.clear()
      : Array.isArray(this.dataSource)
      ? this.dataSource.forEach((row) => this.rowSelection.select(row))
      : this.dataSource.data.forEach((row) => this.rowSelection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return this.trans.instant(`${this.isAllSelected() ? 'SELECT' : 'DESELECT'}_ALL`);
    }
    return this.trans.instant(`${this.rowSelection.isSelected(row) ? 'DESELECT' : 'SELECT'}_ROW`, { position: row.position + 1 });
  }

  // click events
  onRowClick(event: MouseEvent, rowData: any) {
    this.rowClick.emit({ ...event, row: rowData });
  }

  onRowKeyDown(event: KeyboardEvent, rowData: any) {
    this.rowKeyDown.emit({ event, row: rowData });
  }

  onCellClick(event: MouseEvent, cellData: any) {
    this.cellClick.emit({ ...event, cell: cellData });
  }
}
