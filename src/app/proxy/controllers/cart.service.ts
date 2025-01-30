import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CartItemDto } from '../dtos/cart-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiName = 'Default';
  

  addCartItemByCartItemDto = (cartItemDto: CartItemDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Cart/add-item-to-cart',
      body: cartItemDto,
    },
    { apiName: this.apiName,...config });
  

  getCart = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Cart/GetCarforcustomer',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
