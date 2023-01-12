import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { MemberComponent } from './components/member/member.component';
import { VipGuard } from './guards/vip.guard';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
// import { NgbModule } from '';

const routes: Routes=[
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [VipGuard]},
  {path: 'member', component: MemberComponent, canActivate: [VipGuard]},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch:'full'},
  {path: '**', redirectTo: '/products', pathMatch:'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    MemberComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule, 
    HttpClientModule,
    ReactiveFormsModule
    // NgbModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
