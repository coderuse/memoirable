/// <reference path="../../typings/index.d.ts" />

export interface IStorageItem {
  key: string;
  value: any;
}

export class StorageItem {
  key: string;
  value: any;

  constructor(data: IStorageItem) {
    this.key = data.key;
    this.value = data.value;
  }
}

export class Utils {
  public static localStorageSupported =
  typeof window['localStorage'] !== "undefined" && window['localStorage'] !== null;

  // add value to storage
  public static add(key: string, item: string) {
    if (Utils.localStorageSupported) {
      localStorage.setItem(key, item);
    }
  }

  // get all values from storage (all items)
  public static getAllItems(): Array<StorageItem> {
    var list = new Array<StorageItem>();

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);

      list.push(new StorageItem({
        key: key,
        value: value
      }));
    }

    return list;
  }

  // get only all values from localStorage
  public static getAllValues(): Array<any> {
    var list = new Array<any>();

    if (Utils.localStorageSupported) {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);

        list.push(value);
      }
    }

    return list;
  }

  // get one item by key from storage
  public static get(key: string): string {
    if (Utils.localStorageSupported) {
      var item = localStorage.getItem(key);

      return item;
    } else {
      return null;
    }
  }

  // remove value from storage
  public static remove(key: string) {
    if (Utils.localStorageSupported) {
      localStorage.removeItem(key);
    }
  }

  // clear storage (remove all items from it)
  public static clear() {
    if (Utils.localStorageSupported) {
      localStorage.clear();
    }
  }

  public static getReferenceById(type: string, ref_id: number, references: Array<any>): any {
    var matchedReference = $.grep(references, function (reference) {
      return reference.type === type && reference.id == ref_id;
    });

    return matchedReference.length > 0 ? matchedReference[0] : {};
  }

  public static priceToUSDString(price: number): string {
    return '$' + price.toFixed(2);
  }

  public static tryParseNumber(str = '', radix = 10, defaultValue = 0): number {
    var retValue = defaultValue;
    if (str !== null) {
      if (typeof str === 'string' && str.length > 0) {
        try {
          retValue = parseInt(str, radix);
        } catch (e) {
          return defaultValue;
        }
        if (isNaN(retValue)) {
          return defaultValue;
        }
      }
      else if (typeof str === 'number') {
        return parseInt(str);
      }
    }
    return retValue;
  }

  public static formatReferences(refs: Array<any>): { [key: string]: { [id: string]: any } } {
    let formatted: { [key: string]: { [id: string]: any } } = {};

    for (var i = 0; i < refs.length; i++) {
      var ref = refs[i];
      var type = ref.type;
      if (typeof formatted[type] === 'undefined') {
        formatted[type] = {};
      }
      formatted[type][ref.id] = ref;
    }

    return formatted;
  }

  private static regexp = /(\[\[[a-z_]+:[0-9]+\]\])/g;
  public static formatMessage(msg: string, refs: { [key: string]: { [id: string]: any } }): { msg: string, relatedObj: any } {
    if (typeof msg !== 'string') {
      return { msg: '', relatedObj: {} };
    }
    let match: Array<any>, matches = {}, relatedObj: any;
    while (match = this.regexp.exec(msg)) {
      var matched = match[0];
      var indexOfDivider = matched.indexOf(':');
      var type = matched.substring(2, indexOfDivider);
      var id = matched.substring(indexOfDivider + 1, matched.length - 2);
      if (type === 'user') {
        relatedObj = refs[type][id];
      }
      matches[matched] = refs[type][id];
    }
    for (var i in matches) {
      if (matches.hasOwnProperty(i)) {
        msg = msg.replace(i, matches[i].full_name);
      }
    }

    return { msg: msg, relatedObj: relatedObj };
  }

}