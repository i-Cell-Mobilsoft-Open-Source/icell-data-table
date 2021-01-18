![icell data
table](https://img.shields.io/github/license/i-Cell-Mobilsoft-Open-Source/icell-data-table)
![data table](https://img.shields.io/npm/v/@i-cell/data-table)
![npm](https://img.shields.io/npm/dt/@i-cell/data-table)
![Build](https://github.com/i-Cell-Mobilsoft-Open-Source/icell-data-table/workflows/CI/badge.svg)

# Installation

``` bash
npm i @i-cell/data-table
```

# Usage

## Configuration

> **Important**
> 
> The table uses `materialdesignicons` svg icon, you will need to
> download the latest `mdi.svg` from
> [here](https://materialdesignicons.com/api/download/angularmaterial/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B).
> Place the downloaded svg inside the `assets/` folder of your
> application.

> **Note**
> 
> If you structure your `assets/` folder in a specific way, you have the
> option to set the path of the svg, while you import the module.

``` typescript
import { DataTableModule } from '@icell/widget-data-table';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
...

const pathToSvg: string = 'assets/path-to-svg/mdi.svg';

@NgModule({
  ...
  imports: [
    ...
    DataTableModule.forRoot(pathToSvg),
    MatTableModule,
    TranslateModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    ...
  ],
  ...
})
export class Module {
  ...
}
```

## General

### Column settings

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 20%" />
</colgroup>
<thead>
<tr class="header">
<th>Property</th>
<th>Type</th>
<th>Optional</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>field</p></td>
<td><p><code>string</code></p></td>
<td><p>❌</p></td>
<td></td>
<td><p>Path to field that should be rendered.</p></td>
</tr>
<tr class="even">
<td><p>orderName</p></td>
<td><p><code>string</code></p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Custom ordering parameter.</p></td>
</tr>
<tr class="odd">
<td><p>valueFormatter</p></td>
<td><p><code>function</code></p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Callback to transform the cell’s data.</p></td>
</tr>
<tr class="even">
<td><p>valueGetter</p></td>
<td><p><code>function</code></p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Callback to transform the row model.</p></td>
</tr>
<tr class="odd">
<td><p>label</p></td>
<td><p><code>string</code></p></td>
<td><p>❌</p></td>
<td></td>
<td><p>Column label; can be a localization key.</p></td>
</tr>
<tr class="even">
<td><p>hideable</p></td>
<td><p><code>boolean</code></p></td>
<td><p>❌</p></td>
<td></td>
<td><p>Defines if the column dis hideable.</p></td>
</tr>
<tr class="odd">
<td><p>visible</p></td>
<td><p><code>boolean</code></p></td>
<td><p>❌</p></td>
<td></td>
<td><p>Defines if the column is visible. If used with hideable, the column will be in the column menu unchecked.</p></td>
</tr>
<tr class="even">
<td><p>sortable</p></td>
<td><p><code>boolean</code></p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines if the column should be sortable.</p></td>
</tr>
<tr class="odd">
<td><p>sticky</p></td>
<td><p><code>boolean</code></p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines if the column should be sticky at the begining of the table.</p></td>
</tr>
<tr class="even">
<td><p>stickyEnd</p></td>
<td><p><code>boolean</code></p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines if the column should be sticky at the end of the table.</p></td>
</tr>
<tr class="odd">
<td><p>template</p></td>
<td><p><code>string</code></p></td>
<td><p>✔️</p></td>
<td><p><code>'labelTemplate'</code></p></td>
<td><p>Defines how the cell should be rendered.</p>
<p>If <code>componentTemplate</code> is used you must define the <code>component</code> property as well.</p></td>
</tr>
<tr class="even">
<td><p>component</p></td>
<td><p>any</p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines what component to use to render the cell.</p>
<p>Use with <code>template = 'componentTemplate'</code>.</p></td>
</tr>
<tr class="odd">
<td><p>componentOptions</p></td>
<td><p>ComponentOptions</p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Provide input, output bindings for the component rendered in the cell.</p>
<p>Use with <code>template = 'componentTemplate'</code>.</p></td>
</tr>
<tr class="even">
<td><p>parent</p></td>
<td><p>any</p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines what component to use to render the cell.</p>
<p>Use with <code>template = 'componentTemplate'</code>.</p></td>
</tr>
<tr class="odd">
<td><p>identifier</p></td>
<td><p>boolean</p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines if the cell should render as header for a11y reasons.</p></td>
</tr>
<tr class="even">
<td><p>columnClasses</p></td>
<td><p>boolean</p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines custom <code>CSS</code> class for the column it self.</p></td>
</tr>
<tr class="odd">
<td><p>cellClasses</p></td>
<td><p>boolean</p></td>
<td><p>✔️</p></td>
<td></td>
<td><p>Defines custom <code>CSS</code> class for the column cells.</p></td>
</tr>
</tbody>
</table>

> **Note**
> 
> The `template` field can have the following values:
> 
>   - `'labelTemplate'`
> 
>   - `'labelBoldTemplate'`
> 
>   - `'numericTemplate'`
> 
>   - `'iconTemplate'`
> 
>   - `'componentTemplate'`

**some.ts.**

``` javascript
...
this.columnSettings: DataTableColumnDefinition[] = [
  {
    field: 'atomicNumber',
    label: 'position',
    sortable: true,
    hideable: true,
    visible: true,
    columnClass: 'table__atomic-numbers_bold',
  },
  {
    field: 'type',
    label: 'Item type',
    valueFormatter: (type) => ('ITEM_TYPES.' + type)
    sortable: true,
    hideable: true,
    visible: true,
  },
  {
    label: 'name',
    sortable: true,
    template: 'labelBoldTemplate',
    hideable: true,
    visible: true,
    identifier: true,
  },
  {
    label: 'weight',
    valueGetter: (item) => (item.type === 'NET' ? item.netWeight : item.grossWeight)
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
    componentOptions: {
      inputs: {
        // In RowActionComponent: `@Input() icon: string;`
        icon: 'details'
      },
      outputs: {
        // In RowActionComponent: `@Output() clicked = new EventEmitter<RowDataType>();`
        clicked: (rowData: RowDataType) => {
          // Do something
        }
      }
    }
  },
];
...
```

### Table settings

| Attribute        | Binding   | Type                                                  | Optional | Default            | Description                                          |
| ---------------- | --------- | ----------------------------------------------------- | -------- | ------------------ | ---------------------------------------------------- |
| name             | `@Input`  | `string`                                              | ✔️       | `''`               | Name of the table.                                   |
| caption          | `@Input`  | `string`                                              | ✔️       | `''`               | Caption of the table.                                |
| dataSource       | `@Input`  | `any[] \| ServerSideDataSource \| MatTableDataSource` | ❌        | `[]`               | DataSource.                                          |
| columnSettings   | `@Input`  | `DataTableColumnDefinition[]`                         | ❌        |                    | Column settings.                                     |
| detailTemplate   | `@Input`  | `ngTemplateRef`                                       | ✔️       | `#defaultTemplate` | Custom user defined **detail** view                  |
| showDetails      | `@Input`  | `boolean`                                             | ✔️       | `false`            | Flag indicating to render with **detail** rows.      |
| useSelection     | `@Input`  | `boolean`                                             | ✔️       | `false`            | Flag to render with checkboxes for multiselect rows. |
| color            | `@Input`  | `ThemePalette`                                        | ✔️       | `primary`          | Use this palette for mat elements.                   |
| showColumnMenu   | `@Input`  | `boolean`                                             | ✔️       | `false`            | Flag to render column menu.                          |
| hasSorting       | `@Input`  | `boolean`                                             | ✔️       | `false`            | Flag to enable sorting.                              |
| fixedHeader      | `@Input`  | `boolean`                                             | ✔️       | `false`            | Flag to have sticky header.                          |
| detailClosedIcon | `@Input`  | `string`                                              | ✔️       | `chevron-right`    | Icon to use for closed details.                      |
| detailOpenIcon   | `@Input`  | `string`                                              | ✔️       | `chevron-down`     | Icon to use for opened details.                      |
| sortingNoSort    | `@Input`  | `string`                                              | ✔️       | `sort`             | Icon to use for no sort active.                      |
| sortingAsc       | `@Input`  | `string`                                              | ✔️       | `sort-ascending`   | Icon to use for sort ascending.                      |
| sortingDesc      | `@Input`  | `string`                                              | ✔️       | `sort-descending`  | Icon to use for sort descending.                     |
| rowClass         | `@Input`  | `function`                                            | ✔️       | `() ⇒ ''`          | Dynamically set per-row CSS class.                   |
| headerClass      | `@Input`  | `srting`                                              | ✔️       |                    | Defines the class used by `thead > tr`.              |
| rowClick         | `@Output` | `RowClickEvent`                                       | ✔️       |                    | Emitted row click event.                             |
| cellClick        | `@Output` | `CellClickEvent`                                      | ✔️       |                    | Emitted cell click event.                            |
| rowKeyDown       | `@Output` | `RowKeyDownEvent`                                     | ✔️       |                    | Emitted row onkeydown event.                         |

**some.html.**

``` xml
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

### DataSource configuration

**some.server-side-datasource.ts.**

``` javascript
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

**some.client-side-datasource.ts.**

``` javascript
...
this.data = new MatTableDataSource([]);
...
```

## Localization

For translation we utilize `@ngx-translate`.

  - `ICELL_DATA_TABLE.SORT_BUTTON_LABEL` used for localizing
    
      - uses 2 input properties:
        
          - `id` represents the columns locale\_key
        
          - `direction`:
            
              - `ICELL_DATA_TABLE.SORT_NONE` used if no sort is set
            
              - `ICELL_DATA_TABLE.SORT_ASC` used if sort is ascending
            
              - `ICELL_DATA_TABLE.SORT_DESC` used if sort is descending

<!-- end list -->

``` json
{
  ...
  "ICELL_DATA_TABLE": {
    "SORT_BUTTON_LABEL": "Change sorting for {{id}}, {{direction}}.",
    "SORT_NONE": "no sorting",
    "SORT_ASC": "sorting ascending",
    "SORT_DESC": "sorting descending"
  }
  ...
}
```

## Examples

### Run example project

``` bash
# Build a local version
npm run build:prod
npm run pack
# Switch directories
cd ./examples/icell-data-table-example/
# Edit the package.json to have the proper path to the tgz
#   "@i-cell/data-table": "file:../../i-cell-data-table-<version>.tgz",
# Install dependencies
npm i
# Start up the example
npm start
```

If no issues emerge the application should up and running, so you can
start to experiment.
