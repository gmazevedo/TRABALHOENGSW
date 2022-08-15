import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';
import { AbstractArrayFetcherService } from './abstract-array.service';
import { Session } from './models/session.model';

const BACKEND_URL = 'http://localhost:5000/v1';

@Injectable({ providedIn: 'root' })
export class SessionsService extends AbstractArrayFetcherService<Session> {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(http: HttpClient) {
    super(http, BACKEND_URL + '/select_sessions');
  }

  public async saveSession(
    registration_number: string,
    leader: string,
    participants: string
  ) {
    const url = `${BACKEND_URL}/upsert_session`;
    try {
      const content: any = {
        parameters: {
          owner_registration_number: registration_number,
          leader,
          participants,
        },
      };

      await lastValueFrom(this.http.post(url, content));
      this.fetch();
    } catch (err) {
      console.error('Error in sessions-service method: ', err);
      throw err;
    }
  }
}
