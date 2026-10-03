// apps/doublestar-marketing/src/app/home-page/home-page.component.ts — full replacement
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@doublestar/shared';
import { PageSeoService } from '../../../../../libs/shared/src/lib/seo/page-seo.service';
import { environment } from '../../environments/environment';

interface Testimonial { name: string; quote: string; rating: number; }

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly seo = inject(PageSeoService);
  protected readonly customerAppUrl = environment.customerAppUrl;

  // PLACEHOLDER testimonials — replace with real customer quotes before launch.
  // Do not add Review/AggregateRating JSON-LD until these are genuine.
  protected readonly testimonials: Testimonial[] = [
    { name: 'REPLACE-WITH-REAL-CUSTOMER-NAME', quote: 'REPLACE-WITH-A-REAL-CUSTOMER-QUOTE-ABOUT-THEIR-REPAIR-OR-PURCHASE.', rating: 5 },
    { name: 'REPLACE-WITH-REAL-CUSTOMER-NAME', quote: 'REPLACE-WITH-A-REAL-CUSTOMER-QUOTE-ABOUT-THEIR-REPAIR-OR-PURCHASE.', rating: 5 },
    { name: 'REPLACE-WITH-REAL-CUSTOMER-NAME', quote: 'REPLACE-WITH-A-REAL-CUSTOMER-QUOTE-ABOUT-THEIR-REPAIR-OR-PURCHASE.', rating: 5 },
  ];

  protected readonly stars = [0, 1, 2, 3, 4];

  ngOnInit(): void {
    this.seo.set({
      title: 'Double Star — Phone & Gadget Sales and Repairs in Lagos',
      description: 'Double Star sells phones, accessories and electronic gadgets, and repairs cracked screens, batteries and more. Visit us or request a repair online.',
      path: '/',
    });
  }
}