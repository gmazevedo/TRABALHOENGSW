import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';
import { AbstractArrayFetcherService } from './abstract-array.service';
import { User } from '../services/models/user.model';

const BACKEND_URL = 'http://localhost:5000/v1';

@Injectable({ providedIn: 'root' })
export class UsersService extends AbstractArrayFetcherService<User> {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(http: HttpClient) {
    super(http, BACKEND_URL + '/select_users');
  }

  public async updateUser(name: string, email: string, password: string) {
    const url = `${BACKEND_URL}/update_user`;
    try {
      const content: any = {
        parameters: {
          name,
          email,
          password,
        },
      };

      await lastValueFrom(this.http.post(url, content));
      this.fetch();
    } catch (err) {
      console.error('Error in users-service method: ', err);
      throw err;
    }
  }

  public async updateUserMembership(email: string, session_id: string) {
    const url = `${BACKEND_URL}/update_user_membership`;
    try {
      const content: any = {
        parameters: {
          email,
          session_id,
        },
      };

      await lastValueFrom(this.http.post(url, content));
      this.fetch();
    } catch (err) {
      console.error('Error in users-service method: ', err);
      throw err;
    }
  }

  public async updateUserLeadership(email: string, session_id: string) {
    const url = `${BACKEND_URL}/update_user_leadership`;
    try {
      const content: any = {
        parameters: {
          email,
          session_id,
        },
      };

      await lastValueFrom(this.http.post(url, content));
      this.fetch();
    } catch (err) {
      console.error('Error in users-service method: ', err);
      throw err;
    }
  }

  public async insertUser(name: string, email: string, password: string) {
    const url = `${BACKEND_URL}/insert_user`;
    try {
      const content: any = {
        parameters: {
          name,
          email,
          password,
        },
      };

      await lastValueFrom(this.http.post(url, content));
      this.fetch();
    } catch (err) {
      console.error('Error in users-service method: ', err);
      throw err;
    }
  }
}
