import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  // previousCategoryd: number = 1;
  searchMode: boolean;

  //properties for pagination
  // thePageNumber: number = 1;
  // thePagesize: number = 10;
  // theTotalElements: number = 0;

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProduct()
    }else{
      this.handlelistProduct()
    }   
  }

  handleSearchProduct(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    this.productService.searchProduct(theKeyword).subscribe(
      data => this.products = data
    )
  }

  handlelistProduct(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }else{
      this.currentCategoryId = 1;
    }

    // if (this.previousCategoryd != this.currentCategoryId){
    //   this.thePageNumber = 1;
    // }

    // this.previousCategoryd = this.currentCategoryId;

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => this.products = data
    )
  }

  addToCart(theProduct: Product){
    console.log(theProduct.name+ ' & '+theProduct.unitPrice);
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem)
  }
}
