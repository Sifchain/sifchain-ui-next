var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// ../../node_modules/.pnpm/tsup@5.12.8_typescript@4.6.4/node_modules/tsup/assets/esm_shims.js
var init_esm_shims = __esm({
  "../../node_modules/.pnpm/tsup@5.12.8_typescript@4.6.4/node_modules/tsup/assets/esm_shims.js"() {
  }
});

// ../../node_modules/.pnpm/toformat@2.0.0/node_modules/toformat/toFormat.js
var require_toFormat = __commonJS({
  "../../node_modules/.pnpm/toformat@2.0.0/node_modules/toformat/toFormat.js"(exports, module) {
    init_esm_shims();
    function toFormat2(Ctor) {
      "use strict";
      Ctor.prototype.toFormat = function toFormat3(dp, rm, fmt) {
        if (!this.e && this.e !== 0)
          return this.toString();
        var arr, g1, g2, i, u, nd, intd, intp, fracp, dsep, gsep, gsize, sgsize, fgsep, fgsize, tfmt = this.format || {}, cfmt = this.constructor.format || {};
        if (dp != u) {
          if (typeof dp == "object") {
            fmt = dp;
            dp = u;
          } else if (rm != u) {
            if (typeof rm == "object") {
              fmt = rm;
              rm = u;
            } else if (typeof fmt != "object") {
              fmt = {};
            }
          } else {
            fmt = {};
          }
        } else {
          fmt = {};
        }
        arr = this.toFixed(dp, rm).split(".");
        intp = arr[0];
        fracp = arr[1];
        intd = this.s < 0 ? intp.slice(1) : intp;
        nd = intd.length;
        dsep = fmt.decimalSeparator;
        if (dsep == u) {
          dsep = tfmt.decimalSeparator;
          if (dsep == u) {
            dsep = cfmt.decimalSeparator;
            if (dsep == u)
              dsep = ".";
          }
        }
        gsep = fmt.groupSeparator;
        if (gsep == u) {
          gsep = tfmt.groupSeparator;
          if (gsep == u)
            gsep = cfmt.groupSeparator;
        }
        if (gsep) {
          gsize = fmt.groupSize;
          if (gsize == u) {
            gsize = tfmt.groupSize;
            if (gsize == u) {
              gsize = cfmt.groupSize;
              if (gsize == u)
                gsize = 0;
            }
          }
          sgsize = fmt.secondaryGroupSize;
          if (sgsize == u) {
            sgsize = tfmt.secondaryGroupSize;
            if (sgsize == u) {
              sgsize = cfmt.secondaryGroupSize;
              if (sgsize == u)
                sgsize = 0;
            }
          }
          if (sgsize) {
            g1 = +sgsize;
            g2 = +gsize;
            nd -= g2;
          } else {
            g1 = +gsize;
            g2 = +sgsize;
          }
          if (g1 > 0 && nd > 0) {
            i = nd % g1 || g1;
            intp = intd.substr(0, i);
            for (; i < nd; i += g1)
              intp += gsep + intd.substr(i, g1);
            if (g2 > 0)
              intp += gsep + intd.slice(i);
            if (this.s < 0)
              intp = "-" + intp;
          }
        }
        if (fracp) {
          fgsep = fmt.fractionGroupSeparator;
          if (fgsep == u) {
            fgsep = tfmt.fractionGroupSeparator;
            if (fgsep == u)
              fgsep = cfmt.fractionGroupSeparator;
          }
          if (fgsep) {
            fgsize = fmt.fractionGroupSize;
            if (fgsize == u) {
              fgsize = tfmt.fractionGroupSize;
              if (fgsize == u) {
                fgsize = cfmt.fractionGroupSize;
                if (fgsize == u)
                  fgsize = 0;
              }
            }
            fgsize = +fgsize;
            if (fgsize) {
              fracp = fracp.replace(new RegExp("\\d{" + fgsize + "}\\B", "g"), "$&" + fgsep);
            }
          }
          return intp + dsep + fracp;
        } else {
          return intp;
        }
      };
      Ctor.format = {
        decimalSeparator: ".",
        groupSeparator: ",",
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: "",
        fractionGroupSize: 0
      };
      return Ctor;
    }
    if (typeof module !== "undefined" && module.exports)
      module.exports = toFormat2;
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/currency.js
var require_currency = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/currency.js"(exports) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/bech32.js
var require_bech32 = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/bech32.js"(exports) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/bip44.js
var require_bip44 = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/bip44.js"(exports) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/chain-info.js
var require_chain_info = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/chain-info.js"(exports) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/wallet/keplr.js
var require_keplr = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/wallet/keplr.js"(exports) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/wallet/index.js
var require_wallet = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/wallet/index.js"(exports) {
    "use strict";
    init_esm_shims();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_keplr(), exports);
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/window.js
var require_window = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/window.js"(exports) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/index.js
var require_build = __commonJS({
  "../../node_modules/.pnpm/@keplr-wallet+types@0.10.3/node_modules/@keplr-wallet/types/build/index.js"(exports) {
    "use strict";
    init_esm_shims();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_currency(), exports);
    __exportStar(require_bech32(), exports);
    __exportStar(require_bip44(), exports);
    __exportStar(require_chain_info(), exports);
    __exportStar(require_wallet(), exports);
    __exportStar(require_window(), exports);
  }
});

// src/index.ts
init_esm_shims();

// src/entities/index.ts
init_esm_shims();

// src/entities/Address.ts
init_esm_shims();

// src/entities/Amount.ts
init_esm_shims();
import JSBI3 from "jsbi";
import Big2 from "big.js";

// src/entities/fraction/index.ts
init_esm_shims();

// src/entities/fraction/Fraction.ts
init_esm_shims();
var import_toformat = __toESM(require_toFormat());
import invariant from "tiny-invariant";
import JSBI from "jsbi";
import _Decimal from "decimal.js-light";
import _Big from "big.js";
var ZERO = JSBI.BigInt(0);
var ONE = JSBI.BigInt(1);
var TWO = JSBI.BigInt(2);
var THREE = JSBI.BigInt(3);
var FIVE = JSBI.BigInt(5);
var TEN = JSBI.BigInt(10);
var _100 = JSBI.BigInt(100);
var _997 = JSBI.BigInt(997);
var _1000 = JSBI.BigInt(1e3);
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI ? bigintIsh : typeof bigintIsh === "bigint" ? JSBI.BigInt(bigintIsh.toString()) : JSBI.BigInt(bigintIsh);
}
var Decimal = (0, import_toformat.default)(_Decimal);
var Big = (0, import_toformat.default)(_Big);
var toSignificantRounding = {
  [0 /* ROUND_DOWN */]: Decimal.ROUND_DOWN,
  [1 /* ROUND_HALF_UP */]: Decimal.ROUND_HALF_UP,
  [2 /* ROUND_UP */]: Decimal.ROUND_UP
};
var toFixedRounding = {
  [0 /* ROUND_DOWN */]: 0,
  [1 /* ROUND_HALF_UP */]: 1,
  [2 /* ROUND_UP */]: 3
};
function isFraction(value) {
  return value.quotient instanceof JSBI;
}
var ensureFraction = (other) => {
  return other instanceof Fraction || isFraction(other) ? other : new Fraction(parseBigintIsh(other));
};
var Fraction = class {
  numerator;
  denominator;
  constructor(numerator, denominator = ONE) {
    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  }
  get quotient() {
    return JSBI.divide(this.numerator, this.denominator);
  }
  get remainder() {
    return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
  }
  invert() {
    return new Fraction(this.denominator, this.numerator);
  }
  add(other) {
    const otherParsed = ensureFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }
    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  }
  subtract(other) {
    const otherParsed = ensureFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }
    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  }
  lessThan(other) {
    const otherParsed = ensureFraction(other);
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  }
  lessThanOrEqual(other) {
    return this.lessThan(other) || this.equalTo(other);
  }
  equalTo(other) {
    const otherParsed = ensureFraction(other);
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  }
  greaterThan(other) {
    const otherParsed = ensureFraction(other);
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  }
  greaterThanOrEqual(other) {
    return this.greaterThan(other) || this.equalTo(other);
  }
  multiply(other) {
    const otherParsed = ensureFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  }
  divide(other) {
    const otherParsed = ensureFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  }
  toSignificant(significantDigits, format2 = { groupSeparator: "" }, rounding = 1 /* ROUND_HALF_UP */) {
    invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
    invariant(significantDigits > 0, `${significantDigits} is not positive.`);
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    const quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format2);
  }
  toFixed(decimalPlaces, format2 = { groupSeparator: "" }, rounding = 1 /* ROUND_HALF_UP */) {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format2);
  }
};

// src/entities/AssetAmount.ts
init_esm_shims();

// src/entities/Asset.ts
init_esm_shims();

// src/entities/Network.ts
init_esm_shims();
var ACTIVE_NETWORKS = /* @__PURE__ */ new Set([
  "sifchain",
  "ethereum",
  "akash",
  "band",
  "cosmoshub",
  "crypto-org",
  "iris",
  "ixo",
  "juno",
  "likecoin",
  "osmosis",
  "persistence",
  "regen",
  "sentinel",
  "terra",
  "emoney",
  "evmos",
  "starname",
  "bitsong",
  "cerberus",
  "comdex",
  "chihuahua",
  "ki",
  "stargaze",
  "secret"
]);

// src/entities/Asset.ts
var ASSET_MAP_STORAGE_KEY = "@@assetMap";
function isAsset(value) {
  return typeof value?.symbol === "string" && typeof value?.decimals === "number";
}
function _Asset(assetOrSymbol) {
  const rawMapString = sessionStorage.getItem(ASSET_MAP_STORAGE_KEY);
  const assetMap = JSON.parse(rawMapString ?? JSON.stringify({}));
  if (isAsset(assetOrSymbol)) {
    const key = assetOrSymbol.symbol.toLowerCase();
    if (key in assetMap && key === "rowan") {
      return assetOrSymbol;
    }
    assetMap[key] = {
      ...assetOrSymbol,
      displaySymbol: assetOrSymbol.displaySymbol || assetOrSymbol.symbol
    };
    sessionStorage.setItem(ASSET_MAP_STORAGE_KEY, JSON.stringify(assetMap));
    return assetOrSymbol;
  }
  const found = assetOrSymbol ? assetMap[assetOrSymbol.toLowerCase()] : false;
  if (!found) {
    throw new Error(`Attempt to retrieve the asset with key "${assetOrSymbol}" before it had been cached.`);
  }
  return found;
}
var Asset = Object.assign(_Asset, {
  set: (symbol, asset) => {
    Asset(asset);
  },
  get: (symbol) => {
    return Asset(symbol);
  }
});

// src/utils/decimalShift.ts
init_esm_shims();

// src/utils/format.ts
init_esm_shims();
import numbro from "numbro";
function isAsset2(val) {
  return !!val && typeof val?.symbol === "string";
}
function getMantissaFromDynamicMantissa(amount, hash) {
  const { infinity, ...numHash } = hash;
  const entries = Object.entries(numHash);
  entries.sort(([a], [b]) => {
    if (a > b)
      return 1;
    return -1;
  });
  for (const entry of entries) {
    const [range, mantissa] = entry;
    if (amount.lessThan(range)) {
      return mantissa;
    }
  }
  if (amount.lessThan("10000")) {
    return 2;
  }
  return infinity;
}
function round(decimal, places) {
  return decimalShift(Amount(decimal).multiply(Amount(decimalShift("1", places))).toBigInt().toString(), -1 * places);
}
function isDynamicMantissa(value) {
  return typeof value !== "number";
}
function isOptionsWithFixedMantissa(options) {
  return options.shorthand || !isDynamicMantissa(options["mantissa"]);
}
function convertDynamicMantissaToFixedMantissa(amount, options) {
  if (!isOptionsWithFixedMantissa(options) && typeof options.mantissa === "object") {
    return {
      ...options,
      mantissa: getMantissaFromDynamicMantissa(amount, options.mantissa)
    };
  }
  return options;
}
function formatAssetAmount(value) {
  if (!value || value.equalTo("0"))
    return "0";
  const { amount, asset } = value;
  return amount.greaterThan(toBaseUnits("100000", asset)) ? format(amount, asset, { mantissa: 2 }) : format(amount, asset, { mantissa: 6 });
}
function format(_amount, _asset, _options) {
  const amount = _amount;
  const _optionsWithDynamicMantissa = (isAsset2(_asset) ? _options : _asset) || {};
  const asset = isAsset2(_asset) ? _asset : void 0;
  const options = convertDynamicMantissaToFixedMantissa(amount, _optionsWithDynamicMantissa);
  if (typeof amount === "string") {
    throw new Error("Amount can only take an IAmount and must NOT be a string. If you have a string and need to format it you should first convert it to an IAmount. Eg. format(Amount('100'), myformat)");
  }
  if (!amount) {
    console.error(`Amount "${amount}" supplied to format function is falsey`);
    return "";
  }
  let decimal = asset ? decimalShift(amount.toBigInt().toString(), -1 * asset.decimals) : amount.toString();
  let postfix = options.prefix ?? "";
  let prefix = options.postfix ?? "";
  let space = "";
  if (options.zeroFormat && amount.equalTo("0")) {
    return options.zeroFormat;
  }
  if (options.shorthand) {
    return numbro(decimal).format(createNumbroConfig(options));
  }
  if (options.space) {
    space = " ";
  }
  if (options.mode === "percent") {
    decimal = decimalShift(decimal, 2);
    postfix = "%";
  }
  if (typeof options["mantissa"] === "number") {
    decimal = applyMantissa(decimal, options["mantissa"]);
  }
  if (options["trimMantissa"]) {
    decimal = trimMantissa(decimal, options["trimMantissa"] === "integer");
  }
  if (options.separator) {
    decimal = applySeparator(decimal);
  }
  return `${prefix}${decimal}${space}${postfix}`;
}
function trimMantissa(decimal, integer = false) {
  return decimal.replace(/(0+)$/, "").replace(/\.$/, integer ? "" : ".0");
}
function applySeparator(decimal) {
  const parts = decimal.split(".");
  return new Intl.NumberFormat("en-us", {
    maximumFractionDigits: parts.length < 2 ? 0 : String(parts[1]).length
  }).format(+decimal);
}
function applyMantissa(decimal, mantissa) {
  return round(decimal, mantissa);
}
function isShorthandWithTotalLength(val) {
  return val?.shorthand && val?.totalLength;
}
function createNumbroConfig(options) {
  return {
    forceSign: options.forceSign ?? false,
    output: options.mode ?? "number",
    thousandSeparated: options.separator ?? false,
    spaceSeparated: options.space ?? false,
    prefix: options.prefix ?? "",
    postfix: options.postfix ?? "",
    ...isShorthandWithTotalLength(options) ? {
      average: options.shorthand ?? false,
      totalLength: options.totalLength
    } : {
      average: options.shorthand ?? false,
      mantissa: options.mantissa ?? 0,
      trimMantissa: !!options.trimMantissa
    }
  };
}

// src/utils/decimalShift.ts
function decimalShift(decimal, shift) {
  if (!decimal.match(/^[+-]?(\d+)?\.?\d+$/)) {
    throw new Error(`Cannot recognise number format: ${decimal}`);
  }
  const [, sign = "", unsignedDecimal = decimal] = decimal.match(/^([+-]?)(.+)$/) || [];
  const [origCharacter, origMantissa] = unsignedDecimal.split(".");
  const dotIndex = String(origCharacter).length;
  const targetIndex = dotIndex + shift;
  const significand = [origCharacter, origMantissa].join("");
  const character = targetIndex >= 0 ? significand.slice(0, targetIndex).padEnd(targetIndex, "0").replace(/^0+/, "") || "0" : "0";
  const mantissa = targetIndex >= 0 ? significand.slice(targetIndex) : significand.padStart(Math.abs(targetIndex) + significand.length, "0");
  return `${sign}${[character, mantissa].filter(Boolean).join(".")}`;
}
function toBaseUnits(decimal, asset) {
  return decimalShift(decimal, asset.decimals);
}
function fromBaseUnits(integer, asset) {
  return decimalShift(integer, -1 * asset.decimals);
}
function floorDecimal(decimal) {
  return String(decimal.split(".")[0]);
}
function getMantissaLength(amount) {
  const number = format(amount, { mantissa: 18, trimMantissa: true });
  return number.length - number.indexOf(".") - 1;
}
function humanUnitsToAssetAmount(asset, amount) {
  return AssetAmount(asset, toBaseUnits(String(amount), asset));
}

// src/entities/AssetAmount.ts
import "jsbi";
function AssetAmount(asset, amount) {
  const _asset = asset?.asset || Asset(asset);
  const _amount = amount?.amount || Amount(amount);
  const instance = {
    get homeNetwork() {
      return _asset.homeNetwork;
    },
    get displaySymbol() {
      return _asset.displaySymbol;
    },
    get asset() {
      return _asset;
    },
    get amount() {
      return _amount;
    },
    get address() {
      return _asset.address;
    },
    get decimals() {
      return _asset.decimals;
    },
    get imageUrl() {
      return _asset.imageUrl;
    },
    get name() {
      return _asset.name;
    },
    get network() {
      return _asset.network;
    },
    get symbol() {
      return _asset.symbol;
    },
    get label() {
      return _asset.label;
    },
    toDerived() {
      return _amount.multiply(fromBaseUnits("1", _asset));
    },
    toBigInt() {
      return _amount.toBigInt();
    },
    toString() {
      return `${_amount.toString(false)} ${_asset.symbol.toUpperCase()}`;
    },
    toNumber() {
      return _amount.toNumber();
    },
    add(other) {
      return _amount.add(other);
    },
    divide(other) {
      return _amount.divide(other);
    },
    equalTo(other) {
      return _amount.equalTo(other);
    },
    greaterThan(other) {
      return _amount.greaterThan(other);
    },
    greaterThanOrEqual(other) {
      return _amount.greaterThanOrEqual(other);
    },
    lessThan(other) {
      return _amount.lessThan(other);
    },
    lessThanOrEqual(other) {
      return _amount.lessThanOrEqual(other);
    },
    multiply(other) {
      return _amount.multiply(other);
    },
    sqrt() {
      return _amount.sqrt();
    },
    subtract(other) {
      return _amount.subtract(other);
    },
    _toInternal() {
      return _amount._toInternal();
    },
    _fromInternal(internal) {
      return _amount._fromInternal(internal);
    }
  };
  return instance;
}
function isAssetAmount(value) {
  return value?.asset && value?.amount;
}

// src/entities/Amount.ts
function Amount(source) {
  if (typeof source === "number") {
    return Amount(source.toString());
  }
  if (typeof source === "string" && /^[+-]?(\d+)?\.\d+$/.test(source)) {
    return getAmountFromDecimal(source);
  }
  if (typeof source === "string" && !/^[+-]?\d+$/.test(source)) {
    throw new Error(`Amount input error! string "${source}" is not numeric`);
  }
  if (!source) {
    throw new Error(`Amount input cannot be falsey given <${source}>`);
  }
  if (!(source instanceof JSBI3) && typeof source !== "bigint" && typeof source !== "string") {
    if (isAssetAmount(source)) {
      return source.amount;
    }
    return source;
  }
  let fraction = new Fraction(source);
  const instance = {
    toBigInt() {
      return getQuotientWithBankersRounding(fraction);
    },
    toString(detailed = true) {
      return fraction.toFixed(detailed ? 18 : 0);
    },
    toNumber() {
      return +this.toString();
    },
    add(other) {
      return toAmount(fraction.add(toFraction(other)));
    },
    divide(other) {
      return toAmount(fraction.divide(toFraction(other)));
    },
    equalTo(other) {
      return fraction.equalTo(toFraction(other));
    },
    greaterThan(other) {
      return fraction.greaterThan(toFraction(other));
    },
    greaterThanOrEqual(other) {
      return fraction.greaterThanOrEqual(toFraction(other));
    },
    lessThan(other) {
      return fraction.lessThan(toFraction(other));
    },
    lessThanOrEqual(other) {
      return fraction.lessThanOrEqual(toFraction(other));
    },
    multiply(other) {
      return toAmount(fraction.multiply(toFraction(other)));
    },
    subtract(other) {
      return toAmount(fraction.subtract(toFraction(other)));
    },
    sqrt() {
      const big = toBig(fraction);
      const string = toFraction(big.sqrt().times("100000000000000000000000").toFixed(0));
      return Amount(string).divide("100000000000000000000000");
    },
    _fromInternal(_fraction) {
      fraction = _fraction;
      return instance;
    },
    _toInternal() {
      return fraction;
    }
  };
  return instance;
}
function isAmount(a) {
  if (!a)
    return false;
  return a && typeof a._fromInternal === "function" && typeof a._toInternal === "function" && typeof a.toBigInt === "function";
}
function getQuotientWithBankersRounding(fraction) {
  const a = fraction.numerator;
  const b = fraction.denominator;
  const aAbs = JSBI3.greaterThan(a, JSBI3.BigInt("0")) ? a : JSBI3.multiply(JSBI3.BigInt("-1"), a);
  const bAbs = JSBI3.greaterThan(b, JSBI3.BigInt("0")) ? b : JSBI3.multiply(JSBI3.BigInt("-1"), b);
  let result = JSBI3.divide(aAbs, bAbs);
  const rem = JSBI3.remainder(aAbs, bAbs);
  if (JSBI3.greaterThan(JSBI3.multiply(rem, JSBI3.BigInt("2")), bAbs)) {
    result = JSBI3.add(result, JSBI3.BigInt("1"));
  } else if (JSBI3.equal(JSBI3.multiply(rem, JSBI3.BigInt("2")), bAbs)) {
    if (JSBI3.equal(JSBI3.remainder(result, JSBI3.BigInt("2")), JSBI3.BigInt("1"))) {
      result = JSBI3.add(result, JSBI3.BigInt("1"));
    }
  }
  if (JSBI3.greaterThan(a, JSBI3.BigInt("0")) !== JSBI3.greaterThan(b, JSBI3.BigInt("0"))) {
    return JSBI3.multiply(JSBI3.BigInt("-1"), result);
  } else {
    return result;
  }
}
function getAmountFromDecimal(decimal) {
  return Amount(floorDecimal(decimalShift(decimal, 18))).divide("1000000000000000000");
}
function toFraction(a) {
  if (typeof a === "number") {
    return toFraction(a.toString());
  }
  if (typeof a === "string") {
    return a.indexOf(".") < 0 ? a : Amount(a)._toInternal();
  }
  return a._toInternal();
}
function toBig(fraction) {
  return Big2(fraction.toFixed(24));
}
function toAmount(a) {
  return Amount("0")._fromInternal(a);
}

// src/entities/Chain.ts
init_esm_shims();
var import_types = __toESM(require_build());

// src/entities/LiquidityProvider.ts
init_esm_shims();
var LiquidityProvider = class {
  asset;
  units;
  address;
  nativeAmount;
  externalAmount;
  constructor(asset, units, address, nativeAmount, externalAmount) {
    this.asset = asset;
    this.units = units;
    this.address = address;
    this.nativeAmount = nativeAmount;
    this.externalAmount = externalAmount;
  }
};

// src/entities/Pair.ts
init_esm_shims();
var Pair = class {
  constructor(nativeAsset5, externalAsset) {
    this.nativeAsset = nativeAsset5;
    this.externalAsset = externalAsset;
    this.amounts = [nativeAsset5, externalAsset];
  }
  amounts;
  otherAsset(asset) {
    const otherAsset = this.amounts.find((amount) => amount.symbol !== asset.symbol);
    if (!otherAsset) {
      throw new Error("Asset doesnt exist in pair");
    }
    return otherAsset;
  }
  symbol() {
    return createPoolKey(this.externalAsset, this.nativeAsset);
  }
  contains(...assets8) {
    const local = this.amounts.map((a) => a.symbol);
    const other = assets8.map((a) => a.symbol);
    return !!local.find((s) => other.includes(s));
  }
  getAmount(asset) {
    const assetSymbol = typeof asset === "string" ? asset : asset.symbol;
    const found = this.amounts.find((amount) => {
      return amount.symbol === assetSymbol;
    });
    if (!found)
      throw new Error(`Asset ${assetSymbol} doesnt exist in pair`);
    return found;
  }
  toString() {
    return this.amounts.map((a) => a.toString()).join(" | ");
  }
};

// src/entities/Pool.ts
init_esm_shims();

// src/entities/formulae.ts
init_esm_shims();
function slipAdjustment(r, a, R, A) {
  const slipAdjDenominator = r.add(R).multiply(a.add(A));
  let slipAdjustmentReciprocal;
  if (R.multiply(a).greaterThan(r.multiply(A))) {
    slipAdjustmentReciprocal = R.multiply(a).subtract(r.multiply(A)).divide(slipAdjDenominator);
  } else {
    slipAdjustmentReciprocal = r.multiply(A).subtract(R.multiply(a)).divide(slipAdjDenominator);
  }
  return Amount("1").subtract(slipAdjustmentReciprocal);
}
function calculatePoolUnits(r, a, R, A, P) {
  if (A.equalTo("0") || R.equalTo("0") || P.equalTo("0")) {
    return r;
  }
  if (a.equalTo("0") && r.equalTo("0")) {
    return Amount("0");
  }
  const slipAdjustmentCalc = slipAdjustment(r, a, R, A);
  const numerator = P.multiply(a.multiply(R).add(A.multiply(r)));
  const denominator = Amount("2").multiply(A).multiply(R);
  return numerator.divide(denominator).multiply(slipAdjustmentCalc);
}
var TEN_THOUSAND = Amount("10000");
function calculateSwapResult(x, X, Y) {
  if (x.equalTo("0") || X.equalTo("0") || Y.equalTo("0")) {
    return Amount("0");
  }
  const xPlusX = x.add(X);
  return x.multiply(X).multiply(Y).divide(xPlusX.multiply(xPlusX));
}
function calculateReverseSwapResult(S, X, Y) {
  if (S.equalTo("0") || X.equalTo("0") || S.multiply(Amount("4")).greaterThan(Y)) {
    return Amount("0");
  }
  const term1 = Amount("-2").multiply(X).multiply(S);
  const term2 = X.multiply(Y);
  const underRoot = Y.multiply(Y.subtract(S.multiply(Amount("4"))));
  const term3 = X.multiply(underRoot.sqrt());
  const numerator = term1.add(term2).subtract(term3);
  const denominator = S.multiply(Amount("2"));
  const x = numerator.divide(denominator);
  return x.greaterThanOrEqual(Amount("0")) ? x : Amount("0");
}
function calculateProviderFee(x, X, Y) {
  if (x.equalTo("0") || X.equalTo("0") || Y.equalTo("0")) {
    return Amount("0");
  }
  const xPlusX = x.add(X);
  return x.multiply(x).multiply(Y).divide(xPlusX.multiply(xPlusX));
}
function calculatePriceImpact(x, X) {
  if (x.equalTo("0")) {
    return Amount("0");
  }
  const denominator = x.add(X);
  return x.divide(denominator);
}

