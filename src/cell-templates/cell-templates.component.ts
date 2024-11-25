import { get as _get, isFunction as _isFunction, isNumber as _isNumber, isString as _isString } from 'lodash-es';
import { CellTemplateDirective } from '../directives/cell-template.directive';
import { DataTableColumnDefinition } from '../interfaces';
import { Component, TemplateRef, viewChildren } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SanitizeTranformPipe } from 'src/pipes/sanitize.pipe';

/**
 * Collection of built-in cell templates.
 *
```xml
<cell-templates></cell-templates>
```
 *
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'cell-templates',
    templateUrl: './cell-templates.component.html',
    imports: [TranslateModule, SanitizeTranformPipe],
    standalone: true
})
export class CellTemplatesComponent {
  public templates = viewChildren(CellTemplateDirective);
  // @ViewChildren(CellTemplateDirective) templates: QueryList<CellTemplateDirective>;

  constructor(public translate: TranslateService) {}

  /**
   * @returns The specified template.
   * @param templateName specific template to be returned.
   */
  public getTemplate(templateName: string): TemplateRef<any> {
    return this.templates().find((x) => x.name.toLowerCase() === templateName.toLowerCase()).template;
  }

  private preSanitize(input: string) {
    // Convert & to &amp;, Convert < to &lt;, Convert > to &gt;, Convert " to &quot;, Convert ' to &#x27;, Convert / to &#x2F;
    const entities = [
      { rx: '&', entity: '&amp;' },
      { rx: '<', entity: '&lt;' },
      { rx: '>', entity: '&gt;' },
      { rx: '"', entity: '&quot;' },
      { rx: "'", entity: '&#x27;' },
      { rx: '/', entity: '&#x2F;' },
    ];
    entities.forEach((item) => {
      const reg = new RegExp(item.rx, 'g');
      input = input.replace(reg, item.entity);
    });
    return input;
  }

  getFieldData(rowData: any, colDef: DataTableColumnDefinition) {
    if (!colDef) {
      return '';
    }

    let fieldData = '';

    if (_isFunction(colDef.valueGetter)) {
      fieldData = colDef.valueGetter(rowData);
      return this.preSanitize(_isNumber(fieldData) ? String(fieldData) : fieldData || '');
    }

    if (_isString(colDef.field)) {
      fieldData = _get(rowData, colDef.field) ?? '';
    }

    if (_isFunction(colDef.valueFormatter)) {
      fieldData = colDef.valueFormatter(fieldData);
    }

    return this.preSanitize(_isNumber(fieldData) ? String(fieldData) : fieldData || '');
  }

  /**
   * @returns Internationalized number.
   * @param value Input.
   */
  asNumeric(value) {
    return Intl.NumberFormat(this.translate.currentLang).format(parseFloat(value));
  }

  /**
   * Assemble input bindings for `ndcDynamicInputs`
   *
   * @param rowData Current row's data
   * @param colDef Cell's colun definition
   * @internal
   */
  getComponentInputs(rowData: any, colDef: DataTableColumnDefinition) {
    return {
      data: rowData,
      parent: colDef.parent,
      ...colDef.componentOptions?.inputs,
    };
  }
}
