import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2shopFormService } from 'src/app/services/luv2shop-form.service';
import { Luv2shopValidators } from 'src/app/validators/luv2shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = localStorage;

  constructor(private formBuilder: FormBuilder, 
              private luv2shopFormService: Luv2shopFormService, 
              private cartService: CartService,
              private checkoutService: CheckoutService, 
              private router: Router
             ){}

  ngOnInit(): void{
    const theEmail = JSON.parse(this.storage.getItem('userEmail'))

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])//instead of '' we can use userEmail if we can build sign in component
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    })

    const theMonth: number = new Date().getMonth() + 1;
    console.log('theMonth: '+ theMonth)
    
    this.luv2shopFormService.getCreditCardMonths(theMonth).subscribe(
      data => {
        console.log('Month'+JSON.stringify(data))
        this.creditCardMonths = data
      }
    )

    this.luv2shopFormService.getCreditCardYear().subscribe(
      data => {
        console.log('Year'+JSON.stringify(data))
        this.creditCardYears = data}

    )

    this.luv2shopFormService.getCountries().subscribe(
      data => {
        console.log('countries'+JSON.stringify(data));
        this.countries = data;
      }
    )

    this.reviewCartDetails();
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    )
  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName') }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName') }
  get email(){ return this.checkoutFormGroup.get('customer.email') }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state') }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country') }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode') }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state') }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country') }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode') }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType') }
  get creditCardnameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get creditCardsecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode') }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    // console.log(this.checkoutFormGroup.get('customer').value)
   
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems
    //we can fill the orderItems in 2 way:
    //1
    let orderItems : OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    //2
    // let orderItems : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;

    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been Received. \nOrder tracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => {
          console.log(err.statusText)
          alert(`There was an error: ${err.message}`);
          
        }
      }
    )
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1
    }

    this.luv2shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    this.luv2shopFormService.getStates(countryCode).subscribe(
      data =>{
        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data
        }else{
          this.billingAddressStates = data
        }
        formGroup.get('state').setValue(data[0]);
      }  
    )
    console.log(this.checkoutFormGroup.get('customer').value)
  }

}
