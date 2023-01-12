import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: String;
    unitPrice: number;
    quantity: number;
    productid: String;

    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productid = cartItem.id;
    }
}
