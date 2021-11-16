import { ComponentOptions } from './component-options.interface';

export interface DataTableColumnDefinition {
  /**
   * Path to field that should be rendered.
   */
  field: string;

  /**
   * Custom ordering parameter
   */
  orderName?: string;

  /**
   * Custom aria label for sort button
   */
  sortButtonAriaLabel?: string;

  /**
   * Callback to transform the cell's data
   */
  valueFormatter?: (data: any) => string;

  /**
   * Callback to transform the row model
   */
  valueGetter?: (row: any) => any;

  /**
   * Column label; can be a localization key.
   */
  label?: string;

  /**
   * Defines if the column dis hideable.
   */
  hideable?: boolean;

  /**
   * Defines if the column is visible. If used with hideable, the column will be in the column menu unchecked.
   */
  visible?: boolean;

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
   * Provide input, output bindings for the component rendered in the cell
   *
   * Use with `template = 'componentTemplate'`.
   */
  componentOptions?: ComponentOptions;

  /**
   * Defines the context parent for the component.
   *
   * Use with `template = 'componentTemplate'`.
   */
  parent?: any;

  /**
   * Defines if the cell should render as header for a11y reasons.
   */
  identifier?: boolean;

  /**
   * Defines custom `CSS` class for the column it self.
   */
  columnClasses?: string;

  /**
   * Defines custom `CSS` class for the column cells.
   */
  cellClasses?: string;
}
