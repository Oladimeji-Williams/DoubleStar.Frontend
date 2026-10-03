// apps/doublestar-marketing/src/app/guides/common-phone-repair-problems/common-phone-repair-problems.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSeoService } from '../../../../../../libs/shared/src/lib/seo/page-seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-common-phone-repair-problems',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './common-phone-repair-problems.component.html',
  styleUrl: './common-phone-repair-problems.component.scss',
})
export class CommonPhoneRepairProblemsComponent implements OnInit {
  private readonly seo = inject(PageSeoService);
  private readonly path = '/guides/common-phone-repair-problems';

  ngOnInit(): void {
    const title = '5 Common Phone Repair Problems (and How We Fix Them) — Double Star';
    const description = 'Cracked screens, draining batteries, and more — a plain-English guide to the most common phone problems Double Star repairs every week.';

    this.seo.set({ title, description, path: this.path });

    this.seo.setJsonLd('article-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '5 Common Phone Repair Problems (and How We Fix Them)',
      description,
      author: { '@type': 'Organization', name: 'Double Star' },
      publisher: { '@type': 'Organization', name: 'Double Star' },
      mainEntityOfPage: `${environment.siteUrl}${this.path}`,
      datePublished: '2026-10-01',
    });
  }
}