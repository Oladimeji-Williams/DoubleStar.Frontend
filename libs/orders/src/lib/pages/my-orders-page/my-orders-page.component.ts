import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [OrderListComponent],
  templateUrl: './my-orders-page.component.html',
  styleUrl: './my-orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrdersPageComponent {}