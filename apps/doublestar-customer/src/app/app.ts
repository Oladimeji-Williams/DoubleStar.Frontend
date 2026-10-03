import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  ConfirmDialogComponent,
  PageSeoService,
  ToastContainerComponent,
  WatermarkComponent,
} from '@doublestar/shared';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastContainerComponent,
    ConfirmDialogComponent,
    WatermarkComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly seo = inject(PageSeoService);

  constructor() {
    this.seo.configure(environment.siteUrl);
  }
}