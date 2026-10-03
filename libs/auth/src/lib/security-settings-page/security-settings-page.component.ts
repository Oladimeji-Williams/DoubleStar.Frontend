// libs/auth/src/lib/security-settings-page/security-settings-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiException, AuthService, ToastService } from '@doublestar/shared';
import { TwoFactorSetup } from '@doublestar/shared';

@Component({
  selector: 'app-security-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-settings-page.component.html',
  styleUrl: './security-settings-page.component.scss',
})
export class SecuritySettingsPageComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly setup = signal<TwoFactorSetup | null>(null);
  protected readonly confirmCode = signal('');
  protected readonly disablePassword = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected beginSetup(): void {
    this.isBusy.set(true);
    this.errorMessage.set(null);
    this.authService.beginTwoFactorSetup().subscribe({
      next: (setup) => { this.isBusy.set(false); this.setup.set(setup); },
      error: (error: unknown) => { this.isBusy.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
    });
  }

  protected confirmSetup(): void {
    if (!this.confirmCode().trim()) return;
    this.isBusy.set(true);
    this.errorMessage.set(null);
    this.authService.confirmTwoFactorSetup(this.confirmCode()).subscribe({
      next: () => { this.isBusy.set(false); this.setup.set(null); this.confirmCode.set(''); this.toastService.success('Two-factor authentication enabled.'); },
      error: (error: unknown) => { this.isBusy.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
    });
  }

  protected disable(): void {
    if (!this.disablePassword().trim()) return;
    this.isBusy.set(true);
    this.errorMessage.set(null);
    this.authService.disableTwoFactor(this.disablePassword()).subscribe({
      next: () => { this.isBusy.set(false); this.disablePassword.set(''); this.toastService.success('Two-factor authentication disabled.'); },
      error: (error: unknown) => { this.isBusy.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
    });
  }
}