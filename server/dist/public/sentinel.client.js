var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: !0 });
var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues && (getRandomValues = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !getRandomValues))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return getRandomValues(rnds8);
}
__name(rng, "rng");
const byteToHex = [];
for (let i = 0; i < 256; ++i)
  byteToHex.push((i + 256).toString(16).slice(1));
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");
const randomUUID = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), native = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options)
    return native.randomUUID();
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  if (rnds[6] = rnds[6] & 15 | 64, rnds[8] = rnds[8] & 63 | 128, buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i)
      buf[offset + i] = rnds[i];
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
const _SentinelClient = class _SentinelClient {
  constructor({
    environment,
    tag,
    path,
    endpoint = _SentinelClient.DEFAULT_ENDPOINT_URL
  }) {
    __publicField(this, "environment");
    __publicField(this, "tag");
    __publicField(this, "path");
    __publicField(this, "endpoint");
    this.environment = environment, this.tag = tag, this.path = path, this.endpoint = endpoint;
  }
  static of() {
    const environment = "default", path = window.location.pathname, tag = v4();
    return new _SentinelClient({ environment, path, tag });
  }
  async post(data) {
    const url = `${this.endpoint}/report/create`, body = JSON.stringify(data);
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body
      });
    } catch {
      console.log(`Failed to sent Report = ${body}`);
    }
  }
  getUserInformation() {
    return {};
  }
  buildCreateReportObject(label, data) {
    return {
      label,
      environment: this.environment,
      tag: this.tag,
      path: this.path,
      error: data,
      user: {
        user_agent: navigator.userAgent,
        language: navigator.language
      }
    };
  }
  info(data) {
    this.post(this.buildCreateReportObject("INFO", data));
  }
  error(data) {
    this.post(this.buildCreateReportObject("ERROR", data));
  }
  ofError(error, label = "ERROR") {
    var _a;
    const [_, ...items] = (_a = error.stack) == null ? void 0 : _a.split(/\n/g).map((it) => it.trim());
    this.post(
      this.buildCreateReportObject("ERROR", {
        name: error.name,
        message: error.message,
        stack: items
      })
    );
  }
  warning(data) {
    this.post(this.buildCreateReportObject("WARNING", data));
  }
  inspect() {
    try {
      throw new Error();
    } catch (error) {
      const data = error;
      this.ofError(data, "INFO");
    }
  }
  guard(callback) {
    try {
      callback();
    } catch (error) {
      this.ofError(error);
    }
  }
  protect() {
    window.addEventListener("error", ({ error }) => this.ofError(error));
  }
};
__name(_SentinelClient, "SentinelClient"), __publicField(_SentinelClient, "DEFAULT_ENDPOINT_URL", "http://localhost:8080/api");
let SentinelClient = _SentinelClient;
export {
  SentinelClient as default
};
