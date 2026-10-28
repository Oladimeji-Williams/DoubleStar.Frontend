
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';

import { AuthService } from '@doublestar/shared';

@Component({
  selector: 'app-confirm-email-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-email-page.component.html',
  styleUrl: './confirm-email-page.component.scss',
})
export class ConfirmEmailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  protected readonly isLoading = signal(true);
  protected readonly isSuccess = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const email = params.get('email');
      const token = params.get('token');

      if (!email || !token) {
        this.fail(
          'This confirmation link is incomplete. Please request a new confirmation email.',
        );
        return;
      }

      this.auth.confirmEmail(email, token).subscribe({
        next: () => {
          this.isSuccess.set(true);
          this.isLoading.set(false);
        },
        error: () => {
          this.fail(
            'We could not confirm your email. The link may have expired or already been used. Please request a new confirmation email if necessary.',
          );
        },
      });
    });
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.isLoading.set(false);
  }
}