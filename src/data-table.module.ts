import { A11yModule } from '@angular/cdk/a11y'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA, Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortHeaderIntl, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ResizableModule } from 'angular-resizable-element';
import { DynamicModule } from 'ng-dynamic-component';
import { CellTemplatesComponent } from './cell-templates/cell-templates.component';
import { DataTableComponent } from './data-table.component';
import { CellTemplateDirective } from './directives/cell-template.directive';
import { NgxMultiLineEllipsisDirective } from './directives/ngx-multi-line-ellipsis.directive';
import { SanitizeTranformPipe } from './pipes/sanitize.pipe';

export interface DataTableConfig {
  mdiSvgResourcePath: string;
}
export const DATATABLE_CONFIG_TOKEN = new InjectionToken<DataTableConfig>('TOKEN:DATATABLE:CONFIG');

/**
 * # !!!IMPORTANT!!!
 *
 * Needed for self hosted mdi.svg  store under `./assets/mdi.svg`
 *
 * svg download url: https://materialdesignicons.com/api/download/angularmaterial/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B
 *
 * Provide module with `.forRoot(mdiSvgResourcePath)`.
 */
@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    TranslateModule,
    ResizableModule,
    DynamicModule,
    HttpClientModule,
    DragDropModule,
    OverlayModule,
  ],
  declarations: [DataTableComponent, CellTemplateDirective, CellTemplatesComponent, NgxMultiLineEllipsisDirective, SanitizeTranformPipe],
  exports: [DataTableComponent, CellTemplateDirective, CellTemplatesComponent, NgxMultiLineEllipsisDirective, SanitizeTranformPipe],
  providers: [MatSortHeaderIntl],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DataTableModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    @Optional() @Inject(DATATABLE_CONFIG_TOKEN) private config: DataTableConfig
  ) {
    this.matIconRegistry.addSvgIconSet(this.domSanitizer.bypassSecurityTrustResourceUrl(config ? config.mdiSvgResourcePath : './assets/mdi.svg'));
  }

  /**
   *
   * @param mdiSvgResourcePath defaults to `'./assets/mdi.svg'`
   */
  static forRoot(mdiSvgResourcePath: string = './assets/mdi.svg'): ModuleWithProviders<DataTableModule> {
    return {
      ngModule: DataTableModule,
      providers: [{ provide: DATATABLE_CONFIG_TOKEN, useValue: { mdiSvgResourcePath } }],
    };
  }
}
