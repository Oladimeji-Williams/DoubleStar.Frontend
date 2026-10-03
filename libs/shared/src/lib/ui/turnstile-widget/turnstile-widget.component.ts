// libs/shared/src/lib/ui/turnstile-widget/turnstile-widget.component.ts — corrected, full replacement
import { Component, ElementRef, OnDestroy, OnInit, inject, output, viewChild } from '@angular/core';
import { TURNSTILE_SITE_KEY } from './turnstile-site-key.token';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

@Component({
  selector: 'app-turnstile-widget',
  standalone: true,
  template: `<div #container></div>`,
})
export class TurnstileWidgetComponent implements OnInit, OnDestroy {
  private readonly siteKey = inject(TURNSTILE_SITE_KEY);
  readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  readonly verified = output<string | null>();

  private widgetId: string | null = null;

  ngOnInit(): void {
    this.loadScript().then(() => this.render());
  }

  ngOnDestroy(): void {
    if (this.widgetId) window.turnstile?.remove(this.widgetId);
  }

  private loadScript(): Promise<void> {
    if (window.turnstile) return Promise.resolve();
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private render(): void {
    if (!window.turnstile) return;
    this.widgetId = window.turnstile.render(this.container().nativeElement, {
      sitekey: this.siteKey,
      callback: (token: string) => this.verified.emit(token),
      'expired-callback': () => this.verified.emit(null),
      'error-callback': () => this.verified.emit(null),
    });
  }
}