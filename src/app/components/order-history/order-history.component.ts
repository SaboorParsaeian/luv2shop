import { Component } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = localStorage;

  constructor(private orderHistoryService: OrderHistoryService){}

  ngOnInit():void{
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));// in login component we storage the email now we use it here
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => this.orderHistoryList = data._embedded.orders
    )
  }

}
