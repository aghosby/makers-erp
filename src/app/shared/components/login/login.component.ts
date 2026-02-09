import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn, FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { PasswordValidators } from '../../services/utils/password-validators';
import { CustomValidators } from '../../services/utils/password-validators';
import { AuthenticationService } from '../../services/utils/authentication.service';
import { NotificationService } from '../../services/utils/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  apiLoading: boolean = false;
  dateTime: Date;

  carouselItems = [
    {
      label: "HR",
      image: "https://greenpegacademy.com/wp-content/uploads/2022/10/multiracial-businesswomen-discussing-while-walking-2022-07-19-17-06-19-utc-1-1-2000x1333.jpg",
      caption: "Drive your Organizational Success with Our HR Module"
    },
    {
      label: "Project Management",
      image: "https://silo-inc.com/wp-content/uploads/2023/05/flat-lay-people-working-office-scaled.jpg",
      caption: "Empowering Project Management Excellence"
    },
    {
      label: "Supply Chain",
      image: "https://silo-inc.com/wp-content/uploads/2023/05/hand-with-support-gears-isolated-white-background-1-scaled.jpg",
      caption: "Optimizing Your Supply Chain Management Processes"
    },
    {
      label: "CRM",
      image: "https://silo-inc.com/wp-content/uploads/2023/05/cheerful-call-center-operators-during-working-process-1-scaled.jpg",
      caption: "Streamline Customer Relationship with Our CRM Module"
    }
  ]

  loginInfo = {
    email: "",
    password: ""
  }
  // loginEmail: string;
  // loginPassword: string;

  showPassword: boolean = false;
  submitted: boolean = false;
  existingUser: boolean = true;
  loggingIn: boolean = false;
  forgotPass: boolean = false;
  setPass: boolean = false;
  userToken: string;
  authDetails: any;

  selectedIndex = 0;
  slideInterval = 5000;

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        PasswordValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
          requiresDigit: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
          requiresUppercase: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
          requiresLowercase: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&:])"), {
          requiresSpecialChars: true
        })
      ])
    ),
  })

  setPasswordForm = this.fb.group({
    email: [null, [Validators.email, Validators.required]],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        PasswordValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
          requiresDigit: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
          requiresUppercase: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
          requiresLowercase: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&:])"), {
          requiresSpecialChars: true
        })
      ])
    ],
    confirmPassword: [null, Validators.required]
  }, { validator: CustomValidators.MatchingPasswords })

  constructor(
    private auth: AuthenticationService, 
    private route: Router, 
    private notify: NotificationService,
    private fb: FormBuilder) {
    setInterval(() => {
      this.dateTime = new Date()
    }, 1000)
    this.autoSlideImages();
  }

  // transformSvg(html: string) {
  //   return this.sanitizer.bypassSecurityTrustHtml(html);
  // }

  ngOnInit(): void {
    let urlsplit = this.route.url?.split("/");
    console.log('LoginUrl', urlsplit);
    if (urlsplit[1] == 'login') this.loggingIn = true;
    else if (urlsplit[1] == 'set-password') {
      this.loggingIn = false;
      this.setPass = true;
      this.userToken = urlsplit[2];
      this.authDetails = this.auth.getUser(this.userToken);
      this.setPasswordForm.controls['email'].setValue(this.authDetails.email);
    } 
    else {
      console.log(urlsplit);
      this.forgotPass = true;
    }
  }

  ngAfterViewInit() {
    
  }

  //CAROUSEL SLIDE FUNCTIONS
  selectSlide(index: number): void {
    this.selectedIndex = index;
  }

  onPrevClick(): void {
    if(this.selectedIndex === 0) {
      this.selectedIndex = this.carouselItems.length - 1;
    }
    else {
      this.selectedIndex--;
    }
  }

  onNextClick(): void {
    if(this.selectedIndex === this.carouselItems.length - 1) {
      this.selectedIndex = 0;
    }
    else {
      this.selectedIndex++;
    }
  }

  autoSlideImages(): void {
    setInterval(() => {
      this.onNextClick();
    }, this.slideInterval)
  }

  onSubmit() {
    this.apiLoading = true;
    this.submitted = true;
    if(this.loginForm.valid) {
      if(this.existingUser) {
        this.auth.login(this.loginForm.value).subscribe({
          next: res => {
            console.log(res);
            if(res.status == 200) {
              this.apiLoading = false;
              if(res.data.email == 'erp@makersorbit.com') {
                this.route.navigate(['app/aceerp']);
              }
              else if(res.data.isSuperAdmin && res.data.companyFeatures.subscriptionStatus.isActive) {
                if(!res.data.activeStatus) this.route.navigate(['app/settings']);
                else this.route.navigate(['app/human-resources']);
              }
              else if(res.data.modules.subscriptionStatus.isActive) {
                this.route.navigate(['app/human-resources']);
              }
              else {
                this.notify.showError('You currently have no active subscription')
              }
            }
          },
          error: err => {
            this.apiLoading = false;
          }          
        })
      }

      else {
        this.auth.signup(this.loginForm.value).subscribe({
          next: res => {
            console.log(res);
            if(res.status == 200) {
              this.apiLoading = false;
              this.notify.showSuccess(res.message);
              // this.route.navigate(['/app']);
            }
          },
          error: err => {
            console.log(err)
            this.apiLoading = false;
          }
        })      
      }
    }    
  }

  routeToforgotPassword() {
    this.route.navigate(['forgot-password']);
  }

  forgotPassword() {
    if(this.setPasswordForm.controls['email'].valid) {
      let info = {
        email: this.setPasswordForm.value.email
      }
      this.auth.forgotPassword(info).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notify.showSuccess('A verification link has been sent to your email');
          }
        },
        error: err => {
          console.log(err)
        }          
      })
    }
  }

  setPassword() {
    if(this.setPasswordForm.valid) {
      let info = {
        token: this.userToken,
        password: this.setPasswordForm.value.password
      }
      this.auth.setPassword(info).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notify.showSuccess("Your password has been set successfully");
            let authInfo = {
              email: res.data.email,
              password: this.setPasswordForm.value.password
            }
            this.auth.login(authInfo).subscribe({
              next: res => {
                console.log(res);
                if(res.status == 200) {
                  this.route.navigate(['app']);
                }
              },
              error: err => {
                console.log(err)
              }          
            })
          }
        },
        error: err => {
          console.log(err)
          //this.notify.showError("res.message");
        }          
      })
    }
    else {
      console.log(this.setPasswordForm)
      this.setPasswordForm.markAllAsTouched();
      this.notify.showError('Please check that all your inputs are valid');
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  get fp() {
    return this.setPasswordForm.controls;
  }

  get passwordValid() {
    return this.loginForm.controls["password"].errors === null;
  }
  get confirmPasswordValid() {
    return this.setPasswordForm.controls["password"].errors === null;
  }

  get requiredValid() {
    return !this.loginForm.controls["password"].hasError("required");
  }
  get setPasswordRequired() {
    return !this.setPasswordForm.controls["password"].hasError("required");
  }
  get requiredConfirmationValid() {
    return !this.setPasswordForm.controls["confirmPassword"].hasError("required");
  }

  get minLengthValid() {
    return !this.loginForm.controls["password"].hasError("minlength");
  }
  get setPasswordMinLengthValid() {
    return !this.setPasswordForm.controls["password"].hasError("minlength");
  }

  get requiresDigitValid() {
    return !this.loginForm.controls["password"].hasError("requiresDigit");
  }
  get setPasswordRequiresDigitValid() {
    return !this.setPasswordForm.controls["password"].hasError("requiresDigit");
  }

  get requiresUppercaseValid() {
    return !this.loginForm.controls["password"].hasError("requiresUppercase");
  }
  get setPasswordRequiresUppercaseValid() {
    return !this.setPasswordForm.controls["password"].hasError("requiresUppercase");
  }

  get requiresLowercaseValid() {
    return !this.loginForm.controls["password"].hasError("requiresLowercase");
  }
  get setPasswordRequiresLowercaseValid() {
    return !this.setPasswordForm.controls["password"].hasError("requiresLowercase");
  }

  get requiresSpecialCharsValid() {
    return !this.loginForm.controls["password"].hasError("requiresSpecialChars");
  }
  get setPasswordRequiresSpecialCharsValid() {
    return !this.setPasswordForm.controls["password"].hasError("requiresSpecialChars");
  }

  get matchValid() {
    return !this.setPasswordForm.controls["confirmPassword"].hasError("not_matching");
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }


}
