import { A11yModule } from '@angular/cdk/a11y'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA, Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSortHeaderIntl, MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ResizableModule } from 'angular-resizable-element';
import { DynamicIoModule, DynamicModule } from 'ng-dynamic-component';
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
    // DynamicIoModule,
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