// src/entities/Pool.ts
function getNormalizedSwapPrice(swapAsset, pool) {
  if (!pool.swapPrices) {
    throw new Error("Pool is missing 'swapPrices'");
  }
  const otherAsset = pool.otherAsset(swapAsset);
  const decimalsDelta = swapAsset.decimals - otherAsset.decimals;
  const decimalAdjust = Math.pow(10, Math.abs(decimalsDelta));
  return swapAsset.symbol === "rowan" ? pool.swapPrices.native.divide(decimalAdjust) : pool.swapPrices.external.multiply(decimalAdjust);
}
function calculateSwapResultPmtp(inputAmount, pool) {
  if (!pool.swapPrices) {
    throw new Error("Pool.swapPrices is required for PMTP swaps");
  }
  const swapPrice = getNormalizedSwapPrice(inputAmount.asset, pool);
  return inputAmount.multiply(swapPrice);
}
var Pool = class extends Pair {
  poolUnits;
  swapPrices;
  constructor(a, b, poolUnits, swapPrices) {
    super(a, b);
    this.swapPrices = swapPrices;
    this.poolUnits = poolUnits || calculatePoolUnits(Amount(a), Amount(b), Amount("0"), Amount("0"), Amount("0"));
  }
  get nativeSwapPrice() {
    return this.swapPrices?.native;
  }
  get externalSwapPrice() {
    return this.swapPrices?.external;
  }
  get externalAmount() {
    return this.amounts.find((amount) => amount.symbol !== "rowan");
  }
  get nativeAmount() {
    return this.amounts.find((amount) => amount.symbol === "rowan");
  }
  calcProviderFee(x) {
    const X = this.amounts.find((a) => a.symbol === x.symbol);
    if (!X) {
      throw new Error(`Sent amount with symbol ${x.symbol} does not exist in this pair: ${this.toString()}`);
    }
    const Y = this.amounts.find((a) => a.symbol !== x.symbol);
    if (!Y)
      throw new Error("Pool does not have an opposite asset.");
    const providerFee = calculateProviderFee(x, X, Y);
    return AssetAmount(this.otherAsset(x), providerFee);
  }
  calcPriceImpact(x) {
    const X = this.amounts.find((a) => a.symbol === x.symbol);
    if (!X) {
      throw new Error(`Sent amount with symbol ${x.symbol} does not exist in this pair: ${this.toString()}`);
    }
    return calculatePriceImpact(x, X).multiply("100");
  }
  calcSwapResult(x) {
    const X = this.amounts.find((a) => a.symbol === x.symbol);
    if (!X) {
      throw new Error(`Sent amount with symbol ${x.symbol} does not exist in this pair: ${this.toString()}`);
    }
    const Y = this.amounts.find((a) => a.symbol !== x.symbol);
    if (!Y) {
      throw new Error("Pool does not have an opposite asset.");
    }
    const fromRowan = x.symbol === "rowan";
    const toRowan = Y.symbol === "rowan";
    const swapResult = (fromRowan || toRowan) && this.swapPrices ? calculateSwapResultPmtp(x, this) : calculateSwapResult(x, X, Y);
    return AssetAmount(this.otherAsset(x), swapResult);
  }
  calcReverseSwapResult(Sa) {
    const Ya = this.amounts.find((a) => a.symbol === Sa.symbol);
    if (!Ya) {
      throw new Error(`Sent amount with symbol ${Sa.symbol} does not exist in this pair: ${this.toString()}`);
    }
    const Xa = this.amounts.find((a) => a.symbol !== Sa.symbol);
    if (!Xa) {
      throw new Error("Pool does not have an opposite asset.");
    }
    const otherAsset = this.otherAsset(Sa);
    if (Sa.equalTo("0")) {
      return AssetAmount(otherAsset, "0");
    }
    const fromRowan = Sa.symbol === "rowan";
    const toRowan = Xa.symbol === "rowan";
    const reverseSwapResult = (fromRowan || toRowan) && this.swapPrices ? calculateSwapResultPmtp(Sa, this) : calculateReverseSwapResult(Sa, Xa, Ya);
    return AssetAmount(otherAsset, reverseSwapResult);
  }
  calculatePoolUnits(nativeAssetAmount, externalAssetAmount) {
    const [nativeBalanceBefore, externalBalanceBefore] = this.amounts;
    const lpUnits = calculatePoolUnits(nativeAssetAmount, externalAssetAmount, nativeBalanceBefore, externalBalanceBefore, this.poolUnits);
    const newTotalPoolUnits = lpUnits.add(this.poolUnits);
    return [newTotalPoolUnits, lpUnits];
  }
};
function CompositePool(pair1, pair2) {
  const pair1Assets = pair1.amounts.map((a) => a.symbol);
  const pair2Assets = pair2.amounts.map((a) => a.symbol);
  const nativeSymbol = pair1Assets.find((value) => pair2Assets.includes(value));
  if (!nativeSymbol) {
    throw new Error("Cannot create composite pair because pairs do not share a common symbol");
  }
  const amounts = [
    ...pair1.amounts.filter((a) => a.symbol !== nativeSymbol),
    ...pair2.amounts.filter((a) => a.symbol !== nativeSymbol)
  ];
  if (amounts.length !== 2) {
    throw new Error("Cannot create composite pair because pairs do not share a common symbol");
  }
  return {
    amounts,
    get externalAmount() {
      return amounts[0];
    },
    get nativeAmount() {
      return amounts[1];
    },
    get nativeSwapPrice() {
      return pair1.nativeSwapPrice || pair2.nativeSwapPrice;
    },
    get externalSwapPrice() {
      return pair1.externalSwapPrice || pair2.externalSwapPrice;
    },
    getAmount: (asset) => {
      if (Asset(asset).symbol === nativeSymbol) {
        throw new Error(`Asset ${nativeSymbol} doesnt exist in pair`);
      }
      try {
        return pair1.getAmount(asset);
      } catch (err) {
      }
      return pair2.getAmount(asset);
    },
    otherAsset(asset) {
      const otherAsset = amounts.find((amount) => amount.symbol !== asset.symbol);
      if (!otherAsset) {
        throw new Error("Asset doesnt exist in pair");
      }
      return otherAsset;
    },
    symbol() {
      return amounts.map((a) => a.symbol).sort().join("_");
    },
    contains(...assets8) {
      const local = amounts.map((a) => a.symbol).sort();
      const other = assets8.map((a) => a.symbol).sort();
      return !!local.find((s) => other.includes(s));
    },
    calcProviderFee(x) {
      const [first, second] = pair1.contains(x) ? [pair1, pair2] : [pair2, pair1];
      const firstSwapFee = first.calcProviderFee(x);
      const firstSwapOutput = first.calcSwapResult(x);
      const secondSwapFee = second.calcProviderFee(firstSwapOutput);
      const firstSwapFeeInOutputAsset = second.calcSwapResult(firstSwapFee);
      return AssetAmount(second.otherAsset(firstSwapFee), firstSwapFeeInOutputAsset.add(secondSwapFee));
    },
    calcPriceImpact(x) {
      const [first, second] = pair1.contains(x) ? [pair1, pair2] : [pair2, pair1];
      const firstPoolImpact = first.calcPriceImpact(x);
      const r = first.calcSwapResult(x);
      const secondPoolImpact = second.calcPriceImpact(r);
      return firstPoolImpact.add(secondPoolImpact);
    },
    calcSwapResult(x) {
      const [first, second] = pair1.contains(x) ? [pair1, pair2] : [pair2, pair1];
      const nativeAmount = first.calcSwapResult(x);
      return second.calcSwapResult(nativeAmount);
    },
    calcReverseSwapResult(S) {
      const [first, second] = pair1.contains(S) ? [pair1, pair2] : [pair2, pair1];
      const nativeAmount = first.calcReverseSwapResult(S);
      return second.calcReverseSwapResult(nativeAmount);
    },
    toString() {
      return amounts.map((a) => a.toString()).join(" | ");
    }
  };
}

// src/entities/Transaction.ts
init_esm_shims();
import { DeliverTxResponse } from "@cosmjs/stargate";

// src/entities/Wallet.ts
init_esm_shims();
var WalletType = /* @__PURE__ */ ((WalletType2) => {
  WalletType2["KEPLR"] = "keplr";
  WalletType2["METAMASK"] = "metamask";
  return WalletType2;
})(WalletType || {});

// src/entities/Errors.ts
init_esm_shims();
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2[ErrorCode2["TX_FAILED_SLIPPAGE"] = 0] = "TX_FAILED_SLIPPAGE";
  ErrorCode2[ErrorCode2["TX_FAILED"] = 1] = "TX_FAILED";
  ErrorCode2[ErrorCode2["USER_REJECTED"] = 2] = "USER_REJECTED";
  ErrorCode2[ErrorCode2["UNKNOWN_FAILURE"] = 3] = "UNKNOWN_FAILURE";
  ErrorCode2[ErrorCode2["INSUFFICIENT_FUNDS"] = 4] = "INSUFFICIENT_FUNDS";
  ErrorCode2[ErrorCode2["TX_FAILED_OUT_OF_GAS"] = 5] = "TX_FAILED_OUT_OF_GAS";
  ErrorCode2[ErrorCode2["TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS"] = 6] = "TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS";
  ErrorCode2[ErrorCode2["TX_FAILED_USER_NOT_ENOUGH_BALANCE"] = 7] = "TX_FAILED_USER_NOT_ENOUGH_BALANCE";
  return ErrorCode2;
})(ErrorCode || {});
var ErrorMessages = {
  [0 /* TX_FAILED_SLIPPAGE */]: "Your transaction has failed - Received amount is below expected",
  [1 /* TX_FAILED */]: "Your transaction has failed",
  [2 /* USER_REJECTED */]: "You have rejected the transaction",
  [3 /* UNKNOWN_FAILURE */]: "There was an unknown failure",
  [4 /* INSUFFICIENT_FUNDS */]: "You have insufficient funds",
  [7 /* TX_FAILED_USER_NOT_ENOUGH_BALANCE */]: "Not have enough balance",
  [6 /* TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS */]: "Not enough ROWAN to cover the gas fees",
  [5 /* TX_FAILED_OUT_OF_GAS */]: "Your transaction has failed - Out of gas"
};
function getErrorMessage(code) {
  return ErrorMessages[code];
}

// src/utils/index.ts
init_esm_shims();

// src/utils/pool.ts
init_esm_shims();
function createPoolKey(a, b) {
  if (typeof a === "string")
    a = Asset.get(a);
  if (typeof b === "string")
    b = Asset.get(b);
  return [a, b].map((asset) => asset.symbol.toLowerCase()).sort().join("_");
}

// src/config/getConfig.ts
init_esm_shims();

// src/config/networks/sifchain/config.localnet.json
var sifAddrPrefix = "sif";
var sifChainId = "localnet";
var sifApiUrl = "http://localhost:3000/api/sifchain-local/rest";
var sifRpcUrl = "http://localhost:3000/api/sifchain-local/rpc";
var web3Provider = "metamask";
var nativeAsset = "rowan";
var cryptoeconomicsUrl = "http://localhost:3000/api";
var blockExplorerUrl = "https://blockexplorer.sifchain.finance";
var bridgebankContractAddress = "0x30753E4A8aad7F8597332E813735Def5dD395028";
var keplrChainConfig = {
  chainName: "Sifchain Local",
  chainId: "localnet",
  rpc: "http://localhost:3000/api/sifchain-local/rpc",
  rest: "http://localhost:3000/api/sifchain-local/rest",
  stakeCurrency: {
    coinDenom: "ROWAN",
    coinMinimalDenom: "rowan",
    coinDecimals: 18
  },
  bip44: {
    coinType: 118
  },
  bech32Config: {
    bech32PrefixAccAddr: "sif",
    bech32PrefixAccPub: "sifpub",
    bech32PrefixValAddr: "sifvaloper",
    bech32PrefixValPub: "sifvaloperpub",
    bech32PrefixConsAddr: "sifvalcons",
    bech32PrefixConsPub: "sifvalconspub"
  },
  currencies: [],
  feeCurrencies: [
    {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    }
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0.5,
    average: 0.65,
    high: 0.8
  }
};
var chains = [
  {
    id: "sifchain",
    displayName: "Sifchain",
    blockExplorerUrl: "https://blockexplorer-devnet.sifchain.finance",
    nativeAssetSymbol: "rowan"
  },
  {
    id: "ethereum",
    displayName: "Ethereum",
    blockExplorerUrl: "https://ropsten.etherscan.io",
    nativeAssetSymbol: "eth"
  },
  {
    id: "cosmoshub",
    displayName: "Cosmoshub",
    blockExplorerUrl: "https://mintscan.io/cosmos",
    nativeAssetSymbol: "uphoton"
  },
  {
    id: "iris",
    displayName: "Iris",
    blockExplorerUrl: "https://nyancat.iobscan.io/",
    nativeAssetSymbol: "nyan"
  }
];
var config_localnet_default = {
  sifAddrPrefix,
  sifChainId,
  sifApiUrl,
  sifRpcUrl,
  web3Provider,
  nativeAsset,
  cryptoeconomicsUrl,
  blockExplorerUrl,
  bridgebankContractAddress,
  keplrChainConfig,
  chains
};

// src/config/networks/sifchain/config.devnet.json
var sifAddrPrefix2 = "sif";
var sifApiUrl2 = "https://api-devnet.sifchain.finance";
var sifRpcUrl2 = "https://rpc-devnet.sifchain.finance";
var sifChainId2 = "sifchain-devnet-1";
var web3Provider2 = "metamask";
var web3Provider__option2 = "https://ropsten.infura.io/v3/f2e434009a9c4db8bfbd1b03ef572170";
var nativeAsset2 = "rowan";
var blockExplorerUrl2 = "https://blockexplorer-devnet.sifchain.finance";
var cryptoeconomicsUrl2 = "https://api-cryptoeconomics.sifchain.finance/api";
var bridgebankContractAddress2 = "0x96DC6f02C66Bbf2dfbA934b8DafE7B2c08715A73";
var keplrChainConfig2 = {
  chainName: "Sifchain Devnet",
  chainId: "sifchain-devnet-1",
  rpc: "https://rpc-devnet.sifchain.finance",
  rest: "https://api-devnet.sifchain.finance",
  stakeCurrency: {
    coinDenom: "ROWAN",
    coinMinimalDenom: "rowan",
    coinDecimals: 18
  },
  bip44: {
    coinType: 118
  },
  bech32Config: {
    bech32PrefixAccAddr: "sif",
    bech32PrefixAccPub: "sifpub",
    bech32PrefixValAddr: "sifvaloper",
    bech32PrefixValPub: "sifvaloperpub",
    bech32PrefixConsAddr: "sifvalcons",
    bech32PrefixConsPub: "sifvalconspub"
  },
  currencies: [
    {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    }
  ],
  feeCurrencies: [
    {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    }
  ],
  coinType: 118,
  gasPriceStep: {
    low: 5e12,
    average: 65e11,
    high: 8e12
  }
};
var config_devnet_default = {
  sifAddrPrefix: sifAddrPrefix2,
  sifApiUrl: sifApiUrl2,
  sifRpcUrl: sifRpcUrl2,
  sifChainId: sifChainId2,
  web3Provider: web3Provider2,
  "web3Provider--option2": web3Provider__option2,
  nativeAsset: nativeAsset2,
  blockExplorerUrl: blockExplorerUrl2,
  cryptoeconomicsUrl: cryptoeconomicsUrl2,
  bridgebankContractAddress: bridgebankContractAddress2,
  keplrChainConfig: keplrChainConfig2
};

// src/config/networks/sifchain/config.testnet.json
var sifAddrPrefix3 = "sif";
var sifApiUrl3 = "https://api-testnet.sifchain.finance";
var sifRpcUrl3 = "https://rpc-testnet.sifchain.finance";
var sifChainId3 = "sifchain-testnet-1";
var web3Provider3 = "metamask";
var nativeAsset3 = "rowan";
var blockExplorerUrl3 = "https://blockexplorer-testnet.sifchain.finance";
var cryptoeconomicsUrl3 = "https://api-cryptoeconomics.sifchain.finance/api";
var bridgebankContractAddress3 = "0x6CfD69783E3fFb44CBaaFF7F509a4fcF0d8e2835";
var keplrChainConfig3 = {
  chainName: "Sifchain Testnet",
  chainId: "sifchain-testnet-1",
  rpc: "https://rpc-testnet.sifchain.finance",
  rest: "https://api-testnet.sifchain.finance",
  stakeCurrency: {
    coinDenom: "ROWAN",
    coinMinimalDenom: "rowan",
    coinDecimals: 18
  },
  bip44: {
    coinType: 118
  },
  bech32Config: {
    bech32PrefixAccAddr: "sif",
    bech32PrefixAccPub: "sifpub",
    bech32PrefixValAddr: "sifvaloper",
    bech32PrefixValPub: "sifvaloperpub",
    bech32PrefixConsAddr: "sifvalcons",
    bech32PrefixConsPub: "sifvalconspub"
  },
  currencies: [
    {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    }
  ],
  feeCurrencies: [
    {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    }
  ],
  coinType: 118,
  gasPriceStep: {
    low: 5e12,
    average: 65e11,
    high: 8e12
  },
  features: ["stargate", "ibc-transfer"]
};
var config_testnet_default = {
  sifAddrPrefix: sifAddrPrefix3,
  sifApiUrl: sifApiUrl3,
  sifRpcUrl: sifRpcUrl3,
  sifChainId: sifChainId3,
  web3Provider: web3Provider3,
  nativeAsset: nativeAsset3,
  blockExplorerUrl: blockExplorerUrl3,
  cryptoeconomicsUrl: cryptoeconomicsUrl3,
  bridgebankContractAddress: bridgebankContractAddress3,
  keplrChainConfig: keplrChainConfig3
};

// src/config/networks/sifchain/config.mainnet.json
var sifAddrPrefix4 = "sif";
var sifApiUrl4 = "https://api-int.sifchain.finance";
var sifRpcUrl4 = "https://rpc.sifchain.finance";
var sifChainId4 = "sifchain-1";
var web3Provider4 = "metamask";
var nativeAsset4 = "rowan";
var blockExplorerUrl4 = "https://blockexplorer.sifchain.finance";
var cryptoeconomicsUrl4 = "https://api-cryptoeconomics.sifchain.finance/api";
var bridgebankContractAddress4 = "0xB5F54ac4466f5ce7E0d8A5cB9FE7b8c0F35B7Ba8";
var keplrChainConfig4 = {
  chainName: "Sifchain",
  chainId: "",
  rpc: "",
  rest: "",
  stakeCurrency: {
    coinDenom: "ROWAN",
    coinMinimalDenom: "rowan",
    coinDecimals: 18
  },
  bip44: {
    coinType: 118
  },
  bech32Config: {
    bech32PrefixAccAddr: "sif",
    bech32PrefixAccPub: "sifpub",
    bech32PrefixValAddr: "sifvaloper",
    bech32PrefixValPub: "sifvaloperpub",
    bech32PrefixConsAddr: "sifvalcons",
    bech32PrefixConsPub: "sifvalconspub"
  },
  currencies: [],
  feeCurrencies: [
    {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    }
  ],
  coinType: 118,
  gasPriceStep: {
    low: 5e12,
    average: 65e11,
    high: 8e12
  }
};
var chains2 = [
  {
    id: "sifchain",
    displayName: "Sifchain",
    blockExplorerUrl: "https://blockexplorer-devnet.sifchain.finance",
    nativeAssetSymbol: "rowan"
  },
  {
    id: "ethereum",
    displayName: "Ethereum",
    blockExplorerUrl: "https://ropsten.etherscan.io",
    nativeAssetSymbol: "eth"
  },
  {
    id: "cosmoshub",
    displayName: "Cosmoshub",
    blockExplorerUrl: "https://mintscan.io/cosmos",
    nativeAssetSymbol: "uphoton"
  },
  {
    id: "iris",
    displayName: "Iris",
    blockExplorerUrl: "https://nyancat.iobscan.io/",
    nativeAssetSymbol: "nyan"
  }
];
var config_mainnet_default = {
  sifAddrPrefix: sifAddrPrefix4,
  sifApiUrl: sifApiUrl4,
  sifRpcUrl: sifRpcUrl4,
  sifChainId: sifChainId4,
  web3Provider: web3Provider4,
  nativeAsset: nativeAsset4,
  blockExplorerUrl: blockExplorerUrl4,
  cryptoeconomicsUrl: cryptoeconomicsUrl4,
  bridgebankContractAddress: bridgebankContractAddress4,
  keplrChainConfig: keplrChainConfig4,
  chains: chains2
};

// src/config/networks/ethereum/assets.ethereum.localnet.json
var assets = [
  {
    symbol: "erowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "/images/siflogo.png",
    address: "0x82D50AD3C1091866E258Fd0f1a7cC9674609D254",
    network: "ethereum"
  },
  {
    name: "Ethereum",
    symbol: "eth",
    imageUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    network: "ethereum",
    decimals: 18
  },
  {
    symbol: "atk",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    name: "Apple Coin",
    address: "0xB529f14AA8096f943177c09Ca294Ad66d2E08b1f",
    network: "ethereum"
  },
  {
    symbol: "btk",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    name: "Banana Coin",
    address: "0x3d49d1eF2adE060a33c6E6Aa213513A7EE9a6241",
    network: "ethereum"
  },
  {
    symbol: "usdc",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    name: "USD Coin",
    address: "0x2a504B5e7eC284ACa5b6f49716611237239F0b97",
    network: "ethereum"
  },
  {
    symbol: "link",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    name: "Chainlink",
    address: "0xBd2c938B9F6Bfc1A66368D08CB44dC3EB2aE27bE",
    network: "ethereum"
  }
];
var assets_ethereum_localnet_default = {
  assets
};

