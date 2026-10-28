import { CartDto, CartItemDto, CheckoutSummaryDto } from '../dto/orders.dto';
import { Cart, CartItem, CheckoutSummary } from '../models/cart.model';

export function toCartItem(dto: CartItemDto): CartItem {
  return {
    productId: dto.productId,
    name: dto.name,
    sku: dto.sku,
    imageUrl: dto.imageUrl,
    unitPriceKobo: dto.unitPriceKobo,
    quantity: dto.quantity,
    lineTotalKobo: dto.lineTotalKobo,
    availableQuantity: dto.availableQuantity,
    isAvailable: dto.isAvailable,
    issue: dto.issue,
  };
}

export function toCart(dto: CartDto): Cart {
  return {
    items: dto.items.map(toCartItem),
    itemCount: dto.itemCount,
    subtotalKobo: dto.subtotalKobo,
    hasIssues: dto.hasIssues,
  };
}

export function toCheckoutSummary(dto: CheckoutSummaryDto): CheckoutSummary {
  return {
    cart: toCart(dto.cart),
    fulfillmentMethod: dto.fulfillmentMethod,
    deliveryFeeKobo: dto.deliveryFeeKobo,
    totalKobo: dto.totalKobo,
    pickupAddress: dto.pickupAddress,
    paymentWindowMinutes: dto.paymentWindowMinutes,
  };
}