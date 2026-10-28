// libs/shared/src/lib/ui/site-header/site-header.component.ts
// ONE header for the marketing site, the storefront and the customer account area.
// Pages don't build their own top bars any more — they pass nav data to this.
import { NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserStore } from '../../auth/current-user.store';
import { AvatarComponent } from '../avatar/avatar.component';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { BrandWordmarkComponent } from '../brand-wordmark/brand-wordmark.component';
import { IconComponent } from '../icon/icon.component';

export interface SiteNavItem {
  label: string;
  /** Router path, or an absolute URL when `external` is true (links across the marketing/customer apps). */
  path: string;
  external?: boolean;
  /** Only highlight on an exact URL match (use for '/'). */
  exact?: boolean;
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    AvatarComponent,
    BrandLogoComponent,
    BrandWordmarkComponent,
    IconComponent,
  ],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  readonly navItems = input.required<SiteNavItem[]>();
  readonly accountLinks = input<SiteNavItem[]>([]);
  readonly homeLink = input<SiteNavItem>({ label: 'Home', path: '/' });
  readonly cartLink = input<SiteNavItem | null>(null);
  /** null = unknown (e.g. the marketing site), so no badge is drawn. */
  readonly cartCount = input<number | null>(null);
  readonly signInLink = input<SiteNavItem | null>(null);
  readonly registerLink = input<SiteNavItem | null>(null);

  readonly signOut = output<void>();

  protected readonly currentUserStore = inject(CurrentUserStore);
  protected readonly menuOpen = signal(false);
  protected readonly accountOpen = signal(false);

  protected readonly cartBadge = computed(() => {
    const count = this.cartCount();
    if (!count || count <= 0) {
      return null;
    }
    return count > 99 ? '99+' : String(count);
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeMenus();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMenus();
  }

  protected closeMenus(): void {
    this.menuOpen.set(false);
    this.accountOpen.set(false);
  }

  protected toggleMenu(): void {
    this.accountOpen.set(false);
    this.menuOpen.update((open) => !open);
  }

  protected toggleAccount(): void {
    this.menuOpen.set(false);
    this.accountOpen.update((open) => !open);
  }

  protected signOutClicked(): void {
    this.closeMenus();
    this.signOut.emit();
  }
}