import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ClientSidePaginationHandler,
  DataTableColumnDefinition,
  DataTableComponent,
  DataWithQueryResponseDetails,
  QueryRequestDetails,
  ServerSideDataSource,
  ServerSidePaginationHandler,
} from '@i-cell/data-table';
import { PaginationParams } from '@i-cell/data-table/interfaces';
import { TranslateService } from '@ngx-translate/core';
import { orderBy } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { RowActionComponent } from './row-action/row-action.component';
import { TableDemoService } from './table-demo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public data: MatTableDataSource<any>;
  public withDetail = true;
  public columnDefs: DataTableColumnDefinition[];
  @ViewChild(DataTableComponent, { static: true })
  private table: DataTableComponent;

  paginationHandler: any;
  paginationParams: PaginationParams = {
    maxPage: 2,
    page: 1,
    rows: 10,
    totalRows: 20,
  };

  constructor(
    public translate: TranslateService,
    public http: HttpClient,
    public route: Router,
    public activeRoute: ActivatedRoute,
    private ds: TableDemoService,
    private cdRef: ChangeDetectorRef,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.translate.addLangs(['en', 'hu']);
    this.translate.setTranslation(
      'en',
      {
        'ICELL_DATA_TABLE.NOROWSTOSHOW': 'No data present',
      },
      true
    );
    this.translate.setDefaultLang('en');
  }

  toNumber(mass) {
    return Intl.NumberFormat(this.translate.getBrowserLang()).format(
      parseFloat(mass)
    );
  }

  toColor(hex) {
    return hex ? `#${hex}` : '#FFFFFF';
  }

  getDescription(row) {
    if (
      !row.description &&
      row.description !== '' &&
      row.description !== null
    ) {
      row.description = null;
      return new Observable((observer) => {
        fetch(
          // tslint:disable-next-line: max-line-length
          `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${row.name}&explaintext=1&formatversion=2&origin=*&format=json`
        ).then((resp) =>
          resp.json().then((res) => {
            row.description = res.query.pages[0].extract;
            observer.next(row.description);
          })
        );
      });
    }
    return of(row.description);
  }

  ngOnInit() {
    // this.data = new ServerSideDataSource(
    //   this.getStaticData.bind(this),
    //   'list',
    //   this.paginationParams,
    //   this.table.sort,
    //   this.table.rowSelection,
    //   this.paginatorIntl,
    //   this.cdRef,
    //   this.withDetail,
    //   false
    // );
    // this.paginationHandler = new ServerSidePaginationHandler(this.data);
    this.data = new MatTableDataSource(this.ds.data);
    this.paginationHandler = new ClientSidePaginationHandler(this.data, this.paginatorIntl, this.cdRef, this.paginationParams);

    this.columnDefs = [
      {
        field: 'atomicNumber',
        label: 'position',
        sortable: true,
        hideable: true,
        visible: true,
      },
      {
        field: 'name',
        label: 'name',
        sortable: true,
        template: 'labelBoldTemplate',
        hideable: true,
        visible: true,
        identifier: true
      },
      {
        field: 'atomicMass',
        label: 'weight',
        template: 'labelTemplate',
        valueFormatter: (atomicMass) => `${atomicMass} molar mass`,
        sortable: true,
        hideable: true,
        visible: true,
      },
      {
        field: 'symbol',
        label: 'symbol',
        sortable: true,
        hideable: true,
        visible: true,
      },
      {
        field: 'actions',
        label: 'actions',
        sortable: false,
        hideable: false,
        visible: true,
        stickyEnd: true,
        template: 'componentTemplate',
        component: RowActionComponent,
        parent: this,
      },
    ];
  }

  getStaticData(
    queryParams: QueryRequestDetails,
    sortColumn: any,
    sortOrder: any
  ) {
    const page = queryParams.page - 1;
    return new Observable<DataWithQueryResponseDetails>((observer) => {
      setTimeout(() => {
        observer.next({
          list: orderBy([...this.ds.data], [sortColumn], [sortOrder]).slice(
            page * queryParams.rows,
            page * queryParams.rows + queryParams.rows
          ),
          paginationParams: {
            totalRows: this.ds.data.length,
            maxPage: this.ds.data.length % queryParams.rows,
          },
        } as DataWithQueryResponseDetails);
      }, 1000);
    });
  }

  rowClick(event) {
    console.log('rowClick', event.row);
  }

  cellClick(event) {
    console.log('cellClick', event.cell);
  }
}
