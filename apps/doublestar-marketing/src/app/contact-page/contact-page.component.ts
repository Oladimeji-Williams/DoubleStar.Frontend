// apps/doublestar-marketing/src/app/contact-page/contact-page.component.ts — full replacement
import { Component, OnInit, inject } from '@angular/core';
import { IconComponent } from '@doublestar/shared';
import { PageSeoService } from '../../../../../libs/shared/src/lib/seo/page-seo.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent implements OnInit {
  private readonly seo = inject(PageSeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Contact & Store Location — Double Star',
      description: 'Visit Double Star for phone sales and repairs, or reach us by phone or email. Opening hours and directions.',
      path: '/contact',
    });
  }
}