import type {
  BaseData,
  ButtonData,
  ImageFormatData,
  OptionImageData,
  Prereqs,
  RootData,
  TreeArtPage
} from '$lib/conf/TreeArtConfig';
import { config } from '$lib/conf/config';
import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';

export let requirementsNotMet = writable([]);
let _requirementsNotMet = [];

let _selections = {};
export const selections: Writable<any> = writable(_selections);
let _multiSelectEntries = {};
export const multiSelectEntries = writable(_multiSelectEntries);
export const myCanvas: Writable<HTMLCanvasElement> = writable();

let _svg: SVGElement;
export const customSvg: Writable<SVGElement> = writable();
customSvg.subscribe((val) => (_svg = val));

export let composite: Writable<any> = writable();
export let loading: Writable<boolean> = writable(false);

export let totalCost: Writable<number> = writable(0);

export const calculateTotal = (option: BaseData): number => {
  if ('cost' in option) {
    return option.cost;
  } else if ('values' in option) {
    for (const val of option.values) {
      let selected = _selections[val.option];
      if (!selected) continue;

      if (val.value.includes(selected.key)) {
        return val.cost;
      }
    }
  } else {
    return 0;
  }
};

const updateTotal = () => {
  let total = 0;
  Object.values(_selections).forEach((val: BaseData) => {
    console.log('val: ', val);
    if (typeof val == 'object') total += calculateTotal(val);
  });

  Object.entries<any>(_multiSelectEntries).forEach(([key, entry]) => {
    console.log('mult: ', entry);
    let currentData = config.getMultiSelectData(key);
    console.log('current: ', currentData);
    entry.forEach((multi) => (total += currentData.total(multi)));
  });

  totalCost.set(total);
};

selections.subscribe(updateTotal);
multiSelectEntries.subscribe(updateTotal);

const drawSvg = () => {
  let canvas = get(myCanvas);
  if (!_svg || !canvas) return;
  let ctx = canvas.getContext('2d');
  let txt = _svg.outerHTML;
  // Convert the SVG to an object url
  let url = URL.createObjectURL(new Blob([txt], { type: 'image/svg+xml' }));
  let img = document.createElement('img');
  console.log(url);
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
  };
  img.src = url;
};

export const selectItem = (optId: string, value: BaseData | number | string) => {
  console.log(`New value for ${optId}: `, value);
  _selections[optId] = value;
  if (typeof value == 'object') {
    if ('reset' in value) {
      for (let res of value.reset) {
        delete _selections[res];
      }
    }

    if (value.disable) {
      // TODO Implement disabling
    }
  }

  console.log(_selections);
  _requirementsNotMet = _requirementsNotMet.filter((item) => item != optId);
  requirementsNotMet.set(_requirementsNotMet);
  selections.set(_selections);
  processImg();
};

export const unset = (optId: string) => {
  _selections[optId] = undefined;
  selections.set(_selections);
};

export const getValue = (
  optId: string,
  sourceData?: any
): OptionImageData | ButtonData | string => {
  return sourceData && sourceData[optId] ? sourceData[optId] : _selections[optId];
};

export const selectMultiSelect = (optId: string, value: any) => {
  if (!_multiSelectEntries[optId]) _multiSelectEntries[optId] = [];
  _multiSelectEntries[optId].push(value);
  multiSelectEntries.set(_multiSelectEntries);
};

export const getMultiSelect = (optId: string): any => _multiSelectEntries[optId];

export const deleteMulti = (optId: string, multi: any) => {
  console.log(optId, multi);
  _multiSelectEntries[optId] = _multiSelectEntries[optId].filter((data) => data != multi);
  multiSelectEntries.set(_multiSelectEntries);
};

export const getQualifiedCost = (option: BaseData, sourceData?: any): number => {
  let value = -1;
  if (!option.values) return value;

  for (let check of option.values) {
    let targetValue = getValue(check.option, sourceData);
    // console.log('Target value: ' + targetValue);
    if (!targetValue) continue;

    if (
      (typeof targetValue == 'string' && check.value.includes(targetValue)) ||
      check.value.includes((<BaseData>targetValue).key)
    ) {
      value = check.cost;
      break;
    }
  }

  return value;
};

export const meetsPrereqs = (prereq: Prereqs): boolean => {
  if (!prereq) return true;

  let value: BaseData | string = getValue(prereq.option);
  if (typeof value != 'string') value = (<BaseData>value)?.key;

  if (!value) return false;

  let result = prereq.value
    ? // Check if we have an included value
      prereq.value.includes(value)
    : // Or that we are properly using an excluded value
      prereq.not_value && !prereq.not_value.includes(value);

  // Check the and recursively
  if (prereq.and) result = result && meetsPrereqs(prereq.and);

  // Check the or recursively
  if (prereq.or) result = result || meetsPrereqs(prereq.or);

  // Return our result
  return result;
};

export const requirementsMet = (page: TreeArtPage): boolean => {
  _requirementsNotMet = [];
  for (let opt of page.options) {
    if ((!opt.prereq || meetsPrereqs(opt.prereq)) && opt.required && !getValue(opt.id))
      _requirementsNotMet.push(opt.id);
  }
  requirementsNotMet.set(_requirementsNotMet);
  return _requirementsNotMet.length === 0;
};

/*
	imageFormats = <ImageFormats>{
		leaf: '/imgs/Tree Layers/%type% %gen% %couple% %style1% LEAVES%chalk%.png',
		tree_layer: 2,
		root_layer: 3,
		leaf_layer: 4,
		defaults: {
			type: 'DESCENDANT',
			gen: '3 Gen',
			couple: '',
			style1: 'Style 1',
			color: 'black',
			chalk: ''
		}
	};
 */