// src/config/networks/ethereum/assets.ethereum.mainnet.json
var assets2 = [
  {
    symbol: "erowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "./images/siflogo.png",
    address: "0x07bac35846e5ed502aa91adf6a9e7aa210f2dcbe",
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    name: "Tether USDT",
    network: "ethereum",
    symbol: "USDT",
    transferLimit: "5004238590",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    name: "Ethereum",
    network: "ethereum",
    symbol: "eth",
    transferLimit: "4381237787299667968",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427",
    name: "Basic Attention Token",
    network: "ethereum",
    symbol: "BAT",
    transferLimit: "16147836674320740909056",
    homeNetwork: "ethereum"
  },
  {
    address: "0xa117000000f279d81a1d3cc75430faa017fa5a2e",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/681/thumb/JelZ58cv_400x400.png?1601449653",
    name: "Aragon",
    network: "ethereum",
    symbol: "ANT",
    transferLimit: "1305483028720626696192",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/736/thumb/bancor.png?1547034477",
    name: "Bancor Network Token",
    network: "ethereum",
    symbol: "BNT",
    transferLimit: "2577319587628866076672",
    homeNetwork: "ethereum"
  },
  {
    address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/863/thumb/0x.png?1547034672",
    name: "0x",
    network: "ethereum",
    symbol: "ZRX",
    transferLimit: "8175411631975670218752",
    homeNetwork: "ethereum"
  },
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    name: "Chainlink",
    network: "ethereum",
    symbol: "LINK",
    transferLimit: "214408233276157788160",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745",
    name: "Decentraland",
    network: "ethereum",
    symbol: "MANA",
    transferLimit: "31495864592978940002304",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/913/thumb/LRC.png?1572852344",
    name: "Loopring",
    network: "ethereum",
    symbol: "LRC",
    transferLimit: "10751115965837254590464",
    homeNetwork: "ethereum"
  },
  {
    address: "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078",
    name: "Enjin Coin",
    network: "ethereum",
    symbol: "ENJ",
    transferLimit: "13591240717182590517248",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3406/thumb/SNX.png?1598631139",
    name: "Synthetix Network Token",
    network: "ethereum",
    symbol: "SNX",
    transferLimit: "288850375505488150528",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0000000000085d4780b73119b644ae5ecd22b376",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3449/thumb/TUSD.png?1559172762",
    name: "TrueUSD",
    network: "ethereum",
    symbol: "TUSD",
    transferLimit: "5000845142829138182144",
    homeNetwork: "ethereum"
  },
  {
    address: "0x967da4048cd07ab37855c090aaf366e4ce1b9f48",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686",
    name: "Ocean Protocol",
    network: "ethereum",
    symbol: "OCEAN",
    hasDarkIcon: true,
    transferLimit: "8793017640551988592640",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016",
    name: "Fantom",
    network: "ethereum",
    symbol: "FTM",
    transferLimit: "34341602791285476818944",
    homeNetwork: "ethereum"
  },
  {
    address: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1562212426",
    name: "sUSD",
    network: "ethereum",
    symbol: "SUSD",
    transferLimit: "4950495049504951107584",
    homeNetwork: "ethereum"
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    name: "USD Coin",
    network: "ethereum",
    symbol: "USDC",
    transferLimit: "5000000000",
    homeNetwork: "ethereum"
  },
  {
    address: "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b",
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cypto.png?1547043960",
    name: "Crypto com Coin",
    network: "ethereum",
    symbol: "CRO",
    displaySymbol: "CRO (ERC-20)",
    transferLimit: "7111262818051",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Crypto.org's ERC-20 token has been decommissioned on Sifchain in favor of the Cosmos CRO token. Please export all CRO (ERC-20) off of Sifchain."
  },
  {
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    name: "Wrapped Bitcoin",
    network: "ethereum",
    symbol: "WBTC",
    transferLimit: "14713671",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311",
    name: "Swipe",
    network: "ethereum",
    symbol: "SXP",
    transferLimit: "4132231404958677729280",
    homeNetwork: "ethereum"
  },
  {
    address: "0xba11d00c5f74255f56a5e366f4f77f5a186d7f55",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326",
    name: "Band Protocol",
    network: "ethereum",
    symbol: "BAND",
    transferLimit: "555555555555555540992",
    homeNetwork: "ethereum"
  },
  {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774",
    name: "Dai Stablecoin",
    network: "ethereum",
    symbol: "DAI",
    transferLimit: "5012003748978804916224",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425",
    name: "Compound",
    network: "ethereum",
    symbol: "COMP",
    transferLimit: "19435590453237972992",
    homeNetwork: "ethereum"
  },
  {
    address: "0x04fa0d235c4abf4bcf4787af4cf447de572ef828",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10951/thumb/UMA.png?1586307916",
    name: "UMA",
    network: "ethereum",
    symbol: "UMA",
    transferLimit: "460405156537753272320",
    homeNetwork: "ethereum"
  },
  {
    address: "0xba100000625a3754423978a60c9317c58a424e3d",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png?1592792958",
    name: "Balancer",
    network: "ethereum",
    symbol: "BAL",
    transferLimit: "210437710437710430208",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330",
    name: "yearn finance",
    network: "ethereum",
    symbol: "YFI",
    transferLimit: "165766004707754528",
    homeNetwork: "ethereum"
  },
  {
    address: "0x476c5e26a75bd202a9683ffd34359c0cc15be0ff",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/11970/thumb/serum-logo.png?1597121577",
    name: "Serum",
    network: "ethereum",
    symbol: "SRM",
    transferLimit: "2604166666",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2ba592f78db6436527729929aaf6c908497cb200",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11976/thumb/Cream.png?1596593418",
    name: "Cream",
    network: "ethereum",
    symbol: "CREAM",
    transferLimit: "32823475349570011136",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3845badade8e6dff049820680d1f14bd3903a5d0",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942",
    name: "SAND",
    network: "ethereum",
    symbol: "SAND",
    transferLimit: "55533342218668080103424",
    homeNetwork: "ethereum"
  },
  {
    address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688",
    name: "Sushi",
    network: "ethereum",
    symbol: "SUSHI",
    transferLimit: "595947556615017725952",
    homeNetwork: "ethereum"
  },
  {
    address: "0x36f3fd68e7325a35eb768f1aedaae9ea0689d723",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12440/thumb/esd_logo_circle.png?1603676421",
    name: "Empty Set Dollar",
    network: "ethereum",
    symbol: "ESD",
    transferLimit: "23367980258730274979840",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    name: "Uniswap",
    network: "ethereum",
    symbol: "UNI",
    transferLimit: "325097529258777640960",
    homeNetwork: "ethereum"
  },
  {
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
    name: "Aave",
    network: "ethereum",
    symbol: "AAVE",
    transferLimit: "16593103906016661504",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0391d2021f89dc339f60fff84546ea23e337750f",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853",
    name: "BarnBridge",
    network: "ethereum",
    symbol: "BOND",
    transferLimit: "100341159943808942080",
    homeNetwork: "ethereum"
  },
  {
    address: "0x6e1a19f235be7ed8e3369ef73b196c07257494de",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13238/thumb/WFIL-Icon.png?1606630561",
    name: "Wrapped Filecoin",
    network: "ethereum",
    symbol: "WFIL",
    transferLimit: "178316690442225385472",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566",
    name: "The Graph",
    network: "ethereum",
    symbol: "GRT",
    transferLimit: "8004341554859355406336",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0000000000095413afc295d19edeb1ad7b71c952",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13454/thumb/lon_logo.png?1608701720",
    name: "Tokenlon",
    network: "ethereum",
    symbol: "LON",
    transferLimit: "748502994011976105984",
    homeNetwork: "ethereum"
  },
  {
    address: "0x111111111117dc0aa78b770fa6a738034120c302",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    name: "1inch",
    network: "ethereum",
    symbol: "1INCH",
    transferLimit: "1582278481012658274304",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3155ba85d5f96b2d030a4966af206230e46849cb",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13677/thumb/BrMhBTr8_400x400.jpg?1610723303",
    name: "THORChain ERC20",
    network: "ethereum",
    symbol: "RUNE",
    transferLimit: "1547987616099071164416",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2b89bf8ba858cd2fcee1fada378d5cd6936968be",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/13767/thumb/Secret_S_Black_Coingecko.png?1611667298",
    name: "Secret ERC20 ",
    network: "ethereum",
    symbol: "WSCRT",
    transferLimit: "4464285714",
    homeNetwork: "ethereum"
  },
  {
    address: "0x6fb3e0a217407efff7ca062d46c26e5d60a14d69",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3334/small/iotex-logo.png?1547037941",
    name: "IoTeX",
    network: "ethereum",
    symbol: "IOTX",
    transferLimit: "458715596330000000000000",
    homeNetwork: "ethereum"
  },
  {
    address: "0xfe3e6a25e6b192a42a44ecddcd13796471735acf",
    name: "Reef Finance",
    symbol: "REEF",
    decimals: 18,
    transferLimit: "277355888654000000000000",
    network: "ethereum",
    imageUrl: "https://assets.coingecko.com/coins/images/13504/small/Group_10572.png?1610534130",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc4c7ea4fab34bd9fb9a5e1b1a98df76e26e6407c",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4932/thumb/_QPpjoUi_400x400.jpg?1566430520",
    name: "COCOS BCX",
    network: "ethereum",
    symbol: "cocos",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3373/small/IuNzUb5b_400x400.jpg?1589526336",
    name: "Keep Network",
    network: "ethereum",
    symbol: "keep",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8207c1ffc5b6804f6024322ccf34f29c3541ae26",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3296/small/op.jpg?1547037878",
    name: "Origin Protocol",
    network: "ethereum",
    symbol: "ogn",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xd82bb924a1707950903e2c0a619824024e254cd1",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12782/small/logocircle.png?1611944557",
    name: "DAOfi",
    network: "ethereum",
    hasDarkIcon: true,
    symbol: "daofi",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3e9bc21c9b189c09df3ef1b824798658d5011937",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12509/small/linear.jpg?1606884470",
    name: "Linear",
    network: "ethereum",
    symbol: "lina",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x525794473f7ab5715c81d06d10f52d11cc052804",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9351/small/12ships.png?1566485390",
    name: "12Ships",
    network: "ethereum",
    symbol: "tshp",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0xc4de189abf94c57f396bd4c52ab13b954febefd8",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13803/small/b20.png?1611996305",
    name: "B.20",
    network: "ethereum",
    symbol: "b20",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3328/small/Akropolis.png?1547037929",
    name: "Akropolis",
    network: "ethereum",
    symbol: "akro",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xaf9f549774ecedbd0966c52f250acc548d3f36e5",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12623/small/RFUEL_SQR.png?1602481093",
    name: "Rio Fuel Token",
    network: "ethereum",
    symbol: "rfuel",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12843/small/image.png?1611212077",
    name: "Rally",
    network: "ethereum",
    symbol: "rly",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc834fa996fa3bec7aad3693af486ae53d8aa8b50",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/convergence_32.png",
    name: "Convergence",
    network: "ethereum",
    symbol: "conv",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/render_32.png",
    name: "Render Token",
    network: "ethereum",
    symbol: "rndr",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1614f18fc94f47967a3fbe5ffcd46d4e7da3d787",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/paidnetwork_32.png",
    name: "PAID Network",
    network: "ethereum",
    symbol: "paid",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x29cbd0510eec0327992cd6006e63f9fa8e7f33b7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14460/small/Tidal-mono.png?1616233894",
    name: "Tidal",
    network: "ethereum",
    symbol: "tidal",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11939/small/SHIBLOGO.png?1600752116",
    name: "SHIBA INU",
    network: "ethereum",
    symbol: "SHIB",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x27c70cd1946795b66be9d954418546998b546634",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/dogekiller_32.png",
    name: "DOGE KILLER",
    network: "ethereum",
    symbol: "LEASH",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    name: "Atom",
    network: "ethereum",
    homeNetwork: "cosmoshub",
    symbol: "uatom",
    displaySymbol: "atom",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12681/small/UST.png?1601612407",
    name: "Terra USD",
    network: "ethereum",
    symbol: "UST",
    transferLimit: "99999999999999999999999999999",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Temporarily decommissioned due to Terra instability"
  },
  {
    address: "0x853d955acef822db058eb8505911ed77f175b99e",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13422/small/frax_logo.png?1608476506",
    name: "Frax",
    hasDarkIcon: true,
    network: "ethereum",
    symbol: "FRAX",
    transferLimit: "99999999999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13423/small/frax_share.png?1608478989",
    name: "Frax Share",
    network: "ethereum",
    symbol: "FXS",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc52c326331e9ce41f04484d3b5e5648158028804",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14830/small/7xjpHaG.png?1618564961",
    name: "Unizen",
    network: "ethereum",
    symbol: "ZCX",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x217ddead61a42369a266f1fb754eb5d3ebadc88a",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/15482/small/donkey_logo.jpg?1621012824",
    name: "Don-key",
    symbol: "DON",
    transferLimit: "99999999999999999999999",
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
    imageUrl: "https://assets.coingecko.com/coins/images/15595/small/metis.PNG?1621298076",
    name: "Metis Token",
    symbol: "Metis",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0xEF53462838000184F35f7D991452e5f25110b207",
    imageUrl: "https://assets.coingecko.com/coins/images/15632/small/knit.jpg?1621396114",
    name: "Knit Finance",
    symbol: "KFT",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0xb9ef770b6a5e12e45983c5d80545258aa38f3b78",
    imageUrl: "https://assets.coingecko.com/coins/images/4934/small/0_Black-svg.png?1600757954",
    name: "0chain",
    symbol: "ZCN",
    hasDarkIcon: true,
    decimals: 10,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0xFa14Fa6958401314851A17d6C5360cA29f74B57B",
    imageUrl: "https://assets.coingecko.com/coins/images/14750/small/SAITO.png?1626857406",
    name: "SAITO",
    symbol: "SAITO",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9695e0114e12c0d3a3636fab5a18e6b737529023",
    imageUrl: "https://assets.coingecko.com/coins/images/15368/small/SgqhfWz4_400x400_%281%29.jpg?1620666919",
    name: "DFYN Token",
    symbol: "DFYN",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x20a8cec5fffea65be7122bcab2ffe32ed4ebf03a",
    imageUrl: "https://assets.coingecko.com/coins/images/17321/small/asset_icon_dnxc_200.png?1627292452",
    name: "DinoX Coin",
    symbol: "DNXC",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbbc2ae13b23d715c30720f079fcd9b4a74093505",
    imageUrl: "https://assets.coingecko.com/coins/images/14238/small/ethernity_logo.png?1615189750",
    name: "@EthernityChain $ERN Token",
    symbol: "ERN",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x83e6f1e41cdd28eaceb20cb649155049fac3d5aa",
    imageUrl: "https://assets.coingecko.com/coins/images/12648/small/polkastarter.png?1609813702",
    name: "PolkastarterToken",
    symbol: "POLS",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
    imageUrl: "https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png?1604471082",
    name: "Axie Infinity Shard",
    symbol: "AXS",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    imageUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    name: "Matic Token",
    symbol: "MATIC",
    decimals: 18,
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2e9d63788249371f1dfc918a52f8d799f4a38c94",
    imageUrl: "https://assets.coingecko.com/coins/images/17495/small/tokemak-avatar-200px-black.png?1628131614",
    name: "Tokemak",
    symbol: "TOKE",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x05079687d35b93538cbd59fe5596380cae9054a9",
    imageUrl: "https://assets.coingecko.com/coins/images/5041/large/logo_-_2021-01-10T210801.390.png?1610284134",
    name: "BitSong",
    symbol: "BTSG",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x6c28aef8977c9b773996d0e8376d2ee379446f2f",
    imageUrl: "https://assets.coingecko.com/coins/images/13970/small/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659",
    name: "QuickSwap",
    symbol: "QUICK",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
    imageUrl: "https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png?1609873644",
    name: "Lido DAO",
    symbol: "LDO",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0xe76c6c83af64e4c60245d8c7de953df673a7a33d",
    imageUrl: "https://assets.coingecko.com/coins/images/16840/small/railgun.jpeg?1625322775",
    name: "Railgun",
    symbol: "RAIL",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x57b946008913b82e4df85f501cbaed910e58d26c",
    imageUrl: "https://assets.coingecko.com/coins/images/8903/small/POND_200x200.png?1622515451",
    name: "Marlin",
    symbol: "POND",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x2701E1D67219a49F5691C92468Fe8D8ADc03e609",
    imageUrl: "https://assets.coingecko.com/coins/images/17103/small/DINO.png?1626244014",
    name: "DinoSwap",
    symbol: "DINO",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b",
    imageUrl: "https://assets.coingecko.com/coins/images/16801/small/ufo_logo.jpg?1630078847",
    name: "UFO Gaming",
    symbol: "UFO",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0xd01cb3d113a864763dd3977fe1e725860013b0ed",
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    symbol: "ratom",
    name: "rATOM",
    network: "ethereum",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x16ba8Efe847EBDFef99d399902ec29397D403C30",
    symbol: "coh",
    displaySymbol: "oh",
    decimals: 18,
    name: "oh",
    label: "oh",
    network: "ethereum",
    homeNetwork: "ethereum",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13143.png"
  },
  {
    symbol: "ngm",
    displaySymbol: "ngm",
    decimals: 6,
    name: "ngm",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "ngm",
    imageUrl: "https://assets.coingecko.com/coins/images/13722/small/logo-200x200.jpg?1626095888"
  },
  {
    address: "0x4461cfd640da24d1a4642fa5f9ea3e6da966b831",
    symbol: "csms",
    displaySymbol: "csms",
    decimals: 18,
    name: "Cosmostarter",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Cosmostarter",
    imageUrl: "https://assets.coingecko.com/coins/images/19875/small/cosmosstarter.PNG?1636083064",
    decommissioned: true
  },
  {
    address: "0xae697f994fc5ebc000f8e22ebffee04612f98a0d",
    symbol: "lgcy",
    displaySymbol: "lgcy",
    decimals: 18,
    name: "LGCY Network",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "LGCY Network",
    imageUrl: "https://assets.coingecko.com/coins/images/12181/small/LGCY_network.jpg?1597926587",
    decommissioned: false
  },
  {
    address: "0xABe580E7ee158dA464b51ee1a83Ac0289622e6be",
    symbol: "xft",
    displaySymbol: "xft",
    decimals: 18,
    name: "Offshift",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Offshift",
    imageUrl: "https://assets.coingecko.com/coins/images/11977/small/CsBrPiA.png?1614570441",
    decommissioned: false
  },
  {
    address: "0xf1b99e3e573a1a9c5e6b2ce818b617f0e664e86b",
    symbol: "osqth",
    displaySymbol: "osqth",
    decimals: 18,
    name: "Opyn Squeeth",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Opyn Squeeth",
    imageUrl: "https://assets.coingecko.com/coins/images/22806/small/DyVT5XPV_400x400.jpg?1642656239"
  },
  {
    address: "0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c",
    symbol: "uos",
    displaySymbol: "uos",
    decimals: 4,
    name: "Ultra",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ultra",
    imageUrl: "https://assets.coingecko.com/coins/images/4480/small/Ultra.png?1563356418"
  },
  {
    address: "0x98585dFc8d9e7D48F0b1aE47ce33332CF4237D96",
    symbol: "newo",
    displaySymbol: "newo",
    decimals: 18,
    name: "New Order",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "New Order",
    imageUrl: "https://assets.coingecko.com/coins/images/21440/small/new-order-icon-256px.png?1639125759"
  },
  {
    address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
    symbol: "gala",
    displaySymbol: "gala",
    decimals: 8,
    name: "Gala",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Gala",
    imageUrl: "https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png?1600233435"
  },
  {
    address: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
    symbol: "push",
    displaySymbol: "push",
    decimals: 18,
    name: "Ethereum Push Notification Service - EPNS",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ethereum Push Notification Service - EPNS",
    imageUrl: "https://assets.coingecko.com/coins/images/14769/small/epns_logo.jpg?1618330344"
  },
  {
    address: "0x949d48eca67b17269629c7194f4b727d4ef9e5d6",
    symbol: "mc",
    displaySymbol: "mc",
    decimals: 18,
    name: "Merit Circle",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Merit Circle",
    imageUrl: "https://assets.coingecko.com/coins/images/19304/small/Db4XqML.png?1634972154"
  },
  {
    address: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
    symbol: "inj",
    displaySymbol: "inj",
    decimals: 18,
    name: "Injective",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Injective",
    imageUrl: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png?1628233237"
  }
];
var assets_ethereum_mainnet_default = {
  assets: assets2
};

// src/config/networks/ethereum/assets.ethereum.devnet.json
var assets3 = [
  {
    symbol: "erowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "./images/siflogo.png",
    address: "0xaa0532e884ac34c1B9937fb433045A2b796D9347",
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x43EB5eC458Ab344DF8351d5c57319ecbb5fe2FfC",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    name: "Tether USDT",
    network: "ethereum",
    symbol: "USDT",
    transferLimit: "5004238590",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    name: "Ethereum",
    network: "ethereum",
    symbol: "eth",
    transferLimit: "4381237787299667968",
    homeNetwork: "ethereum"
  },
  {
    address: "0xF8D6e4D8A128bE2651e4e9a11D0d78869ffd3Dcb",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427",
    name: "Basic Attention Token",
    network: "ethereum",
    symbol: "BAT",
    transferLimit: "16147836674320740909056",
    homeNetwork: "ethereum"
  },
  {
    address: "0xE91C0AFD4C23610D2D106E874C0f71be689d2995",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/681/thumb/JelZ58cv_400x400.png?1601449653",
    name: "Aragon",
    network: "ethereum",
    symbol: "ANT",
    transferLimit: "1305483028720626696192",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4c85D302D5dF39629FA70ac2AfE2A55b73c24853",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/736/thumb/bancor.png?1547034477",
    name: "Bancor Network Token",
    network: "ethereum",
    symbol: "BNT",
    transferLimit: "2577319587628866076672",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4a86CA57a8a1a5D72360E9792c0d563779eeB5E6",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/863/thumb/0x.png?1547034672",
    name: "0x",
    network: "ethereum",
    symbol: "ZRX",
    transferLimit: "8175411631975670218752",
    homeNetwork: "ethereum"
  },
  {
    address: "0xf837953D6dB2C04E45dF309CD6fdc2Dcf79e10aA",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    name: "Chainlink",
    network: "ethereum",
    symbol: "LINK",
    transferLimit: "214408233276157788160",
    homeNetwork: "ethereum"
  },
  {
    address: "0x15F7aC2E15f5bb26aa24B525CA3e3EBEC5230Ed9",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745",
    name: "Decentraland",
    network: "ethereum",
    symbol: "MANA",
    transferLimit: "31495864592978940002304",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8556B8Be2D0223Ef40f6d8dceE6f867E65e9EDb3",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/913/thumb/LRC.png?1572852344",
    name: "Loopring",
    network: "ethereum",
    symbol: "LRC",
    transferLimit: "10751115965837254590464",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1C65d5D1C7d863ffB89A21f9Ef7aA29037A1920B",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078",
    name: "Enjin Coin",
    network: "ethereum",
    symbol: "ENJ",
    transferLimit: "13591240717182590517248",
    homeNetwork: "ethereum"
  },
  {
    address: "0xf4364bfdcd883cc62c1A9202068b7AC100718847",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3406/thumb/SNX.png?1598631139",
    name: "Synthetix Network Token",
    network: "ethereum",
    symbol: "SNX",
    transferLimit: "288850375505488150528",
    homeNetwork: "ethereum"
  },
  {
    address: "0xEbBb824c16Fe3CD628a57A7ADF9F0576479Ae0AA",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3449/thumb/TUSD.png?1559172762",
    name: "TrueUSD",
    network: "ethereum",
    symbol: "TUSD",
    transferLimit: "5000845142829138182144",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9C83747E0DB1b66C829A887BB10C8973E0BbCB6D",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686",
    name: "Ocean Protocol",
    network: "ethereum",
    symbol: "OCEAN",
    transferLimit: "8793017640551988592640",
    homeNetwork: "ethereum"
  },
  {
    address: "0xA846bd9010D37A7458E2746eF7bC8D1E1719DC08",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016",
    name: "Fantom",
    network: "ethereum",
    symbol: "FTM",
    transferLimit: "34341602791285476818944",
    homeNetwork: "ethereum"
  },
  {
    address: "0x064aA67db83b8fc4D1a1fDD294d4E6a11BD6efe2",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1562212426",
    name: "sUSD",
    network: "ethereum",
    symbol: "SUSD",
    transferLimit: "4950495049504951107584",
    homeNetwork: "ethereum"
  },
  {
    address: "0xD3951d710314b721866a1F4df5414d8f906207DD",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    name: "USD Coin",
    network: "ethereum",
    symbol: "USDC",
    transferLimit: "5000000000",
    homeNetwork: "ethereum"
  },
  {
    address: "0xef1C4af73261eDD79BFEd11973E86173b1981021",
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cypto.png?1547043960",
    name: "Crypto com Coin",
    network: "ethereum",
    symbol: "CRO",
    displaySymbol: "CRO (ERC-20)",
    transferLimit: "7111262818051",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Crypto.org's ERC-20 token has been decommissioned on Sifchain in favor of the Cosmos CRO token. Please export all CRO (ERC-20) off of Sifchain."
  },
  {
    address: "0xcdF2504B6313A47306b9B85Ed628b9C7065aEA76",
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    name: "Wrapped Bitcoin",
    network: "ethereum",
    symbol: "WBTC",
    transferLimit: "14713671",
    homeNetwork: "ethereum"
  },
  {
    address: "0x03d81381B672a765E3F3925eFE00AD1B119Fd911",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311",
    name: "Swipe",
    network: "ethereum",
    symbol: "SXP",
    transferLimit: "4132231404958677729280",
    homeNetwork: "ethereum"
  },
  {
    address: "0x516cfAb6FC73BEb041a02CC4EE76F3bde1025cc0",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326",
    name: "Band Protocol",
    network: "ethereum",
    symbol: "BAND",
    transferLimit: "555555555555555540992",
    homeNetwork: "ethereum"
  },
  {
    address: "0x51c41F59Cd9edAF3dA4E17Ea40DaB8F4A555808E",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774",
    name: "Dai Stablecoin",
    network: "ethereum",
    symbol: "DAI",
    transferLimit: "5012003748978804916224",
    homeNetwork: "ethereum"
  },
  {
    address: "0x202E0e9AeBFba38024e3c655a556c7a9533C4a19",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425",
    name: "Compound",
    network: "ethereum",
    symbol: "COMP",
    transferLimit: "19435590453237972992",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2Df8522737EA39165409144165F5Aa11c617efc1",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10951/thumb/UMA.png?1586307916",
    name: "UMA",
    network: "ethereum",
    symbol: "UMA",
    transferLimit: "460405156537753272320",
    homeNetwork: "ethereum"
  },
  {
    address: "0xCb92407A0DAff145601675Aac063059839d29ef4",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png?1592792958",
    name: "Balancer",
    network: "ethereum",
    symbol: "BAL",
    transferLimit: "210437710437710430208",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1a9b5011e5a5e1AF47AaC123E62E47230920718C",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330",
    name: "yearn finance",
    network: "ethereum",
    symbol: "YFI",
    transferLimit: "165766004707754528",
    homeNetwork: "ethereum"
  },
  {
    address: "0x35282f5F4e20BBAE0FCfDceF9e008b39F195C32A",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/11970/thumb/serum-logo.png?1597121577",
    name: "Serum",
    network: "ethereum",
    symbol: "SRM",
    transferLimit: "2604166666",
    homeNetwork: "ethereum"
  },
  {
    address: "0xB2C7c02DD15eCA10e00588BCe18A5316DC0A7684",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11976/thumb/Cream.png?1596593418",
    name: "Cream",
    network: "ethereum",
    symbol: "CREAM",
    transferLimit: "32823475349570011136",
    homeNetwork: "ethereum"
  },
  {
    address: "0x07aeD342a842A351129227C55e89b57bE46e2830",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942",
    name: "SAND",
    network: "ethereum",
    symbol: "SAND",
    transferLimit: "55533342218668080103424",
    homeNetwork: "ethereum"
  },
  {
    address: "0xb8554a27D8d6aA8D14d049aE4DBCAC6ac2582280",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688",
    name: "Sushi",
    network: "ethereum",
    symbol: "SUSHI",
    transferLimit: "595947556615017725952",
    homeNetwork: "ethereum"
  },
  {
    address: "0x60DE6E0dA25C0EBAfE30f824FA96bfA9C3eaaf69",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12440/thumb/esd_logo_circle.png?1603676421",
    name: "Empty Set Dollar",
    network: "ethereum",
    symbol: "ESD",
    transferLimit: "23367980258730274979840",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4303D04691b793bD6C20e9F627640b042Ef6a5fB",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    name: "Uniswap",
    network: "ethereum",
    symbol: "UNI",
    transferLimit: "325097529258777640960",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc01deAf141869DBCc760A78b0cFfA0AF4705057a",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
    name: "Aave",
    network: "ethereum",
    symbol: "AAVE",
    transferLimit: "16593103906016661504",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9673ccf6A8366d832Ef75A28AddE144423F4d148",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853",
    name: "BarnBridge",
    network: "ethereum",
    symbol: "BOND",
    transferLimit: "100341159943808942080",
    homeNetwork: "ethereum"
  },
  {
    address: "0x149cb62320Ab43F530063E86b3ceEAccC573003a",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13238/thumb/WFIL-Icon.png?1606630561",
    name: "Wrapped Filecoin",
    network: "ethereum",
    symbol: "WFIL",
    transferLimit: "178316690442225385472",
    homeNetwork: "ethereum"
  },
  {
    address: "0x58625f8EBF7f41956C3a6913796e43B0a5984ae3",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566",
    name: "The Graph",
    network: "ethereum",
    symbol: "GRT",
    transferLimit: "8004341554859355406336",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4c39B31FBC836f32f53A97fd360e7AbF792e72a0",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13454/thumb/lon_logo.png?1608701720",
    name: "Tokenlon",
    network: "ethereum",
    symbol: "LON",
    transferLimit: "748502994011976105984",
    homeNetwork: "ethereum"
  },
  {
    address: "0xDD0ED24e3c0479F423891258c391e7Dd7a6E4EF7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    name: "1inch",
    network: "ethereum",
    symbol: "1INCH",
    transferLimit: "1582278481012658274304",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbfBf12646B30af76f5728c8DFcC680843cf0820b",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13677/thumb/BrMhBTr8_400x400.jpg?1610723303",
    name: "THORChain ERC20",
    network: "ethereum",
    symbol: "RUNE",
    transferLimit: "1547987616099071164416",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1310BCB18474c75B39358c1A5F9F47f9ac847aB1",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/13767/thumb/Secret_S_Black_Coingecko.png?1611667298",
    name: "Secret ERC20 ",
    network: "ethereum",
    symbol: "WSCRT",
    transferLimit: "4464285714",
    homeNetwork: "ethereum"
  },
  {
    address: "0x250e711E217AdcD7CA40381251D8BBf27c136564",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3334/small/iotex-logo.png?1547037941",
    name: "IoTeX",
    network: "ethereum",
    symbol: "IOTX",
    transferLimit: "458715596330000000000000",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3F063B4c302C15CcF05D474301b75F86944544Aa",
    name: "Reef Finance",
    symbol: "REEF",
    decimals: 18,
    transferLimit: "277355888654000000000000",
    network: "ethereum",
    imageUrl: "https://assets.coingecko.com/coins/images/13504/small/Group_10572.png?1610534130",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbD51c9391f38CBF97C2F9597AAb5A94d2114efA2",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4932/thumb_2x/_QPpjoUi_400x400.jpg?1566430520",
    name: "COCOS BCX",
    network: "ethereum",
    symbol: "cocos",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xFcF61Ae012c708dD17f46B62D155637ddfd7D0D1",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3373/small/IuNzUb5b_400x400.jpg?1589526336",
    name: "Keep Network",
    network: "ethereum",
    symbol: "keep",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xF66Be71DE1e9061877edE53F6eD066a08F61F3BC",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3296/small/op.jpg?1547037878",
    name: "Origin Protocol",
    network: "ethereum",
    symbol: "ogn",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x967b9994c634924c8ddb6864b1F510DF91908c71",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12782/small/logocircle.png?1611944557",
    name: "DAOfi",
    network: "ethereum",
    symbol: "daofi",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8c8ec2F53E1f4729889697e1b274f143407aC8d6",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12509/small/linear.jpg?1606884470",
    name: "Linear",
    network: "ethereum",
    symbol: "lina",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3963d088036763359740C0E0855152D82a551730",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9351/small/12ships.png?1566485390",
    name: "12Ships",
    network: "ethereum",
    symbol: "tshp",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0xE8947F381f786A998eD6dA7ab938a11c7BD018B8",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13803/small/b20.png?1611996305",
    name: "B.20",
    network: "ethereum",
    symbol: "b20",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x370DE8ca4dcD270aB6b04b01e419c2ef545541a7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3328/small/Akropolis.png?1547037929",
    name: "Akropolis",
    network: "ethereum",
    symbol: "akro",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xd176f177B0e6aBb1e104D2ed9CAF8DB32844c6EF",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12623/small/RFUEL_SQR.png?1602481093",
    name: "Rio Fuel Token",
    network: "ethereum",
    symbol: "rfuel",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0x380934E9D47B466616D427380f99cb7283D1e7A1",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12843/small/image.png?1611212077",
    name: "Rally",
    network: "ethereum",
    symbol: "rly",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2050D33F6d14DEe23De3C6a20173295474D7c0F6",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/convergence_32.png",
    name: "Convergence",
    network: "ethereum",
    symbol: "conv",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x0F7C5C3b81AA776aDd281A5D7DcA4F5d62056601",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/render_32.png",
    name: "Render Token",
    network: "ethereum",
    symbol: "rndr",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xb317fa8D773dF4254B2107A02Edf1711FdCb0443",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/paidnetwork_32.png",
    name: "PAID Network",
    network: "ethereum",
    symbol: "paid",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1821DA6Fc5609e547889d6b650985876c2392E73",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14460/small/Tidal-mono.png?1616233894",
    name: "Tidal",
    network: "ethereum",
    symbol: "tidal",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11939/small/SHIBLOGO.png?1600752116",
    name: "SHIBA INU",
    network: "ethereum",
    symbol: "SHIB",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/dogekiller_32.png",
    name: "DOGE KILLER",
    network: "ethereum",
    symbol: "LEASH",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "0x173a2334BED717dfD472AeD2808C001cbe4bd373",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    name: "Photon",
    network: "ethereum",
    homeNetwork: "cosmoshub",
    symbol: "uphoton",
    displaySymbol: "photon",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "0x8ba31C93a5E3F856B82a16f81414fb1A78d9de07",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676",
    name: "AKT",
    network: "ethereum",
    homeNetwork: "akash",
    symbol: "uakt",
    displaySymbol: "akt",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "0x2513D9F97b1bAca5Bd70049334Fb8E0Dd2828BF7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14879/small/Sentinel_512X512.png?1622174499",
    name: "DVPN",
    network: "ethereum",
    homeNetwork: "sentinel",
    symbol: "udvpn",
    displaySymbol: "dvpn",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "0xABe580E7ee158dA464b51ee1a83Ac0289622e6be",
    symbol: "xft",
    displaySymbol: "xft",
    decimals: 18,
    name: "Offshift",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Offshift",
    imageUrl: "https://assets.coingecko.com/coins/images/11977/small/CsBrPiA.png?1614570441",
    decommissioned: false
  },
  {
    address: "0xf1b99e3e573a1a9c5e6b2ce818b617f0e664e86b",
    symbol: "osqth",
    displaySymbol: "osqth",
    decimals: 18,
    name: "Opyn Squeeth",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Opyn Squeeth",
    imageUrl: "https://assets.coingecko.com/coins/images/22806/small/DyVT5XPV_400x400.jpg?1642656239"
  },
  {
    address: "0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c",
    symbol: "uos",
    displaySymbol: "uos",
    decimals: 4,
    name: "Ultra",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ultra",
    imageUrl: "https://assets.coingecko.com/coins/images/4480/small/Ultra.png?1563356418"
  },
  {
    address: "0x98585dFc8d9e7D48F0b1aE47ce33332CF4237D96",
    symbol: "newo",
    displaySymbol: "newo",
    decimals: 18,
    name: "New Order",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "New Order",
    imageUrl: "https://assets.coingecko.com/coins/images/21440/small/new-order-icon-256px.png?1639125759"
  },
  {
    address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
    symbol: "gala",
    displaySymbol: "gala",
    decimals: 8,
    name: "Gala",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Gala",
    imageUrl: "https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png?1600233435"
  },
  {
    address: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
    symbol: "push",
    displaySymbol: "push",
    decimals: 18,
    name: "Ethereum Push Notification Service - EPNS",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ethereum Push Notification Service - EPNS",
    imageUrl: "https://assets.coingecko.com/coins/images/14769/small/epns_logo.jpg?1618330344"
  },
  {
    address: "0x949d48eca67b17269629c7194f4b727d4ef9e5d6",
    symbol: "mc",
    displaySymbol: "mc",
    decimals: 18,
    name: "Merit Circle",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Merit Circle",
    imageUrl: "https://assets.coingecko.com/coins/images/19304/small/Db4XqML.png?1634972154"
  },
  {
    address: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
    symbol: "inj",
    displaySymbol: "inj",
    decimals: 18,
    name: "Injective",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Injective",
    imageUrl: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png?1628233237"
  }
];
var assets_ethereum_devnet_default = {
  assets: assets3
};

