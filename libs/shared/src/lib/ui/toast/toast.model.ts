// libs/shared/src/lib/ui/toast/toast.model.ts
export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}