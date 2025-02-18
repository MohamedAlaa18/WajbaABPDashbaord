import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CartDto, CreateCartItemDto } from '../dtos/cart-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiName = 'Default';

  private getToken(): string {
    return this.cookieService.get('userToken');
  }

  addCartItemByCartItemDto = (cartItemDto: CreateCartItemDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Cart/add-item-to-cart',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      body: cartItemDto,
    },
      { apiName: this.apiName, ...config });


  addVoucherByCode = (code: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Cart/AddVoucher',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { code },
    },
      { apiName: this.apiName, ...config });


  getCart = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<CartDto>>>({
      method: 'GET',
      url: '/api/Cart/GetCarforcustomer',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
      { apiName: this.apiName, ...config });

  constructor(private restService: RestService, private cookieService: CookieService) { }
}
