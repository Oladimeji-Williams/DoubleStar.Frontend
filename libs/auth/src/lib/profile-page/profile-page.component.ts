// libs/auth/src/lib/profile-page/profile-page.component.ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';
import { ApiException, AuthService, CurrentUserStore } from '@doublestar/shared';
import { AvatarComponent } from '@doublestar/shared';


@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly authService = inject(AuthService);

  protected readonly isLoading = signal(true);
  protected readonly isSavingDetails = signal(false);
  protected readonly detailsError = signal<string | null>(null);
  protected readonly detailsSuccess = signal<string | null>(null);

  protected readonly email = signal<string | null>(null);
  protected readonly roles = signal<string[]>([]);
  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly phone = signal('');

  protected readonly currentPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmNewPassword = signal('');
  protected readonly isSavingPassword = signal(false);
  protected readonly passwordError = signal<string | null>(null);
  protected readonly passwordSuccess = signal<string | null>(null);
  protected readonly isUploadingAvatar = signal(false);
  private readonly currentUserStore = inject(CurrentUserStore);
  protected readonly avatarUrl = computed(() => this.currentUserStore.currentUser()?.avatarUrl ?? null);


  ngOnInit(): void {
    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.email.set(profile.email);
        this.roles.set(profile.roles);
        this.firstName.set(profile.firstName);
        this.lastName.set(profile.lastName);
        this.phone.set(profile.phone ?? '');
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected readonly canSaveDetails = () => this.firstName().trim().length > 0 && this.lastName().trim().length > 0;

  protected saveDetails(): void {
    if (!this.canSaveDetails()) return;

    this.isSavingDetails.set(true);
    this.detailsError.set(null);
    this.detailsSuccess.set(null);

    this.authService
      .updateMyProfile({ firstName: this.firstName(), lastName: this.lastName(), phone: this.phone() || null })
      .subscribe({
        next: () => {
          this.isSavingDetails.set(false);
          this.detailsSuccess.set('Profile updated.');
          this.authService.refreshCurrentUser().subscribe(); // syncs the sidebar/topbar display name immediately
        },
        error: (error: unknown) => {
          this.isSavingDetails.set(false);
          this.detailsError.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }

  protected readonly canSavePassword = () =>
    this.currentPassword().length > 0 &&
    this.newPassword().length >= 12 &&
    this.newPassword() === this.confirmNewPassword();

  protected savePassword(): void {
    if (!this.canSavePassword()) return;

    this.isSavingPassword.set(true);
    this.passwordError.set(null);
    this.passwordSuccess.set(null);

    this.authService
      .changePassword({ currentPassword: this.currentPassword(), newPassword: this.newPassword() })
      .subscribe({
        next: () => {
          this.isSavingPassword.set(false);
          this.passwordSuccess.set('Password changed.');
          this.currentPassword.set('');
          this.newPassword.set('');
          this.confirmNewPassword.set('');
        },
        error: (error: unknown) => {
          this.isSavingPassword.set(false);
          this.passwordError.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }

  protected onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isUploadingAvatar.set(true);
    this.authService.uploadAvatar(file).subscribe({
      next: () => {
        this.isUploadingAvatar.set(false);
        this.authService.refreshCurrentUser().subscribe();
      },
      error: () => this.isUploadingAvatar.set(false),
    });
  }

  protected removeAvatar(): void {
    this.authService.removeAvatar().subscribe(() => this.authService.refreshCurrentUser().subscribe());
  }
}