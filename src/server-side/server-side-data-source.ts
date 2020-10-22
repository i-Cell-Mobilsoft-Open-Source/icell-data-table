import { CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { get as _get } from 'lodash-es';
import { BehaviorSubject, merge, Observable, of, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PaginationParams } from '../interfaces';
import { DataWithQueryResponseDetails } from '../interfaces/data-with-query-response-details.interface';
import { QueryFunction } from '../interfaces/query-function';
import { QueryRequestDetails } from '../interfaces/query-request-details.interface';

/**
 * Server side data source. This will represent the remote data.
 */
export class ServerSideDataSource implements DataSource<any> {
  public data: any[] = [];
  private dataSubject = new BehaviorSubject<any[]>(this.data);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private paginatorInitSubscription: Subscription;
  private pageSubscription: Subscription;
  private sortSubscription: Subscription;

  public loading$ = this.loadingSubject.asObservable();

  public paginator: MatPaginator;

  public get length() {
    return this.data.length;
  }

  /**
   *
   * @param dataSourceEndpoint Data query endpoint function.
   * @param dataHolder Field of the response that holds the array to be rendered.
   * @param paginationParams Pagination configuration.
   * @param sort `matSort` of the table.
   * @param rowSelection Needed to clear selection if [clearSelectionOnPageChange]{@link ServerSideDataSource#clearSelectionOnPageChange} is set.
   * @param paginatorIntl Needed to factory a `mat-paginator` component.
   * @param cdRef Needed to factory a `mat-paginator` component.
   * @param withDetail Flag to extend the response for master-detail representation.
   * @param clearSelectionOnPageChange Flag if set the selection will be cleared on paging.
   */
  constructor(
    private dataSourceEndpoint: QueryFunction,
    private dataHolder: string | symbol,
    public paginationParams: PaginationParams,
    private sort: MatSort,
    public rowSelection: SelectionModel<any>,
    private paginatorIntl: MatPaginatorIntl,
    private cdRef: ChangeDetectorRef,
    public withDetail: boolean = false,
    public clearSelectionOnPageChange: boolean = false,
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.cdRef);
  }

  connect(collectionViewer: CollectionViewer): Observable<any[] | readonly any[]> {
    this.paginator.ngOnInit();

    this.paginatorInitSubscription = this.paginator.initialized.subscribe(() => {
      this.paginator.pageSize = this.paginationParams.rows;
    });

    this.pageSubscription = this.paginator.page.subscribe(() => {
      this.loadData();
    });
    this.sortSubscription = this.sort.sortChange.subscribe(() => {
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.loadData();
    });

    this.loadData();
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.pageSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();
    this.paginatorInitSubscription.unsubscribe();
  }

  /**
   * Loads data from specified endpoint.
   */
  public loadData() {
    this.loadingSubject.next(true);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (this.clearSelectionOnPageChange) {
            this.rowSelection.clear();
          }

          switch (typeof this.dataSourceEndpoint) {
            case 'function':
              return this.dataSourceEndpoint(
                { rows: this.paginator.pageSize, page: this.paginator.pageIndex + 1 } as QueryRequestDetails,
                this.sort.active,
                this.sort.direction
              );
            default:
              throw new Error('The `dataSourceEndpoint` argument should be a function!');
          }
        }),
        map((data: DataWithQueryResponseDetails) => {
          this.loadingSubject.next(false);
          this.paginator.length = data.paginationParams.totalRows;
          this.paginationParams = {
            ...this.paginationParams,
            maxPage: Math.ceil(data.paginationParams.totalRows / this.paginationParams.rows),
            totalRows: data.paginationParams.totalRows,
            page: this.paginator.pageIndex + 1,
          };

          const rows = _get(data, this.dataHolder, []);

          if (this.withDetail) {
            rows.forEach((item: any) => (item.$detail = true));
          }

          return rows;
        }),
        catchError(() => {
          this.loadingSubject.next(false);
          this.paginator.length = 0;

          return of([]);
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.dataSubject.next(this.data);
      });
  }
}
