import { CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { get as _get, identity, isFunction as _isFunction } from 'lodash-es';
import { BehaviorSubject, merge, Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, finalize, map, switchMap, tap } from 'rxjs/operators';
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
  private loadDataTriggerSubject = new BehaviorSubject<void>(null);

  private loadDataSubscription: Subscription;

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
   * @param mappingFn A function that maps the response data from the server to a [DataWithQueryResponseDetails]{@link ServerSideDataSource#DataWithQueryResponseDetails} type.
   */
  constructor(
    private dataSourceEndpoint: QueryFunction,
    private dataHolder: string | symbol,
    public paginationParams: PaginationParams,
    public sort: MatSort,
    public rowSelection: SelectionModel<any>,
    private paginatorIntl: MatPaginatorIntl,
    private cdRef: ChangeDetectorRef,
    public withDetail: boolean = false,
    public clearSelectionOnPageChange: boolean = false,
    public mappingFn: (resp: any) => DataWithQueryResponseDetails = identity,
  ) {
    if (!_isFunction(this.dataSourceEndpoint)) {
      throw new Error('The `dataSourceEndpoint` argument should be a function!');
    }

    this.paginator = new MatPaginator(this.paginatorIntl, this.cdRef);
  }

  connect(_collectionViewer: CollectionViewer): Observable<any[] | readonly any[]> {
    this.paginator.ngOnInit();

    this.paginator.initialized.subscribe(() => {
      this.paginator.pageSize = this.paginationParams.rows;
      this.paginator.pageIndex = this.paginationParams.page - 1 || 0;
    });

    this.initDataLoading();
    this.loadData();

    return this.dataSubject.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.loadDataSubscription.unsubscribe();
  }

  /**
   * Loads data from specified endpoint.
   */
  public loadData() {
    this.loadDataTriggerSubject.next();
  }

  private initDataLoading() {
    const sortChange$ = this.sort.sortChange.pipe(tap(() => (this.paginator.pageIndex = 0)));

    this.loadDataSubscription = merge(this.loadDataTriggerSubject, sortChange$, this.paginator.page)
      .pipe(
        debounceTime(100),
        switchMap(() => {
          if (this.clearSelectionOnPageChange) {
            this.rowSelection.clear();
          }

          this.loadingSubject.next(true);

          const request$ = this.dataSourceEndpoint(
            { rows: this.paginator.pageSize, page: this.paginator.pageIndex + 1 } as QueryRequestDetails,
            this.sort.active,
            this.sort.direction
          );

          if (!(request$ instanceof Observable)) {
            throw new Error('The `dataSourceEndpoint` function should return an Observable!');
          }

          return request$.pipe(
            map(this.mappingFn),
            map((data: DataWithQueryResponseDetails) => {
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
              this.paginator.length = 0;
              return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
          );
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.dataSubject.next(this.data);
      });
  }
}