// src/config/networks/ethereum/assets.ethereum.testnet.json
var assets4 = [
  {
    symbol: "erowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "./images/siflogo.png",
    address: "0xEC017aC9003D2906Fc855258040A56C671a315d6",
    network: "ethereum",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4d0f15bA9B4f20C70F8D089FE26499088dfe0EAc",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    name: "Tether USDT",
    network: "ethereum",
    symbol: "USDT",
    transferLimit: "5004238590",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    name: "Ethereum",
    network: "ethereum",
    symbol: "eth",
    transferLimit: "4381237787299667968",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3cA047fD7e0a4Bf245ea30826bd156753aacDecE",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427",
    name: "Basic Attention Token",
    network: "ethereum",
    symbol: "BAT",
    transferLimit: "16147836674320740909056",
    homeNetwork: "ethereum"
  },
  {
    address: "0x251A1c0b6c6FD03ee58d2f888B354BC553D602E9",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/681/thumb/JelZ58cv_400x400.png?1601449653",
    name: "Aragon",
    network: "ethereum",
    symbol: "ANT",
    transferLimit: "1305483028720626696192",
    homeNetwork: "ethereum"
  },
  {
    address: "0xB4b2D1696B5F9Ed38c3d7c7E9f542aC0f321077d",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/736/thumb/bancor.png?1547034477",
    name: "Bancor Network Token",
    network: "ethereum",
    symbol: "BNT",
    transferLimit: "2577319587628866076672",
    homeNetwork: "ethereum"
  },
  {
    address: "0xD2E32f04C213C57Aa74D9B6A58560B0Ed0cE02bd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/863/thumb/0x.png?1547034672",
    name: "0x",
    network: "ethereum",
    symbol: "ZRX",
    transferLimit: "8175411631975670218752",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3fC57975eA289984f17Dd138ed86Fb81A1734FE5",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    name: "Chainlink",
    network: "ethereum",
    symbol: "LINK",
    transferLimit: "214408233276157788160",
    homeNetwork: "ethereum"
  },
  {
    address: "0x89Eb17D155908c44F37F24Bfc2a984Bd956BEA03",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745",
    name: "Decentraland",
    network: "ethereum",
    symbol: "MANA",
    transferLimit: "31495864592978940002304",
    homeNetwork: "ethereum"
  },
  {
    address: "0x16e0d8825bd8E3fC4F6B3149c5E949c590b07A62",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/913/thumb/LRC.png?1572852344",
    name: "Loopring",
    network: "ethereum",
    symbol: "LRC",
    transferLimit: "10751115965837254590464",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1798335Aa6415CD6092377113F3F7a2fAB6F7DFF",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078",
    name: "Enjin Coin",
    network: "ethereum",
    symbol: "ENJ",
    transferLimit: "13591240717182590517248",
    homeNetwork: "ethereum"
  },
  {
    address: "0x27dABBe9d2058C6cce3FA405C296A1e0d83Cb3A7",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3406/thumb/SNX.png?1598631139",
    name: "Synthetix Network Token",
    network: "ethereum",
    symbol: "SNX",
    transferLimit: "288850375505488150528",
    homeNetwork: "ethereum"
  },
  {
    address: "0x18ecc845c06d212f1c94a044022F317836b01191",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3449/thumb/TUSD.png?1559172762",
    name: "TrueUSD",
    network: "ethereum",
    symbol: "TUSD",
    transferLimit: "5000845142829138182144",
    homeNetwork: "ethereum"
  },
  {
    address: "0x7dFA6910CC2540b071a68a2A68A96Bb16305451A",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686",
    name: "Ocean Protocol",
    network: "ethereum",
    symbol: "OCEAN",
    transferLimit: "8793017640551988592640",
    homeNetwork: "ethereum"
  },
  {
    address: "0x12B48f49C991bCCa589c7C1A7AAA4396444989CF",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016",
    name: "Fantom",
    network: "ethereum",
    symbol: "FTM",
    transferLimit: "34341602791285476818944",
    homeNetwork: "ethereum"
  },
  {
    address: "0x73cdfFA0902ad9c5E8be0FA42E7D8b32e529e37D",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1562212426",
    name: "sUSD",
    network: "ethereum",
    symbol: "SUSD",
    transferLimit: "4950495049504951107584",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc6E2163616e4092622783454AC4AF38D9795F469",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    name: "USD Coin",
    network: "ethereum",
    symbol: "USDC",
    transferLimit: "5000000000",
    homeNetwork: "ethereum"
  },
  {
    address: "0xe7B67B7D5aF118F6CFe8AC916b2a578B3aE2872c",
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cypto.png?1547043960",
    name: "Crypto com Coin",
    network: "ethereum",
    symbol: "CRO",
    displaySymbol: "CRO (ERC-20)",
    transferLimit: "7111262818051",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Crypto.org's ERC-20 token has been decommissioned on Sifchain in favor of the Cosmos CRO token. Please export all CRO (ERC-20) off of Sifchain."
  },
  {
    address: "0xbe0c274D086C072a68150f956d7c5E95414B3f37",
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    name: "Wrapped Bitcoin",
    network: "ethereum",
    symbol: "WBTC",
    transferLimit: "14713671",
    homeNetwork: "ethereum"
  },
  {
    address: "0xE341955Fbc53c1B32247085e4bef2EF58278be13",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311",
    name: "Swipe",
    network: "ethereum",
    symbol: "SXP",
    transferLimit: "4132231404958677729280",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8c6D0af7ab24E2Ed74CA1AEBb3E51D9cE393b008",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326",
    name: "Band Protocol",
    network: "ethereum",
    symbol: "BAND",
    transferLimit: "555555555555555540992",
    homeNetwork: "ethereum"
  },
  {
    address: "0x902475D0Fd5A54CDA71CAc85fA67AbE41F13Ef11",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774",
    name: "Dai Stablecoin",
    network: "ethereum",
    symbol: "DAI",
    transferLimit: "5012003748978804916224",
    homeNetwork: "ethereum"
  },
  {
    address: "0xe3F0834A2E91C657D24f041ad46300D83806dAd0",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425",
    name: "Compound",
    network: "ethereum",
    symbol: "COMP",
    transferLimit: "19435590453237972992",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4FcaFf7746608A6310691b5A91d41F8Bc2AD85Bc",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10951/thumb/UMA.png?1586307916",
    name: "UMA",
    network: "ethereum",
    symbol: "UMA",
    transferLimit: "460405156537753272320",
    homeNetwork: "ethereum"
  },
  {
    address: "0x75D163Ffd3B13F0F0654f25772bdF9174F6Ad458",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png?1592792958",
    name: "Balancer",
    network: "ethereum",
    symbol: "BAL",
    transferLimit: "210437710437710430208",
    homeNetwork: "ethereum"
  },
  {
    address: "0xBDb7FAf0bE838d86F1eDE2549D51a70Eba119cCc",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330",
    name: "yearn finance",
    network: "ethereum",
    symbol: "YFI",
    transferLimit: "165766004707754528",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc7d9eDB7BE3e9D6C3d12661c67C8669F3AdfeC51",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/11970/thumb/serum-logo.png?1597121577",
    name: "Serum",
    network: "ethereum",
    symbol: "SRM",
    transferLimit: "2604166666",
    homeNetwork: "ethereum"
  },
  {
    address: "0x037ccf19C4F2dc644392084A2c32020dd92AE37C",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11976/thumb/Cream.png?1596593418",
    name: "Cream",
    network: "ethereum",
    symbol: "CREAM",
    transferLimit: "32823475349570011136",
    homeNetwork: "ethereum"
  },
  {
    address: "0xBFfcb603A89742098edc22AA4187b9D513305C77",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942",
    name: "SAND",
    network: "ethereum",
    symbol: "SAND",
    transferLimit: "55533342218668080103424",
    homeNetwork: "ethereum"
  },
  {
    address: "0xeaE8348617EDe45f363d0B061560b34567b93827",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688",
    name: "Sushi",
    network: "ethereum",
    symbol: "SUSHI",
    transferLimit: "595947556615017725952",
    homeNetwork: "ethereum"
  },
  {
    address: "0x53FD7B91E6d819aD421ae3065899441dD4E0d022",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12440/thumb/esd_logo_circle.png?1603676421",
    name: "Empty Set Dollar",
    network: "ethereum",
    symbol: "ESD",
    transferLimit: "23367980258730274979840",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc9ACBBBB7781bEeCdF9DAf953E481Aa74BbA6203",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    name: "Uniswap",
    network: "ethereum",
    symbol: "UNI",
    transferLimit: "325097529258777640960",
    homeNetwork: "ethereum"
  },
  {
    address: "0xf45bf408ce96F36eF9a8E32f73d5F97e87b2fD34",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
    name: "Aave",
    network: "ethereum",
    symbol: "AAVE",
    transferLimit: "16593103906016661504",
    homeNetwork: "ethereum"
  },
  {
    address: "0x1105202c67bB1295Ce1B0BcF303D79327DFdf07e",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853",
    name: "BarnBridge",
    network: "ethereum",
    symbol: "BOND",
    transferLimit: "100341159943808942080",
    homeNetwork: "ethereum"
  },
  {
    address: "0xD1a919b5A948302a05F75a613707d7b8629Bcc47",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13238/thumb/WFIL-Icon.png?1606630561",
    name: "Wrapped Filecoin",
    network: "ethereum",
    symbol: "WFIL",
    transferLimit: "178316690442225385472",
    homeNetwork: "ethereum"
  },
  {
    address: "0x736a886EEc09fccDdDa868206F070CF1b131a8b9",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566",
    name: "The Graph",
    network: "ethereum",
    symbol: "GRT",
    transferLimit: "8004341554859355406336",
    homeNetwork: "ethereum"
  },
  {
    address: "0x44181Bb8564904B99CEf74E261659925FB67D6df",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13454/thumb/lon_logo.png?1608701720",
    name: "Tokenlon",
    network: "ethereum",
    symbol: "LON",
    transferLimit: "748502994011976105984",
    homeNetwork: "ethereum"
  },
  {
    address: "0xFF03e7FAefa15015Bd7562d90bF3bBFF5f20866E",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    name: "1inch",
    network: "ethereum",
    symbol: "1INCH",
    transferLimit: "1582278481012658274304",
    homeNetwork: "ethereum"
  },
  {
    address: "0xB589Cb59F02D6F6226f643D3cf45541ca26db56e",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13677/thumb/BrMhBTr8_400x400.jpg?1610723303",
    name: "THORChain ERC20",
    network: "ethereum",
    symbol: "RUNE",
    transferLimit: "1547987616099071164416",
    homeNetwork: "ethereum"
  },
  {
    address: "0x775f3E95CFecf751A1A1c3e4423793f814e3A419",
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/13767/thumb/Secret_S_Black_Coingecko.png?1611667298",
    name: "Secret ERC20 ",
    network: "ethereum",
    symbol: "WSCRT",
    transferLimit: "4464285714",
    homeNetwork: "ethereum"
  },
  {
    address: "0x38b55ca57c8067254F3cDcBbC42E13502D8AF0af",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3334/small/iotex-logo.png?1547037941",
    name: "IoTeX",
    network: "ethereum",
    symbol: "IOTX",
    transferLimit: "458715596330000000000000",
    homeNetwork: "ethereum"
  },
  {
    address: "0xe2Fb7837845e13816fB5376d94A1DF9403B44A64",
    name: "Reef Finance",
    symbol: "REEF",
    decimals: 18,
    transferLimit: "277355888654000000000000",
    network: "ethereum",
    imageUrl: "https://assets.coingecko.com/coins/images/13504/small/Group_10572.png?1610534130",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbE93f6523B834Fe77360aC7D4caF5a176DBb24A4",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4932/thumb_2x/_QPpjoUi_400x400.jpg?1566430520",
    name: "COCOS BCX",
    network: "ethereum",
    symbol: "cocos",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xb147eceD3E755A4EfE59F517fd0C4DA0EB5197Fd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3373/small/IuNzUb5b_400x400.jpg?1589526336",
    name: "Keep Network",
    network: "ethereum",
    symbol: "keep",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x00858922a3899410bdDf8eFA0c8C1cb121d6E0Fb",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3296/small/op.jpg?1547037878",
    name: "Origin Protocol",
    network: "ethereum",
    symbol: "ogn",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x18103BbeD63165a54396174Fb27fC239712A3A08",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12782/small/logocircle.png?1611944557",
    name: "DAOfi",
    network: "ethereum",
    symbol: "daofi",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x5d8a6754510521C5B6BEFFa3901A79048A8210b9",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12509/small/linear.jpg?1606884470",
    name: "Linear",
    network: "ethereum",
    symbol: "lina",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9DddB85CA245863DA71Cdce9Bd6931027d552c11",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9351/small/12ships.png?1566485390",
    name: "12Ships",
    network: "ethereum",
    symbol: "tshp",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0x8d38e872B962597395BdBEce07Ceca822608f140",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13803/small/b20.png?1611996305",
    name: "B.20",
    network: "ethereum",
    symbol: "b20",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0xCB0d94427fD96b2beF355efC4ECB0787a9311170",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3328/small/Akropolis.png?1547037929",
    name: "Akropolis",
    network: "ethereum",
    symbol: "akro",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9eeCBe0F0bdBfC08211937C265282b513BF483cF",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12623/small/RFUEL_SQR.png?1602481093",
    name: "Rio Fuel Token",
    network: "ethereum",
    symbol: "rfuel",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "0x1228dC7733DB560f72c11c86B3d28ADE20632B2d",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12843/small/image.png?1611212077",
    name: "Rally",
    network: "ethereum",
    symbol: "rly",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2ccA17Ff8B0f1f0bFF9a0D3Db1db42a118e03696",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/convergence_32.png",
    name: "Convergence",
    network: "ethereum",
    symbol: "conv",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x231Ebb6883DDaDeD987E3B24dA326eB691C8eBc3",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/render_32.png",
    name: "Render Token",
    network: "ethereum",
    symbol: "rndr",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x8a9A18098B1add191523a459769d1b447C3B8c15",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/paidnetwork_32.png",
    name: "PAID Network",
    network: "ethereum",
    symbol: "paid",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "0x4e90489e5478F06db6EdA518f63263b5E612FA40",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14460/small/Tidal-mono.png?1616233894",
    name: "Tidal",
    network: "ethereum",
    symbol: "tidal",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11939/small/SHIBLOGO.png?1600752116",
    name: "SHIBA INU",
    network: "ethereum",
    symbol: "SHIB",
    transferLimit: "99999999999999999999999",
    homeNetwork: "ethereum"
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/dogekiller_32.png",
    name: "DOGE KILLER",
    network: "ethereum",
    symbol: "LEASH",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    name: "Photon",
    network: "ethereum",
    homeNetwork: "cosmoshub",
    symbol: "uphoton",
    displaySymbol: "photon",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676",
    name: "AKT",
    network: "ethereum",
    homeNetwork: "akash",
    symbol: "uakt",
    displaySymbol: "akt",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14879/small/Sentinel_512X512.png?1622174499",
    name: "DVPN",
    network: "ethereum",
    homeNetwork: "sentinel",
    symbol: "udvpn",
    displaySymbol: "dvpn",
    transferLimit: "99999999999999999999999"
  },
  {
    address: "0xABe580E7ee158dA464b51ee1a83Ac0289622e6be",
    symbol: "xft",
    displaySymbol: "xft",
    decimals: 18,
    name: "Offshift",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Offshift",
    imageUrl: "https://assets.coingecko.com/coins/images/11977/small/CsBrPiA.png?1614570441",
    decommissioned: false
  },
  {
    address: "0xf1b99e3e573a1a9c5e6b2ce818b617f0e664e86b",
    symbol: "osqth",
    displaySymbol: "osqth",
    decimals: 18,
    name: "Opyn Squeeth",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Opyn Squeeth",
    imageUrl: "https://assets.coingecko.com/coins/images/22806/small/DyVT5XPV_400x400.jpg?1642656239"
  },
  {
    address: "0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c",
    symbol: "uos",
    displaySymbol: "uos",
    decimals: 4,
    name: "Ultra",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ultra",
    imageUrl: "https://assets.coingecko.com/coins/images/4480/small/Ultra.png?1563356418"
  },
  {
    address: "0x98585dFc8d9e7D48F0b1aE47ce33332CF4237D96",
    symbol: "newo",
    displaySymbol: "newo",
    decimals: 18,
    name: "New Order",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "New Order",
    imageUrl: "https://assets.coingecko.com/coins/images/21440/small/new-order-icon-256px.png?1639125759"
  },
  {
    address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
    symbol: "gala",
    displaySymbol: "gala",
    decimals: 8,
    name: "Gala",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Gala",
    imageUrl: "https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png?1600233435"
  },
  {
    address: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
    symbol: "push",
    displaySymbol: "push",
    decimals: 18,
    name: "Ethereum Push Notification Service - EPNS",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ethereum Push Notification Service - EPNS",
    imageUrl: "https://assets.coingecko.com/coins/images/14769/small/epns_logo.jpg?1618330344"
  },
  {
    address: "0x949d48eca67b17269629c7194f4b727d4ef9e5d6",
    symbol: "mc",
    displaySymbol: "mc",
    decimals: 18,
    name: "Merit Circle",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Merit Circle",
    imageUrl: "https://assets.coingecko.com/coins/images/19304/small/Db4XqML.png?1634972154"
  },
  {
    address: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
    symbol: "inj",
    displaySymbol: "inj",
    decimals: 18,
    name: "Injective",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Injective",
    imageUrl: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png?1628233237"
  }
];
var assets_ethereum_testnet_default = {
  assets: assets4
};

// src/config/networks/sifchain/assets.sifchain.localnet.json
var assets5 = [
  {
    symbol: "rowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "./images/siflogo.png",
    network: "sifchain",
    displaySymbol: "rowan",
    homeNetwork: "sifchain"
  },
  {
    address: "0x2701E1D67219a49F5691C92468Fe8D8ADc03e609",
    imageUrl: "https://assets.coingecko.com/coins/images/17103/small/DINO.png?1626244014",
    name: "DinoSwap",
    displaySymbol: "DINO",
    symbol: "cdino",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12681/small/UST.png?1601612407",
    name: "Terra USD",
    label: "Terra USD",
    network: "sifchain",
    displaySymbol: "UST (ERC-20)",
    symbol: "cust",
    homeNetwork: "ethereum"
  }
];
var assets_sifchain_localnet_default = {
  assets: assets5
};

