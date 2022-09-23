import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { getComposite, getLeavesImage, getRootsImage, getTreeImage, selections } from './interpreter';

export const myCanvas: Writable<HTMLCanvasElement> = writable();
export const customSvg: Writable<SVGElement> = writable();
export const loading: Writable<boolean> = writable(false);

class CanvasManager {
  lastUpdate: number = 0;
  previousCompositeString: string = '';
  time: NodeJS.Timeout;

  processImg = (forceReload: boolean = false): void => {
    let composite = getComposite();
    let compositeString = JSON.stringify(composite);
    if (!forceReload && (this.previousCompositeString == compositeString || compositeString == '{}')) return;

    this.previousCompositeString = compositeString;
    loading.set(true);
    this.lastUpdate = new Date().getTime();
    if (this.time) window.clearTimeout(this.time);

    this.time = setTimeout(async () => {
      if (new Date().getTime() - this.lastUpdate < 400) return;

      await this.renderCanvas(composite);
      setTimeout(() => loading.set(false), 50);
    }, 500);
  };

  renderCanvas = async composite => {
    let canvas = get(myCanvas);
    let select = get(selections);

    delete composite.use;
    let rootsExist = !!composite.roots && 'type' in composite.roots;

    let treeImg = getTreeImage(composite);
    let rootsImg = getRootsImage(composite.roots);
    let leavesImg = getLeavesImage(composite);

    let ctx = canvas.getContext('2d');

    let images = [];

    if (composite.background) {
      let background = new Image();
      background.src = composite.background;
      background.width = canvas.width;
      background.height = canvas.height;
      images.push(background);
    }

    let tree = new Image();
    tree.src = treeImg;
    let tenW = canvas.width * 0.1;
    let tenH = canvas.height * 0.1;
    tree.width = canvas.width - (rootsExist ? tenW * 2 : 0);
    tree.height =
      canvas.height -
      (rootsExist ? tenH * 2 : 0) -
      (select['nameLoc']?.position == 'center' ? tenH / 2 : 0);

    images.push(tree);

    if (rootsExist) {
      let roots = new Image();
      roots.src = rootsImg;
      roots.width = canvas.width;
      roots.height = canvas.height;
      images.push(roots);
    }

    if (composite.leaves) {
      let leaves = new Image();
      leaves.src = leavesImg;
      leaves.width = tree.width;
      leaves.height = tree.height;
      images.push(leaves);
    }

    await this.drawImages(ctx, images);
    await this.drawSvg();
  };

  drawImages = async (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[]
  ): Promise<void> => {
    new Promise<void>(async res => {
      let canvas = get(myCanvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const img of images) {
        let offset = 0;
        if (img.width < canvas.width) offset = (canvas.width - img.width) / 2;
        await this.whenLoaded(img, () =>
          ctx.drawImage(img, offset, 0, img.width, img.height)
        );
      }
      res();
    });
  };

  drawSvg = async (): Promise<void> => {
    let canvas = get(myCanvas);
    let svg = get(customSvg);
    if (!svg || !canvas) return;
    let ctx = canvas.getContext('2d');
    let txt = svg.outerHTML;
    // Convert the SVG to an object url
    const blob = new Blob([txt], { type: 'image/svg+xml' });
    let reader = new FileReader();
    reader.readAsDataURL(blob);

    await new Promise<void>(resolve => {
      reader.onload = e => {
        let url = <string>e.target.result;
        let img = document.createElement('img');
        img.src = url;
        this.whenLoaded(img, () =>
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        ).then(() => resolve());
      };
    });
  };

  private whenLoaded = async (
    img: HTMLImageElement,
    callback: () => void
  ): Promise<void> => {
    img.crossOrigin = 'anonymous';
    if (img.complete) {
      callback();
      return;
    }

    await new Promise<void>(resolve => {
      img.onload = () => {
        callback();
        resolve();
      };
    });
  };
}

const canvasManager: CanvasManager = new CanvasManager();
export { canvasManager };
