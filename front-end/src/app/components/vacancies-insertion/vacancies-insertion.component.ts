import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { TsUtils } from 'src/app/util/TsUtils';

@Component({
  selector: 'app-vacancies-insertion',
  templateUrl: './vacancies-insertion.component.html',
  styleUrls: ['./vacancies-insertion.component.css'],
})
export class VacanciesInsertionComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    leader: this.fb.control('', [Validators.required]),
    participants: this.fb.control('', [Validators.required]),
  });
  public areaOptions: string[] = [];

  constructor(
    private vacanciesService: VacanciesService,
    private authService: AuthService,
    private fb: FormBuilder,
    public areasService: AreasService
  ) {}

  ngOnInit(): void {
    this.areasService.getUpdateListener().subscribe({
      next: (res) => {
        this.areaOptions = res.data.map((area) => area.area_name).sort();
        let areaOptionsArray = this.form.get('areas') as FormArray;
        this.areaOptions.forEach((opt) => {
          areaOptionsArray.push(new FormControl());
        });
      },
    });

    this.areasService.getData();
  }

  public resetForm(): void {
    this.form.reset();
  }

  public async saveForm() {
    try {
      const selectedAreas = [];
      await this.vacanciesService.saveVacancy(
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
