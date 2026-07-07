import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm!: FormGroup;
  public error: string = '';
  public showPassword = false;
  public toggleClass = 'off-line';

  public isLoading = false;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: ToastrService, private authService: AuthService

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get form() {
    return this.loginForm.controls;
  }
  employeeData: any = null;


  loadError: string | null = null;
  // ✅ API login
  login() {
    if (!this.loginForm.valid) {
      this.error = 'Please enter valid username and password';
      return;
    }

    this.isLoading = true;
    const userName = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    this.authservice.loginWithApi(userName, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res["statusCode"] == "200") {
          // Save user info in AuthService / localStorage
          if (res.objResult.token) {
            // Save in AuthService BehaviorSubject
            this.authservice.setCurrentUser({
              userName: res.objResult.userName,
              roleName: res.objResult.roleName,
              token: res.objResult.token,
              companyId:
                res.objResult.company_id ||
                1,
              userId: res.objResult.userId,
              userCode:
                res.objResult.user_Code 
            });
          }   
          this.isLoading = false;
          this.router.navigate(['/insights']); 
        }
        else {
          this.toastr.error(res["message"], 'Login', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.toastr.error(this.error, 'ynex', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        this.isLoading = false;
      },
    });
  }

  toggleVisibility() {
    this.showPassword = !this.showPassword;
    this.toggleClass = this.showPassword ? 'line' : 'off-line';
  }

  ngOnDestroy(): void {
    const bodyElement = this.renderer.selectRootElement('body', true);
    this.renderer.removeAttribute(bodyElement, 'class');
  }
}
