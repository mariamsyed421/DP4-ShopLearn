export type Payment = {
  name: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
  address: string;
};

export const defaultPayment: Payment = {
  name: "Mariam Syed",
  cardNumber: "1234 5678 1234 1234",
  expDate: "05/2027",
  cvv: "123",
  address: "1235 Main Street, Dallas, TX",
};