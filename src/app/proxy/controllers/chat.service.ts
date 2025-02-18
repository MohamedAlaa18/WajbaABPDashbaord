import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { ChatMessagesDto } from '../dtos/chat-messges-contract/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  apiName = 'Default';
  

  getAllMessgesforuserByUserid = (userid: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<ChatMessagesDto>>>({
      method: 'GET',
      url: '/api/Chat',
      params: { userid },
    },
    { apiName: this.apiName,...config });
  

  getByIdById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<ChatMessagesDto>>>({
      method: 'GET',
      url: `/api/Chat/${id}`,
    },
    { apiName: this.apiName,...config });
  

  markAsReadByMessageId = (messageId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<ChatMessagesDto>>>({
      method: 'POST',
      url: `/api/Chat/messages/${messageId}/read`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
