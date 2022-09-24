import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('successDialog') successDialog: TemplateRef<any>;

  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private dialog: MatDialog,
    private userService: UsersService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  public resetForm(): void {
    this.form.get('name').setValue('');
    this.form.get('password').setValue('');
    this.form.get('email').setValue('');
  }

  public async saveForm() {
    try {
      await this.userService.insertUser(
        this.form.get('name').value,
        this.form.get('email').value,
        this.form.get('password').value
      );

      this.resetForm();
      this.openSucessDialog();
    } catch (err) {
      console.error('Error saving data: ', err);
      this.openErrorDialog();
    }
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }

  public logout() {
    this.router.navigate(['login']);
  }
}
