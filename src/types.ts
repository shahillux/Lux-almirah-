export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  material: string;
  dimensions: string;
  warranty: string;
  description: string;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  paymentMethod: 'COD' | 'QR';
  paymentCompleted: boolean;
}

export type OrderStatus = 'PAID' | 'UNPAID';