// src/config/networks/sifchain/assets.sifchain.mainnet.json
var assets6 = [
  {
    symbol: "rowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "./images/siflogo.png",
    network: "sifchain",
    displaySymbol: "rowan",
    homeNetwork: "sifchain"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    name: "Tether USDT",
    network: "sifchain",
    symbol: "cusdt",
    displaySymbol: "usdt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    name: "Ethereum",
    network: "sifchain",
    symbol: "ceth",
    displaySymbol: "eth",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427",
    name: "Basic Attention Token",
    network: "sifchain",
    symbol: "cbat",
    displaySymbol: "bat",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/681/thumb/JelZ58cv_400x400.png?1601449653",
    name: "Aragon",
    network: "sifchain",
    symbol: "cant",
    displaySymbol: "ant",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/736/thumb/bancor.png?1547034477",
    name: "Bancor Network Token",
    network: "sifchain",
    symbol: "cbnt",
    displaySymbol: "bnt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/863/thumb/0x.png?1547034672",
    name: "0x",
    network: "sifchain",
    symbol: "czrx",
    displaySymbol: "zrx",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    name: "Chainlink",
    network: "sifchain",
    symbol: "clink",
    displaySymbol: "link",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745",
    name: "Decentraland",
    network: "sifchain",
    symbol: "cmana",
    displaySymbol: "mana",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/913/thumb/LRC.png?1572852344",
    name: "Loopring",
    network: "sifchain",
    symbol: "clrc",
    displaySymbol: "lrc",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078",
    name: "Enjin Coin",
    network: "sifchain",
    symbol: "cenj",
    displaySymbol: "enj",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3406/thumb/SNX.png?1598631139",
    name: "Synthetix Network Token",
    network: "sifchain",
    symbol: "csnx",
    displaySymbol: "snx",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3449/thumb/TUSD.png?1559172762",
    name: "TrueUSD",
    network: "sifchain",
    symbol: "ctusd",
    displaySymbol: "tusd",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686",
    name: "Ocean Protocol",
    network: "sifchain",
    symbol: "cocean",
    hasDarkIcon: true,
    displaySymbol: "ocean",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016",
    name: "Fantom",
    network: "sifchain",
    symbol: "cftm",
    displaySymbol: "ftm",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1562212426",
    name: "sUSD",
    network: "sifchain",
    symbol: "csusd",
    displaySymbol: "susd",
    homeNetwork: "ethereum"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    name: "USD Coin",
    network: "sifchain",
    symbol: "cusdc",
    displaySymbol: "usdc",
    homeNetwork: "ethereum"
  },
  {
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cypto.png?1547043960",
    name: "Crypto com Coin",
    network: "sifchain",
    symbol: "ccro",
    displaySymbol: "CRO (ERC-20)",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Crypto.org's ERC-20 token has been decommissioned on Sifchain in favor of the Cosmos CRO token. Please export all CRO (ERC-20) off of Sifchain."
  },
  {
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    name: "Wrapped Bitcoin",
    network: "sifchain",
    symbol: "cwbtc",
    displaySymbol: "wbtc",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311",
    name: "Swipe",
    network: "sifchain",
    symbol: "csxp",
    displaySymbol: "sxp",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326",
    name: "Band Protocol",
    network: "sifchain",
    symbol: "cband",
    displaySymbol: "Band",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774",
    name: "Dai Stablecoin",
    network: "sifchain",
    symbol: "cdai",
    displaySymbol: "dai",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425",
    name: "Compound",
    network: "sifchain",
    symbol: "ccomp",
    displaySymbol: "comp",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10951/thumb/UMA.png?1586307916",
    name: "UMA",
    network: "sifchain",
    symbol: "cuma",
    displaySymbol: "uma",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png?1592792958",
    name: "Balancer",
    network: "sifchain",
    symbol: "cbal",
    displaySymbol: "bal",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330",
    name: "yearn finance",
    network: "sifchain",
    symbol: "cyfi",
    displaySymbol: "yfi",
    homeNetwork: "ethereum"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/11970/thumb/serum-logo.png?1597121577",
    name: "Serum",
    network: "sifchain",
    symbol: "csrm",
    displaySymbol: "srm",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11976/thumb/Cream.png?1596593418",
    name: "Cream",
    network: "sifchain",
    symbol: "ccream",
    displaySymbol: "cream",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942",
    name: "SAND",
    network: "sifchain",
    symbol: "csand",
    displaySymbol: "sand",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688",
    name: "Sushi",
    network: "sifchain",
    symbol: "csushi",
    displaySymbol: "sushi",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12440/thumb/esd_logo_circle.png?1603676421",
    name: "Empty Set Dollar",
    network: "sifchain",
    symbol: "cesd",
    displaySymbol: "esd",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    name: "Uniswap",
    network: "sifchain",
    symbol: "cuni",
    displaySymbol: "uni",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
    name: "Aave",
    network: "sifchain",
    symbol: "caave",
    displaySymbol: "aave",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853",
    name: "BarnBridge",
    network: "sifchain",
    symbol: "cbond",
    displaySymbol: "bond",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13238/thumb/WFIL-Icon.png?1606630561",
    name: "Wrapped Filecoin",
    network: "sifchain",
    symbol: "cwfil",
    displaySymbol: "wfil",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566",
    name: "The Graph",
    network: "sifchain",
    symbol: "cgrt",
    displaySymbol: "grt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13454/thumb/lon_logo.png?1608701720",
    name: "Tokenlon",
    network: "sifchain",
    symbol: "clon",
    displaySymbol: "lon",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    name: "1inch",
    network: "sifchain",
    symbol: "c1inch",
    displaySymbol: "1inch",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13677/thumb/BrMhBTr8_400x400.jpg?1610723303",
    name: "THORChain ERC20",
    network: "sifchain",
    symbol: "crune",
    displaySymbol: "rune",
    homeNetwork: "ethereum"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/13767/thumb/Secret_S_Black_Coingecko.png?1611667298",
    name: "Secret ERC20",
    network: "sifchain",
    symbol: "cwscrt",
    displaySymbol: "wscrt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3334/small/iotex-logo.png?1547037941",
    name: "IoTeX",
    network: "sifchain",
    symbol: "ciotx",
    displaySymbol: "iotx",
    homeNetwork: "ethereum"
  },
  {
    imageUrl: "https://assets.coingecko.com/coins/images/13504/small/Group_10572.png?1610534130",
    name: "Reef Finance",
    symbol: "creef",
    network: "sifchain",
    decimals: 18,
    displaySymbol: "reef",
    homeNetwork: "ethereum"
  },
  {
    imageUrl: "https://assets.coingecko.com/coins/images/4932/thumb/_QPpjoUi_400x400.jpg?1566430520",
    name: "COCOS BCX",
    symbol: "ccocos",
    network: "sifchain",
    decimals: 18,
    displaySymbol: "cocos",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3373/small/IuNzUb5b_400x400.jpg?1589526336",
    name: "Keep Network",
    network: "sifchain",
    symbol: "ckeep",
    displaySymbol: "keep",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3296/small/op.jpg?1547037878",
    name: "Origin Protocol",
    network: "sifchain",
    symbol: "cogn",
    displaySymbol: "ogn",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12782/small/logocircle.png?1611944557",
    name: "DAOfi",
    network: "sifchain",
    hasDarkIcon: true,
    symbol: "cdaofi",
    displaySymbol: "daofi",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12509/small/linear.jpg?1606884470",
    name: "Linear",
    network: "sifchain",
    symbol: "clina",
    displaySymbol: "lina",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9351/small/12ships.png?1566485390",
    name: "12Ships",
    network: "sifchain",
    symbol: "ctshp",
    displaySymbol: "tshp",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13803/small/b20.png?1611996305",
    name: "B.20",
    network: "sifchain",
    symbol: "cb20",
    displaySymbol: "b20",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3328/small/Akropolis.png?1547037929",
    name: "Akropolis",
    network: "sifchain",
    symbol: "cakro",
    displaySymbol: "akro",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12623/small/RFUEL_SQR.png?1602481093",
    name: "Rio Fuel Token",
    network: "sifchain",
    symbol: "crfuel",
    displaySymbol: "rfuel",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12843/small/image.png?1611212077",
    name: "Rally",
    network: "sifchain",
    symbol: "crly",
    displaySymbol: "rly",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/convergence_32.png",
    name: "Convergence",
    network: "sifchain",
    symbol: "cconv",
    displaySymbol: "conv",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/render_32.png",
    name: "Render Token",
    network: "sifchain",
    symbol: "crndr",
    displaySymbol: "rndr",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/paidnetwork_32.png",
    name: "PAID Network",
    network: "sifchain",
    symbol: "cpaid",
    displaySymbol: "paid",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14460/small/Tidal-mono.png?1616233894",
    name: "Tidal",
    network: "sifchain",
    symbol: "ctidal",
    displaySymbol: "tidal",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11939/small/SHIBLOGO.png?1600752116",
    name: "SHIBA INU",
    network: "sifchain",
    symbol: "cshib",
    displaySymbol: "shib",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/dogekiller_32.png",
    name: "DOGE KILLER",
    network: "sifchain",
    symbol: "cleash",
    displaySymbol: "leash",
    homeNetwork: "ethereum"
  },
  {
    symbol: "uatom",
    decimals: 6,
    name: "Atom",
    network: "sifchain",
    label: "Atom",
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    displaySymbol: "atom",
    homeNetwork: "cosmoshub"
  },
  {
    symbol: "uakt",
    decimals: 6,
    name: "Akash Token",
    network: "sifchain",
    label: "AKT",
    imageUrl: "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676",
    displaySymbol: "akt",
    homeNetwork: "akash"
  },
  {
    symbol: "udvpn",
    decimals: 6,
    name: "Sentinel",
    network: "sifchain",
    label: "Sentinel",
    imageUrl: "https://assets.coingecko.com/coins/images/14879/small/Sentinel_512X512.png?1622174499",
    displaySymbol: "dvpn",
    homeNetwork: "sentinel"
  },
  {
    symbol: "uiris",
    decimals: 6,
    name: "IRIS",
    network: "sifchain",
    label: "IRIS",
    imageUrl: "https://assets.coingecko.com/coins/images/5135/small/IRIS.png?1557999365",
    displaySymbol: "iris",
    homeNetwork: "iris"
  },
  {
    symbol: "basecro",
    displaySymbol: "cro",
    decimals: 8,
    name: "CRO",
    network: "sifchain",
    label: "CRO",
    imageUrl: "https://assets.coingecko.com/coins/images/7310/small/cypto.png?1547043960",
    homeNetwork: "crypto-org"
  },
  {
    symbol: "uxprt",
    displaySymbol: "xprt",
    decimals: 6,
    name: "xprt",
    network: "sifchain",
    label: "xprt",
    imageUrl: "https://persistence.one/favicon.png",
    homeNetwork: "persistence"
  },
  {
    symbol: "uregen",
    displaySymbol: "regen",
    decimals: 6,
    name: "regen",
    network: "sifchain",
    label: "regen",
    imageUrl: "https://assets.coingecko.com/coins/images/16733/small/REGEN.png?1624861317",
    homeNetwork: "regen"
  },
  {
    symbol: "uosmo",
    displaySymbol: "osmo",
    decimals: 6,
    name: "osmo",
    network: "sifchain",
    label: "osmo",
    imageUrl: "https://assets.coingecko.com/coins/images/16724/small/osmosis.jpeg?1624849879",
    homeNetwork: "osmosis"
  },
  {
    address: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12681/small/UST.png?1601612407",
    name: "Terra USD",
    label: "Terra USD",
    network: "sifchain",
    displaySymbol: "UST",
    symbol: "cust",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Temporarily disabled due to Terra instability"
  },
  {
    address: "0x853d955acef822db058eb8505911ed77f175b99e",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13422/small/frax_logo.png?1608476506",
    name: "Frax",
    label: "Frax",
    network: "sifchain",
    displaySymbol: "FRAX",
    hasDarkIcon: true,
    symbol: "cfrax",
    homeNetwork: "ethereum"
  },
  {
    address: "0xc52c326331e9ce41f04484d3b5e5648158028804",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14830/small/7xjpHaG.png?1618564961",
    name: "Unizen",
    label: "Unizen",
    network: "sifchain",
    displaySymbol: "ZCX",
    symbol: "czcx",
    homeNetwork: "ethereum"
  },
  {
    address: "0x217ddead61a42369a266f1fb754eb5d3ebadc88a",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/15482/small/donkey_logo.jpg?1621012824",
    name: "Don-key",
    label: "Don-key",
    displaySymbol: "DON",
    symbol: "cdon",
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
    imageUrl: "https://assets.coingecko.com/coins/images/15595/small/metis.PNG?1621298076",
    name: "Metis Token",
    label: "Metis Token",
    displaySymbol: "Metis",
    symbol: "cmetis",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
    imageUrl: "https://assets.coingecko.com/coins/images/13423/small/frax_share.png?1608478989",
    name: "Frax Share",
    label: "Frax Share",
    displaySymbol: "FXS",
    symbol: "cfxs",
    hasDarkIcon: true,
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0xEF53462838000184F35f7D991452e5f25110b207",
    imageUrl: "https://assets.coingecko.com/coins/images/15632/small/knit.jpg?1621396114",
    name: "Knit Finance",
    label: "Knit Finance",
    displaySymbol: "KFT",
    symbol: "ckft",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0xb9ef770b6a5e12e45983c5d80545258aa38f3b78",
    imageUrl: "https://assets.coingecko.com/coins/images/4934/small/0_Black-svg.png?1600757954",
    name: "0chain",
    label: "0chain",
    displaySymbol: "ZCN",
    symbol: "czcn",
    hasDarkIcon: true,
    decimals: 10,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0xFa14Fa6958401314851A17d6C5360cA29f74B57B",
    imageUrl: "https://assets.coingecko.com/coins/images/14750/small/SAITO.png?1626857406",
    name: "SAITO",
    label: "SAITO",
    displaySymbol: "SAITO",
    symbol: "csaito",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x9695e0114e12c0d3a3636fab5a18e6b737529023",
    imageUrl: "https://assets.coingecko.com/coins/images/15368/small/SgqhfWz4_400x400_%281%29.jpg?1620666919",
    name: "DFYN Token",
    label: "DFYN Token",
    displaySymbol: "DFYN",
    symbol: "cdfyn",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x20a8cec5fffea65be7122bcab2ffe32ed4ebf03a",
    imageUrl: "https://assets.coingecko.com/coins/images/17321/small/asset_icon_dnxc_200.png?1627292452",
    name: "DinoX Coin",
    label: "DinoX Coin",
    displaySymbol: "DNXC",
    symbol: "cdnxc",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbbc2ae13b23d715c30720f079fcd9b4a74093505",
    imageUrl: "https://assets.coingecko.com/coins/images/14238/small/ethernity_logo.png?1615189750",
    name: "@EthernityChain $ERN Token",
    label: "@EthernityChain $ERN Token",
    displaySymbol: "ERN",
    symbol: "cern",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x83e6f1e41cdd28eaceb20cb649155049fac3d5aa",
    imageUrl: "https://assets.coingecko.com/coins/images/12648/small/polkastarter.png?1609813702",
    name: "PolkastarterToken",
    label: "PolkastarterToken",
    displaySymbol: "POLS",
    symbol: "cpols",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
    imageUrl: "https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png?1604471082",
    name: "Axie Infinity Shard",
    label: "Axie Infinity Shard",
    displaySymbol: "AXS",
    symbol: "caxs",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    imageUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    name: "Matic Token",
    label: "Matic Token",
    displaySymbol: "MATIC",
    symbol: "cmatic",
    decimals: 18,
    network: "sifchain",
    homeNetwork: "ethereum"
  },
  {
    address: "0x2e9d63788249371f1dfc918a52f8d799f4a38c94",
    imageUrl: "https://assets.coingecko.com/coins/images/17495/small/tokemak-avatar-200px-black.png?1628131614",
    name: "Tokemak",
    label: "Tokemak",
    displaySymbol: "TOKE",
    symbol: "ctoke",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    symbol: "uluna",
    displaySymbol: "luna",
    decimals: 6,
    name: "luna",
    network: "sifchain",
    label: "luna",
    imageUrl: "https://assets.coingecko.com/coins/images/8284/small/luna1557227471663.png?1567147072",
    homeNetwork: "terra",
    decommissioned: true,
    decommissionReason: "Temporarily disabled due to Terra instability"
  },
  {
    symbol: "uusd",
    displaySymbol: "UST",
    decimals: 6,
    name: "TerraUSD",
    network: "sifchain",
    label: "TerraUSD",
    imageUrl: "https://assets.coingecko.com/coins/images/12681/small/UST.png?1601612407",
    homeNetwork: "terra",
    decommissioned: true,
    decommissionReason: "Temporarily disabled due to Terra instability"
  },
  {
    address: "0x05079687d35b93538cbd59fe5596380cae9054a9",
    imageUrl: "https://assets.coingecko.com/coins/images/5041/large/logo_-_2021-01-10T210801.390.png?1610284134",
    name: "BitSong",
    displaySymbol: "BTSG (ERC-20)",
    symbol: "cbtsg",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x6c28aef8977c9b773996d0e8376d2ee379446f2f",
    imageUrl: "https://assets.coingecko.com/coins/images/13970/small/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659",
    name: "QuickSwap",
    displaySymbol: "QUICK",
    symbol: "cquick",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
    imageUrl: "https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png?1609873644",
    name: "Lido DAO",
    displaySymbol: "LDO",
    symbol: "cldo",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0xe76c6c83af64e4c60245d8c7de953df673a7a33d",
    imageUrl: "https://assets.coingecko.com/coins/images/16840/small/railgun.jpeg?1625322775",
    name: "Railgun",
    symbol: "crail",
    displaySymbol: "RAIL",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x57b946008913b82e4df85f501cbaed910e58d26c",
    imageUrl: "https://assets.coingecko.com/coins/images/8903/small/POND_200x200.png?1622515451",
    name: "Marlin",
    displaySymbol: "POND",
    symbol: "cpond",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x2701E1D67219a49F5691C92468Fe8D8ADc03e609",
    imageUrl: "https://assets.coingecko.com/coins/images/17103/small/DINO.png?1626244014",
    name: "DinoSwap",
    displaySymbol: "DINO",
    symbol: "cdino",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b",
    imageUrl: "https://assets.coingecko.com/coins/images/16801/small/ufo_logo.jpg?1630078847",
    name: "UFO Gaming",
    displaySymbol: "UFO",
    symbol: "cufo",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    address: "0x4461cfd640da24d1a4642fa5f9ea3e6da966b831",
    symbol: "ccsms",
    displaySymbol: "csms",
    decimals: 18,
    name: "Cosmostarter",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Cosmostarter",
    imageUrl: "https://assets.coingecko.com/coins/images/19875/small/cosmosstarter.PNG?1636083064"
  },
  {
    address: "0xae697f994fc5ebc000f8e22ebffee04612f98a0d",
    symbol: "clgcy",
    displaySymbol: "lgcy",
    decimals: 18,
    name: "LGCY Network",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "LGCY Network",
    imageUrl: "https://assets.coingecko.com/coins/images/12181/small/LGCY_network.jpg?1597926587"
  },
  {
    symbol: "ujuno",
    displaySymbol: "juno",
    decimals: 6,
    name: "juno",
    network: "sifchain",
    label: "juno",
    imageUrl: "https://junoscan.com/icons/safari-pinned-tab.svg",
    homeNetwork: "juno"
  },
  {
    symbol: "uixo",
    displaySymbol: "ixo",
    decimals: 6,
    name: "ixo",
    network: "sifchain",
    label: "ixo",
    imageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
    homeNetwork: "ixo"
  },
  {
    symbol: "uband",
    displaySymbol: "band",
    decimals: 6,
    name: "band",
    network: "sifchain",
    label: "band",
    imageUrl: "https://assets.coingecko.com/coins/images/9545/small/Band_token_blue_violet_token.png?1625881431",
    homeNetwork: "band"
  },
  {
    symbol: "nanolike",
    displaySymbol: "like",
    decimals: 9,
    name: "likecoin",
    network: "sifchain",
    homeNetwork: "likecoin",
    label: "like",
    imageUrl: "https://assets.coingecko.com/coins/images/10212/small/likecoin.png?1576640519"
  },
  {
    address: "0xd01cb3d113a864763dd3977fe1e725860013b0ed",
    symbol: "cratom",
    displaySymbol: "ratom",
    lowercasePrefixLength: 1,
    decimals: 18,
    name: "ratom",
    network: "sifchain",
    label: "ratom",
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    homeNetwork: "ethereum"
  },
  {
    address: "0x16ba8Efe847EBDFef99d399902ec29397D403C30",
    symbol: "coh",
    displaySymbol: "oh",
    decimals: 18,
    name: "oh",
    label: "oh",
    network: "sifchain",
    homeNetwork: "ethereum",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13143.png"
  },
  {
    symbol: "ungm",
    displaySymbol: "ngm",
    decimals: 6,
    name: "ngm",
    network: "sifchain",
    homeNetwork: "emoney",
    label: "ngm",
    imageUrl: "https://assets.coingecko.com/coins/images/13722/small/logo-200x200.jpg?1626095888"
  },
  {
    symbol: "uiov",
    displaySymbol: "iov",
    decimals: 6,
    name: "iov",
    network: "sifchain",
    homeNetwork: "starname",
    label: "iov",
    imageUrl: "https://assets.coingecko.com/coins/images/12660/small/iov.png?1601862353"
  },
  {
    symbol: "eeur",
    displaySymbol: "eeur",
    decimals: 6,
    name: "e-Money EUR",
    network: "sifchain",
    homeNetwork: "emoney",
    label: "e-Money EUR",
    imageUrl: "https://assets.coingecko.com/coins/images/18817/small/eeur.jpg?1633508407"
  },
  {
    symbol: "aevmos",
    displaySymbol: "evmos",
    decimals: 18,
    name: "EVMOS",
    network: "sifchain",
    homeNetwork: "evmos",
    label: "evmos",
    imageUrl: "https://assets.coingecko.com/coins/images/24023/small/Evmos_Token_Orange_RGB.png?1651162025"
  },
  {
    symbol: "uscrt",
    displaySymbol: "scrt",
    decimals: 6,
    name: "scrt",
    network: "sifchain",
    homeNetwork: "secret",
    label: "scrt",
    imageUrl: "https://assets.coingecko.com/coins/images/11871/small/Secret.png?1595520186"
  },
  {
    address: "0xABe580E7ee158dA464b51ee1a83Ac0289622e6be",
    symbol: "cxft",
    displaySymbol: "xft",
    decimals: 18,
    name: "Offshift",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Offshift",
    imageUrl: "https://assets.coingecko.com/coins/images/11977/small/CsBrPiA.png?1614570441"
  },
  {
    address: "0xf1b99e3e573a1a9c5e6b2ce818b617f0e664e86b",
    symbol: "cosqth",
    displaySymbol: "osqth",
    decimals: 18,
    name: "Opyn Squeeth",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Opyn Squeeth",
    imageUrl: "https://assets.coingecko.com/coins/images/22806/small/DyVT5XPV_400x400.jpg?1642656239"
  },
  {
    address: "0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c",
    symbol: "cuos",
    displaySymbol: "uos",
    decimals: 4,
    name: "Ultra",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Ultra",
    imageUrl: "https://assets.coingecko.com/coins/images/4480/small/Ultra.png?1563356418"
  },
  {
    address: "0x98585dFc8d9e7D48F0b1aE47ce33332CF4237D96",
    symbol: "cnewo",
    displaySymbol: "newo",
    decimals: 18,
    name: "New Order",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "New Order",
    imageUrl: "https://assets.coingecko.com/coins/images/21440/small/new-order-icon-256px.png?1639125759"
  },
  {
    address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
    symbol: "cgala",
    displaySymbol: "gala",
    decimals: 8,
    name: "Gala",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Gala",
    imageUrl: "https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png?1600233435"
  },
  {
    address: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
    symbol: "cpush",
    displaySymbol: "push",
    decimals: 18,
    name: "Ethereum Push Notification Service - EPNS",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Ethereum Push Notification Service - EPNS",
    imageUrl: "https://assets.coingecko.com/coins/images/14769/small/epns_logo.jpg?1618330344"
  },
  {
    address: "0x949d48eca67b17269629c7194f4b727d4ef9e5d6",
    symbol: "cmc",
    displaySymbol: "mc",
    decimals: 18,
    name: "Merit Circle",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Merit Circle",
    imageUrl: "https://assets.coingecko.com/coins/images/19304/small/Db4XqML.png?1634972154"
  },
  {
    address: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
    symbol: "cinj",
    displaySymbol: "inj",
    decimals: 18,
    name: "Injective",
    network: "sifchain",
    homeNetwork: "ethereum",
    label: "Injective",
    imageUrl: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png?1628233237"
  }
];
var assets_sifchain_mainnet_default = {
  assets: assets6
};

