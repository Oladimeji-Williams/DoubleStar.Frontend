import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TURNSTILE_SITE_KEY } from './turnstile-site-key.token';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => string;

      remove: (
        widgetId: string,
      ) => void;

      reset?: (
        widgetId: string,
      ) => void;
    };
  }
}

@Component({
  selector: 'app-turnstile-widget',
  standalone: true,

  template: `
    @if (configError()) {
      <p class="ts-error">
        Verification could not load. Please refresh the page and try again.
      </p>
    } @else {
      <div class="turnstile-wrapper">
        <div
          #container
          class="turnstile-container"
        ></div>
      </div>
    }
  `,

  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .turnstile-wrapper {
        display: block;
        width: 100%;
      }

      .turnstile-container {
        display: block;
        width: 100%;
      }

      .ts-error {
        font-size: 0.75rem;
        color: var(
          --ds-color-danger,
          #dc2626
        );
        margin: 0.5rem 0;
      }
    `,
  ],
})
export class TurnstileWidgetComponent
  implements OnInit, OnDestroy
{
  private readonly siteKey =
    inject(TURNSTILE_SITE_KEY, {
      optional: true,
    });

  private readonly platformId =
    inject(PLATFORM_ID);

  readonly container =
    viewChild<ElementRef<HTMLElement>>(
      'container',
    );

  readonly verified =
    output<string | null>();

  protected readonly configError =
    signal(false);

  private widgetId: string | null = null;

  ngOnInit(): void {
    if (
      !isPlatformBrowser(
        this.platformId,
      )
    ) {
      return;
    }

    if (!this.siteKey) {
      this.configError.set(true);
      return;
    }

    this.loadScript().then(() => {
      this.render();
    });
  }

  ngOnDestroy(): void {
    if (
      !isPlatformBrowser(
        this.platformId,
      )
    ) {
      return;
    }

    if (this.widgetId) {
      window.turnstile?.remove(
        this.widgetId,
      );

      this.widgetId = null;
    }
  }

  private loadScript(): Promise<void> {
    if (window.turnstile) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const existingScript =
        document.querySelector(
          'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
        );

      if (existingScript) {
        existingScript.addEventListener(
          'load',
          () => resolve(),
          { once: true },
        );

        return;
      }

      const script =
        document.createElement(
          'script',
        );

      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js';

      script.async = true;

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        this.configError.set(true);
        resolve();
      };

      document.head.appendChild(
        script,
      );
    });
  }

  private render(): void {
    const turnstile =
      window.turnstile;

    const element =
      this.container();

    if (
      !turnstile ||
      !element ||
      !this.siteKey
    ) {
      this.configError.set(true);
      return;
    }

    this.widgetId =
      turnstile.render(
        element.nativeElement,
        {
          sitekey: this.siteKey,

          /*
           * Let Cloudflare adapt the widget
           * to the available space.
           */
          size: 'flexible',

          callback: (
            token: string,
          ) => {
            this.verified.emit(token);
          },

          'expired-callback': () => {
            this.verified.emit(null);
          },

          'error-callback': () => {
            this.verified.emit(null);
          },
        },
      );
  }
}