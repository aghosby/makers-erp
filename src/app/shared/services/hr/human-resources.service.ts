import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';
import { buildUrlWithParams } from '../utils/query-params.helper';

@Injectable({
  providedIn: 'root'
})
export class HumanResourcesService {

  private path = `${environment.baseUrl}`;
  //private token = `${environment.token}`;

  headerParams = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  /*************** EMPLOYEE RELATED ACTIONS ***************/

  //Create a new employee
  public createEmployee(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addEmployee`, info, this.requestOptions);
  }

  //Bulk employee upload
  public bulkEmployeeUpload(file: any): Observable<any> {
    return this.http.post<any>(`${this.path}/uploadBulkEmployees`, file, this.requestOptions);
  }

  //Get the list of all employees
  public getEmployees(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const params: { [k: string]: any } = { page: pageNo ?? 1, limit: pageSize ?? 10 }; 
    if (searchParam) params.search = searchParam; 
    Object.assign(params, filters || {});
    const url = buildUrlWithParams(`${this.path}/fetchEmployees`, params);
    return this.http.get<any>(url, this.requestOptions);
  }

  //Get an employee details
  public getEmployeeDetails(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchEmployee/${employeeId}`, this.requestOptions);
  }

  //Delete employee
  public deleteEmployee(employeeId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteEmployee/${employeeId}`, this.requestOptions);
  }

  //Update Employee
  public updateEmployee(data: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateEmployee`, data, this.requestOptions);
  }

  //Update Employee by Admin
  public updateEmployeeByAdmin(data: any, employeeId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/adminUpdateEmployee/${employeeId}`, data, this.requestOptions);
  }

  //Edit employee payment info
  public updatePaymentInfo(info: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/addPayment`, info, this.requestOptions);
  }

  //Assign Manager
  public assignManager(data: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/assignManager`, data, this.requestOptions);
  }

  //Assign Manager
  public assignApprover(data: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/assignApprover`, data, this.requestOptions);
  }

  //Assign Salary Scales
  public assignSalaryScale(data: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/assignSalaryScale`, data, this.requestOptions);
  }

  /*************** DEPARTMENT RELATED ACTIONS ***************/

  //Create a new department
  public createDepartment(departmentName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addDepartment`, departmentName, this.requestOptions);
  }

  //Get the list of all Departments
  public getDepartments(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchDepartments`, this.requestOptions);
  }

  //Update Department
  public updateDepartment(data: any, departmentId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateDepartment/${departmentId}`, data, this.requestOptions);
  }

  //Delete department
  public deleteDepartment(deptId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteDepartment/${deptId}`, this.requestOptions);
  }

  /*************** BRANCH RELATED ACTIONS ***************/

  //Create a new branch
  public createBranch(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/branches`, payload, this.requestOptions);
  }

  //Get the list of all Branches
  public getBranches(): Observable<any> {
    return this.http.get<any>(`${this.path}/branches`, this.requestOptions);
  }

  //Update Branch
  public updateBranch(data: any, branchId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/branches/${branchId}`, data, this.requestOptions);
  }

  //Delete branch
  public deleteBranch(branchId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/branches/${branchId}`, this.requestOptions);
  }

  /*************** COMPANY ROLES RELATED ACTIONS ***************/

  //Create a new company role
  public createCompanyRole(roleName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addRole`, roleName, this.requestOptions);
  }

  //Get the list of all Company Roles
  public getCompanyRoles(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchCompanyRoles`, this.requestOptions);
  }


  /*************** DESIGNATIONS RELATED ACTIONS ***************/

  //Create a new designation
  public createDesignation(designationName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createDesignation`, designationName, this.requestOptions);
  }

  //Get the list of all Designations
  public getDesignations(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchDesignations`, this.requestOptions);
  }

  //Update designation
  public updateDesignation(data: any, designationId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateDesignation/${designationId}`, data, this.requestOptions);
  }

  //Delete designation
  public deleteDesignation(designationId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteDesignation/${designationId}`, this.requestOptions);
  }

  /*************** LEAVE TYPES RELATED ACTIONS ***************/

  //Create a new leave type
  public createLeaveType(leaveTypeName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createLeave`, leaveTypeName, this.requestOptions);
  }

  //Get the list of all Leave Types
  public getLeaveTypes(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchLeave`, this.requestOptions);
  }

  //Update Leave Type
  public updateLeaveType(data: any, leaveTypeId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateLeave/${leaveTypeId}`, data, this.requestOptions);
  }

  //Delete Leave Type
  public deleteLeaveType(leaveId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteLeave/${leaveId}`, this.requestOptions);
  }

  /*************** LEAVE APPLICATIONS RELATED ACTIONS ***************/

  //Create a new leave request
  public createLeaveRequest(leaveDetails: any): Observable<any> {
    return this.http.post<any>(`${this.path}/leaveApplication`, leaveDetails, this.requestOptions);
  }

  //Update Leave Request
  public updateLeaveRequest(data: any, leaveId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateLeaveApplication/${leaveId}`, data, this.requestOptions);
  }

  //Delete leave request
  public deleteLeaveRequest(leaveId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteLeaveApplication/${leaveId}`, this.requestOptions);
  }

  //Get the list of all leave applications
  public getLeaveRequests(): Observable<any> {
    return this.http.get<any>(`${this.path}/getLeaveRecords`, this.requestOptions);
  }

  //Get the list of all requested leave applications
  public getRequestedLeaveApprovals(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const params: { [k: string]: any } = { page: pageNo ?? 1, limit: pageSize ?? 10 }; 
    if (searchParam) params.search = searchParam; 
    Object.assign(params, filters || {});
    const url = buildUrlWithParams(`${this.path}/fetchRequestedLeaves`, params);
    return this.http.get<any>(url, this.requestOptions);
  }

  //Get details of employee leave applications on a graph
  public getLeaveGraph(leaveYear?:number): Observable<any> {
    return this.http.get<any>(`${this.path}/leaveGraphDetails?year=${leaveYear}`, this.requestOptions);
  }

  //Approve or Decline a leave request
  public actionLeaveRequest(leaveDetails: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/leaveAction`, leaveDetails, this.requestOptions);
  }

  //Assign Leave Days
  public assignLeaveDays(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/assignLeaveDays`, payload, this.requestOptions);
  }

  /*************** PUBLIC HOLIDAYS RELATED ACTIONS ***************/

  //Create a new public holiday
  public createPublicHoliday(holidayName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createHoliday`, holidayName, this.requestOptions);
  }

  //Get the list of all public holidays
  public getPublicHolidays(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchHolidays`, this.requestOptions);
  }

  //Update public holiday
  public updatePublicHoliday(data: any, holidayId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateHoliday/${holidayId}`, data, this.requestOptions);
  }

  //Delete public holiday
  public deletePublicHoliday(holidayId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteHoliday/${holidayId}`, this.requestOptions);
  }

  /*************** EXPENSE TYPES RELATED ACTIONS ***************/

  //Create a new expense type
  public createExpenseType(expenseTypeName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createExpenseType`, expenseTypeName, this.requestOptions);
  }

  //Get the list of all Expense Types
  public getExpenseTypes(): Observable<any> {
    return this.http.get<any>(`${this.path}/getExpenseTypes`, this.requestOptions);
  }

  //Update Expense Type
  public updateExpenseType(data: any, expenseTypeId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateExpense/${expenseTypeId}`, data, this.requestOptions);
  }

  //Delete Expense Type
  public deleteExpenseType(expenseTypeId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteExpenseType/${expenseTypeId}`, this.requestOptions);
  }

  /*************** REIMBURSEMENT APPLICATIONS RELATED ACTIONS ***************/

  //Create a new expense request
  public createExpenseRequest(expenseDetails: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createExpenseRequests`, expenseDetails, this.requestOptions);
  }

  //Get the list of all expense applications
  public getExpenseRequests(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchExpenseRequests`, this.requestOptions);
  }

  //Get the list of all requested expense applications
  public getRequestedExpenseApprovals(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const params: { [k: string]: any } = { page: pageNo ?? 1, limit: pageSize ?? 10 }; 
    if (searchParam) params.search = searchParam; 
    Object.assign(params, filters || {});
    const url = buildUrlWithParams(`${this.path}/fetchApprovalExpenseRequest`, params);
    return this.http.get<any>(url, this.requestOptions);
  }

  //Update Expense Request
  public updateExpenseRequest(data: any, requestId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateExpenseRequest/${requestId}`, data, this.requestOptions);
  }

  //Delete expense request
  public deleteExpenseRequest(requestId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteExpenseRequest/${requestId}`, this.requestOptions);
  }

  //Approve or Decline a expense request
  public actionExpenseRequest(expenseDetails: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/expenseAction`, expenseDetails, this.requestOptions);
  }

  /*************** PAYROLL RELATED ACTIONS ***************/

  //Payroll details upload
  public payrollFileUpload(file: any): Observable<any> {
    return this.http.post<any>(`${this.path}/uploadPayroll`, file, this.requestOptions);
  }

  //Create a new payroll credit
  public createPayrollCredit(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createCredits`, info, this.requestOptions);
  }

  //Get the list of all payroll credits
  public getPayrollCredits(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchCredits`, this.requestOptions);
  }

  //Update Payroll Credit Info
  public updatePayrollCredits(data: any, payrollCreditId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateCredits/${payrollCreditId}`, data, this.requestOptions);
  }

  //Delete payroll credit
  public deletePayrollCredit(payrollCreditId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteCredit/${payrollCreditId}`, this.requestOptions);
  }

  //Create a new payroll debit
  public createPayrollDebit(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createDebits`, info, this.requestOptions);
  }

  //Get the list of all payroll debits
  public getPayrollDebits(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchDebits`, this.requestOptions);
  }

  //Update Payroll Debit Info
  public updatePayrollDebits(data: any, payrollDebitId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateDebits/${payrollDebitId}`, data, this.requestOptions);
  }

  //Delete payroll debit
  public deletePayrollDebit(payrollDebitId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteDebit/${payrollDebitId}`, this.requestOptions);
  }

  //Create a new payroll period
  public createPayrollPeriod(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createPayrollPeriod`, info, this.requestOptions);
  }

  //Get the list of all payroll periods
  public getPayrollPeriods(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchPayrollPeriods`, this.requestOptions);
  }

  //Get a payroll period details
  public getPayrollDetails(perioId: string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchPayrollPeriodDetails/${perioId}`, this.requestOptions);
  }

  //Update Payroll Period
  public updatePayrollPeriod(data: any, payrollPeriodId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updatePayrollPeriod/${payrollPeriodId}`, data, this.requestOptions);
  }

  //Delete payroll period
  public deletePayrollPeriod(payrollPeriodId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deletePayrollPeriod/${payrollPeriodId}`, this.requestOptions);
  }

  //Update Payroll Entry
  public updatePayrollEntry(data: any, entryId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updatePayrollEntry/${entryId}`, data, this.requestOptions);
  }

  //Get the payroll graph data
  public getPayrollGraph(year?: any): Observable<any> {
    return this.http.get<any>(`${this.path}/payrollGraph/${year}`, this.requestOptions);
  }

  //Get the payroll years with data
  public getPayrollYears(): Observable<any> {
    return this.http.get<any>(`${this.path}/payrollYears`, this.requestOptions);
  }

  //Approve Payroll
  public approvePayroll(payrollPeriodId:string): Observable<any> {
    return this.http.patch<any>(`${this.path}/approvePayroll/${payrollPeriodId}`, undefined, this.requestOptions);
  }

  //Disburse Payroll
  public disbursePayroll(payrollPeriodId:string): Observable<any> {
    return this.http.patch<any>(`${this.path}/disbursePayroll/${payrollPeriodId}`, undefined, this.requestOptions);
  }

  /*************** SALARY SCALE RELATED ACTIONS ***************/

  //Create a new salary scale
  public createSalaryScale(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createSalaryScale`, payload, this.requestOptions);
  }

  //Get the payroll salary scales
  public getSalaryScales(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchSalaryScale`, this.requestOptions);
  }

  //Update Payroll salary scale
  public updateSalaryScale(salaryScaleId: any, payload:any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateSalaryScale/${salaryScaleId}`, payload, this.requestOptions);
  }

  //Delete payroll salary scale
  public deleteSalaryScale(salaryScaleId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteSalaryScale/${salaryScaleId}`, this.requestOptions);
  }

  /*************** APPRAISAL PERIODS RELATED ACTIONS ***************/

  //Create a new appraisal period
  public createAppraisalPeriod(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createAppraisalPeriod`, info, this.requestOptions);
  }

  //Get the list of all appraisal periods
  public getAppraisalPeriods(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchPeriod`, this.requestOptions);
  }

  //Get appraisal period details for an employee
  public getEmployeeAppraisalDetails(employeeId: string, periodId: string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchGroupDetails/${employeeId}/${periodId}`, this.requestOptions);
  }

  //Get appraisal period details for all employees
  public getAppraisalDetails(periodId: string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchAppraisalPeriod/${periodId}`, this.requestOptions);
  }

  //Update Appraisal Period
  public updateAppraisalPeriod(data: any, periodId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updatePeriod/${periodId}`, data, this.requestOptions);
  }

  //Delete Appraisal period
  public deleteAppraisalPeriod(periodId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deletePeriod/${periodId}`, this.requestOptions);
  }

  /*************** APPRAISAL KPI GROUPS RELATED ACTIONS ***************/

  //Create a new kpi group
  public createKpiGroup(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createKpiGroups`, info, this.requestOptions);
  }

  //Get the list of all kpi groups
  public getKpiGroups(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchAppraisalGroups`, this.requestOptions);
  }

  //Update kpi group
  public updateKpiGroup(data: any, groupId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateGroup/${groupId}`, data, this.requestOptions);
  }

  //Delete kpi group
  public deleteKpiGroup(groupId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteGroup/${groupId}`, this.requestOptions);
  }

  /*************** APPRAISAL KPI RELATED ACTIONS ***************/

  //Create a new kpi
  public createKpi(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createKpis`, info, this.requestOptions);
  }

  //Get the list of all kpis
  // public getKpi(): Observable<any> {
  //   return this.http.get<any>(`${this.path}/fetchAppraisalGroups`, this.requestOptions);
  // }

  //Update kpi
  public updateKpi(data: any, kpiId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateKPIs/${kpiId}`, data, this.requestOptions);
  }

  //Delete kpi 
  public deleteKpi(kpiId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteKPI/${kpiId}`, this.requestOptions);
  }

  /*************** APPRAISAL KPI RATING RELATED ACTIONS ***************/

  //Create a new kpi rating
  public createKpiRating(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createRating`, info, this.requestOptions);
  }

  //Get the list of all kpi ratings
  public getKpiRatings(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchRatings`, this.requestOptions);
  }

  //Update kpi rating
  public updateKpiRating(data: any, ratingId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateRating/${ratingId}`, data, this.requestOptions);
  }

  //Delete kpi rating
  public deleteKpiRating(ratingId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteRating/${ratingId}`, this.requestOptions);
  }

  /*************** APPRAISAL SUBMISSION AND REVIEW RELATED ACTIONS ***************/

  //Submit Appraisal Entry
  public submitAppraisalEntry(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/employeeRequestAppraisal`, payload, this.requestOptions);
  }

  //Submit Appraisal Review
  public submitAppraisalReview(payload: any, employeeId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/managerRateKpi/${employeeId}`, payload, this.requestOptions);
  }

  //Get the list of all appraisal requests
  public getAppraisalRequests(periodId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchAppraisalRequests/${periodId}`, this.requestOptions);
  }

  //Submit Appraisal Review
  public updateAppraisalPeriodStatus(payload:any, periodId: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateAppraisalPeriodStatus/${periodId}`, payload, this.requestOptions);
  }

  /*************** VISITOR MANAGEMENT RELATED ACTIONS ***************/

  //Book a new visitor
  public bookVisitor(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/bookVisitor`, info, this.requestOptions);
  }

  //Get the list of all booked visitors
  public getGuestsList(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchVisits`, this.requestOptions);
  }

  //Check in a visitor
  public checkInVisitor(info: any, bookingId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/checkIn/${bookingId}`, info, this.requestOptions);
  }

  //Check out a visitor
  public checkOutVisitor(info: any, bookingId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/checkOut/${bookingId}`, info, this.requestOptions);
  }

  /*************** CALENDAR RELATED ACTIONS ***************/
  //Book a new meeting
  public bookMeeting(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createMeeting`, info, this.requestOptions);
  }

  //Get the list of all booked visitors
  public getCalendar(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchCalendar`, this.requestOptions);
  }

  //Delete meeting
  public deleteMeeting(meetingId: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteMeeting/${meetingId}`, this.requestOptions);
  }

  /*************** RECRUITMENT RELATED ACTIONS ***************/

  //Create a new job role
  public createJobRole(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createJobListing`, info, this.requestOptions);
  }

  //Get the list of all Job Roles
  public getJobRoles(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchJobListings`, this.requestOptions);
  }

  //Publish a job post
  public publishJobPost(info: any, jobId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/publishJob/${jobId}`, info, this.requestOptions);
  }

  /*************** LMS RELATED ACTIONS ***************/

  //Get the list of all Course Categories
  public getCourseCategories(): Observable<any> {
    return this.http.get<any>(`${this.path}/courseCategories`, this.requestOptions);
  }

  //Create a new course category
  public createCourseCategory(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/courseCategory`, payload, this.requestOptions);
  }

  //Create a new course
  public createCourse(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/course`, payload, this.requestOptions);
  }

  //Get the list of all Courses
  public getCourses(): Observable<any> {
    return this.http.get<any>(`${this.path}/courses`, this.requestOptions);
  }

  //Get course by ID
  public getCourse(courseId: any): Observable<any> {
    return this.http.get<any>(`${this.path}/course/${courseId}`, this.requestOptions);
  }

  //Delete course
  public deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/course/${courseId}`, this.requestOptions);
  }

  //Update a course
  public updateCourse(payload: any, courseId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/course/${courseId}`, payload, this.requestOptions);
  }

  //Get course progress
  public getCourseProgress(courseId: string, employeeId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/getCourseProgress/${courseId}/${employeeId}`, this.requestOptions);
  }

  //Update a course progress
  public updateCourseProgress(payload: any, courseId: string, employeeId:string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateCourseProgress/${courseId}/${employeeId}`, payload, this.requestOptions);
  }

  //Create a new assessment
  public createAssessment(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/assessment`, payload, this.requestOptions);
  }

  //Update an assessment
  public updateAssessment(payload: any, assessmentId: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/assessment/${assessmentId}`, payload, this.requestOptions);
  }

  //Get the list of all Assessments
  public getAssessments(): Observable<any> {
    return this.http.get<any>(`${this.path}/getAssessments`, this.requestOptions);
  }

  //Get assessment by ID
  public getAssessment(assessmentId: any): Observable<any> {
    return this.http.get<any>(`${this.path}/assessment/${assessmentId}`, this.requestOptions);
  }

  //Get assessment by Course ID
  public getCourseAssessment(courseId: any): Observable<any> {
    return this.http.get<any>(`${this.path}/getAssessment/${courseId}`, this.requestOptions);
  }

  //Delete assessment
  public deleteAssessment(assessmentId: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/assessment/${assessmentId}`, this.requestOptions);
  }

  //Submit assessment
  public submitAssessment(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/assessment/submit`, payload, this.requestOptions);
  }

  //Get assessment grades
  public getAssessmentGrades(assessmentId: any): Observable<any> {
    return this.http.get<any>(`${this.path}/getResults/${assessmentId}`, this.requestOptions);
  }

  /*************** NOTICE BOARD RELATED ACTIONS ***************/

  //Create a new notice
  public createNotice(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/announcements`, payload, this.requestOptions);
  }

  //Get the list of all notices
  public getNotices(): Observable<any> {
    return this.http.get<any>(`${this.path}/announcements`, this.requestOptions);
  }

  //Publish a job post
  // public publishJobPost(info: any, jobId: any): Observable<any> {
  //   return this.http.patch<any>(`${this.path}/publishJob/${jobId}`, info, this.requestOptions);
  // }
}