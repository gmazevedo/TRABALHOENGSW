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
import { SessionsService } from 'src/app/services/sessions.service';
import { User } from 'src/app/services/models/user.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('successDialog') successDialog: TemplateRef<any>;
  private currentUser: User;
  private users: User[] = [];
  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
  });
  public sessionForm: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    members: this.fb.control('', [Validators.required]),
  });

  constructor(
    private sessionsService: SessionsService,
    private fb: FormBuilder,
    public authService: AuthService,
    private dialog: MatDialog,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.userService.getUpdateListener().subscribe({
      next: (res) => {
        this.users = res.data;
        this.currentUser = res.data.filter(
          (user) => user.email === this.authService.getCurrentUser().email
        )[0];

        this.form.get('name').setValue(this.currentUser.name);
        this.form.get('password').setValue(this.currentUser.password);
        this.form.get('email').setValue(this.currentUser.email);
      },
    });

    this.userService.fetch();
  }

  public resetForm(): void {
    this.form.get('name').setValue(this.currentUser.name);
    this.form.get('password').setValue(this.currentUser.password);
    this.form.get('email').setValue(this.currentUser.email);
  }

  public async saveForm() {
    try {
      await this.userService.updateUser(
        this.form.get('name').value,
        this.form.get('email').value,
        this.form.get('password').value
      );

      this.openSucessDialog();
    } catch (err) {
      console.error('Error saving data: ', err);
      this.openErrorDialog();
    }
  }
  public resetSessionForm() {
    this.sessionForm.get('name').reset('');
    this.sessionForm.get('members').reset('');
  }

  public async saveSessionForm() {
    try {
      await this.sessionsService.saveSession(
        this.sessionForm.get('name').value,
        this.authService.getCurrentUser().email,
        this.sessionForm.get('members').value
      );

      this.resetSessionForm();
      this.openSucessDialog();
    } catch (err) {
      this.openErrorDialog();
    }
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }
}
