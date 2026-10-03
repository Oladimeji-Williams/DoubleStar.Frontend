// apps/doublestar-customer/src/app/email-signin-page/email-signin-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiException, AuthService } from '@doublestar/shared';

@Component({
  selector: 'app-email-signin-page',
  standalone: true,
  template: `<p>{{ status() }}</p>`,
})
export class EmailSigninPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  protected readonly status = signal('Signing you in...');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status.set('Invalid link.');
      return;
    }

    this.authService.signInWithEmailLink(token).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error: unknown) => this.status.set(error instanceof ApiException ? error.message : 'This link is invalid or has expired.'),
    });
  }
}