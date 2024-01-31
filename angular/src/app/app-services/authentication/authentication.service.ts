import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isAuthenticated: boolean = false;
  private userName: string = '';

  login(): void {
    this.isAuthenticated = true;
    this.userName = 'This User\'s Name';
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userName = '';
  }

  getAuthenticationState(): boolean {
    return this.isAuthenticated;
  }

  getUserName(): string {
    return this.userName
  }
}
