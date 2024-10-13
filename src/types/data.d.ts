import { TreeType } from '$lib/conf/TreeArtConfig';

export interface BaseData {
  prereq?: Prereqs;
  key?: string;
  displayText?: string;
  cost?: number;
  summaryText?: string;
  default?: boolean;
  img?: ImageFormatData;
  placeholder?: string;
  values?: ValueInformation[];
  reset?: string[];
  onselect?: () => void;
  font?:
    | 'MType'
    | 'MType-Script'
    | 'Amaze'
    | 'Script'
    | 'Papyrus'
    | 'Papyrus8'
    | 'Papyrus9';
  position?: 'left' | 'right' | 'center';
  description?: string;
}

export interface OptionImageData extends BaseData {
  key: string;
  displayImage?: string;
  background?: string;
  footer?: string;
}

export interface ButtonData extends BaseData {
  key: string;
}

export interface ItemData extends BaseData {
  formDisplay?: string;
  key: string;
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

export interface Prereqs {
  option: string;
  value?: string[];
  not_value?: string[];
  and?: Prereqs;
  or?: Prereqs;
}

export interface ValueInformation {
  option: string | string[];
  value: string[];
  cost: number;
}
