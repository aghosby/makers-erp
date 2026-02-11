import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralAppraisalComponent } from './appraisals/general-appraisal/general-appraisal.component';
import { EmployeeDetailsComponent } from './employees/employee-info/employee-details/employee-details.component';
import { EmployeesListComponent } from './employees/employees-list/employees-list.component';
import { LeaveManagementOverviewComponent } from './leave-management/leave-management-overview/leave-management-overview.component';
import { PayrollSummaryComponent } from './payroll/payroll-summary/payroll-summary.component';
import { RecruitmentJobBoardComponent } from './recruitment/recruitment-job-board/recruitment-job-board.component';
import { RecruitmentOnboardingComponent } from './recruitment/recruitment-onboarding/recruitment-onboarding.component';
import { RecruitmentOverviewComponent } from './recruitment/recruitment-overview/recruitment-overview.component';
import { RecruitmentPortalComponent } from './recruitment/recruitment-portal/recruitment-portal.component';
import { RecruitmentScreeningComponent } from './recruitment/recruitment-screening/recruitment-screening.component';
import { SelfServiceLeaveRequestsComponent } from './self-service/self-service-leave-requests/self-service-leave-requests.component';
import { SelfServiceOverviewComponent } from './self-service/self-service-overview/self-service-overview.component';
import { SelfServicePayrollComponent } from './self-service/self-service-payroll/self-service-payroll.component';
import { SelfServicePortalComponent } from './self-service/self-service-portal/self-service-portal.component';
import { SelfServiceReimbursementComponent } from './self-service/self-service-reimbursement/self-service-reimbursement.component';
import { VisitorsLogComponent } from './visitors-log/visitors-log/visitors-log.component';
import { ExpenseManagementComponent } from './expense-management/expense-management/expense-management.component';
import { PayrollDetailsComponent } from './payroll/payroll-details/payroll-details.component';
import { PayrollPortalComponent } from './payroll/payroll-portal/payroll-portal.component';
import { AppraisalFormComponent } from './appraisals/appraisal-form/appraisal-form.component';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { DashboardComponent } from 'src/app/shared/components/dashboard/dashboard.component';
import { HumanResourcesSettingsComponent } from '../settings/human-resources/human-resources-settings/human-resources-settings.component';
import { GeneralSettingsComponent } from '../settings/general/general-settings/general-settings.component';
import { DepartmentsOverviewComponent } from '../settings/human-resources/departments/departments-overview/departments-overview.component';
import { AbsenceOverviewComponent } from '../settings/human-resources/absence/absence-overview/absence-overview.component';
import { DesignationsOverviewComponent } from '../settings/human-resources/designations/designations-overview/designations-overview.component';
import { ExpensesOverviewComponent } from '../settings/human-resources/expenses/expenses-overview/expenses-overview.component';
import { PayrollOverviewComponent } from '../settings/human-resources/payroll/payroll-overview/payroll-overview.component';
import { AppraisalOverviewComponent } from '../settings/human-resources/appraisals/appraisal-overview/appraisal-overview.component';
import { AccountSettingsPortalComponent } from '../settings/general/account-settings-portal/account-settings-portal.component';
import { SubscriptionHistoryComponent } from '../settings/general/subscriptions/subscription-history/subscription-history.component';
import { SubscriptionOverviewComponent } from '../settings/general/subscriptions/subscription-overview/subscription-overview.component';
import { AuditTrailComponent } from '../settings/general/audit-trail/audit-trail.component';
import { BillingOverviewComponent } from '../settings/general/billing/billing-overview/billing-overview.component';
import { RolesPermissionsManagementComponent } from '../settings/general/roles-permissions/roles-permissions-management/roles-permissions-management.component';
import { EmployeeOverviewComponent } from './employees/employee-overview/employee-overview.component';
import { EmployeePayrollComponent } from './employees/employee-info/employee-payroll/employee-payroll.component';
import { EmployeeAbsenceComponent } from './employees/employee-info/employee-absence/employee-absence.component';
import { EmployeeDocumentsComponent } from './employees/employee-info/employee-documents/employee-documents.component';
import { LmsPortalComponent } from './lms/lms-portal/lms-portal.component';
import { LmsOverviewComponent } from './lms/lms-overview/lms-overview.component';
import { CoursesListComponent } from './lms/courses-list/courses-list.component';
import { CourseInfoComponent } from './lms/course-info/course-info.component';
import { CourseDetailsComponent } from './lms/course-details/course-details.component';
import { AssessmentPageComponent } from './lms/assessment-page/assessment-page.component';
import { AssessmentInfoComponent } from './lms/assessment-info/assessment-info.component';
import { AssessmentListComponent } from './lms/assessment-list/assessment-list.component';
import { AppraisalPortalComponent } from './appraisals/appraisal-portal/appraisal-portal.component';
import { AppraisalKpisComponent } from './appraisals/appraisal-kpis/appraisal-kpis.component';
import { BranchesOverviewComponent } from '../settings/human-resources/branches/branches-overview/branches-overview.component';
import { ReportsPortalComponent } from './reports/reports-portal/reports-portal.component';
import { ReportsDashboardComponent } from './reports/reports-dashboard/reports-dashboard.component';
import { EmployeeReportsComponent } from './reports/employee-reports/employee-reports.component';
import { AbsenceReportsComponent } from './reports/absence-reports/absence-reports.component';
import { ExpenseReportsComponent } from './reports/expense-reports/expense-reports.component';
import { AppraisalReportsComponent } from './reports/appraisal-reports/appraisal-reports.component';
import { PayrollReportsComponent } from './reports/payroll-reports/payroll-reports.component';
import { NoticeListComponent } from './notice-board/notice-list/notice-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'employees',
    component: EmployeesListComponent
  },
  {
    path: 'employees/:id',
    component: EmployeeOverviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'personal-info',
        pathMatch: 'full'
      },
      {
        path : 'personal-info',
        component: EmployeeDetailsComponent
      },
      {
        path: 'payroll-info',
        component: EmployeePayrollComponent
      },
      {
        path: 'absence-info',
        component: EmployeeAbsenceComponent
      },
    ]
  },
  {
    path: 'payroll',
    component: PayrollPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path : 'overview',
        component: PayrollSummaryComponent
      },
      {
        path: 'payroll-details',
        component: PayrollDetailsComponent
      },
      {
        path: 'payroll-details/:id',
        component: PayrollDetailsComponent
      },
    ]
  },
  {
    path: 'self-service',
    component: SelfServicePortalComponent,
    children:[
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path : 'profile',
        component: SelfServiceOverviewComponent
      },
      {
        path : 'absence-requests',
        component: SelfServiceLeaveRequestsComponent
      },
      {
        path: 'appraisals',
        component: AppraisalFormComponent
      },
      {
        path: 'payroll',
        component: SelfServicePayrollComponent
      },
      {
        path: 'expense-requests',
        component: SelfServiceReimbursementComponent
      }
    ]
  },
  {
    path: 'recruitment',
    component: RecruitmentPortalComponent,
    children:[
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path : 'overview',
        component: RecruitmentOverviewComponent
      },
      {
        path : 'job-board',
        component: RecruitmentJobBoardComponent
      },
      {
        path: 'applicant-screening',
        component: RecruitmentScreeningComponent
      },
      {
        path: 'onboarding',
        component: RecruitmentOnboardingComponent
      }
    ]
  },
  {
    path: 'lms',
    component: LmsPortalComponent,
    children:[
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path : 'overview',
        component: LmsOverviewComponent
      },
      {
        path : 'courses',
        component: CoursesListComponent
      },
      {
        path : 'courses/info',
        component: CourseInfoComponent
      },
      {
        path : 'courses/info/:id',
        component: CourseInfoComponent
      },
      {
        path : 'courses/:id',
        component: CourseDetailsComponent
      },
      {
        path : 'assessments',
        component: AssessmentListComponent
      },
      {
        path : 'assessments/info',
        component: AssessmentInfoComponent
      },
      {
        path : 'assessments/:id',
        component: AssessmentInfoComponent
      },
      {
        path : 'assessments/quiz/:id',
        component: AssessmentPageComponent
      },
      // {
      //   path : 'job-board',
      //   component: RecruitmentJobBoardComponent
      // },
      // {
      //   path: 'applicant-screening',
      //   component: RecruitmentScreeningComponent
      // },
      // {
      //   path: 'onboarding',
      //   component: RecruitmentOnboardingComponent
      // }
    ]
  },
  {
    path: 'absence-management',
    component: LeaveManagementOverviewComponent
  },
  {
    path: 'expense-management',
    component: ExpenseManagementComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'notice-board',
    component: NoticeListComponent
  },
  {
    path: 'appraisals',
    component: AppraisalPortalComponent,
    children:[
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path : 'overview',
        component: GeneralAppraisalComponent
      },
      {
        path : 'appraisal-kpis',
        component: AppraisalKpisComponent
      }
    ]
  },
  {
    path: 'appraisals/:id',
    component: AppraisalFormComponent
  },
  {
    path: 'visitors-log',
    component: VisitorsLogComponent
  },
  {
    path: 'reports',
    component: ReportsPortalComponent,
    children:[
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
      },
      {
        path : 'dashboard',
        component: ReportsDashboardComponent
      },
      {
        path : 'employees',
        component: EmployeeReportsComponent
      },
      {
        path : 'absence',
        component: AbsenceReportsComponent
      },
      {
        path : 'expense',
        component: ExpenseReportsComponent
      },
      {
        path : 'appraisal',
        component: AppraisalReportsComponent
      },
      {
        path : 'payroll',
        component: PayrollReportsComponent
      },
    ]
  },
  {
    path: 'hr-settings',
    component: HumanResourcesSettingsComponent,
    children:[
      {
        path: '',
        redirectTo: 'departments',
        pathMatch: 'full'
      },
      {
        path : 'departments',
        component: DepartmentsOverviewComponent
      },
      {
        path : 'branches',
        component: BranchesOverviewComponent
      },
      {
        path : 'absence',
        component: AbsenceOverviewComponent
      },
      {
        path : 'designations',
        component: DesignationsOverviewComponent
      },
      {
        path : 'expenses',
        component: ExpensesOverviewComponent
      },
      {
        path : 'payroll',
        component: PayrollOverviewComponent
      },
      {
        path : 'appraisal',
        component: AppraisalOverviewComponent
      },
    ]
  },
  {
    path: 'general-settings',
    component: AccountSettingsPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'account-info',
        pathMatch: 'full'
      },
      {
        path : 'account-info',
        component: GeneralSettingsComponent
      },
      {
        path : 'roles-permissions',
        component: RolesPermissionsManagementComponent
      },
      {
        path : 'subscription/history',
        component: SubscriptionHistoryComponent
      },
      {
        path : 'subscription/plans',
        component: SubscriptionOverviewComponent
      },
      {
        path : 'audit-trails',
        component: AuditTrailComponent
      },
      {
        path : 'billing',
        component: BillingOverviewComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
