import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { TsUtils } from 'src/app/util/TsUtils';

@Component({
  selector: 'app-session-create',
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.css'],
})
export class SessionCreateComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    leader: this.fb.control('', [Validators.required]),
    participants: this.fb.control('', [Validators.required]),
  });
  public areaOptions: string[] = [];

  constructor(
    private sessionsService: SessionsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  public resetForm(): void {
    this.form.reset();
  }

  public async saveForm() {
    try {
      await this.sessionsService.saveSession(
        this.authService.getCurrentUser().registration_number,
        this.form.get('leader').value,
        this.form.get('participants').value
      );
      this.resetForm();
    } catch (err) {
      console.error('Error saving data: ', err);
    }
  }
}
