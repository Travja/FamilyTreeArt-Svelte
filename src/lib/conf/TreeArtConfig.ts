import { meetsPrereqs } from '../interpreter';
import type {
  BaseOption,
  ButtonOption,
  ImageOption,
  ItemOption,
  TextOption
} from '../../types/options';
import type { MultiSelectData } from '$lib/multi-select';
import type { Prereqs } from '../../types/data';

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
export enum TreeType {
  ANCESTRY = 'ANCESTRY',
  DESCENDANT = 'DESCENDANT'
}

export interface TreeArtPageData {
  title: string;
  intro: string;
  footer?: string;
  prereq?: Prereqs;
  options: (ImageOption | ButtonOption | ItemOption | TextOption)[];
  finalPage?: boolean;
  multiselect?: MultiSelectData;
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
