// apps/doublestar-customer/src/app/reset-password-page/reset-password-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiException, AuthService } from '@doublestar/shared';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private email = '';
  private token = '';
  protected readonly newPassword = signal('');
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  protected submit(): void {
    this.authService.confirmPasswordReset(this.email, this.token, this.newPassword()).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (error: unknown) => this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'),
    });
  }
}