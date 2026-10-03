// apps/doublestar-marketing/src/app/app.routes.ts
import { Route } from '@angular/router';
import { MarketingLayoutComponent } from './marketing-layout/marketing-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ServicesPageComponent } from './services-page/services-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { CommonPhoneRepairProblemsComponent } from './guides/common-phone-repair-problems/common-phone-repair-problems.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MarketingLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'services', component: ServicesPageComponent },
      { path: 'faq', component: FaqPageComponent },
      { path: 'contact', component: ContactPageComponent },
      { path: 'guides/common-phone-repair-problems', component: CommonPhoneRepairProblemsComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];