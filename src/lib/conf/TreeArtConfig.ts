import { meetsPrereqs } from '../interpreter';

export class TreeArtConfig {
  imageFormats = <ImageFormats>{
    tree: '/imgs/Tree Layers/%type% %gen% %couple% %style1% TREE %color%.png',
    root: '/imgs/Tree Layers/ROOTS %gen% %type% %color%.png',
    leaf: '/imgs/Tree Layers/%type% %gen% %couple% %style1% LEAVES%chalk%.png',
    defaults: {
      type: TreeType.DESCENDANT,
      gen: '3 Gen',
      couple: '',
      style1: 'Style 1',
      color: 'black'
    }
  };

  builderFooter: string = '';
  pages: TreeArtPage[] = [];

  constructor(data: TreeArtConfigData = {}) {
    //Load in and set our image formats, overriding the defaults if they are present.
    if (data.imageFormats) {
      for (let key in data.imageFormats) {
        console.log(typeof data.imageFormats[key]);
        if (typeof data.imageFormats[key] != 'object')
          this.imageFormats[key] = data.imageFormats[key];
        else {
          for (let sub_key in data.imageFormats[key]) {
            this.imageFormats[key][sub_key] = data.imageFormats[key][sub_key];
          }
        }
      }
    }

    //Set our other variables dynamically
    for (let key in data) {
      if (key == 'imageFormats') continue;
      this[key] = data[key];
    }
  }

  setPages = (pages: TreeArtPage[]): void => {
    this.pages = pages;
  };

  addPage = (page: TreeArtPage): void => {
    this.pages.push(page);
  };

  getOption = (id: string): BaseOption => {
    for (const page of this.pages) {
      for (const opt of page.options) {
        if (opt.id == id) return opt;
      }
    }

    return null;
  };

  getMultiSelectData = (id: string): MultiSelectData => {
    for (const page of this.pages) {
      if (page.multiselect && page.multiselect.id == id)
        return page.multiselect;
    }

    return null;
  };
}

export class TreeArtPage {
  title: string;
  intro: string;
  footer: string;
  prereq: Prereqs | undefined;
  options: (ImageOption | ButtonOption | ItemOption | TextOption)[];
  finalPage = false;
  multiselect: MultiSelectData | undefined = undefined;

  constructor(init: TreeArtPageData) {
    this.title = init.title;
    this.intro = init.intro;
    this.footer = init.footer;
    this.prereq = init.prereq;
    this.options = init.options;
    this.multiselect = init.multiselect;
    if (init.finalPage) this.finalPage = init.finalPage;
  }

  meetsRequirements() {
    return meetsPrereqs(this.prereq);
  }
}

/** @type **/
export interface TreeArtPageData {
  title: string;
  intro: string;
  footer?: string;
  prereq?: Prereqs;
  options: (ImageOption | ButtonOption | ItemOption | TextOption)[];
  finalPage?: boolean;
  multiselect?: MultiSelectData;
}

export interface Prereqs {
  option: string;
  value?: string[];
  not_value?: string[];
  and?: Prereqs;
  or?: Prereqs;
}

export interface MultiSelectCreate {
  display: string;
  id: string;
  keys: string[];
  quantifier: string;
  format: string;
}

export class MultiSelectData {
  display: string;
  id: string;
  keys: string[];
  quantifier: string;
  format: string;

  constructor(data: MultiSelectCreate) {
    this.display = data.display;
    this.id = data.id;
    this.keys = data.keys;
    this.quantifier = data.quantifier;
    this.format = data.format;
  }

  parseText = (data: any): string => {
    let final = this.format;
    for (const text of this.keys) {
      let obj = data[text];
      if (typeof obj == 'number') final = final.replace(`%${text}%`, obj + '');
      else {
        final = final.replace(
          `%${text}%`,
          obj.placeholder || obj.summaryText || obj.displayText || obj.key
        );
      }
    }

    return final;
  };

  total = (data: any) => {
    let quant = data[this.quantifier];
    let cost = 0;
    for (let [key, val] of Object.entries<any>(data)) {
      if (typeof val == 'object' && 'values' in val) {
        for (const obj of val.values) {
          // Pick up here
          if (!obj.value.includes(data[obj.option].key)) continue;
          if ('cost' in obj && obj.cost) {
            cost += obj.cost * quant;
          }
        }
      }
    }
    return cost;
  };
}

export interface TreeArtConfigData {
  imageFormats?: ImageFormats;
  builderFooter?: string;
  pages?: [TreeArtPage];
}

export interface ImageFormats {
  tree?: string;
  root?: string;
  leaf?: string;
  tree_layer?: number;
  root_layer?: number;
  leaf_layer?: number;
  defaults?: {
    type?: string;
    gen?: string;
    couple?: string;
    style1?: string;
    color?: string;
    chalk?: string;
  };
}

export interface BaseOption {
  prereq?: Prereqs;
  name: string;
  id: string;
  type: string;
  required?: boolean;
  layer?: number;
  display?: string;
  flexCount?: number;
}

export interface ImageOption extends BaseOption {
  images: (OptionImageData | GroupData)[];
}

export interface ButtonOption extends BaseOption {
  buttons: ButtonData[];
}

export interface ItemOption extends BaseOption {
  items: ItemData[];
}

export interface TextOption extends BaseOption {
  placeholder?: string;
}

export interface BaseData {
  prereq?: Prereqs;
  displayText?: string;
  cost?: number;
  key?: string;
  summaryText?: string;
  default?: boolean;
  img?: ImageFormatData;
  placeholder?: string;
  values?: ValueInformation[];
  reset?: string[];
  disable?: string[];
  font?:
    | 'MType'
    | 'MType-Script'
    | 'Amaze'
    | 'Script'
    | 'Papyrus'
    | 'Papyrus8'
    | 'Papyrus9';
  position?: 'left' | 'right' | 'center';
}

export interface OptionImageData extends BaseData {
  displayImage?: string;
  background?: string;
  footer?: string;
}

export interface ButtonData extends BaseData {}

export interface ItemData extends BaseData {
  formDisplay?: string;
}

export interface ImageFormatData {
  use?: string;
  type?: TreeType;
  couple?: string;
  color?: string;
  chalk?: string;
  gen?: string;
  style1?: string;
  background?: string;
  roots?: RootData;
  leaves?: boolean;
  default?: {
    type?: TreeType;
    couple?: string;
    color?: string;
    gen?: string;
    style1?: string;
  };
}

export interface RootData {
  type?: string;
  gen?: string;
}

export interface GroupData extends BaseData {
  group: {
    id: string;
    header?: string;
    images: OptionImageData[];
  };
}

export enum TreeType {
  ANCESTRY = 'ANCESTRY',
  DESCENDANT = 'DESCENDANT'
}

export interface ValueInformation {
  option: string;
  value: any[];
  cost: number;
}

export interface ShopPage {
  destroyMulti(): void;

  data: TreeArtPage;
}
