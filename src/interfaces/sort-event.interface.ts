import {DataTableColumnDefinition} from './data-table-column-definition.interface';

export interface SortEvent {
  order: string;
  col: DataTableColumnDefinition;
}
