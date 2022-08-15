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

  public async updateUser(
    registration_number: string,
    name: string,
    password: string,
    email: string
  ) {
    const url = `${BACKEND_URL}/update_user`;
    try {
      const content: any = {
        parameters: {
          registration_number,
          name,
          password,
          email,
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
