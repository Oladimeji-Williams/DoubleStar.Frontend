// apps/doublestar-customer/src/app/customer-layout/customer-layout.component.ts — full replacement
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicTopbarComponent } from '../public-topbar/public-topbar.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, PublicTopbarComponent],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.scss',
})
export class CustomerLayoutComponent {}