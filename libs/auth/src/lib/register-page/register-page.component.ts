
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

  protected readonly canResendConfirmation = signal(false);
  protected readonly isResendingConfirmation = signal(false);
  protected readonly resendMessage = signal<string | null>(null);

  protected readonly canSubmit = () =>
    this.email().trim().length > 0 &&
    this.password().length >= 12 &&
    !!this.turnstileToken();

  protected submit(): void {
    if (!this.canSubmit() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.canResendConfirmation.set(false);
    this.resendMessage.set(null);

    this.authService
      .registerCustomer({
        email: this.email().trim(),
        password: this.password(),
        turnstileToken: this.turnstileToken(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl('/login');
        },

        error: (error: unknown) => {
          this.isSubmitting.set(false);

          const message =
            error instanceof ApiException
              ? error.message
              : 'Something went wrong. Please try again.';

          this.errorMessage.set(message);

          if (message.toLowerCase().includes('already exists')) {
            this.canResendConfirmation.set(true);
          }
        },
      });
  }

  protected resendConfirmationEmail(): void {
    const email = this.email().trim();

    if (!email || this.isResendingConfirmation()) {
      return;
    }

    this.isResendingConfirmation.set(true);
    this.resendMessage.set(null);

    this.authService
      .resendEmailConfirmation(email)
      .subscribe({
        next: () => {
          this.isResendingConfirmation.set(false);

          this.resendMessage.set(
            'If this email belongs to an unconfirmed account, a new confirmation email will be sent. Please check your inbox and spam folder.',
          );
        },

        error: () => {
          this.isResendingConfirmation.set(false);

          this.resendMessage.set(
            'We could not process your request right now. Please wait a moment and try again.',
          );
        },
      });
  }
}
