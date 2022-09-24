import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  public form: FormGroup = this.fb.group({
    email: this.fb.control('', [
      Validators.required,
      Validators.pattern('^[a-z0-9]*$'),
      Validators.maxLength(30),
    ]),
    password: this.fb.control('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  public async ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate['/profile'];
    }
  }

  public async onClick() {
    try {
      await this.authService.login(
        this.form.get('email').value,
        this.form.get('password').value
      );
    } catch (err) {
      this.openErrorDialog();
    }
  }

  public onSignup() {
    this.router.navigate(['/signup']);
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }
}
