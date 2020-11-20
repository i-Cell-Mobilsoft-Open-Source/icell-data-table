export interface ComponentOptions {
  /**
   * Custom inputs to bind to a component cell-renderer.
   */
  inputs?: { [inputName: string]: any };
  /**
   * Custom outputs to bind to a component cell-renderer.
   */
  outputs?: { [outputName: string]: any };
}
