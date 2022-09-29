import type {
  BaseData,
  ButtonData,
  ImageFormatData,
  OptionImageData,
  Prereqs,
  RootData,
  TextOption,
  TreeArtPage
} from '$lib/conf/TreeArtConfig';
import { config } from '$lib/conf/config';
import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { canvasManager } from './canvas-manager';
import { saveMultiData, saveSelections } from './data-store';
import { coupon, couponValue } from './coupon-manager';
import { page } from './pages';

export const requirementsNotMet = writable([]);
export const selections: Writable<any> = writable({});
export const multiSelectEntries: Writable<any> = writable({});
export const composite: Writable<any> = writable();
export const itemTotal: Writable<number> = writable(0);
export const shipping: Writable<number> = writable(0);
export const totalCost: Writable<number> = writable(0);

export const calculateTotal = (option: BaseData): number => {
  if ('cost' in option) {
    return option.cost;
  } else if ('values' in option) {
    for (const val of option.values) {
      let selected = get(selections)[val.option];
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
  let itmTotal = 0;
  let sel = get(selections);
  Object.entries<BaseData>(sel).forEach(([key, val]: [string, BaseData]) => {
    if (typeof val == 'object') {
      let value = calculateTotal(val);
      if (key == 'shipping') shipping.set(value);
      else itmTotal += value;
      total += value;
    }
  });

  Object.entries<any>(get(multiSelectEntries)).forEach(([key, entry]) => {
    const currentData = config.getMultiSelectData(key);
    entry.forEach(multi => {
      const sum = currentData.total(multi);
      total += sum;
      itmTotal += sum;
    });
  });

  itemTotal.set(itmTotal);

  const coup = get(coupon);
  if (coup) {
    let amount;
    if (coup.target == 'all') amount = itmTotal;
    else amount = getQualifiedCost(sel[coup.target]);

    let discount = 0;
    if (coup.coupon) { // X% off
      discount = amount * (coup.value / 100);
      discount = Math.round(discount * 100) / 100;
    } else { // Flat value
      discount = Math.min(coup.value, amount);
    }

    couponValue.set(discount);
    total -= discount;
  }

  totalCost.set(total);
};

selections.subscribe(selections => {
  updateTotal();
  saveSelections(selections);
});
multiSelectEntries.subscribe(entries => {
  updateTotal();
  saveMultiData(entries);
});
coupon.subscribe(updateTotal);

export const selectItem = (
  optId: string,
  value: BaseData | number | string,
  cascade: boolean = true
) => {
  let sel = get(selections);
  // console.log(`New value for ${optId}: `, value);
  const prev = sel[optId];
  sel[optId] = value;
  if (typeof value == 'object') {
    if (prev && 'key' in value && prev.key != value.key && 'reset' in value) {
      for (let res of value.reset) {
        delete sel[res];
      }
    }
    if (value.onselect && cascade) {
      value.onselect();
    }
  } else if (typeof value == 'string') {
    const pg = get(page);
    let txtOpt: TextOption;
    for (const opt of pg.options) {
      if (opt.type == 'text' && opt.id == optId) {
        txtOpt = opt;
        break;
      }
    }

    if (txtOpt && txtOpt.onupdate) txtOpt.onupdate();
  }

  let reqs = get(requirementsNotMet).filter(item => item != optId);
  requirementsNotMet.set(reqs);
  selections.set(sel);

  const force = [
    'familyName',
    'lineTwo',
    'familyFont',
    'nameLoc',
    'quote',
    'quoteFont',
    'quoteLoc',
    'ground',
    'groundFont'
  ].includes(optId);
  canvasManager.processImg(force);
};

export const unset = (optId: string) => {
  let sel = get(selections);
  if (sel[optId]) {
    sel[optId] = undefined;
    selections.set(sel);
  }
};

export const getValue = (
  optId: string,
  sourceData?: any
): OptionImageData | ButtonData | string => {
  return sourceData && sourceData[optId]
    ? sourceData[optId]
    : get(selections)[optId];
};

export const selectMultiSelect = (optId: string, value: any) => {
  let entries = get(multiSelectEntries);
  if (!entries[optId]) entries[optId] = [];
  entries[optId].push(value);
  multiSelectEntries.set(entries);
};

export const getMultiSelect = (optId: string): any =>
  get(multiSelectEntries)[optId];

export const deleteMulti = (optId: string, multi: any) => {
  let entries = get(multiSelectEntries);
  entries[optId] = entries[optId].filter(data => data != multi);
  multiSelectEntries.set(entries);
};

export const getQualifiedCost = (
  option: BaseData,
  sourceData?: any
): number => {
  let value = -1;
  if (!option.values) return value;

  for (let check of option.values) {
    let targetValue: OptionImageData | ButtonData | string = getValue(
      check.option,
      sourceData
    );
    // console.log('Target value: ' + targetValue);
    if (!targetValue) continue;

    if (
      (typeof targetValue == 'string' && check.value.includes(targetValue)) ||
      (typeof targetValue == 'object' && check.value.includes(targetValue.key))
    ) {
      value = check.cost;
      break;
    }
  }

  return value;
};

export const meetsPrereqs = (prereq: Prereqs): boolean => {
  if (!prereq) return true;

  let value: OptionImageData | ButtonData | string = getValue(prereq.option);
  if (typeof value != 'string') value = value?.key;

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
  let reqs = [];
  for (let opt of page.options) {
    if (
      (!opt.prereq || meetsPrereqs(opt.prereq)) &&
      opt.required &&
      !getValue(opt.id)
    )
      reqs.push(opt.id);
  }
  requirementsNotMet.set(reqs);
  return reqs.length === 0;
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
  return rootFormat;
};

const getImageData = (data: ImageFormatData, key: string) => {
  // Check for the key in the main img data
  if (key in data) {
    // This value should override the prior retrieved value.
    return data[key];
  } else if (
    data.default &&
    key in data.default &&
    data.default[key] != 'reset'
  ) {
    // Otherwise, check supplied defaults
    return data.default[key];
  } else if (data.use && data.use == 'roots' && data.roots) {
    if (key in data.roots) {
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

  let data: ImageFormatData =
    'img' in preData ? preData.img : (preData as ImageFormatData);

  let val = getImageData(data, key);
  if (!val) val = getImageData(getComposite(), key);

  // Fallback to the config defaults
  if (!val || val == 'reset') return config.imageFormats.defaults[key];
  else if (val) return val;
};

export const getComposite = () => {
  let sel = get(selections);
  let comp = {};
  for (let key in sel) {
    if (!(key in sel) || !sel[key]?.img) continue;

    let obj = sel[key].img;
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
  }

  composite.set(comp);
  return comp;
};
