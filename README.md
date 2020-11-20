# ICELL-DATA-TABLE

## Installation

```shell
npm i @i-cell/data-table
```
## Usage

### Configuration

IMPORTANT: The table uses `materialdesignicons` svg icon, you will need to download the latest `mdi.svg` from [here](https://materialdesignicons.com/api/download/angularmaterial/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B). Place the dovnloaded svg inside the `assets/` folder of your application.

NOTE: If you structure your `assets/` folder in a specific way, you have the option to set the path of the svg, while you import the module.

```typescript
import { DataTableModule } from '@icell/widget-data-table';
...

const pathToSvg: string = 'assets/path-to-svg/mdi.svg';

@NgModule({
  ...
  imports: [
    ...
    DataTableModule.forRoot(pathToSvg),
    ...
  ],
  ...
})
export class Module {
  ...
}
```

### General

#### Column settings

| Property | Type | Optional | Default | Description |
| --- | --- | --- | --- | ---  |
| field | `string` | &#10060; |  | Path to field that should be rendered. |
| label | `string` | &#10060; |  | Column label; can be a localization key. |
| hideable | `boolean` | &#10060; |  | Defines if the column dis hideable. |
| visible | `boolean` | &#10060; |  | Defines if the column is visible.<br>If used with hideable, the column will be in the column menu unchecked. |
| sortable | `boolean` | &#10004;&#65039; |  | Defines if the column should be sortable. |
| sticky | `boolean` | &#10004;&#65039; |  | Defines if the column should be sticky at the begining of the table. |
| stickyEnd | `boolean` | &#10004;&#65039; |  | Defines if the column should be sticky at the end of the table. |
| template | `string` | &#10004;&#65039; | `'labelTemplate'` | Defines how the cell should be rendered.<br>If `componentTemplate` is used you must define the `component` property as well. |
| component | any | &#10004;&#65039; |  | Defines what component to use to render the cell.<br>Use with `template = 'componentTemplate'`. |
| parent | any | &#10004;&#65039; |  | Defines what component to use to render the cell.<br>Use with `template = 'componentTemplate'`. |

| | |
| --- | --- |
| NOTE | The `template` field can have the following values:<br><ul><li>`'labelTemplate'`</li><li>`'labelBoldTemplate'`</li><li>`'numericTemplate'`</li><li>`'iconTemplate'`</li><li>`'componentTemplate'`</li></ul>

`.some.ts`
```typescript
...
this.columnSettings: DataTableColumnDefinition[] = [
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
  },
  {
    field: 'atomicMass',
    label: 'weight',
    template: 'numericTemplate',
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
  },
];
...
```

#### Table settings

| Attribute | Binding | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- | --- |
| name | `@Input` | `string` | &#10004;&#65039; | `''` | Name of the table. |
| dataSource | `@Input` | `any[] \| ServerSideDataSource \| MatTableDataSource` | &#10060; | `[]` | DataSource. |
| columnSettings | `@Input` | `DataTableColumnDefinition[]` | &#10060; |  | Column settings. |
| detailTemplate | `@Input` | `ngTemplateRef` | &#10004;&#65039; | `#defaultTemplate` | Custom user defined *detail* view |
| showDetails |`@Input`  | `boolean` | &#10004;&#65039; | `false` | Flag indicating to render with *detail* rows. |
| useSelection | `@Input` | `boolean` | &#10004;&#65039; | `false` | Flag to render with checkboxes for multiselect rows. |
| showColumnMenu | `@Input` | `boolean` | &#10004;&#65039; | `false` | Flag to render column menu. |
| hasSorting | `@Input` | `boolean` | &#10004;&#65039; | `false` | Flag to enable sorting. |
| fixedHeader | `@Input` | `boolean` | &#10004;&#65039; | `false` | Flag to have sticky header. |
| detailClosedIcon | `@Input` | `string` | &#10004;&#65039; | `chevron-right` | Icon to use for closed details. |
| detailOpenIcon | `@Input` | `string` | &#10004;&#65039; | `chevron-down` | Icon to use for opened details. |
| rowClick | `@Output` | `RowClickEvent` | &#10004;&#65039; |  | Emited row click event. |
| cellClick | `@Output` | `CellClickEvent` | &#10004;&#65039; |  | Emited cell click event. |

`.some.html`
```html
<ic-data-table
  [name]="'table'"
  [dataSource]="dataSource"
  [columnSettings]="columnSettings"
  [detailTemplate]="detailTemplate"
  [showDetails]="showDetails"
  [useSelection]="useSelection"
  [showColumnMenu]="showColumnMenu"
  [hasSorting]="hasSorting"
  [fixedHeader]="fixedHeader"
  (rowClick)="rowClick($event)"
  (cellClick)="cellClick($event)"
></ic-data-table>
```

#### DataSource configuration

`.some.server-side-datasource.ts`
```typescript
...
this.data = new ServerSideDataSource(
  this.getStaticData.bind(this),
  'list',
  this.paginationParams,
  this.table.sort,
  this.table.rowSelection,
  this.paginatorIntl,
  this.cdRef,
  this.withDetail,
  false
);
...
```

`.some.client-side-datasource.ts`
```typescript
...
this.data = new MatTableDataSource([]);
...
```