// src/config/networks/sifchain/assets.sifchain.devnet.json
var assets7 = [
  {
    symbol: "rowan",
    decimals: 18,
    name: "Rowan",
    imageUrl: "./images/siflogo.png",
    network: "sifchain",
    displaySymbol: "rowan",
    homeNetwork: "sifchain"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    name: "Tether USDT",
    network: "sifchain",
    symbol: "cusdt",
    displaySymbol: "usdt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    name: "Ethereum",
    network: "sifchain",
    symbol: "ceth",
    displaySymbol: "eth",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427",
    name: "Basic Attention Token",
    network: "sifchain",
    symbol: "cbat",
    displaySymbol: "bat",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/681/thumb/JelZ58cv_400x400.png?1601449653",
    name: "Aragon",
    network: "sifchain",
    symbol: "cant",
    displaySymbol: "ant",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/736/thumb/bancor.png?1547034477",
    name: "Bancor Network Token",
    network: "sifchain",
    symbol: "cbnt",
    displaySymbol: "bnt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/863/thumb/0x.png?1547034672",
    name: "0x",
    network: "sifchain",
    symbol: "czrx",
    displaySymbol: "zrx",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    name: "Chainlink",
    network: "sifchain",
    symbol: "clink",
    displaySymbol: "link",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745",
    name: "Decentraland",
    network: "sifchain",
    symbol: "cmana",
    displaySymbol: "mana",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/913/thumb/LRC.png?1572852344",
    name: "Loopring",
    network: "sifchain",
    symbol: "clrc",
    displaySymbol: "lrc",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078",
    name: "Enjin Coin",
    network: "sifchain",
    symbol: "cenj",
    displaySymbol: "enj",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3406/thumb/SNX.png?1598631139",
    name: "Synthetix Network Token",
    network: "sifchain",
    symbol: "csnx",
    displaySymbol: "snx",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3449/thumb/TUSD.png?1559172762",
    name: "TrueUSD",
    network: "sifchain",
    symbol: "ctusd",
    displaySymbol: "tusd",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686",
    name: "Ocean Protocol",
    network: "sifchain",
    symbol: "cocean",
    displaySymbol: "ocean",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016",
    name: "Fantom",
    network: "sifchain",
    symbol: "cftm",
    displaySymbol: "ftm",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1562212426",
    name: "sUSD",
    network: "sifchain",
    symbol: "csusd",
    displaySymbol: "susd",
    homeNetwork: "ethereum"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    name: "USD Coin",
    network: "sifchain",
    symbol: "cusdc",
    displaySymbol: "usdc",
    homeNetwork: "ethereum"
  },
  {
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cypto.png?1547043960",
    name: "Crypto com Coin",
    network: "sifchain",
    symbol: "ccro",
    displaySymbol: "CRO (ERC-20)",
    homeNetwork: "ethereum",
    decommissioned: true,
    decommissionReason: "Crypto.org's ERC-20 token has been decommissioned on Sifchain in favor of the Cosmos CRO token. Please export all CRO (ERC-20) off of Sifchain."
  },
  {
    decimals: 8,
    imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    name: "Wrapped Bitcoin",
    network: "sifchain",
    symbol: "cwbtc",
    displaySymbol: "wbtc",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311",
    name: "Swipe",
    network: "sifchain",
    symbol: "csxp",
    displaySymbol: "sxp",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9545/small/Band_token_blue_violet_token.png?1625881431",
    name: "Band Protocol",
    network: "sifchain",
    symbol: "cband",
    displaySymbol: "Band (ERC-20)",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774",
    name: "Dai Stablecoin",
    network: "sifchain",
    symbol: "cdai",
    displaySymbol: "dai",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425",
    name: "Compound",
    network: "sifchain",
    symbol: "ccomp",
    displaySymbol: "comp",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/10951/thumb/UMA.png?1586307916",
    name: "UMA",
    network: "sifchain",
    symbol: "cuma",
    displaySymbol: "uma",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png?1592792958",
    name: "Balancer",
    network: "sifchain",
    symbol: "cbal",
    displaySymbol: "bal",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330",
    name: "yearn finance",
    network: "sifchain",
    symbol: "cyfi",
    displaySymbol: "yfi",
    homeNetwork: "ethereum"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/11970/thumb/serum-logo.png?1597121577",
    name: "Serum",
    network: "sifchain",
    symbol: "csrm",
    displaySymbol: "srm",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11976/thumb/Cream.png?1596593418",
    name: "Cream",
    network: "sifchain",
    symbol: "ccream",
    displaySymbol: "cream",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942",
    name: "SAND",
    network: "sifchain",
    symbol: "csand",
    displaySymbol: "sand",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688",
    name: "Sushi",
    network: "sifchain",
    symbol: "csushi",
    displaySymbol: "sushi",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12440/thumb/esd_logo_circle.png?1603676421",
    name: "Empty Set Dollar",
    network: "sifchain",
    symbol: "cesd",
    displaySymbol: "esd",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    name: "Uniswap",
    network: "sifchain",
    symbol: "cuni",
    displaySymbol: "uni",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
    name: "Aave",
    network: "sifchain",
    symbol: "caave",
    displaySymbol: "aave",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853",
    name: "BarnBridge",
    network: "sifchain",
    symbol: "cbond",
    displaySymbol: "bond",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13238/thumb/WFIL-Icon.png?1606630561",
    name: "Wrapped Filecoin",
    network: "sifchain",
    symbol: "cwfil",
    displaySymbol: "wfil",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566",
    name: "The Graph",
    network: "sifchain",
    symbol: "cgrt",
    displaySymbol: "grt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13454/thumb/lon_logo.png?1608701720",
    name: "Tokenlon",
    network: "sifchain",
    symbol: "clon",
    displaySymbol: "lon",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    name: "1inch",
    network: "sifchain",
    symbol: "c1inch",
    displaySymbol: "1inch",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13677/thumb/BrMhBTr8_400x400.jpg?1610723303",
    name: "THORChain ERC20",
    network: "sifchain",
    symbol: "crune",
    displaySymbol: "rune",
    homeNetwork: "ethereum"
  },
  {
    decimals: 6,
    imageUrl: "https://assets.coingecko.com/coins/images/13767/thumb/Secret_S_Black_Coingecko.png?1611667298",
    name: "Secret ERC20",
    network: "sifchain",
    symbol: "cwscrt",
    displaySymbol: "wscrt",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3334/small/iotex-logo.png?1547037941",
    name: "IoTeX",
    network: "sifchain",
    symbol: "ciotx",
    displaySymbol: "iotx",
    homeNetwork: "ethereum"
  },
  {
    imageUrl: "https://assets.coingecko.com/coins/images/13504/small/Group_10572.png?1610534130",
    name: "Reef Finance",
    symbol: "creef",
    network: "sifchain",
    decimals: 18,
    displaySymbol: "reef",
    homeNetwork: "ethereum"
  },
  {
    imageUrl: "https://assets.coingecko.com/coins/images/4932/thumb/_QPpjoUi_400x400.jpg?1566430520",
    name: "COCOS BCX",
    symbol: "ccocos",
    network: "sifchain",
    decimals: 18,
    displaySymbol: "cocos",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3373/small/IuNzUb5b_400x400.jpg?1589526336",
    name: "Keep Network",
    network: "sifchain",
    symbol: "ckeep",
    displaySymbol: "keep",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3296/small/op.jpg?1547037878",
    name: "Origin Protocol",
    network: "sifchain",
    symbol: "cogn",
    displaySymbol: "ogn",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12782/small/logocircle.png?1611944557",
    name: "DAOfi",
    network: "sifchain",
    symbol: "cdaofi",
    displaySymbol: "daofi",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12509/small/linear.jpg?1606884470",
    name: "Linear",
    network: "sifchain",
    symbol: "clina",
    displaySymbol: "lina",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/9351/small/12ships.png?1566485390",
    name: "12Ships",
    network: "sifchain",
    symbol: "ctshp",
    displaySymbol: "tshp",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/13803/small/b20.png?1611996305",
    name: "B.20",
    network: "sifchain",
    symbol: "cb20",
    displaySymbol: "b20",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/3328/small/Akropolis.png?1547037929",
    name: "Akropolis",
    network: "sifchain",
    symbol: "cakro",
    displaySymbol: "akro",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12623/small/RFUEL_SQR.png?1602481093",
    name: "Rio Fuel Token",
    network: "sifchain",
    symbol: "crfuel",
    displaySymbol: "rfuel",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12843/small/image.png?1611212077",
    name: "Rally",
    network: "sifchain",
    symbol: "crly",
    displaySymbol: "rly",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/convergence_32.png",
    name: "Convergence",
    network: "sifchain",
    symbol: "cconv",
    displaySymbol: "conv",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/render_32.png",
    name: "Render Token",
    network: "sifchain",
    symbol: "crndr",
    displaySymbol: "rndr",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/paidnetwork_32.png",
    name: "PAID Network",
    network: "sifchain",
    symbol: "cpaid",
    displaySymbol: "paid",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/14460/small/Tidal-mono.png?1616233894",
    name: "Tidal",
    network: "sifchain",
    symbol: "ctidal",
    displaySymbol: "tidal",
    homeNetwork: "ethereum",
    hasDarkIcon: true
  },
  {
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/11939/small/SHIBLOGO.png?1600752116",
    name: "SHIBA INU",
    network: "sifchain",
    symbol: "cshib",
    displaySymbol: "shib",
    homeNetwork: "ethereum"
  },
  {
    decimals: 18,
    imageUrl: "https://etherscan.io/token/images/dogekiller_32.png",
    name: "DOGE KILLER",
    network: "sifchain",
    symbol: "cleash",
    displaySymbol: "leash",
    homeNetwork: "ethereum"
  },
  {
    symbol: "uphoton",
    decimals: 6,
    name: "Photon",
    network: "sifchain",
    label: "Photon",
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    displaySymbol: "photon",
    homeNetwork: "cosmoshub"
  },
  {
    symbol: "uakt",
    decimals: 6,
    name: "Akash Token",
    network: "sifchain",
    label: "AKT",
    imageUrl: "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676",
    displaySymbol: "akt",
    homeNetwork: "akash"
  },
  {
    symbol: "uatom",
    decimals: 6,
    name: "Atom",
    network: "sifchain",
    label: "Atom",
    imageUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png?1555657960",
    displaySymbol: "atom",
    homeNetwork: "cosmoshub"
  },
  {
    symbol: "udvpn",
    decimals: 6,
    name: "Sentinel",
    network: "sifchain",
    label: "Sentinel",
    imageUrl: "https://assets.coingecko.com/coins/images/14879/small/Sentinel_512X512.png?1622174499",
    displaySymbol: "dvpn",
    homeNetwork: "sentinel"
  },
  {
    symbol: "unyan",
    decimals: 6,
    name: "Nyan",
    network: "sifchain",
    label: "Nyan",
    imageUrl: "https://assets.coingecko.com/coins/images/5135/small/IRIS.png?1557999365",
    displaySymbol: "nyan",
    homeNetwork: "iris"
  },
  {
    symbol: "basecro",
    displaySymbol: "cro",
    decimals: 8,
    name: "CRO",
    network: "sifchain",
    label: "CRO",
    imageUrl: "https://assets.coingecko.com/coins/images/7310/small/cypto.png?1547043960",
    homeNetwork: "crypto-org"
  },
  {
    symbol: "uxprt",
    displaySymbol: "xprt",
    decimals: 6,
    name: "xprt",
    network: "sifchain",
    label: "xprt",
    imageUrl: "https://persistence.one/favicon.png",
    homeNetwork: "persistence"
  },
  {
    symbol: "uregen",
    displaySymbol: "regen",
    decimals: 6,
    name: "regen",
    network: "sifchain",
    label: "regen",
    imageUrl: "https://assets.coingecko.com/coins/images/16733/small/REGEN.png?1624861317",
    homeNetwork: "regen"
  },
  {
    address: "0x2701E1D67219a49F5691C92468Fe8D8ADc03e609",
    imageUrl: "https://assets.coingecko.com/coins/images/17103/small/DINO.png?1626244014",
    name: "DinoSwap",
    displaySymbol: "DINO",
    symbol: "cdino",
    network: "sifchain",
    homeNetwork: "ethereum",
    decimals: 18
  },
  {
    symbol: "uosmo",
    displaySymbol: "osmo",
    decimals: 6,
    name: "osmo",
    network: "sifchain",
    label: "osmo",
    imageUrl: "https://assets.coingecko.com/coins/images/16724/small/osmosis.jpeg?1624849879",
    homeNetwork: "osmosis"
  },
  {
    symbol: "uluna",
    displaySymbol: "luna",
    decimals: 6,
    name: "luna",
    network: "sifchain",
    label: "luna",
    imageUrl: "https://assets.coingecko.com/coins/images/8284/small/luna1557227471663.png?1567147072",
    homeNetwork: "terra"
  },
  {
    symbol: "ubtsg",
    displaySymbol: "btsg",
    decimals: 6,
    name: "btsg",
    network: "sifchain",
    label: "btsg",
    imageUrl: "https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png?1610284134",
    homeNetwork: "bitsong"
  },
  {
    symbol: "ucrbrus",
    displaySymbol: "crbrus",
    decimals: 6,
    name: "crbrus",
    network: "sifchain",
    label: "crbrus",
    imageUrl: "https://assets.coingecko.com/coins/images/24509/small/AUdZyrmO_400x400.png?1647931023",
    homeNetwork: "cerberus"
  },
  {
    symbol: "uhuahua",
    displaySymbol: "huahua",
    decimals: 6,
    name: "huahua",
    network: "sifchain",
    label: "huahua",
    imageUrl: "https://assets.coingecko.com/coins/images/15651/small/chihua.PNG?1621476950",
    homeNetwork: "chihuahua"
  },
  {
    symbol: "ucmdx",
    displaySymbol: "cmdx",
    decimals: 6,
    name: "cmdx",
    network: "sifchain",
    label: "cmdx",
    imageUrl: "https://assets.coingecko.com/coins/images/21540/small/_ooQky6B_400x400.jpg?1639447618",
    homeNetwork: "comdex"
  },
  {
    symbol: "uxki",
    displaySymbol: "xki",
    decimals: 6,
    name: "xki",
    network: "sifchain",
    label: "xki",
    imageUrl: "https://assets.coingecko.com/coins/images/15694/small/xki-color.png?1621569714",
    homeNetwork: "ki"
  },
  {
    symbol: "nanolike",
    displaySymbol: "nanolike",
    decimals: 6,
    name: "nanolike",
    network: "sifchain",
    label: "nanolike",
    imageUrl: "https://assets.coingecko.com/coins/images/10212/small/likecoin.png?1576640519",
    homeNetwork: "likecoin"
  },
  {
    symbol: "ustarx",
    displaySymbol: "starx",
    decimals: 6,
    name: "starx",
    network: "sifchain",
    label: "starx",
    imageUrl: "https://assets.coingecko.com/coins/images/10212/small/likecoin.png?1576640519",
    homeNetwork: "stargaze"
  },
  {
    address: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
    decimals: 18,
    imageUrl: "https://assets.coingecko.com/coins/images/12681/small/UST.png?1601612407",
    name: "Terra USD",
    label: "Terra USD",
    network: "sifchain",
    displaySymbol: "UST (ERC-20)",
    symbol: "cust",
    homeNetwork: "ethereum"
  },
  {
    symbol: "uusd",
    displaySymbol: "ust",
    decimals: 6,
    name: "TerraUSD",
    network: "sifchain",
    label: "TerraUSD",
    imageUrl: "https://assets.coingecko.com/coins/images/12681/small/UST.png?1601612407",
    homeNetwork: "terra"
  },
  {
    symbol: "ujuno",
    displaySymbol: "juno",
    decimals: 6,
    name: "juno",
    network: "sifchain",
    label: "juno",
    imageUrl: "https://junoscan.com/icons/safari-pinned-tab.svg",
    homeNetwork: "juno"
  },
  {
    symbol: "uixo",
    displaySymbol: "ixo",
    decimals: 6,
    name: "ixo",
    network: "sifchain",
    label: "ixo",
    imageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
    homeNetwork: "ixo"
  },
  {
    symbol: "uband",
    displaySymbol: "band",
    decimals: 6,
    name: "band",
    network: "sifchain",
    label: "band",
    imageUrl: "https://assets.coingecko.com/coins/images/9545/small/Band_token_blue_violet_token.png?1625881431",
    homeNetwork: "band"
  },
  {
    symbol: "nanolike",
    displaySymbol: "like",
    decimals: 9,
    name: "like",
    network: "sifchain",
    homeNetwork: "likecoin",
    label: "like",
    imageUrl: "https://assets.coingecko.com/coins/images/10212/small/likecoin.png?1576640519"
  },
  {
    symbol: "uiov",
    displaySymbol: "iov",
    decimals: 6,
    name: "iov",
    network: "sifchain",
    homeNetwork: "starname",
    label: "starname",
    imageUrl: "https://assets.coingecko.com/coins/images/12660/small/iov.png?1601862353"
  },
  {
    address: "0xABe580E7ee158dA464b51ee1a83Ac0289622e6be",
    symbol: "xft",
    displaySymbol: "xft",
    decimals: 18,
    name: "Offshift",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Offshift",
    imageUrl: "https://assets.coingecko.com/coins/images/11977/small/CsBrPiA.png?1614570441",
    decommissioned: false
  },
  {
    address: "0xf1b99e3e573a1a9c5e6b2ce818b617f0e664e86b",
    symbol: "osqth",
    displaySymbol: "osqth",
    decimals: 18,
    name: "Opyn Squeeth",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Opyn Squeeth",
    imageUrl: "https://assets.coingecko.com/coins/images/22806/small/DyVT5XPV_400x400.jpg?1642656239"
  },
  {
    address: "0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c",
    symbol: "uos",
    displaySymbol: "uos",
    decimals: 4,
    name: "Ultra",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ultra",
    imageUrl: "https://assets.coingecko.com/coins/images/4480/small/Ultra.png?1563356418"
  },
  {
    address: "0x98585dFc8d9e7D48F0b1aE47ce33332CF4237D96",
    symbol: "newo",
    displaySymbol: "newo",
    decimals: 18,
    name: "New Order",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "New Order",
    imageUrl: "https://assets.coingecko.com/coins/images/21440/small/new-order-icon-256px.png?1639125759"
  },
  {
    address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
    symbol: "gala",
    displaySymbol: "gala",
    decimals: 8,
    name: "Gala",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Gala",
    imageUrl: "https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png?1600233435"
  },
  {
    address: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
    symbol: "push",
    displaySymbol: "push",
    decimals: 18,
    name: "Ethereum Push Notification Service - EPNS",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Ethereum Push Notification Service - EPNS",
    imageUrl: "https://assets.coingecko.com/coins/images/14769/small/epns_logo.jpg?1618330344"
  },
  {
    address: "0x949d48eca67b17269629c7194f4b727d4ef9e5d6",
    symbol: "mc",
    displaySymbol: "mc",
    decimals: 18,
    name: "Merit Circle",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Merit Circle",
    imageUrl: "https://assets.coingecko.com/coins/images/19304/small/Db4XqML.png?1634972154"
  },
  {
    address: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
    symbol: "inj",
    displaySymbol: "inj",
    decimals: 18,
    name: "Injective",
    network: "ethereum",
    homeNetwork: "ethereum",
    label: "Injective",
    imageUrl: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png?1628233237"
  }
];
var assets_sifchain_devnet_default = {
  assets: assets7
};

// src/utils/parseConfig.ts
init_esm_shims();
function getMetamaskProvider() {
  throw new Error("Not implemented");
}
function parseLabel(a) {
  if (a.network === "sifchain") {
    return a.symbol.indexOf("c") === 0 ? "c" + a.symbol.slice(1).toUpperCase() : a.symbol.toUpperCase();
  }
  return a.symbol === "erowan" ? "eROWAN" : a.symbol.toUpperCase();
}
function parseAsset(a) {
  return Asset({
    ...a,
    displaySymbol: a.displaySymbol || a.symbol,
    label: parseLabel(a)
  });
}
function parseAssets(configAssets) {
  return configAssets.map(parseAsset);
}
function parseConfig(config, assets8, chainConfigsByNetwork, peggyCompatibleCosmosBaseDenoms) {
  const nativeAsset5 = assets8.find((a) => a.symbol === config.nativeAsset);
  if (!nativeAsset5)
    throw new Error("No nativeAsset defined for chain config:" + JSON.stringify(config));
  const bridgetokenContractAddress = assets8.find((token) => token.symbol === "erowan")?.address;
  const sifAssets = assets8.filter((asset) => asset.network === "sifchain").map((sifAsset) => {
    return {
      coinDenom: sifAsset.symbol,
      coinDecimals: sifAsset.decimals,
      coinMinimalDenom: sifAsset.symbol
    };
  });
  return {
    peggyCompatibleCosmosBaseDenoms,
    chains: [],
    chainConfigsByNetwork,
    sifAddrPrefix: config.sifAddrPrefix,
    sifApiUrl: config.sifApiUrl,
    sifRpcUrl: config.sifRpcUrl,
    sifChainId: config.sifChainId,
    cryptoeconomicsUrl: config.cryptoeconomicsUrl,
    blockExplorerUrl: config.blockExplorerUrl,
    getWeb3Provider: config.web3Provider === "metamask" ? getMetamaskProvider : async () => config.web3Provider,
    assets: assets8,
    nativeAsset: nativeAsset5,
    bridgebankContractAddress: config.bridgebankContractAddress,
    bridgetokenContractAddress,
    keplrChainConfig: {
      ...config.keplrChainConfig,
      rest: config.sifApiUrl,
      rpc: config.sifRpcUrl,
      chainId: config.sifChainId,
      currencies: sifAssets
    }
  };
}

// src/config/getEnv.ts
init_esm_shims();

// src/config/AppCookies.ts
init_esm_shims();
import Cookies from "js-cookie";

// src/config/getEnv.ts
var NETWORK_ENVS = /* @__PURE__ */ new Set([
  "localnet",
  "devnet",
  "testnet",
  "mainnet"
]);

// src/config/chains/index.ts
init_esm_shims();

// src/config/chains/ethereum/index.ts
init_esm_shims();

// src/config/chains/NetEnvChainConfigLookup.ts
init_esm_shims();

// src/config/chains/ethereum/ethereum-testnet.ts
init_esm_shims();
var ETHEREUM_TESTNET = {
  chainType: "eth",
  chainId: "0x3",
  network: "ethereum",
  displayName: "Ethereum",
  blockExplorerUrl: "https://ropsten.etherscan.io",
  blockExplorerApiUrl: "https://api-ropsten.etherscan.io",
  nativeAssetSymbol: "eth"
};

// src/config/chains/ethereum/ethereum-mainnet.ts
init_esm_shims();
var ETHEREUM_MAINNET = {
  chainType: "eth",
  chainId: "0x1",
  network: "ethereum",
  displayName: "Ethereum",
  blockExplorerUrl: "https://etherscan.io",
  blockExplorerApiUrl: "https://api.etherscan.io",
  nativeAssetSymbol: "eth"
};

// src/config/chains/ethereum/index.ts
var ethereum_default = {
  devnet: ETHEREUM_TESTNET,
  testnet: ETHEREUM_TESTNET,
  localnet: ETHEREUM_TESTNET,
  mainnet: ETHEREUM_MAINNET
};

// src/config/chains/sifchain/index.ts
init_esm_shims();

