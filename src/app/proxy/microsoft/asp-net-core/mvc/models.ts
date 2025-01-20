
// export interface ActionResult {
// }

export interface ActionResult<TValue> extends IActionResult {
  // result: ActionResult;
  value: TValue;
}

export interface IActionResult {
  data: any;
  success: boolean;
}