export const getImage = (data: OptionImageData) => {
  if (!data.img.use || data.img.use == 'tree') return getTreeImage(data);
  else if (data.img.use == 'roots') return getRootsImage(data);
  else if (data.img.use == 'leaves') return getLeavesImage(data);
};

// tree: '/imgs/Tree Layers/%type% %gen% %couple% %style1% TREE %color%.png',
export const getTreeImage = (data: OptionImageData) => {
  let treeFormat = config.imageFormats.tree
    .replace('%type%', getOrDefault(data, 'type'))
    .replace('%gen%', getOrDefault(data, 'gen'))
    .replace('%couple%', getOrDefault(data, 'couple'))
    .replace('%style1%', getOrDefault(data, 'style1'))
    .replace('%color%', getOrDefault(data, 'color'))
    .replace(/ {2,}/, ' ');

  // console.log(treeFormat);
  return treeFormat;
};

// leaf: '/imgs/Tree Layers/%type% %gen% %couple% %style1% LEAVES%chalk%.png',
export const getLeavesImage = (data: OptionImageData) => {
  let format = config.imageFormats.leaf
    .replace('%type%', getOrDefault(data, 'type'))
    .replace('%gen%', getOrDefault(data, 'gen'))
    .replace('%couple%', getOrDefault(data, 'couple'))
    .replace('%style1%', getOrDefault(data, 'style1'))
    .replace('%color%', getOrDefault(data, 'color'))
    .replace('%chalk%', getOrDefault(data, 'color') == 'CHALK' ? ' CHALK' : '')
    .replace(/ {2,}/, ' ');

  return format;
};

// root: '/imgs/Tree Layers/ROOTS %gen% %type% %color%.png',
export const getRootsImage = (data: OptionImageData) => {
  let rootFormat = config.imageFormats.root
    .replace('%type%', getOrDefault(data, 'type'))
    .replace('%gen%', getOrDefault(data, 'gen'))
    .replace('%color%', getOrDefault(data, 'color'))
    .replace(/ {2,}/, ' ');

  // console.log(rootFormat);
  return rootFormat;
};

const getImageData = (data: ImageFormatData, key: string) => {
  // Check for the key in the main img data
  if (key in data) {
    // This value should override the prior retrieved value.
    // console.log(`'${key}' In data`);
    return data[key];
  } else if (data.default && key in data.default && data.default[key] != 'reset') {
    // Otherwise, check supplied defaults
    // console.log(`'${key}' In data default`);
    // console.log(data.img);
    return data.default[key];
  } else if (data.use && data.use == 'roots' && data.roots) {
    if (key in data.roots) {
      // console.log(`'${key}' in roots`);
      return data.roots[key];
    }
  }

  return null;
};

const getOrDefault = (
  preData: OptionImageData | ImageFormatData | RootData,
  key: string
): string => {
  if (!preData) return '';

  // TODO Get already selected values and see if there is a supplied value there

  let data: ImageFormatData = 'img' in preData ? preData.img : (preData as ImageFormatData);

  let val = getImageData(data, key);
  if (!val) val = getImageData(getComposite(), key);

  // Fallback to the config defaults
  if (!val || val == 'reset') return config.imageFormats.defaults[key];
  else if (val) return val;
};

export const getComposite = () => {
  let comp = {};
  for (let key in _selections) {
    if (!(key in _selections) || !_selections[key]?.img) continue;

    let obj = _selections[key].img;
    // console.log(key + ': ', _selections[key]);
    for (let imgKey in obj) {
      if (typeof obj[imgKey] == 'object') {
        if (!comp[imgKey]) comp[imgKey] = {};
        for (let subKey in obj[imgKey]) {
          let val = obj[imgKey][subKey];
          if (val == 'reset') delete comp[imgKey][subKey];
          else comp[imgKey][subKey] = val;
        }
      } else {
        let val = obj[imgKey];
        if (val == 'reset') delete comp[imgKey];
        else comp[imgKey] = val;
      }
    }

    // console.log('Composite', comp);
  }

  composite.set(comp);
  return comp;
};

let lastUpdate = 0;
const processImg = () => {
  loading.set(true);
  lastUpdate = new Date().getTime();
  setTimeout(() => {
    if (new Date().getTime() - lastUpdate < 400) return;

    let composite = getComposite();
    renderCanvas(composite).then(() => {});
    loading.set(false);
  }, 500);
};

const renderCanvas = async (composite) => {
  let canvas = get(myCanvas);
  delete composite.use;
  let rootsExist = !!composite.roots && 'type' in composite.roots;

  let treeImg = getTreeImage(composite);
  let rootsImg = getRootsImage(composite.roots);
  let leavesImg = getLeavesImage(composite);

  console.log(leavesImg);
  console.log(canvas);

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
    (_selections['nameLoc']?.position == 'center' ? tenH / 2 : 0);

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

  drawImages(ctx, images);
  setTimeout(drawSvg, 50);
};

const drawImages = (ctx: CanvasRenderingContext2D, images: HTMLImageElement[]) => {
  let canvas = get(myCanvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  images.forEach((img) => {
    img.onload = () => {
      let offset = 0;
      if (img.width < canvas.width) offset = (canvas.width - img.width) / 2;
      ctx.drawImage(img, offset, 0, img.width, img.height);
    };
  });
};
