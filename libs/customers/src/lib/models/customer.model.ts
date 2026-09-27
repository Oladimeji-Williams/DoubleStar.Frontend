// libs/customers/src/lib/models/customer.model.ts
export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  hasAccount: boolean;
}