// src/config/chains/sifchain/sifchain-devnet.ts
init_esm_shims();
var SIFCHAIN_DEVNET = {
  network: Network.SIFCHAIN,
  chainType: "ibc",
  displayName: "Sifchain",
  blockExplorerUrl: "https://www.mintscan.io/sifchain",
  nativeAssetSymbol: "rowan",
  chainId: "sifchain-devnet-1",
  rpcUrl: "https://rpc-devnet.sifchain.finance",
  restUrl: "https://api-devnet.sifchain.finance",
  keplrChainInfo: {
    chainName: "Sifchain Devnet",
    chainId: "sifchain-devnet-1",
    rpc: "https://rpc-devnet.sifchain.finance",
    rest: "https://api-devnet.sifchain.finance",
    stakeCurrency: {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sif",
      bech32PrefixAccPub: "sifpub",
      bech32PrefixValAddr: "sifvaloper",
      bech32PrefixValPub: "sifvaloperpub",
      bech32PrefixConsAddr: "sifvalcons",
      bech32PrefixConsPub: "sifvalconspub"
    },
    currencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 5e12,
      average: 65e11,
      high: 8e12
    },
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/sifchain/sifchain-testnet.ts
init_esm_shims();
var SIFCHAIN_TESTNET = {
  network: Network.SIFCHAIN,
  chainType: "ibc",
  displayName: "Sifchain",
  blockExplorerUrl: "https://www.mintscan.io/sifchain",
  nativeAssetSymbol: "rowan",
  chainId: "sifchain-testnet-1",
  rpcUrl: "https://rpc-testnet.sifchain.finance",
  restUrl: "https://api-testnet.sifchain.finance",
  keplrChainInfo: {
    chainName: "Sifchain Testnet",
    chainId: "sifchain-testnet-1",
    rpc: "https://rpc-testnet.sifchain.finance",
    rest: "https://api-testnet.sifchain.finance",
    stakeCurrency: {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sif",
      bech32PrefixAccPub: "sifpub",
      bech32PrefixValAddr: "sifvaloper",
      bech32PrefixValPub: "sifvaloperpub",
      bech32PrefixConsAddr: "sifvalcons",
      bech32PrefixConsPub: "sifvalconspub"
    },
    currencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 5e12,
      average: 65e11,
      high: 8e12
    },
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/sifchain/sifchain-mainnet.ts
init_esm_shims();
var SIFCHAIN_MAINNET = {
  network: Network.SIFCHAIN,
  chainType: "ibc",
  displayName: "Sifchain",
  blockExplorerUrl: "https://www.mintscan.io/sifchain",
  nativeAssetSymbol: "rowan",
  chainId: "sifchain-1",
  rpcUrl: "https://rpc.sifchain.finance",
  restUrl: "https://api-int.sifchain.finance",
  denomTracesPath: "/ibc/apps/transfer/v1/denom_traces",
  keplrChainInfo: {
    chainName: "Sifchain",
    chainId: "sifchain-1",
    rpc: "https://rpc.sifchain.finance",
    rest: "https://api-int.sifchain.finance",
    stakeCurrency: {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sif",
      bech32PrefixAccPub: "sifpub",
      bech32PrefixValAddr: "sifvaloper",
      bech32PrefixValPub: "sifvaloperpub",
      bech32PrefixConsAddr: "sifvalcons",
      bech32PrefixConsPub: "sifvalconspub"
    },
    currencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 5e12,
      average: 65e11,
      high: 8e12
    },
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/sifchain/sifchain-localnet.ts
init_esm_shims();
var SIFCHAIN_LOCALNET = {
  network: Network.SIFCHAIN,
  chainType: "ibc",
  displayName: "Sifchain",
  blockExplorerUrl: "https://www.mintscan.io/sifchain",
  nativeAssetSymbol: "rowan",
  chainId: "localnet",
  rpcUrl: "http://localhost:3000/api/sifchain-local/rpc",
  restUrl: "http://localhost:3000/api/sifchain-local/rest",
  keplrChainInfo: {
    chainName: "Sifchain Local",
    chainId: "localnet",
    rpc: "http://localhost:3000/api/sifchain-local/rpc",
    rest: "http://localhost:3000/api/sifchain-local/rest",
    stakeCurrency: {
      coinDenom: "ROWAN",
      coinMinimalDenom: "rowan",
      coinDecimals: 18
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sif",
      bech32PrefixAccPub: "sifpub",
      bech32PrefixValAddr: "sifvaloper",
      bech32PrefixValPub: "sifvaloperpub",
      bech32PrefixConsAddr: "sifvalcons",
      bech32PrefixConsPub: "sifvalconspub"
    },
    currencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ROWAN",
        coinMinimalDenom: "rowan",
        coinDecimals: 18
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 5e12,
      average: 65e11,
      high: 8e12
    },
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/sifchain/index.ts
var sifchain_default = {
  localnet: SIFCHAIN_LOCALNET,
  devnet: SIFCHAIN_DEVNET,
  testnet: SIFCHAIN_TESTNET,
  mainnet: SIFCHAIN_MAINNET
};

// src/config/chains/cosmoshub/index.ts
init_esm_shims();

// src/config/chains/cosmoshub/cosmoshub-testnet.ts
init_esm_shims();
var COSMOSHUB_TESTNET = {
  network: "cosmoshub",
  chainType: "ibc",
  displayName: "Cosmoshub",
  blockExplorerUrl: "https://mintscan.io/cosmos",
  nativeAssetSymbol: "uphoton",
  chainId: "cosmoshub-testnet",
  rpcUrl: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rpc",
  restUrl: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rpc",
    rest: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rest",
    chainId: "cosmoshub-testnet",
    chainName: "Cosmos Testnet",
    stakeCurrency: {
      coinDenom: "PHOTON",
      coinMinimalDenom: "uphoton",
      coinDecimals: 6,
      coinGeckoId: "cosmos"
    },
    walletUrl: "https://wallet.keplr.app/#/cosmoshub/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmospub",
      bech32PrefixValAddr: "cosmosvaloper",
      bech32PrefixValPub: "cosmosvaloperpub",
      bech32PrefixConsAddr: "cosmosvalcons",
      bech32PrefixConsPub: "cosmosvalconspub"
    },
    currencies: [
      {
        coinDenom: "PHOTON",
        coinMinimalDenom: "uphoton",
        coinDecimals: 6,
        coinGeckoId: "cosmos"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "PHOTON",
        coinMinimalDenom: "uphoton",
        coinDecimals: 6,
        coinGeckoId: "cosmos"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/cosmoshub/cosmoshub-mainnet.ts
init_esm_shims();
var COSMOSHUB_MAINNET = {
  network: "cosmoshub",
  chainType: "ibc",
  displayName: "Cosmoshub",
  blockExplorerUrl: "https://mintscan.io/cosmos",
  nativeAssetSymbol: "uatom",
  chainId: "cosmoshub-4",
  rpcUrl: "https://proxies.sifchain.finance/api/cosmoshub-4/rpc",
  restUrl: "https://proxies.sifchain.finance/api/cosmoshub-4/rest",
  denomTracesPath: "/ibc/apps/transfer/v1/denom_traces",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/cosmoshub-4/rpc",
    rest: "https://proxies.sifchain.finance/api/cosmoshub-4/rest",
    chainId: "cosmoshub-4",
    chainName: "Cosmos",
    stakeCurrency: {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos"
    },
    walletUrl: "https://wallet.keplr.app/#/cosmoshub/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmospub",
      bech32PrefixValAddr: "cosmosvaloper",
      bech32PrefixValPub: "cosmosvaloperpub",
      bech32PrefixConsAddr: "cosmosvalcons",
      bech32PrefixConsPub: "cosmosvalconspub"
    },
    currencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        coinGeckoId: "cosmos"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        coinGeckoId: "cosmos"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/cosmoshub/index.ts
var cosmoshub_default = {
  localnet: COSMOSHUB_TESTNET,
  devnet: COSMOSHUB_TESTNET,
  testnet: COSMOSHUB_TESTNET,
  mainnet: COSMOSHUB_MAINNET
};

// src/config/chains/iris/index.ts
init_esm_shims();

// src/config/chains/iris/iris-testnet.ts
init_esm_shims();
var IRIS_TESTNET = {
  chainType: "ibc",
  displayName: "IRISNet",
  blockExplorerUrl: "https://nyancat.iobscan.io/",
  nativeAssetSymbol: "unyan",
  network: Network.IRIS,
  chainId: "irissif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/irissif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/irissif-1/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/irissif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/irissif-1/rest",
    chainId: "irissif-1",
    chainName: "Iris Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "NYAN",
      coinMinimalDenom: "unyan",
      coinDecimals: 6,
      coinGeckoId: "iris"
    },
    walletUrl: "https://wallet.keplr.app/#/iris/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/iris/stake",
    bip44: {
      coinType: 566
    },
    bech32Config: {
      bech32PrefixAccAddr: "iaa",
      bech32PrefixAccPub: "iaapub",
      bech32PrefixValAddr: "iaavaloper",
      bech32PrefixValPub: "iaavaloperpub",
      bech32PrefixConsAddr: "iaavalcons",
      bech32PrefixConsPub: "iaavalconspub"
    },
    currencies: [
      {
        coinDenom: "NYAN",
        coinMinimalDenom: "unyan",
        coinDecimals: 6,
        coinGeckoId: "iris"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "NYAN",
        coinMinimalDenom: "unyan",
        coinDecimals: 6,
        coinGeckoId: "iris"
      }
    ],
    coinType: 556,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/iris/iris-mainnet.ts
init_esm_shims();
var IRIS_MAINNET = {
  network: Network.IRIS,
  chainType: "ibc",
  displayName: "IRISnet",
  blockExplorerUrl: "https://irishub.iobscan.io/",
  nativeAssetSymbol: "uiris",
  chainId: "irishub-1",
  rpcUrl: "https://proxies.sifchain.finance/api/irishub-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/irishub-1/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/irishub-1/rpc",
    rest: "https://proxies.sifchain.finance/api/irishub-1/rest",
    chainId: "irishub-1",
    chainName: "IRISnet",
    stakeCurrency: {
      coinDenom: "IRIS",
      coinMinimalDenom: "uiris",
      coinDecimals: 6,
      coinGeckoId: "iris"
    },
    walletUrl: "https://wallet.keplr.app/#/iris/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/iris/stake",
    bip44: {
      coinType: 566
    },
    bech32Config: {
      bech32PrefixAccAddr: "iaa",
      bech32PrefixAccPub: "iaapub",
      bech32PrefixValAddr: "iaavaloper",
      bech32PrefixValPub: "iaavaloperpub",
      bech32PrefixConsAddr: "iaavalcons",
      bech32PrefixConsPub: "iaavalconspub"
    },
    currencies: [
      {
        coinDenom: "IRIS",
        coinMinimalDenom: "uiris",
        coinDecimals: 6,
        coinGeckoId: "iris"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "IRIS",
        coinMinimalDenom: "uiris",
        coinDecimals: 6,
        coinGeckoId: "iris"
      }
    ],
    coinType: 556,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/iris/index.ts
var iris_default = {
  localnet: IRIS_TESTNET,
  devnet: IRIS_TESTNET,
  testnet: IRIS_TESTNET,
  mainnet: IRIS_MAINNET
};

// src/config/chains/akash/index.ts
init_esm_shims();

// src/config/chains/akash/akash-testnet.ts
init_esm_shims();
var AKASH_TESTNET = {
  network: "akash",
  chainType: "ibc",
  displayName: "Akash",
  blockExplorerUrl: "https://testnet.akash.aneka.io",
  nativeAssetSymbol: "uakt",
  chainId: "akashsif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/akashsif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/akashsif-1/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/akashsif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/akashsif-1/rest",
    chainId: "akashsif-1",
    chainName: "Akash Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "AKT",
      coinMinimalDenom: "uakt",
      coinDecimals: 6,
      coinGeckoId: "akash-network"
    },
    walletUrl: "https://wallet.keplr.app/#/akash/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/akash/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "akash",
      bech32PrefixAccPub: "akashpub",
      bech32PrefixValAddr: "akashvaloper",
      bech32PrefixValPub: "akashvaloperpub",
      bech32PrefixConsAddr: "akashvalcons",
      bech32PrefixConsPub: "akashvalconspub"
    },
    currencies: [
      {
        coinDenom: "AKT",
        coinMinimalDenom: "uakt",
        coinDecimals: 6,
        coinGeckoId: "akash-network"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "AKT",
        coinMinimalDenom: "uakt",
        coinDecimals: 6,
        coinGeckoId: "akash-network"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/akash/akash-mainnet.ts
init_esm_shims();
var AKASH_MAINNET = {
  network: "akash",
  chainType: "ibc",
  displayName: "Akash",
  blockExplorerUrl: "https://akash.aneka.io",
  nativeAssetSymbol: "uakt",
  chainId: "akashnet-2",
  rpcUrl: "https://proxies.sifchain.finance/api/akashnet-2/rpc",
  restUrl: "https://proxies.sifchain.finance/api/akashnet-2/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/akashnet-2/rpc",
    rest: "https://proxies.sifchain.finance/api/akashnet-2/rest",
    chainId: "akashnet-2",
    chainName: "Akash",
    stakeCurrency: {
      coinDenom: "AKT",
      coinMinimalDenom: "uakt",
      coinDecimals: 6,
      coinGeckoId: "akash-network"
    },
    walletUrl: "https://wallet.keplr.app/#/akash/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/akash/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "akash",
      bech32PrefixAccPub: "akashpub",
      bech32PrefixValAddr: "akashvaloper",
      bech32PrefixValPub: "akashvaloperpub",
      bech32PrefixConsAddr: "akashvalcons",
      bech32PrefixConsPub: "akashvalconspub"
    },
    currencies: [
      {
        coinDenom: "AKT",
        coinMinimalDenom: "uakt",
        coinDecimals: 6,
        coinGeckoId: "akash-network"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "AKT",
        coinMinimalDenom: "uakt",
        coinDecimals: 6,
        coinGeckoId: "akash-network"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/akash/index.ts
var akash_default = {
  localnet: AKASH_TESTNET,
  devnet: AKASH_TESTNET,
  testnet: AKASH_TESTNET,
  mainnet: AKASH_MAINNET
};

// src/config/chains/sentinel/index.ts
init_esm_shims();

// src/config/chains/sentinel/sentinel-mainnet.ts
init_esm_shims();
var SENTINEL_MAINNET = {
  chainType: "ibc",
  network: Network.SENTINEL,
  displayName: "Sentinel",
  blockExplorerUrl: "https://explorer.sentinel.co/",
  nativeAssetSymbol: "udvpn",
  chainId: "sentinelhub-2",
  rpcUrl: "https://proxies.sifchain.finance/api/sentinelhub-2/rpc",
  restUrl: "https://proxies.sifchain.finance/api/sentinelhub-2/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/sentinelhub-2/rpc",
    rest: "https://proxies.sifchain.finance/api/sentinelhub-2/rest",
    chainId: "sentinelhub-2",
    chainName: "Sentinel",
    stakeCurrency: {
      coinDenom: "udvpn",
      coinMinimalDenom: "udvpn",
      coinDecimals: 18,
      coinGeckoId: "sentinel"
    },
    walletUrl: "https://wallet.keplr.app/#/cosmoshub/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sent",
      bech32PrefixAccPub: "sentpub",
      bech32PrefixValAddr: "sentvaloper",
      bech32PrefixValPub: "sentvaloperpub",
      bech32PrefixConsAddr: "sentvalcons",
      bech32PrefixConsPub: "sentvalconspub"
    },
    currencies: [
      {
        coinDenom: "udvpn",
        coinMinimalDenom: "udvpn",
        coinDecimals: 18,
        coinGeckoId: "sentinel"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "udvpn",
        coinMinimalDenom: "udvpn",
        coinDecimals: 18,
        coinGeckoId: "sentinel"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/sentinel/index.ts
var sentinel_default = {
  localnet: SENTINEL_MAINNET,
  devnet: SENTINEL_MAINNET,
  testnet: SENTINEL_MAINNET,
  mainnet: SENTINEL_MAINNET
};

// src/config/chains/crypto-org/index.ts
init_esm_shims();

// src/config/chains/crypto-org/crypto-org-mainnet.ts
init_esm_shims();
var CRYPTO_ORG_MAINNET = {
  chainType: "ibc",
  network: "crypto-org",
  displayName: "Crypto.org",
  blockExplorerUrl: "https://crypto.org/explorer/",
  nativeAssetSymbol: "basecro",
  chainId: "crypto-org-chain-mainnet-1",
  rpcUrl: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rpc",
    rest: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rest",
    chainId: "crypto-org-chain-mainnet-1",
    chainName: "Sentinel",
    stakeCurrency: {
      coinDenom: "basecro",
      coinMinimalDenom: "basecro",
      coinDecimals: 8,
      coinGeckoId: "crypto-com-coin"
    },
    walletUrl: "https://wallet.keplr.app/#/crytpo-org/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/crypto-org/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "cro",
      bech32PrefixAccPub: "cropub",
      bech32PrefixValAddr: "crovaloper",
      bech32PrefixValPub: "crovaloperpub",
      bech32PrefixConsAddr: "crovalcons",
      bech32PrefixConsPub: "crovalconspub"
    },
    currencies: [
      {
        coinDenom: "basecro",
        coinMinimalDenom: "basecro",
        coinDecimals: 8,
        coinGeckoId: "crypto-com-coin"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "basecro",
        coinMinimalDenom: "basecro",
        coinDecimals: 8,
        coinGeckoId: "crypto-com-coin"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/crypto-org/index.ts
var crypto_org_default = {
  localnet: CRYPTO_ORG_MAINNET,
  devnet: CRYPTO_ORG_MAINNET,
  testnet: CRYPTO_ORG_MAINNET,
  mainnet: CRYPTO_ORG_MAINNET
};

// src/config/chains/persistence/index.ts
init_esm_shims();

// src/config/chains/persistence/persistence-testnet.ts
init_esm_shims();
var PERSISTENCE_TESTNET = {
  network: Network.PERSISTENCE,
  chainType: "ibc",
  displayName: "Persistence",
  blockExplorerUrl: "https://test-core-1.explorer.persistence.one/",
  nativeAssetSymbol: "uxprt",
  chainId: "test-core-1",
  rpcUrl: "https://proxies.sifchain.finance/api/test-core-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/test-core-1/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/test-core-1/rpc",
    rest: "https://proxies.sifchain.finance/api/test-core-1/rest",
    chainId: "test-core-1",
    chainName: "Persistence Testnet",
    stakeCurrency: {
      coinDenom: "XPRT",
      coinMinimalDenom: "uxprt",
      coinDecimals: 6,
      coinGeckoId: "persistence"
    },
    walletUrl: "https://wallet.keplr.app/#/persistence/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/persistence/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "persistence",
      bech32PrefixAccPub: "persistencepub",
      bech32PrefixValAddr: "persistencevaloper",
      bech32PrefixValPub: "persistencevaloperpub",
      bech32PrefixConsAddr: "persistencevalcons",
      bech32PrefixConsPub: "persistencevalconspub"
    },
    currencies: [
      {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/persistence/persistence-mainnet.ts
init_esm_shims();
var PERSISTENCE_MAINNET = {
  network: Network.PERSISTENCE,
  chainType: "ibc",
  displayName: "Persistence",
  blockExplorerUrl: "https://explorer.persistence.one/",
  nativeAssetSymbol: "uxprt",
  chainId: "core-1",
  rpcUrl: "https://rpc-persistence.keplr.app/",
  restUrl: "https://lcd-persistence.keplr.app/",
  keplrChainInfo: {
    rpc: "https://rpc-persistence.keplr.app/",
    rest: "https://lcd-persistence.keplr.app/",
    chainId: "core-1",
    chainName: "Persistence",
    stakeCurrency: {
      coinDenom: "XPRT",
      coinMinimalDenom: "uxprt",
      coinDecimals: 6,
      coinGeckoId: "persistence"
    },
    walletUrl: "https://wallet.keplr.app/#/persistence/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/persistence/stake",
    bip44: {
      coinType: 566
    },
    bech32Config: {
      bech32PrefixAccAddr: "persistence",
      bech32PrefixAccPub: "persistencepub",
      bech32PrefixValAddr: "persistencevaloper",
      bech32PrefixValPub: "persistencevaloperpub",
      bech32PrefixConsAddr: "persistencevalcons",
      bech32PrefixConsPub: "persistencevalconspub"
    },
    currencies: [
      {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      }
    ],
    coinType: 556,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/persistence/index.ts
var persistence_default = {
  localnet: PERSISTENCE_TESTNET,
  devnet: PERSISTENCE_TESTNET,
  testnet: PERSISTENCE_TESTNET,
  mainnet: PERSISTENCE_MAINNET
};

// src/config/chains/regen/index.ts
init_esm_shims();

// src/config/chains/regen/regen-mainnet.ts
init_esm_shims();
var REGEN_MAINNET = {
  chainType: "ibc",
  network: Network.REGEN,
  displayName: "Regen",
  blockExplorerUrl: "https://regen.aneka.io/",
  nativeAssetSymbol: "uregen",
  chainId: "regen-1",
  rpcUrl: "https://proxies.sifchain.finance/api/regen-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/regen-1/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/regen-1/rpc",
    rest: "https://proxies.sifchain.finance/api/regen-1/rest",
    chainId: "regen-1",
    chainName: "Regen",
    stakeCurrency: {
      coinDenom: "REGEN",
      coinMinimalDenom: "uregen",
      coinDecimals: 6,
      coinGeckoId: "regen"
    },
    walletUrl: "https://wallet.keplr.app/#/cosmoshub/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "sent",
      bech32PrefixAccPub: "sentpub",
      bech32PrefixValAddr: "sentvaloper",
      bech32PrefixValPub: "sentvaloperpub",
      bech32PrefixConsAddr: "sentvalcons",
      bech32PrefixConsPub: "sentvalconspub"
    },
    currencies: [
      {
        coinDenom: "REGEN",
        coinMinimalDenom: "uregen",
        coinDecimals: 6,
        coinGeckoId: "regen"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "REGEN",
        coinMinimalDenom: "uregen",
        coinDecimals: 6,
        coinGeckoId: "regen"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/regen/index.ts
var regen_default = {
  localnet: REGEN_MAINNET,
  devnet: REGEN_MAINNET,
  testnet: REGEN_MAINNET,
  mainnet: REGEN_MAINNET
};

// src/config/chains/osmosis/index.ts
init_esm_shims();

// src/config/chains/osmosis/osmosis-mainnet.ts
init_esm_shims();
var OSMOSIS_MAINNET = {
  chainType: "ibc",
  network: Network.OSMOSIS,
  displayName: "Osmosis",
  blockExplorerUrl: "https://www.mintscan.io/osmosis",
  nativeAssetSymbol: "uosmo",
  chainId: "osmosis-1",
  rpcUrl: "https://proxies.sifchain.finance/api/osmosis-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/osmosis-1/rest",
  features: {
    erc20Transfers: false
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/osmosis-1/rpc",
    rest: "https://proxies.sifchain.finance/api/osmosis-1/rest",
    chainId: "osmosis-1",
    chainName: "Osmosis",
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis"
    },
    walletUrl: "https://wallet.keplr.app/#/osmosis/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "osmo",
      bech32PrefixAccPub: "osmopub",
      bech32PrefixValAddr: "osmovaloper",
      bech32PrefixValPub: "osmovaloperpub",
      bech32PrefixConsAddr: "osmovalcons",
      bech32PrefixConsPub: "osmovalconspub"
    },
    currencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/osmosis/index.ts
var osmosis_default = {
  localnet: OSMOSIS_MAINNET,
  devnet: OSMOSIS_MAINNET,
  testnet: OSMOSIS_MAINNET,
  mainnet: OSMOSIS_MAINNET
};

// src/config/chains/terra/index.ts
init_esm_shims();

// src/config/chains/terra/terra-testnet.ts
init_esm_shims();
var TERRA_TESTNET = {
  network: Network.TERRA,
  chainType: "ibc",
  displayName: "Terra",
  blockExplorerUrl: "https://finder.terra.money/testnet/",
  nativeAssetSymbol: "uluna",
  chainId: "bombay-12",
  rpcUrl: "https://proxies.sifchain.finance/api/bombay-12/rpc",
  restUrl: "https://proxies.sifchain.finance/api/bombay-12/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/bombay-12/rpc",
    rest: "https://proxies.sifchain.finance/api/bombay-12/rest",
    chainId: "bombay-12",
    chainName: "Terra Testnet",
    stakeCurrency: {
      coinDenom: "LUNA",
      coinMinimalDenom: "uluna",
      coinDecimals: 6,
      coinGeckoId: "terra-luna"
    },
    walletUrl: "https://wallet.keplr.app/#/terra/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/terra/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "terra",
      bech32PrefixAccPub: "terrapub",
      bech32PrefixValAddr: "terravaloper",
      bech32PrefixValPub: "terravaloperpub",
      bech32PrefixConsAddr: "terravalcons",
      bech32PrefixConsPub: "terravalconspub"
    },
    currencies: [
      {
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        coinGeckoId: "terra-luna"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        coinGeckoId: "terra-luna"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/terra/terra-mainnet.ts
init_esm_shims();
var TERRA_MAINNET = {
  network: Network.TERRA,
  chainType: "ibc",
  displayName: "Terra",
  blockExplorerUrl: "https://finder.terra.money/mainnet/",
  nativeAssetSymbol: "uluna",
  chainId: "columbus-5",
  rpcUrl: "https://proxies.sifchain.finance/api/columbus-5/rpc",
  restUrl: "https://proxies.sifchain.finance/api/columbus-5/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/columbus-5/rpc",
    rest: "https://proxies.sifchain.finance/api/columbus-5/rest",
    chainId: "columbus-5",
    chainName: "Terra",
    stakeCurrency: {
      coinDenom: "LUNA",
      coinMinimalDenom: "uluna",
      coinDecimals: 6,
      coinGeckoId: "terra-luna"
    },
    walletUrl: "https://wallet.keplr.app/#/terra/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/terra/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "terra",
      bech32PrefixAccPub: "terrapub",
      bech32PrefixValAddr: "terravaloper",
      bech32PrefixValPub: "terravaloperpub",
      bech32PrefixConsAddr: "terravalcons",
      bech32PrefixConsPub: "terravalconspub"
    },
    currencies: [
      {
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        coinGeckoId: "terra-luna"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        coinGeckoId: "terra-luna"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/terra/index.ts
var terra_default = {
  localnet: TERRA_TESTNET,
  devnet: TERRA_TESTNET,
  testnet: TERRA_TESTNET,
  mainnet: TERRA_MAINNET
};

// src/config/chains/juno/index.ts
init_esm_shims();

// src/config/chains/juno/juno-mainnet.ts
init_esm_shims();
var JUNO_MAINNET = {
  chainType: "ibc",
  network: Network.JUNO,
  displayName: "Juno",
  blockExplorerUrl: "http://junoscan.com",
  nativeAssetSymbol: "ujuno",
  chainId: "juno-1",
  rpcUrl: "https://proxies.sifchain.finance/api/juno-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/juno-1/rest",
  features: {
    erc20Transfers: false
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/juno-1/rpc",
    rest: "https://proxies.sifchain.finance/api/juno-1/rest",
    chainId: "juno-1",
    chainName: "Juno",
    stakeCurrency: {
      coinDenom: "JUNO",
      coinMinimalDenom: "ujuno",
      coinDecimals: 6,
      coinGeckoId: "pool:ujuno"
    },
    walletUrl: "https://wallet.keplr.app/#/juno/stake",
    walletUrlForStaking: "https://stake.fish/en/juno/",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub"
    },
    currencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
        coinGeckoId: "pool:ujuno"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
        coinGeckoId: "pool:ujuno"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/juno/juno-testnet.ts
init_esm_shims();
var JUNO_TESTNET = {
  chainType: "ibc",
  network: Network.JUNO,
  displayName: "Juno",
  blockExplorerUrl: "http://junoscan.com",
  nativeAssetSymbol: "ujuno",
  chainId: "junosif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/junosif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/junosif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/junosif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/junosif-1/rest",
    chainId: "junosif-1",
    chainName: "Juno Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "JUNO",
      coinMinimalDenom: "ujuno",
      coinDecimals: 6,
      coinGeckoId: "pool:ujuno"
    },
    walletUrl: "https://wallet.keplr.app/#/juno/stake",
    walletUrlForStaking: "https://stake.fish/en/juno/",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub"
    },
    currencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
        coinGeckoId: "pool:ujuno"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
        coinGeckoId: "pool:ujuno"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/juno/index.ts
var juno_default = {
  localnet: JUNO_TESTNET,
  devnet: JUNO_TESTNET,
  testnet: JUNO_TESTNET,
  mainnet: JUNO_MAINNET
};

// src/config/chains/ixo/index.ts
init_esm_shims();

// src/config/chains/ixo/ixo-mainnet.ts
init_esm_shims();
var IXO_MAINNET = {
  chainType: "ibc",
  network: Network.IXO,
  displayName: "IXO",
  blockExplorerUrl: "https://proxies.sifchain.finance/api/impacthub-3/rest",
  nativeAssetSymbol: "uixo",
  chainId: "impacthub-3",
  rpcUrl: "https://proxies.sifchain.finance/api/impacthub-3/rpc",
  restUrl: "https://proxies.sifchain.finance/api/impacthub-3/rest",
  keplrChainInfo: {
    rpc: "https://rpc-impacthub.keplr.app",
    rest: "https://lcd-impacthub.keplr.app",
    chainId: "impacthub-3",
    chainName: "ixo",
    stakeCurrency: {
      coinDenom: "IXO",
      coinMinimalDenom: "uixo",
      coinDecimals: 6
    },
    walletUrl: true ? "https://wallet.keplr.app/#/ixo/stake" : "http://localhost:8081/#/ixo/stake",
    walletUrlForStaking: true ? "https://wallet.keplr.app/#/ixo/stake" : "http://localhost:8081/#/ixo/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "ixo",
      bech32PrefixAccPub: "ixopub",
      bech32PrefixValAddr: "ixovaloper",
      bech32PrefixValPub: "ixovaloperpub",
      bech32PrefixConsAddr: "ixovalcons",
      bech32PrefixConsPub: "ixovalconspub"
    },
    currencies: [
      {
        coinDenom: "IXO",
        coinMinimalDenom: "uixo",
        coinDecimals: 6
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "IXO",
        coinMinimalDenom: "uixo",
        coinDecimals: 6
      }
    ],
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/ixo/index.ts
var ixo_default = {
  localnet: IXO_MAINNET,
  devnet: IXO_MAINNET,
  testnet: IXO_MAINNET,
  mainnet: IXO_MAINNET
};

// src/config/chains/band/index.ts
init_esm_shims();

// src/config/chains/band/band-testnet.ts
init_esm_shims();
var BAND_TESTNET = {
  chainType: "ibc",
  displayName: "Band Protocol",
  blockExplorerUrl: "https://cosmoscan.io/",
  nativeAssetSymbol: "uband",
  network: "band",
  chainId: "band-laozi-testnet4",
  rpcUrl: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rpc",
  restUrl: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rpc",
    rest: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rest",
    chainId: "band-laozi-testnet4",
    chainName: "Band Protocol Testnet",
    stakeCurrency: {
      coinDenom: "UBAND",
      coinMinimalDenom: "uband",
      coinDecimals: 6,
      coinGeckoId: "band-protocol"
    },
    walletUrl: "https://wallet.keplr.app/#/band/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/band/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "band",
      bech32PrefixAccPub: "bandpub",
      bech32PrefixValAddr: "bandvaloper",
      bech32PrefixValPub: "bandvaloperpub",
      bech32PrefixConsAddr: "bandvalcons",
      bech32PrefixConsPub: "bandvalconspub"
    },
    currencies: [
      {
        coinDenom: "UBAND",
        coinMinimalDenom: "uband",
        coinDecimals: 6,
        coinGeckoId: "band-protocol"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "UBAND",
        coinMinimalDenom: "uband",
        coinDecimals: 6,
        coinGeckoId: "band-protocol"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/band/index.ts
var band_default = {
  localnet: BAND_TESTNET,
  devnet: BAND_TESTNET,
  testnet: BAND_TESTNET,
  mainnet: BAND_TESTNET
};

// src/config/chains/likecoin/index.ts
init_esm_shims();

// src/config/chains/likecoin/likecoin-mainnet.ts
init_esm_shims();
var LIKECOIN_MAINNET = {
  network: "likecoin",
  chainType: "ibc",
  displayName: "LikeCoin",
  blockExplorerUrl: "https://likecoin.bigdipper.live/",
  nativeAssetSymbol: "nanolike",
  chainId: "likecoin-mainnet-2",
  rpcUrl: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rpc",
  restUrl: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rest",
  keplrChainInfo: {
    chainId: "likecoin-mainnet-2",
    chainName: "LikeCoin",
    rpc: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rpc",
    rest: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rest",
    stakeCurrency: {
      coinDenom: "LIKE",
      coinMinimalDenom: "nanolike",
      coinDecimals: 9,
      coinGeckoId: "likecoin"
    },
    walletUrlForStaking: "https://stake.like.co",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmospub",
      bech32PrefixValAddr: "cosmosvaloper",
      bech32PrefixValPub: "cosmosvaloperpub",
      bech32PrefixConsAddr: "cosmosvalcons",
      bech32PrefixConsPub: "cosmosvalconspub"
    },
    currencies: [
      {
        coinDenom: "LIKE",
        coinMinimalDenom: "nanolike",
        coinDecimals: 9,
        coinGeckoId: "likecoin"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "LIKE",
        coinMinimalDenom: "nanolike",
        coinDecimals: 9,
        coinGeckoId: "likecoin"
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
      average: 1,
      high: 1e3
    },
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/likecoin/likecoin-testnet.ts
init_esm_shims();
var LIKECOIN_TESTNET = {
  network: Network.LIKECOIN,
  chainType: "ibc",
  displayName: "LikeCoin",
  blockExplorerUrl: "https://likecoin.bigdipper.live/",
  nativeAssetSymbol: "nanolike",
  chainId: "likecoinsif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/likecoinsif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/likecoinsif-1/rest",
  keplrChainInfo: {
    chainId: "likecoinsif-1",
    chainName: "LikeCoin",
    rpc: "https://proxies.sifchain.finance/api/likecoinsif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/likecoinsif-1/rest",
    stakeCurrency: {
      coinDenom: "LIKE",
      coinMinimalDenom: "nanolike",
      coinDecimals: 9,
      coinGeckoId: "likecoin"
    },
    walletUrlForStaking: "https://stake.like.co",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmospub",
      bech32PrefixValAddr: "cosmosvaloper",
      bech32PrefixValPub: "cosmosvaloperpub",
      bech32PrefixConsAddr: "cosmosvalcons",
      bech32PrefixConsPub: "cosmosvalconspub"
    },
    currencies: [
      {
        coinDenom: "LIKE",
        coinMinimalDenom: "nanolike",
        coinDecimals: 9,
        coinGeckoId: "likecoin"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "LIKE",
        coinMinimalDenom: "nanolike",
        coinDecimals: 9,
        coinGeckoId: "likecoin"
      }
    ],
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
      average: 1,
      high: 1e3
    },
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/likecoin/index.ts
var likecoin_default = {
  localnet: LIKECOIN_TESTNET,
  devnet: LIKECOIN_TESTNET,
  testnet: LIKECOIN_TESTNET,
  mainnet: LIKECOIN_MAINNET
};

// src/config/chains/emoney/index.ts
init_esm_shims();

// src/config/chains/emoney/emoney-mainnet.ts
init_esm_shims();
var EMONEY_MAINNET = {
  chainType: "ibc",
  network: "emoney",
  displayName: "e-Money",
  blockExplorerUrl: "https://emoney.bigdipper.live",
  nativeAssetSymbol: "ungm",
  chainId: "emoney-3",
  rpcUrl: "https://proxies.sifchain.finance/api/emoney-3/rpc",
  restUrl: "https://proxies.sifchain.finance/api/emoney-3/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/emoney-3/rpc",
    rest: "https://proxies.sifchain.finance/api/emoney-3/rest",
    chainId: "emoney-3",
    chainName: "e-Money",
    stakeCurrency: {
      coinDenom: "NGM",
      coinMinimalDenom: "ungm",
      coinDecimals: 6,
      coinGeckoId: "e-money"
    },
    walletUrl: "https://wallet.keplr.app/#/emoney/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/emoney/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "emoney",
      bech32PrefixAccPub: "emoneypub",
      bech32PrefixValAddr: "emoneyvaloper",
      bech32PrefixValPub: "emoneyvaloperpub",
      bech32PrefixConsAddr: "emoneyvalcons",
      bech32PrefixConsPub: "emoneyvalconspub"
    },
    currencies: [
      {
        coinDenom: "NGM",
        coinMinimalDenom: "ungm",
        coinDecimals: 6,
        coinGeckoId: "e-money"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "NGM",
        coinMinimalDenom: "ungm",
        coinDecimals: 6,
        coinGeckoId: "e-money"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/emoney/index.ts
var emoney_default = {
  localnet: EMONEY_MAINNET,
  devnet: EMONEY_MAINNET,
  testnet: EMONEY_MAINNET,
  mainnet: EMONEY_MAINNET
};

// src/config/chains/starname/index.ts
init_esm_shims();

// src/config/chains/starname/starname-testnet.ts
init_esm_shims();
var STARNAME_TESTNET = {
  chainType: "ibc",
  network: Network.STARNAME,
  displayName: "Starname",
  blockExplorerUrl: "https://www.mintscan.io/starname",
  nativeAssetSymbol: "uiov",
  chainId: "starnamesif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/starnamesif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/starnamesif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/starnamesif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/starnamesif-1/rest",
    chainId: "starnamesif-1",
    chainName: "Starname Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "IOV",
      coinMinimalDenom: "uiov",
      coinDecimals: 6,
      coinGeckoId: "pool:uiov"
    },
    walletUrl: "https://wallet.keplr.app/#/iov-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/iov-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "star",
      bech32PrefixAccPub: "starpub",
      bech32PrefixValAddr: "starvaloper",
      bech32PrefixValPub: "starvaloperpub",
      bech32PrefixConsAddr: "starvalcons",
      bech32PrefixConsPub: "starvalconspub"
    },
    currencies: [
      {
        coinDenom: "IOV",
        coinMinimalDenom: "uiov",
        coinDecimals: 6,
        coinGeckoId: "pool:uiov"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "IOV",
        coinMinimalDenom: "uiov",
        coinDecimals: 6,
        coinGeckoId: "pool:uiov"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/starname/starname-mainnet.ts
init_esm_shims();
var STARNAME_MAINNET = {
  chainType: "ibc",
  network: Network.STARNAME,
  displayName: "Starname",
  blockExplorerUrl: "https://www.mintscan.io/starname",
  nativeAssetSymbol: "uiov",
  chainId: "iov-mainnet-ibc",
  rpcUrl: "https://proxies.sifchain.finance/api/iov-mainnet-ibc/rpc",
  restUrl: "https://proxies.sifchain.finance/api/iov-mainnet-ibc/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/iov-mainnet-ibc/rpc",
    rest: "https://proxies.sifchain.finance/api/iov-mainnet-ibc/rest",
    chainId: "iov-mainnet-ibc",
    chainName: "Starname (Sifchain)",
    stakeCurrency: {
      coinDenom: "IOV",
      coinMinimalDenom: "uiov",
      coinDecimals: 6,
      coinGeckoId: "pool:uiov"
    },
    walletUrl: "https://wallet.keplr.app/#/iov-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/iov-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "star",
      bech32PrefixAccPub: "starpub",
      bech32PrefixValAddr: "starvaloper",
      bech32PrefixValPub: "starvaloperpub",
      bech32PrefixConsAddr: "starvalcons",
      bech32PrefixConsPub: "starvalconspub"
    },
    currencies: [
      {
        coinDenom: "IOV",
        coinMinimalDenom: "uiov",
        coinDecimals: 6,
        coinGeckoId: "pool:uiov"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "IOV",
        coinMinimalDenom: "uiov",
        coinDecimals: 6,
        coinGeckoId: "pool:uiov"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/starname/index.ts
var starname_default = {
  localnet: STARNAME_TESTNET,
  devnet: STARNAME_TESTNET,
  testnet: STARNAME_TESTNET,
  mainnet: STARNAME_MAINNET
};

// src/config/chains/bitsong/index.ts
init_esm_shims();

// src/config/chains/bitsong/bitsong-testnet.ts
init_esm_shims();
var BITSONG_TESTNET = {
  chainType: "ibc",
  network: "bitsong",
  displayName: "Bitsong",
  blockExplorerUrl: "https://www.mintscan.io/bitsong",
  nativeAssetSymbol: "ubtsg",
  chainId: "bitsongsif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/bitsongsif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/bitsongsif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/bitsongsif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/bitsongsif-1/rest",
    chainId: "bitsongsif-1",
    chainName: "Bitsong Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "BTSG",
      coinMinimalDenom: "ubtsg",
      coinDecimals: 6,
      coinGeckoId: "pool:ubtsg"
    },
    walletUrl: "https://wallet.keplr.app/#/btsg-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/btsg-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "bitsong",
      bech32PrefixAccPub: "bitsongpub",
      bech32PrefixValAddr: "bitsongvaloper",
      bech32PrefixValPub: "bitsongvaloperpub",
      bech32PrefixConsAddr: "bitsongvalcons",
      bech32PrefixConsPub: "bitsongvalconspub"
    },
    currencies: [
      {
        coinDenom: "BTSG",
        coinMinimalDenom: "ubtsg",
        coinDecimals: 6,
        coinGeckoId: "pool:ubtsg"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "BTSG",
        coinMinimalDenom: "ubtsg",
        coinDecimals: 6,
        coinGeckoId: "pool:ubtsg"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/bitsong/index.ts
var bitsong_default = {
  localnet: BITSONG_TESTNET,
  devnet: BITSONG_TESTNET,
  testnet: BITSONG_TESTNET,
  mainnet: BITSONG_TESTNET
};

// src/config/chains/cerberus/index.ts
init_esm_shims();

// src/config/chains/cerberus/cerberus-testnet.ts
init_esm_shims();
var CERBERUS_TESTNET = {
  chainType: "ibc",
  network: "cerberus",
  displayName: "Cerberus",
  blockExplorerUrl: "https://www.mintscan.io/cerberus",
  nativeAssetSymbol: "ucrbrus",
  chainId: "cerberussif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/cerberussif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/cerberussif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/cerberussif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/cerberussif-1/rest",
    chainId: "cerberussif-1",
    chainName: "Cerberus Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "CRBRUS",
      coinMinimalDenom: "ucrbrus",
      coinDecimals: 6,
      coinGeckoId: "pool:ucrbrus"
    },
    walletUrl: "https://wallet.keplr.app/#/crbrus-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/crbrus-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "cerberus",
      bech32PrefixAccPub: "cerberuspub",
      bech32PrefixValAddr: "cerberusvaloper",
      bech32PrefixValPub: "cerberusvaloperpub",
      bech32PrefixConsAddr: "cerberusvalcons",
      bech32PrefixConsPub: "cerberusvalconspub"
    },
    currencies: [
      {
        coinDenom: "CRBRUS",
        coinMinimalDenom: "ucrbrus",
        coinDecimals: 6,
        coinGeckoId: "pool:ucrbrus"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "CRBRUS",
        coinMinimalDenom: "ucrbrus",
        coinDecimals: 6,
        coinGeckoId: "pool:ucrbrus"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/cerberus/index.ts
var cerberus_default = {
  localnet: CERBERUS_TESTNET,
  devnet: CERBERUS_TESTNET,
  testnet: CERBERUS_TESTNET,
  mainnet: CERBERUS_TESTNET
};

// src/config/chains/chihuahua/index.ts
init_esm_shims();

// src/config/chains/chihuahua/chihuahua-testnet.ts
init_esm_shims();
var CHIHUAHUA_TESTNET = {
  chainType: "ibc",
  network: "chihuahua",
  displayName: "Chihuahua",
  blockExplorerUrl: "https://www.mintscan.io/chihuahua",
  nativeAssetSymbol: "uhuahua",
  chainId: "chihuahuasif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/chihuahuasif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/chihuahuasif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/chihuahuasif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/chihuahuasif-1/rest",
    chainId: "chihuahuasif-1",
    chainName: "Chihuahua Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "HUAHUA",
      coinMinimalDenom: "uhuahua",
      coinDecimals: 6,
      coinGeckoId: "pool:uhuahua"
    },
    walletUrl: "https://wallet.keplr.app/#/huahua-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/huahua-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "chihuahua",
      bech32PrefixAccPub: "chihuahuapub",
      bech32PrefixValAddr: "chihuahuavaloper",
      bech32PrefixValPub: "chihuahuavaloperpub",
      bech32PrefixConsAddr: "chihuahuavalcons",
      bech32PrefixConsPub: "chihuahuavalconspub"
    },
    currencies: [
      {
        coinDenom: "HUAHUA",
        coinMinimalDenom: "uhuahua",
        coinDecimals: 6,
        coinGeckoId: "pool:uhuahua"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "HUAHUA",
        coinMinimalDenom: "uhuahua",
        coinDecimals: 6,
        coinGeckoId: "pool:uhuahua"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/chihuahua/index.ts
var chihuahua_default = {
  localnet: CHIHUAHUA_TESTNET,
  devnet: CHIHUAHUA_TESTNET,
  testnet: CHIHUAHUA_TESTNET,
  mainnet: CHIHUAHUA_TESTNET
};

// src/config/chains/comdex/index.ts
init_esm_shims();

// src/config/chains/comdex/comdex-testnet.ts
init_esm_shims();
var COMDEX_TESTNET = {
  chainType: "ibc",
  network: "comdex",
  displayName: "Comdex",
  blockExplorerUrl: "https://www.mintscan.io/comdex",
  nativeAssetSymbol: "ucmdx",
  chainId: "comdexsif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/comdexsif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/comdexsif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/comdexsif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/comdexsif-1/rest",
    chainId: "comdexsif-1",
    chainName: "Comdex Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "CMDX",
      coinMinimalDenom: "ucmdx",
      coinDecimals: 6,
      coinGeckoId: "pool:ucmdx"
    },
    walletUrl: "https://wallet.keplr.app/#/cmdx-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cmdx-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "comdex",
      bech32PrefixAccPub: "comdexpub",
      bech32PrefixValAddr: "comdexvaloper",
      bech32PrefixValPub: "comdexvaloperpub",
      bech32PrefixConsAddr: "comdexvalcons",
      bech32PrefixConsPub: "comdexvalconspub"
    },
    currencies: [
      {
        coinDenom: "CMDX",
        coinMinimalDenom: "ucmdx",
        coinDecimals: 6,
        coinGeckoId: "pool:ucmdx"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "CMDX",
        coinMinimalDenom: "ucmdx",
        coinDecimals: 6,
        coinGeckoId: "pool:ucmdx"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/comdex/index.ts
var comdex_default = {
  localnet: COMDEX_TESTNET,
  devnet: COMDEX_TESTNET,
  testnet: COMDEX_TESTNET,
  mainnet: COMDEX_TESTNET
};

// src/config/chains/ki/index.ts
init_esm_shims();

// src/config/chains/ki/ki-testnet.ts
init_esm_shims();
var KI_TESTNET = {
  chainType: "ibc",
  network: Network.KI,
  displayName: "Ki",
  blockExplorerUrl: "https://www.mintscan.io/ki",
  nativeAssetSymbol: "uxki",
  chainId: "kisif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/kisif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/kisif-1/rest",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/kisif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/kisif-1/rest",
    chainId: "kisif-1",
    chainName: "Ki Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "KI",
      coinMinimalDenom: "uxki",
      coinDecimals: 6,
      coinGeckoId: "pool:uxki"
    },
    walletUrl: "https://wallet.keplr.app/#/ki-mainnet/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/ki-mainnet/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "ki",
      bech32PrefixAccPub: "kipub",
      bech32PrefixValAddr: "kivaloper",
      bech32PrefixValPub: "kivaloperpub",
      bech32PrefixConsAddr: "kivalcons",
      bech32PrefixConsPub: "kivalconspub"
    },
    currencies: [
      {
        coinDenom: "KI",
        coinMinimalDenom: "uxki",
        coinDecimals: 6,
        coinGeckoId: "pool:uxki"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "KI",
        coinMinimalDenom: "uxki",
        coinDecimals: 6,
        coinGeckoId: "pool:uxki"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/ki/index.ts
var ki_default = {
  localnet: KI_TESTNET,
  devnet: KI_TESTNET,
  testnet: KI_TESTNET,
  mainnet: KI_TESTNET
};

// src/config/chains/stargaze/index.ts
init_esm_shims();

// src/config/chains/stargaze/stargaze-testnet.ts
init_esm_shims();
var STARGAZE_TESTNET = {
  chainType: "ibc",
  network: Network.STARGAZE,
  displayName: "Stargaze",
  blockExplorerUrl: "https://www.mintscan.io/stargaze",
  nativeAssetSymbol: "ustarx",
  chainId: "stargazesif-1",
  rpcUrl: "https://proxies.sifchain.finance/api/stargazesif-1/rpc",
  restUrl: "https://proxies.sifchain.finance/api/stargazesif-1/rest",
  denomTracesPath: "/ibc/apps/transfer/v1/denom_traces",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/stargazesif-1/rpc",
    rest: "https://proxies.sifchain.finance/api/stargazesif-1/rest",
    chainId: "stargazesif-1",
    chainName: "Stargaze Testnet (Sifchain)",
    stakeCurrency: {
      coinDenom: "STARX",
      coinMinimalDenom: "ustarx",
      coinDecimals: 6,
      coinGeckoId: "pool:ustarx"
    },
    walletUrl: "https://wallet.keplr.app/#/stargaze/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/stargaze/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "stars",
      bech32PrefixAccPub: "starspub",
      bech32PrefixValAddr: "starsvaloper",
      bech32PrefixValPub: "starsvaloperpub",
      bech32PrefixConsAddr: "starsvalcons",
      bech32PrefixConsPub: "starsvalconspub"
    },
    currencies: [
      {
        coinDenom: "STARX",
        coinMinimalDenom: "ustarx",
        coinDecimals: 6,
        coinGeckoId: "pool:ustarx"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "STARX",
        coinMinimalDenom: "ustarx",
        coinDecimals: 6,
        coinGeckoId: "pool:ustarx"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/stargaze/index.ts
var stargaze_default = {
  localnet: STARGAZE_TESTNET,
  devnet: STARGAZE_TESTNET,
  testnet: STARGAZE_TESTNET,
  mainnet: STARGAZE_TESTNET
};

// src/config/chains/evmos/index.ts
init_esm_shims();

// src/config/chains/evmos/evmos-mainnet.ts
init_esm_shims();
var EVMOS_MAINNET = {
  chainType: "ibc",
  network: "evmos",
  displayName: "EVMOS",
  blockExplorerUrl: "https://evmos.bigdipper.live",
  nativeAssetSymbol: "aevmos",
  chainId: "evmos_9001-2",
  rpcUrl: "https://proxies.sifchain.finance/api/evmos/rpc",
  restUrl: "https://proxies.sifchain.finance/api/evmos/rest",
  denomTracesPath: "/ibc/apps/transfer/v1/denom_traces",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/evmos/rpc",
    rest: "https://proxies.sifchain.finance/api/evmos/rest",
    chainId: "evmos_9001-2",
    chainName: "EVMOS",
    stakeCurrency: {
      coinDenom: "evmos",
      coinMinimalDenom: "aevmos",
      coinDecimals: 18,
      coinGeckoId: "evmos"
    },
    walletUrl: "https://wallet.keplr.app/#/evmos/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/evmos/stake",
    bip44: {
      coinType: 60
    },
    bech32Config: {
      bech32PrefixAccAddr: "evmos",
      bech32PrefixAccPub: "evmospub",
      bech32PrefixValAddr: "evmosvaloper",
      bech32PrefixValPub: "evmosvaloperpub",
      bech32PrefixConsAddr: "evmosvalcons",
      bech32PrefixConsPub: "evmosvalconspub"
    },
    currencies: [
      {
        coinDenom: "evmos",
        coinMinimalDenom: "aevmos",
        coinDecimals: 18,
        coinGeckoId: "evmos"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "evmos",
        coinMinimalDenom: "aevmos",
        coinDecimals: 18,
        coinGeckoId: "evmos"
      }
    ],
    coinType: 60,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/evmos/index.ts
var evmos_default = {
  localnet: EVMOS_MAINNET,
  devnet: EVMOS_MAINNET,
  testnet: EVMOS_MAINNET,
  mainnet: EVMOS_MAINNET
};

// src/config/chains/secret/index.ts
init_esm_shims();

// src/config/chains/secret/secret-mainnet.ts
init_esm_shims();
var SECRET_MAINNET = {
  chainType: "ibc",
  network: Network.SECRET,
  displayName: "Secret",
  blockExplorerUrl: "https://www.mintscan.io/secret",
  nativeAssetSymbol: "uscrt",
  chainId: "secret-4",
  rpcUrl: "https://proxies.sifchain.finance/api/secret-4/rpc",
  restUrl: "https://proxies.sifchain.finance/api/secret-4/rest",
  denomTracesPath: "/ibc/apps/transfer/v1/denom_traces",
  features: {
    erc20Transfers: true
  },
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/secret-4/rpc",
    rest: "https://proxies.sifchain.finance/api/secret-4/rest",
    chainId: "secret-4",
    chainName: "Secret Network",
    stakeCurrency: {
      coinDenom: "SCRT",
      coinMinimalDenom: "uscrt",
      coinDecimals: 6,
      coinGeckoId: "pool:uscrt"
    },
    walletUrl: "https://wallet.keplr.app/#/secret/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/secret/stake",
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "secret",
      bech32PrefixAccPub: "secretpub",
      bech32PrefixValAddr: "secretvaloper",
      bech32PrefixValPub: "secretvaloperpub",
      bech32PrefixConsAddr: "secretvalcons",
      bech32PrefixConsPub: "secretvalconspub"
    },
    currencies: [
      {
        coinDenom: "SCRT",
        coinMinimalDenom: "uscrt",
        coinDecimals: 6,
        coinGeckoId: "pool:uscrt"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "SCRT",
        coinMinimalDenom: "uscrt",
        coinDecimals: 6,
        coinGeckoId: "pool:uscrt"
      }
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"]
  }
};

// src/config/chains/secret/index.ts
var secret_default = {
  localnet: SECRET_MAINNET,
  devnet: SECRET_MAINNET,
  testnet: SECRET_MAINNET,
  mainnet: SECRET_MAINNET
};

// src/config/chains/index.ts
var chainConfigByNetworkEnv = Object.fromEntries([...NETWORK_ENVS].map((env) => {
  return [
    env,
    {
      sifchain: sifchain_default[env],
      cosmoshub: cosmoshub_default[env],
      iris: iris_default[env],
      akash: akash_default[env],
      sentinel: sentinel_default[env],
      ethereum: ethereum_default[env],
      "crypto-org": crypto_org_default[env],
      osmosis: osmosis_default[env],
      persistence: persistence_default[env],
      regen: regen_default[env],
      terra: terra_default[env],
      juno: juno_default[env],
      ixo: ixo_default[env],
      band: band_default[env],
      bitsong: bitsong_default[env],
      likecoin: likecoin_default[env],
      emoney: emoney_default[env],
      evmos: evmos_default[env],
      starname: starname_default[env],
      cerberus: cerberus_default[env],
      chihuahua: chihuahua_default[env],
      comdex: comdex_default[env],
      ki: ki_default[env],
      stargaze: stargaze_default[env],
      secret: secret_default[env]
    }
  ];
}));

// src/config/getConfig.ts
function getConfig(applicationNetworkEnv = "localnet", sifchainAssetTag = "sifchain.localnet", ethereumAssetTag = "ethereum.localnet") {
  const assetMap = {
    "sifchain.localnet": parseAssets(assets_sifchain_localnet_default.assets),
    "sifchain.mainnet": parseAssets(assets_sifchain_mainnet_default.assets),
    "sifchain.devnet": parseAssets(assets_sifchain_devnet_default.assets),
    "ethereum.localnet": parseAssets(assets_ethereum_localnet_default.assets),
    "ethereum.devnet": parseAssets(assets_ethereum_devnet_default.assets),
    "ethereum.testnet": parseAssets(assets_ethereum_testnet_default.assets),
    "ethereum.mainnet": parseAssets(assets_ethereum_mainnet_default.assets)
  };
  const sifchainAssets = assetMap[sifchainAssetTag] || [];
  const ethereumAssets = assetMap[ethereumAssetTag] || [];
  if (false) {
    console.log("Using development config", applicationNetworkEnv, sifchainAssetTag, ethereumAssetTag, {
      sifchainAssets,
      ethereumAssets
    });
  }
  const allAssets = [...sifchainAssets, ...ethereumAssets];
  [...ACTIVE_NETWORKS].filter((n) => n !== "ethereum" && n !== "sifchain").forEach((n) => {
    allAssets.push(...sifchainAssets.map((a) => ({
      ...a,
      network: n
    })));
  });
  const peggyCompatibleCosmosBaseDenoms = /* @__PURE__ */ new Set([
    "uiris",
    "uatom",
    "uxprt",
    "ukava",
    "uakt",
    "hard",
    "uosmo",
    "uregen",
    "uion",
    "uixo",
    "ujuno",
    "udvpn",
    "uphoton",
    "unyan"
  ]);
  const configMap = {
    localnet: parseConfig(config_localnet_default, allAssets, chainConfigByNetworkEnv["localnet"], peggyCompatibleCosmosBaseDenoms),
    devnet: parseConfig(config_devnet_default, allAssets, chainConfigByNetworkEnv["devnet"], peggyCompatibleCosmosBaseDenoms),
    testnet: parseConfig(config_testnet_default, allAssets, chainConfigByNetworkEnv["testnet"], peggyCompatibleCosmosBaseDenoms),
    mainnet: parseConfig(config_mainnet_default, allAssets, chainConfigByNetworkEnv["mainnet"], peggyCompatibleCosmosBaseDenoms)
  };
  const currConfig = configMap[applicationNetworkEnv];
  return currConfig;
}
export {
  ACTIVE_NETWORKS,
  Amount,
  Asset,
  AssetAmount,
  CompositePool,
  DeliverTxResponse,
  ErrorCode,
  LiquidityProvider,
  Pair,
  Pool,
  WalletType,
  calculateSwapResultPmtp,
  createPoolKey,
  decimalShift,
  floorDecimal,
  format,
  formatAssetAmount,
  fromBaseUnits,
  getConfig,
  getErrorMessage,
  getMantissaFromDynamicMantissa,
  getMantissaLength,
  getNormalizedSwapPrice,
  humanUnitsToAssetAmount,
  isAmount,
  isAssetAmount,
  round,
  toBaseUnits,
  trimMantissa
};
//# sourceMappingURL=index.mjs.map