import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderurl = "http://localhost:8080/api/orders"

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory>{
    const orderHistoryUrl = `${this.orderurl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=john@test.com`
    // const orderHistoryUrl = `${this.orderurl}/search/findByCustomerEmail?email=${theEmail}`
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}
