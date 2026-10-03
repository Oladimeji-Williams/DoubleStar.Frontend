// apps/doublestar-customer/src/app/app.ts — full replacement
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent, ConfirmDialogComponent, WatermarkComponent } from '@doublestar/shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, ConfirmDialogComponent, WatermarkComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}