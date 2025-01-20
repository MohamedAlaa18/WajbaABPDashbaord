import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateFaqs {
  question: string;
  answer: string;
}

export interface GetFaqInput extends PagedAndSortedResultRequestDto {
}

export interface UpadtefaqDto extends CreateFaqs {
  id: number;
}
