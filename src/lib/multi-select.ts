export class MultiSelectData {
  display: string;
  id: string;
  keys: string[];
  quantifier: string;
  format: string;
  paypal: string;

  constructor(data: MultiSelectCreate) {
    this.display = data.display;
    this.id = data.id;
    this.keys = data.keys;
    this.quantifier = data.quantifier;
    this.format = data.format;
    this.paypal = data.paypal;
  }

  parseText = (data: any): string => {
    let final = this.format;
    for (const text of this.keys) {
      let obj = data[text];
      if (!obj) obj = '';
      if (typeof obj == 'number' || typeof obj == 'string')
        final = final.replace(`%${text}%`, obj + '');
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
    return this.getUnitPrice(data) * quant;
  };

  getUnitPrice = (data: any) => {
    let cost = 0;
    for (let val of Object.values<any>(data)) {
      if (typeof val == 'object' && 'values' in val) {
        for (const obj of val.values) {
          // TODO: Multi-select values aren't taken into account here, so
          //  shipping costs don't get updated properly when additional
          //  prints have a frame while the main print does not
          if (!obj.value.includes(data[obj.option].key)) continue;
          if ('cost' in obj && obj.cost) {
            cost += obj.cost;
          }
        }
      }
    }
    return cost;
  };

  formatPaypal = (data: any): string => {
    let str = this.paypal;
    for (let [key, val] of Object.entries<any>(data)) {
      const replaceVal = val.placeholder || val.displayText;
      str = str.replace(`%${key}%`, replaceVal);
    }

    return str;
  };
}

export interface MultiSelectCreate {
  display: string;
  id: string;
  keys: string[];
  quantifier: string;
  format: string;
  paypal: string;
}
