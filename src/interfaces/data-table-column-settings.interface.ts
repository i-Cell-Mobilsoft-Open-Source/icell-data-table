import { DataTableColumnDefinition } from "./data-table-column-definition.interface";
import { DataTableGroupingHeader } from "./data-table-grouping-header.interface";

export interface DataTableColumnSettings {
  /**
   * Column definitions
   */
  columnDefinitions: DataTableColumnDefinition[];

  /**
   * Grouping headers
   */
  groupingHeaders?: DataTableGroupingHeader[];

}
