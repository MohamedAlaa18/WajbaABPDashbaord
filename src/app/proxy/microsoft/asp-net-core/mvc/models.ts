
// export interface ActionResult {
// }

export interface ActionResult<TValue> extends IActionResult {
  // result: ActionResult;
  value: TValue;
}

export interface IActionResult {
  items: any;
  totalCount: number;
  data: any;
  success: boolean;
}
