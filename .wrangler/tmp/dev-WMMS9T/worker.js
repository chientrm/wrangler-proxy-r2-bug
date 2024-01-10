// .wrangler/tmp/bundle-4MT3H9/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// node_modules/wrangler-proxy/dist/worker.js
var m = { headers: { "Content-Type": "application/json" } };
var d = class {
  constructor({ host: e, name: a, metadata: r, data: t }) {
    this.host = e, this.name = a, this.metadata = r, this.data = t;
  }
};
var N = async (o17) => {
  if (!o17.ok)
    throw new Error(await o17.text());
};
var i = class extends d {
  constructor({ host: a, name: r, proxyType: t, metadata: n, data: s }) {
    super({ host: a, name: r, metadata: n, data: s });
    this.proxyType = t;
  }
  async post() {
    let { host: a, name: r, proxyType: t, metadata: n, data: s } = this, p = Math.floor(Math.random() * 1e6).toString(), y = await fetch(`${a}/instruction`, { method: "POST", headers: { "X-Code": p }, body: JSON.stringify({ name: r, proxyType: t, metadata: n }), duplex: "half" });
    await N(y);
    let u = await fetch(`${a}/data`, { method: "POST", headers: { "X-Code": p }, body: s, duplex: "half" });
    return await N(u), this.receive(u);
  }
};
var c = class o extends i {
  static {
    this.proxyType = "D1DatabasePreparedStatementAllProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let a = e[this.name], { query: r, values: t } = this.metadata, n = a.prepare(r), s = t ? n.bind(...t) : n, p = await s.all();
    return new Response(JSON.stringify(p), m);
  }
  receive(e) {
    return e.json();
  }
};
var l = class o2 extends i {
  static {
    this.proxyType = "D1DatabasePreparedStatementFirstProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o2.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let a = e[this.name], { query: r, values: t, colName: n } = this.metadata, s = a.prepare(r), p = t ? s.bind(...t) : s, y = n ? p.first(n) : p.first(), u = await y;
    return new Response(JSON.stringify(u), m);
  }
  receive(e) {
    return e.json();
  }
};
var f = class o3 extends i {
  static {
    this.proxyType = "D1DatabasePreparedStatementRawProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o3.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, t = e[a], { query: n, values: s } = r, p = t.prepare(n), y = s ? p.bind(...s) : p, u = await y.raw();
    return new Response(JSON.stringify(u), m);
  }
  async receive(e) {
    return e.json();
  }
};
var x = class o4 extends i {
  static {
    this.proxyType = "D1DatabasePreparedStatementRunProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o4.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let a = e[this.name], { query: r, values: t } = this.metadata, n = a.prepare(r), s = t ? n.bind(...t) : n, p = await s.run();
    return new Response(JSON.stringify(p), m);
  }
  receive(e) {
    return e.json();
  }
};
var K = class o5 extends d {
  bind(...e) {
    let { host: a, name: r, metadata: t } = this, { query: n } = t;
    return new o5({ host: a, name: r, metadata: { query: n, values: e }, data: null });
  }
  async first(e) {
    let { host: a, name: r, metadata: t } = this, { query: n, values: s } = t;
    return new l({ host: a, name: r, metadata: { query: n, values: s, colName: e } }).post();
  }
  async run() {
    let { host: e, name: a, metadata: r } = this;
    return new x({ host: e, name: a, metadata: r }).post();
  }
  async all() {
    let { host: e, name: a, metadata: r } = this;
    return new c({ host: e, name: a, metadata: r }).post();
  }
  async raw() {
    let { host: e, metadata: a, name: r } = this, { query: t, values: n } = a;
    return new f({ host: e, name: r, metadata: { query: t, values: n } }).post();
  }
  statement(e) {
    let { metadata: a } = this, { query: r, values: t } = a;
    return t ? e.prepare(r).bind(...t) : e.prepare(r);
  }
};
var h = class o6 extends i {
  static {
    this.proxyType = "D1DatabaseBatchProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o6.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, t = e[a], n = r.map((p) => new K({ name: a, metadata: p, data: null }).statement(t)), s = await t.batch(n);
    return new Response(JSON.stringify(s), m);
  }
  receive(e) {
    return e.json();
  }
};
var w = class o7 extends i {
  static {
    this.proxyType = "D1DatabaseExecProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o7.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { query: t } = r, n = e[a], s = await n.exec(t);
    return new Response(JSON.stringify(s), m);
  }
  receive(e) {
    return e.json();
  }
};
var P = class o8 extends i {
  static {
    this.proxyType = "FetcherFetchProxy";
  }
  constructor({ host: e, name: a, metadata: r, data: t }) {
    let n = o8.proxyType;
    super({ proxyType: n, host: e, name: a, metadata: r, data: t });
  }
  async execute(e) {
    let { name: a, metadata: r, data: t } = this, { path: n, method: s, headers: p } = r;
    return await e[a].fetch(n, { method: s, headers: p, body: t });
  }
  receive(e) {
    return Promise.resolve(e);
  }
};
var g = class o9 extends i {
  static {
    this.proxyType = "KvDeleteProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o9.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { key: t } = r;
    return await e[a].delete(t), new Response();
  }
  receive(e) {
    return Promise.resolve();
  }
};
var R = class o10 extends i {
  static {
    this.proxyType = "KVGetProxy";
  }
  static {
    this.nullHeader = "X-Null";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o10.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  getType() {
    let { options: e } = this.metadata;
    if (e == null)
      return null;
    if (e === "text")
      return "text";
    if (e === "json")
      return "json";
    if (e === "arrayBuffer")
      return "arrayBuffer";
    if (e === "stream")
      return "stream";
    if (typeof e == "object") {
      let a = e;
      if (a.type === "text")
        return "text";
      if (a.type === "json")
        return "json";
      if (a.type === "arrayBuffer")
        return "arrayBuffer";
      if (a.type === "stream")
        return "stream";
    }
    throw new Error("Unknown error");
  }
  nullRes(e) {
    if (e === null)
      return new Response(null, { headers: { [o10.nullHeader]: "1" } });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { key: t } = r, n = e[a], s = null;
    switch (this.getType()) {
      case null:
        return s = await n.get(t), this.nullRes(s) ?? new Response(s);
      case "text":
        return s = await n.get(t, "text"), this.nullRes(s) ?? new Response(s);
      case "json":
        return s = await n.get(t, "json"), this.nullRes(s) ?? new Response(JSON.stringify(s));
      case "arrayBuffer":
        return s = await n.get(t, "arrayBuffer"), this.nullRes(s) ?? new Response(s);
      case "stream":
        return s = await n.get(t, "stream"), this.nullRes(s) ?? new Response(s);
    }
  }
  async receive(e) {
    if (e.headers.get(o10.nullHeader))
      return null;
    switch (this.getType()) {
      case null:
      case "text":
        return e.text();
      case "json":
        return e.json();
      case "arrayBuffer":
        return e.arrayBuffer();
      case "stream":
        return e.body;
    }
  }
};
var O = class o11 extends i {
  static {
    this.proxyType = "KVGetWithMetadataProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o11.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { key: t, options: n } = r, s = e[a], p = await s.getWithMetadata(t, n);
    return new Response(JSON.stringify(p), m);
  }
  receive(e) {
    return e.json();
  }
};
var M = class o12 extends i {
  static {
    this.proxyType = "KVListProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o12.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { options: t } = r, s = await e[a].list(t);
    return new Response(JSON.stringify(s), m);
  }
  receive(e) {
    return e.json();
  }
};
var b = class o13 extends i {
  static {
    this.proxyType = "KVPutProxy";
  }
  constructor({ host: e, name: a, metadata: r, data: t }) {
    let n = o13.proxyType;
    super({ proxyType: n, host: e, name: a, metadata: r, data: t });
  }
  async execute(e) {
    let { name: a, metadata: r, data: t } = this, { key: n, options: s } = r, p = e[a], y = t;
    return await p.put(n, y, s), new Response();
  }
  receive(e) {
    return Promise.resolve();
  }
};
var k = class o14 extends i {
  static {
    this.proxyType = "R2DeleteProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o14.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { keys: t } = r;
    return await e[a].delete(t), new Response();
  }
  receive(e) {
    return Promise.resolve();
  }
};
var T = class o15 extends i {
  static {
    this.proxyType = "R2GetProxy";
  }
  constructor({ host: e, name: a, metadata: r }) {
    let t = o15.proxyType;
    super({ proxyType: t, host: e, name: a, metadata: r, data: null });
  }
  async execute(e) {
    let { name: a, metadata: r } = this, { key: t, options: n } = r, s = e[a], p = await s.get(t, n);
    return p === null ? new Response(null, { headers: { "wrangler-proxy-null": "1" } }) : new Response(p.body);
  }
  receive(e) {
    return Promise.resolve(e);
  }
};
var D = class o16 extends i {
  static {
    this.proxyType = "R2PutProxy";
  }
  constructor({ host: e, name: a, metadata: r, data: t }) {
    let n = o16.proxyType;
    super({ proxyType: n, host: e, name: a, metadata: r, data: t });
  }
  async execute(e) {
    let { name: a, metadata: r, data: t } = this, { key: n, options: s } = r, p = e[a], y = t;
    if (s) {
      let u = { ...s, onlyIf: s.onlyIfArr ? new Headers(s.onlyIfArr) : s.onlyIf, httpMetadata: s.httpMetadataArr ? new Headers(s.httpMetadataArr) : s.httpMetadata };
      await p.put(n, y, u);
    } else
      await p.put(n, y);
    return new Response();
  }
  receive(e) {
    return Promise.resolve();
  }
};
var V = class {
  static getProxy(e, a) {
    let { proxyType: r, name: t, metadata: n } = e;
    switch (r) {
      case l.proxyType:
        return new l({ name: t, metadata: n });
      case x.proxyType:
        return new x({ name: t, metadata: n });
      case c.proxyType:
        return new c({ name: t, metadata: n });
      case f.proxyType:
        return new f({ name: t, metadata: n });
      case w.proxyType:
        return new w({ name: t, metadata: n });
      case h.proxyType:
        return new h({ name: t, metadata: n });
      case P.proxyType:
        return new P({ name: t, metadata: n, data: a });
      case b.proxyType:
        return new b({ name: t, metadata: n, data: a });
      case R.proxyType:
        return new R({ name: t, metadata: n });
      case O.proxyType:
        return new O({ name: t, metadata: n });
      case g.proxyType:
        return new g({ name: t, metadata: n });
      case M.proxyType:
        return new M({ name: t, metadata: n });
      case D.proxyType:
        return new D({ name: t, metadata: n, data: a });
      case T.proxyType:
        return new T({ name: t, metadata: n });
      case k.proxyType:
        return new k({ name: t, metadata: n });
      default:
        throw new Error("Unknown proxy type.");
    }
  }
};
var S = {};
var B = () => ({ async fetch(o17, e, a) {
  if (o17.method === "POST")
    try {
      let r = new URL(o17.url), t = o17.headers.get("X-Code");
      if (r.pathname === "/instruction") {
        let n = [];
        for await (let y of o17.body)
          n.push(y);
        let s = await new Blob(n).arrayBuffer(), p = JSON.parse(new TextDecoder().decode(s));
        return S[t] = p, new Response();
      } else if (r.pathname === "/data") {
        let n = S[t];
        return delete S[t], await V.getProxy(n, o17.body).execute(e);
      }
    } catch (r) {
      return new Response(JSON.stringify({ name: r.name, message: r.message, stack: r.stack }), { status: 500 });
    }
  return new Response(null, { status: 404 });
} });
var Rt = B();
export {
  Rt as default
};
//# sourceMappingURL=worker.js.map
