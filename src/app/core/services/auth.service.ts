import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';


interface AuthResponseData {
  token: string;
  username: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: AuthResponseData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 注意：在实际部署时，这里应该是完整的后端API地址
  // 在本地开发时，可以通过proxy.conf.json配置代理来避免跨域
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }):  Observable<ApiResponse> {

    return this.http.post<ApiResponse>(`/api/auth/login`, credentials).pipe(
      tap(response => {
        if (response.code === 200) {
          localStorage.setItem(this.TOKEN_KEY, response.data.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
