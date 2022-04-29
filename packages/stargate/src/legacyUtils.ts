// TODO: copied from old sdk lib
// need to clean this up
import inflection from "inflection";

export const createAminoTypeNameFromProtoTypeUrl = (typeUrl: string) => {
  // TODO: remove specific case override
  // once sifnode fix the proto name convention for this type
  if (typeUrl === "/sifnode.clp.v1.MsgUnlockLiquidityRequest") {
    return "clp/UnlockLiquidity";
  }

  if (typeUrl.startsWith("/ibc")) {
    return typeUrl
      .split(".")
      .filter(Boolean)
      .filter((part) => {
        return !/applications|v1|transfer/.test(part);
      })
      .map((part) => {
        if (part === "/ibc") return "cosmos-sdk";
        return part;
      })
      .join("/");
  }

  if (typeUrl.includes("sifnode") && !/MsgBurn|MsgLock/.test(typeUrl)) {
    typeUrl = typeUrl.replace("Msg", "");
  }

  const [_namespace, cosmosModule, _version, messageType] = typeUrl.split(".");

  const aminoTypeUrl = `${cosmosModule}/${messageType}`;
  switch (aminoTypeUrl) {
    case "dispensation/CreateUserClaim": {
      return "dispensation/claim";
    }
    case "bank/MsgSend": {
      return "cosmos-sdk/MsgSend";
    }
    default: {
      return aminoTypeUrl;
    }
  }
};

export const convertToSnakeCaseDeep = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToSnakeCaseDeep(item));
  }
  const newObj: any = {};
  for (let prop in obj) {
    newObj[inflection.underscore(prop)] = convertToSnakeCaseDeep(obj[prop]);
  }
  return newObj;
};

export const convertToCamelCaseDeep = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCaseDeep(item));
  }
  const newObj: any = {};
  for (let prop in obj) {
    newObj[inflection.camelize(prop, true)] = convertToCamelCaseDeep(obj[prop]);
  }
  return newObj;
};
