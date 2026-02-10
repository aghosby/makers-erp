import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { QuillModule } from 'ngx-quill';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule }  from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { CreateSingleInfoComponent } from './components/create-single-info/create-single-info.component';
import { RegisterGuestComponent } from './components/register-guest/register-guest.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IconComponent } from './components/icon/icon.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ProgressStepperComponent } from './components/progress-stepper/progress-stepper.component';
import { QuillEditorComponent } from './components/quill-editor/quill-editor.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { LoadingDataComponent } from './components/loading-data/loading-data.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SupportInfoComponent } from './components/support-info/support-info.component';
import { TruncateWordsPipe } from './pipes/truncate-words.pipe';
import { TimeDurationPipe } from './pipes/time-duration.pipe';
import { LocaleStringPipe } from './pipes/locale-string.pipe';

const SHARED_COMP = [
  MatIconModule,
  MatTableModule,
  MatCheckboxModule,
  MatChipsModule,
  MatSortModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatSidenavModule,
  MatPaginatorModule
];

@NgModule({
  declarations: [
    DeleteConfirmationComponent, 
    CreateSingleInfoComponent, 
    RegisterGuestComponent, 
    LoginComponent, 
    ConfirmationDialogComponent, 
    PaymentInfoComponent, 
    DashboardComponent, 
    IconComponent, 
    NoDataComponent, 
    ProgressStepperComponent, 
    QuillEditorComponent, 
    InfoDialogComponent, 
    LoadingDataComponent, 
    SupportInfoComponent,
    TruncateWordsPipe,
    TimeDurationPipe,
    LocaleStringPipe
  ],

  exports: [
    ...SHARED_COMP,
    FormsModule,
    ReactiveFormsModule,
    IconComponent,
    NoDataComponent,
    ProgressStepperComponent,
    QuillEditorComponent,
    InfoDialogComponent,
    LoadingDataComponent,
    TruncateWordsPipe,
    TimeDurationPipe,
    LocaleStringPipe
  ],

  imports: [
    ...SHARED_COMP,
    CommonModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule,
    HighchartsChartModule,
    NgxMaterialTimepickerModule,
    NgxChartsModule,
    NgxGaugeModule
  ],
  providers : [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ]
})
export class SharedModule {
}
