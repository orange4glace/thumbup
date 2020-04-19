declare const _grayScale: any;
declare const _boxFilter: any;
declare const _mixWithColor: any;
declare const _malloc: any;
declare const _free: any;
declare const HEAPU8: any;

export class ImageFilter {

  public static enabled = false;

  public static init() {
    if (!("WebAssembly" in window)) {
      ImageFilter.enabled = false;
      alert('Your browser does not support Webassembly!\nImage filter will not work.')
    }
    else {
      ImageFilter.enabled = true;
    }
  }

  public static grayScale(ctx: CanvasRenderingContext2D) {
    if (!ImageFilter.enabled) return;
    const cvs = ctx.canvas;
    const pixels = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    const length = pixels.length;
    const memory = _malloc(length);
    HEAPU8.set(pixels, memory);
    _grayScale(memory, cvs.width, cvs.height);
    const result = HEAPU8.subarray(memory, memory + length);
    ctx.putImageData(new ImageData(new Uint8ClampedArray(result), cvs.width, cvs.height), 0, 0);
    _free(memory);
  }

  public static boxFilter(ctx: CanvasRenderingContext2D,
    filter: [number,number,number,number,number,number,number,number,number]) {
    if (!ImageFilter.enabled) return;
    const cvs = ctx.canvas;
    const pixels = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    const length = pixels.length;
    const memory = _malloc(length);
    HEAPU8.set(pixels, memory);
    _boxFilter(memory, cvs.width, cvs.height, ...filter);
    const result = HEAPU8.subarray(memory, memory + length);
    ctx.putImageData(new ImageData(new Uint8ClampedArray(result), cvs.width, cvs.height), 0, 0);
    _free(memory);
  }

  public static mixWithColor(ctx: CanvasRenderingContext2D,
    r: number, g: number, b: number, opacity: number) {
    if (!ImageFilter.enabled) return;
    const cvs = ctx.canvas;
    const pixels = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    const length = pixels.length;
    const memory = _malloc(length);
    HEAPU8.set(pixels, memory);
    _mixWithColor(memory, cvs.width, cvs.height, r, g, b, opacity);
    const result = HEAPU8.subarray(memory, memory + length);
    ctx.putImageData(new ImageData(new Uint8ClampedArray(result), cvs.width, cvs.height), 0, 0);
    _free(memory);
  }

}