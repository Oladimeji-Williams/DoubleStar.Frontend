// libs/shared/src/lib/seo/page-seo.service.ts
import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface PageSeoOptions { title: string; description: string; path: string; }

@Injectable({ providedIn: 'root' })
export class PageSeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private siteUrl = '';

  configure(siteUrl: string): void { this.siteUrl = siteUrl; }

  set(options: PageSeoOptions): void {
    const url = `${this.siteUrl}${options.path}`;
    this.titleService.setTitle(options.title);
    this.meta.updateTag({ name: 'description', content: options.description });
    this.meta.updateTag({ property: 'og:title', content: options.title });
    this.meta.updateTag({ property: 'og:description', content: options.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = this.document.createElement('link'); link.setAttribute('rel', 'canonical'); this.document.head.appendChild(link); }
    link.setAttribute('href', url);
  }

  setJsonLd(id: string, json: unknown): void {
    this.document.getElementById(id)?.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json'; script.id = id; script.text = JSON.stringify(json);
    this.document.head.appendChild(script);
  }
}