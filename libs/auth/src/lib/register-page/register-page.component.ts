import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  ApiException,
  AuthService,
  BrandWordmarkComponent,
  IconComponent,
  TurnstileWidgetComponent,
  pickRandomFloatingCardPosition,
  FloatingCardPosition,
} from '@doublestar/shared';

import { AuthMarketingPanelComponent } from '../auth-marketing-panel/auth-marketing-panel.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AuthMarketingPanelComponent,
    IconComponent,
    BrandWordmarkComponent,
    TurnstileWidgetComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cardPosition: FloatingCardPosition =
    pickRandomFloatingCardPosition();

  protected readonly email = signal('');
  protected readonly password = signal('');

  protected readonly turnstileToken =
    signal<string | null>(null);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly canSubmit = () =>
    this.email().trim().length > 0 &&
    this.password().length >= 12 &&
    !!this.turnstileToken();

  protected submit(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .registerCustomer({
        email: this.email().trim(),
        password: this.password(),
        turnstileToken: this.turnstileToken(),
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },

        error: (error: unknown) => {
          this.isSubmitting.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Something went wrong. Please try again.',
          );
        },
      });
  }
}