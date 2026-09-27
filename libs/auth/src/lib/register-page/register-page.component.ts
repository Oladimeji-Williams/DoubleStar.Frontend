// libs/auth/src/lib/register-page/register-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ApiException } from '@doublestar/shared';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(12)]],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { phone, ...rest } = this.form.getRawValue();
    this.authService.registerCustomer({ ...rest, phone: phone || null }).subscribe({
      next: () => {
        this.successMessage.set('Account created — signing you in...');
        this.authService
          .login({ emailOrPhone: rest.email, password: rest.password })
          .subscribe(() => this.router.navigateByUrl('/'));
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error instanceof ApiException ? error.message : 'Something went wrong. Please try again.',
        );
      },
    });
  }
}