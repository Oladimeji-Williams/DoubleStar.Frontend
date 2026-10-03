// apps/doublestar-marketing/src/app/services-page/services-page.component.ts — full replacement
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent, IconName, PageSeoService } from '@doublestar/shared';
import { environment } from '../../environments/environment';

interface ServiceItem { icon: IconName; title: string; text: string; }

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss',
})
export class ServicesPageComponent implements OnInit {
  private readonly seo = inject(PageSeoService);
  protected readonly customerAppUrl = environment.customerAppUrl;

  protected readonly repairs: ServiceItem[] = [
    { icon: 'screen', title: 'Screen replacement', text: 'Cracked or unresponsive screens on most phone brands and models.' },
    { icon: 'battery', title: 'Battery replacement', text: 'Fast-draining or swollen batteries replaced with tested, safe parts.' },
    { icon: 'charging-port', title: 'Charging port repair', text: 'Loose or unresponsive charging ports cleaned or replaced.' },
    { icon: 'water-damage', title: 'Water damage recovery', text: 'Cleaning and component-level repair for liquid-damaged devices.' },
  ];

  protected readonly sales: ServiceItem[] = [
    { icon: 'phone-new', title: 'New phones', text: 'Latest and recent-model phones from trusted brands.' },
    { icon: 'phone-used', title: 'Quality-tested used phones', text: 'Inspected, graded and fairly priced second-hand devices.' },
    { icon: 'accessories', title: 'Accessories', text: 'Chargers, cables, screen protectors, cases and more.' },
  ];

  ngOnInit(): void {
    this.seo.set({
      title: 'Our Services — Phone Repair, Sales & More | Double Star',
      description: 'Screen replacement, battery replacement, charging port repair, and new & quality-tested phone sales. See everything Double Star offers.',
      path: '/services',
    });
  }
}