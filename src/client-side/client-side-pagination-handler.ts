import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { PaginationHandler, PaginationParams } from '../interfaces';

/**
 * Client side pagination handler.
 */
export class ClientSidePaginationHandler implements PaginationHandler {

  public paginationParams: PaginationParams;

  private _paginator: MatPaginator;

  /**
   * @param dataSource Data source.
   * @param paginatorIntl Used to factory `mat-paginator`.
   * @param cdRef Used to factory `mat-paginator`.
   * @param paginationParams Pagination configuration.
   */
  constructor(dataSource: MatTableDataSource<any>,
    paginatorIntl: MatPaginatorIntl,
    cdRef: ChangeDetectorRef,
    paginationParams: PaginationParams) {
    this._paginator = new MatPaginator(paginatorIntl, cdRef);
    this.initializePaginatior(paginationParams);
    this.paginationParams = paginationParams;
    dataSource.paginator = this._paginator;
  }

  goToFirstPage(): void {
    this._paginator.firstPage();
    this.updatePage();
  }
  goToPreviousPage(): void {
    this._paginator.previousPage();
    this.updatePage();
  }
  goToNextPage(): void {
    this._paginator.nextPage();
    this.updatePage();
  }
  goToLastPage(): void {
    this._paginator.lastPage();
    this.updatePage();
  }
  goToPage(page: number): void {
    this._paginator.pageIndex = page + 1;
    this.updatePage();
  }

  setPageSize(pageSize: number) {
    this._paginator._changePageSize(pageSize);
    this.paginationParams = {
      ...this.paginationParams,
      rows: pageSize,
      page: this._paginator.pageIndex + 1,
      maxPage: Math.ceil(this.paginationParams.totalRows / pageSize),
    };
  }

  private initializePaginatior(params: PaginationParams) {
    this._paginator.ngOnInit();
    this._paginator.length = params.totalRows;
    this._paginator.pageIndex = params.page - 1;
    this._paginator.pageSize = params.rows;
  }

  private updatePage() {
    this.paginationParams = {
      ...this.paginationParams,
      page: this._paginator.pageIndex + 1,
    };
  }

}
