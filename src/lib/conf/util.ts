import type { BaseData, GroupData, OptionImageData } from '../../types/data';
import type {
  ImageOption,
  ButtonOption,
  ItemOption,
  TextOption
} from '../../types/options';

export const hasSummaryText = (opt: any): opt is BaseData => {
  return 'summaryText' in opt;
}

export const isBaseData = (opt: any): opt is BaseData => {
  return opt instanceof Object && ('summaryText' in opt || 'default' in opt || 'key' in opt);
};

export const isImageOption = (
  opt: ImageOption | ButtonOption | ItemOption | TextOption
): opt is ImageOption => {
  return 'images' in opt;
};

export const isGroupData = (
  img: OptionImageData | GroupData
): img is GroupData => {
  return 'group' in img;
};

export const isButtonOption = (
  opt: ImageOption | ButtonOption | ItemOption | TextOption
): opt is ButtonOption => {
  return 'buttons' in opt;
};

export const isItemOption = (
  opt: ImageOption | ButtonOption | ItemOption | TextOption
): opt is ItemOption => {
  return 'items' in opt;
};

export const isTextOption = (
  opt: ImageOption | ButtonOption | ItemOption | TextOption
): opt is TextOption => {
  return opt.type === 'text';
};

export const isTextLongOption = (
  opt: ImageOption | ButtonOption | ItemOption | TextOption
): opt is TextOption => {
  return opt.type === 'textLong';
};

export const isNumOption = (
  opt: ImageOption | ButtonOption | ItemOption | TextOption
): opt is TextOption => {
  return opt.type === 'number';
};
