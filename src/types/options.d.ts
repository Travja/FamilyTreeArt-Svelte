import type {
  ButtonData,
  GroupData,
  ItemData,
  OptionImageData,
  Prereqs
} from './data';

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
  onupdate?: () => void;
}
