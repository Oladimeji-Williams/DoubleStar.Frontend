import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';

@Component({
  selector: 'app-staff-orders-page',
  standalone: true,
  imports: [OrderListComponent],
  templateUrl: './staff-orders-page.component.html',
  styleUrl: './staff-orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffOrdersPageComponent {}