
export interface IActionResult {
  data: any;
  success: boolean;
  items: any;
  totalCount: number;
  generateToken: any;
  wajbaUser: any;
}

// export interface ActionResult {
// }

export interface ActionResult<TValue> extends IActionResult {
  result: IActionResult;
  value: TValue;
}
