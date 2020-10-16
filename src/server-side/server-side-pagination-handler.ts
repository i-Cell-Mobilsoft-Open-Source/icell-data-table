import { PaginationHandler, PaginationParams } from '../interfaces';
import { ServerSideDataSource } from './server-side-data-source';

/**
 * Pagination handler for server side data sources.
 */
export class ServerSidePaginationHandler implements PaginationHandler {
  private dataSource: ServerSideDataSource;

  constructor(dataSource: ServerSideDataSource) {
    this.dataSource = dataSource;
  }

  goToFirstPage(): void {
    this.dataSource.paginator.firstPage();
  }
  goToPreviousPage(): void {
    this.dataSource.paginator.previousPage();
  }
  goToNextPage(): void {
    this.dataSource.paginator.nextPage();
  }
  goToLastPage(): void {
    this.dataSource.paginator.lastPage();
  }
  goToPage(page: number): void {
    this.dataSource.paginator.pageIndex = page - 1;
  }
  setPageSize(pageSize: number) {
    this.dataSource.paginationParams = {
      ...this.dataSource.paginationParams,
      rows: pageSize,
      maxPage: Math.ceil(this.dataSource.paginationParams.totalRows / pageSize),
    };
    this.dataSource.paginator.pageSize = pageSize;
    this.dataSource.paginator.pageIndex = 0;
    this.dataSource.loadData();
  }
}
