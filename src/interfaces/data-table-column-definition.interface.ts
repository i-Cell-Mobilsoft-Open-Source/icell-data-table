export interface DataTableColumnDefinition {
  /**
   * Path to field that should be rendered.
   */
  field?: string;

  /**
   * Callback to transform the cell's data
   */
  valueFormatter?: (data: any) => string;

  /**
   * Callback to transform the row model to a displayable value
   */
  valueGetter?: (row: any) => string;

  /**
   * Column label; can be a localization key.
   */
  label: string;

  /**
   * Defines if the column dis hideable.
   */
  hideable: boolean;

  /**
   * Defines if the column is visible. If used with hideable, the column will be in the column menu unchecked.
   */
  visible: boolean;

  /**
   * Defines if the column should be sortable.
   */
  sortable?: boolean;

  /**
   * Defines if the column should be sticky at the begining of the table.
   */
  sticky?: boolean;

  /**
   * Defines if the column should be sticky at the end of the table.
   */
  stickyEnd?: boolean;

  /**
   * Defines how the cell should be rendered.
   *
   * If `componentTemplate` is used you must define the `component` property as well.
   */
  template?: 'labelTemplate' | 'labelBoldTemplate' | 'numericTemplate' | 'iconTemplate' | 'componentTemplate';

  /**
   * Defines what component to use to render the cell.
   *
   * Use with `template = 'componentTemplate'`.
   */
  component?: any;

  /**
   * Defines the context parent for the component.
   *
   * Use with `template = 'componentTemplate'`.
   */
  parent?: any;
}
