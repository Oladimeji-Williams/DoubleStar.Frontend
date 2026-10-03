// libs/auth/src/lib/login-page/login-page.component.ts — full replacement
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APP_KIND, ApiException, AuthService, BrandWordmarkComponent, CurrentUserStore, IconComponent, pickRandomFloatingCardPosition, FloatingCardPosition } from '@doublestar/shared';
import { AuthMarketingPanelComponent } from '../auth-marketing-panel/auth-marketing-panel.component';

type LoginMode = 'password' | 'code';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthMarketingPanelComponent, IconComponent, BrandWordmarkComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly router = inject(Router);
  private readonly appKind = inject(APP_KIND, { optional: true });

  protected readonly cardPosition: FloatingCardPosition = pickRandomFloatingCardPosition();

  protected readonly mode = signal<LoginMode>('password');
  protected readonly identifier = signal('');
  protected readonly password = signal('');
  protected readonly codeSent = signal(false);
  protected readonly code = signal('');

  protected readonly needsTwoFactor = signal(false);
  protected readonly twoFactorCode = signal('');
  protected readonly challengeToken = signal<string | null>(null);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected toggleMode(): void {
    this.mode.set(this.mode() === 'password' ? 'code' : 'password');
    this.codeSent.set(false);
    this.code.set('');
    this.errorMessage.set(null);
  }

  protected submitPassword(): void {
    if (!this.identifier().trim() || !this.password().trim()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login({ emailOrPhone: this.identifier(), password: this.password() }).subscribe({
      next: ({ requiresTwoFactor, challengeToken }) => {
        this.isSubmitting.set(false);
        if (requiresTwoFactor) {
          this.challengeToken.set(challengeToken);
          this.needsTwoFactor.set(true);
        } else {
          this.finishLogin();
        }
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong. Please try again.');
      },
    });
  }

  protected submitTwoFactorCode(): void {
    const token = this.challengeToken();
    if (!token || !this.twoFactorCode().trim()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.verifyTwoFactorChallenge(token, this.twoFactorCode()).subscribe({
      next: () => this.finishLogin(),
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error instanceof ApiException ? error.message : 'Invalid code. Please try again.');
      },
    });
  }

  protected requestEmailCode(): void {
    if (!this.identifier().trim()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.authService.requestEmailSignInCode(this.identifier()).subscribe({
      next: () => { this.isSubmitting.set(false); this.codeSent.set(true); },
      error: () => { this.isSubmitting.set(false); this.codeSent.set(true); },
    });
  }

  protected submitEmailCode(): void {
    if (!this.code().trim()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.authService.signInWithEmailCode(this.identifier(), this.code()).subscribe({
      next: () => this.finishLogin(),
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error instanceof ApiException ? error.message : 'Invalid code. Please try again.');
      },
    });
  }

  private finishLogin(): void {
    if (!this.appKind) { this.router.navigateByUrl('/'); return; }

    const isCustomerOnly = this.currentUserStore.isCustomer() && !this.currentUserStore.isStaff();
    const mismatch = (this.appKind === 'customer' && !isCustomerOnly) || (this.appKind === 'staff' && isCustomerOnly);

    if (mismatch) {
      this.authService.logout();
      this.errorMessage.set(
        this.appKind === 'customer'
          ? 'This is a staff account. Please use the staff portal to sign in.'
          : 'This is a customer account. Please use the customer portal to sign in.',
      );
      return;
    }
    this.router.navigateByUrl('/');
  }
}