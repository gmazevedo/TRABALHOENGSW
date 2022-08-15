import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { Session } from '../../services/models/session.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-sessions',
  templateUrl: './my-sessions.component.html',
  styleUrls: ['./my-sessions.component.scss'],
})
export class MySessionsComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('successDialog') successDialog: TemplateRef<any>;

  public sessionsFilter = '';
  public displayCols = ['Nº Participantes', 'Nome da sessão', 'Nome do lider'];
  public sessionsToDisplay: Session[] = [];
  private sessions: Session[] = [];

  constructor(
    public authService: AuthService,
    public sessionsService: SessionsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sessionsService.getUpdateListener().subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.sessionsToDisplay = this.sessions;
      },
    });

    this.sessionsService.fetch();
  }

  public onInput() {
    this.sessionsToDisplay = this.sessionsFilter
      ? this.sessions.filter((session) => {
          return session.name.includes(this.sessionsFilter);
        })
      : this.sessions;
  }

  public getParticipantsNumbers(element: Session): number {
    const members = element.members.split(',');
    return members.length ? members.length : 0;
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }
}
