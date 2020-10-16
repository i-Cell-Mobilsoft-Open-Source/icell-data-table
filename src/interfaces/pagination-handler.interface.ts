export interface PaginationHandler {
    goToFirstPage(): void;
    goToPreviousPage(): void;
    goToNextPage(): void;
    goToLastPage(): void;
    goToPage(page: number): void;
}
