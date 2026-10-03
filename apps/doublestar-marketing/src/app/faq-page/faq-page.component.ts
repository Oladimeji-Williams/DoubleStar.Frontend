// apps/doublestar-marketing/src/app/faq-page/faq-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { IconComponent } from '@doublestar/shared';
import { PageSeoService } from '../../../../../libs/shared/src/lib/seo/page-seo.service';

interface FaqItem { question: string; answer: string; }

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.scss',
})
export class FaqPageComponent implements OnInit {
  private readonly seo = inject(PageSeoService);

  protected readonly faqs: FaqItem[] = [
    { question: 'How long does a screen repair take?', answer: 'Most screen and battery replacements are completed the same day, usually within a few hours, once you approve the quote.' },
    { question: 'Do you give a quote before starting repairs?', answer: 'Yes. We diagnose the fault first and send you a written quote. We never start paid work without your approval.' },
    { question: 'Can I track my repair online?', answer: 'Yes. Create a free account and you can see your repair\u2019s status — received, in progress, ready for collection — at any time.' },
    { question: 'Do you sell used phones?', answer: 'Yes, alongside new phones. Every used device is inspected and graded before it goes on sale.' },
    { question: 'What payment methods do you accept?', answer: 'Cash, bank transfer, card, and Paystack online payments are all accepted.' },
  ];

  protected readonly openIndex = signal<number | null>(0);

  ngOnInit(): void {
    this.seo.set({
      title: 'Frequently Asked Questions — Double Star',
      description: 'Answers to common questions about phone repairs, quotes, turnaround time, and buying phones at Double Star.',
      path: '/faq',
    });

    this.seo.setJsonLd('faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  protected toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}