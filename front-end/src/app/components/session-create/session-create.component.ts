import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-session-create',
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.css'],
})
export class SessionCreateComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('successDialog') successDialog: TemplateRef<any>;

  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    leader: this.fb.control('', [Validators.required]),
    participants: this.fb.control('', [Validators.required]),
  });
  public areaOptions: string[] = [];

  constructor(
    private sessionsService: SessionsService,
    private usersService: UsersService,
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  public resetForm(): void {
    this.form.reset();
  }

  public async saveForm() {
    try {
      let session_id = await this.sessionsService.saveSession(
        this.form.get('name').value,
        this.form.get('leader').value,
        this.form.get('participants').value
      );
      this.resetForm();

      if (
        this.form.get('leader').value == this.authService.getCurrentUser().email
      ) {
        this.usersService.updateUserLeadership(
          this.form.get('leader').value,
          this.form.get('name').value
        );
      } else {
        this.usersService.updateUserMembership(
          this.form.get('participants').value,
          this.form.get('name').value
        );
      }
      this.openSucessDialog();
    } catch (err) {
      this.openErrorDialog();
      console.error('Error saving data: ', err);
    }
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }
}
