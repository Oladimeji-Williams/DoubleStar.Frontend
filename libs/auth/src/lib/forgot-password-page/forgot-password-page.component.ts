import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AuthMarketingPanelComponent,
    IconComponent,
    BrandWordmarkComponent,
    TurnstileWidgetComponent,
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly cardPosition: FloatingCardPosition =
    pickRandomFloatingCardPosition();

  protected readonly email = signal('');

  protected readonly turnstileToken =
    signal<string | null>(null);

  protected readonly sent = signal(false);

  protected readonly isSubmitting =
    signal(false);

  protected readonly errorMessage =
    signal<string | null>(null);

  protected readonly canSubmit = () =>
    this.email().trim().length > 0 &&
    !!this.turnstileToken();

  protected submit(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .requestPasswordReset(
        this.email().trim(),
        this.turnstileToken(),
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.sent.set(true);
        },

        error: (error: unknown) => {
          this.isSubmitting.set(false);

          /*
           * Do not expose whether an account exists.
           *
           * The backend should normally return success
           * even when the email is not registered.
           */
          if (error instanceof ApiException) {
            this.errorMessage.set(error.message);
          } else {
            this.errorMessage.set(
              'Something went wrong. Please try again.',
            );
          }
        },
      });
  }
}