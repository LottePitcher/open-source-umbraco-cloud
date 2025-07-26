var C = Object.defineProperty;
var _ = (e, a, t) => a in e ? C(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var g = (e, a, t) => _(e, typeof a != "symbol" ? a + "" : a, t);
var U = async (e, a) => {
  let t = typeof a == "function" ? await a(e) : a;
  if (t) return e.scheme === "bearer" ? `Bearer ${t}` : e.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, I = { bodySerializer: (e) => JSON.stringify(e, (a, t) => typeof t == "bigint" ? t.toString() : t) }, T = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, A = (e) => {
  switch (e) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, z = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, x = ({ allowReserved: e, explode: a, name: t, style: n, value: l }) => {
  if (!a) {
    let r = (e ? l : l.map((i) => encodeURIComponent(i))).join(A(n));
    switch (n) {
      case "label":
        return `.${r}`;
      case "matrix":
        return `;${t}=${r}`;
      case "simple":
        return r;
      default:
        return `${t}=${r}`;
    }
  }
  let o = T(n), s = l.map((r) => n === "label" || n === "simple" ? e ? r : encodeURIComponent(r) : b({ allowReserved: e, name: t, value: r })).join(o);
  return n === "label" || n === "matrix" ? o + s : s;
}, b = ({ allowReserved: e, name: a, value: t }) => {
  if (t == null) return "";
  if (typeof t == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${a}=${e ? t : encodeURIComponent(t)}`;
}, $ = ({ allowReserved: e, explode: a, name: t, style: n, value: l }) => {
  if (l instanceof Date) return `${t}=${l.toISOString()}`;
  if (n !== "deepObject" && !a) {
    let r = [];
    Object.entries(l).forEach(([c, d]) => {
      r = [...r, c, e ? d : encodeURIComponent(d)];
    });
    let i = r.join(",");
    switch (n) {
      case "form":
        return `${t}=${i}`;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${t}=${i}`;
      default:
        return i;
    }
  }
  let o = z(n), s = Object.entries(l).map(([r, i]) => b({ allowReserved: e, name: n === "deepObject" ? `${t}[${r}]` : r, value: i })).join(o);
  return n === "label" || n === "matrix" ? o + s : s;
}, E = /\{[^{}]+\}/g, W = ({ path: e, url: a }) => {
  let t = a, n = a.match(E);
  if (n) for (let l of n) {
    let o = !1, s = l.substring(1, l.length - 1), r = "simple";
    s.endsWith("*") && (o = !0, s = s.substring(0, s.length - 1)), s.startsWith(".") ? (s = s.substring(1), r = "label") : s.startsWith(";") && (s = s.substring(1), r = "matrix");
    let i = e[s];
    if (i == null) continue;
    if (Array.isArray(i)) {
      t = t.replace(l, x({ explode: o, name: s, style: r, value: i }));
      continue;
    }
    if (typeof i == "object") {
      t = t.replace(l, $({ explode: o, name: s, style: r, value: i }));
      continue;
    }
    if (r === "matrix") {
      t = t.replace(l, `;${b({ name: s, value: i })}`);
      continue;
    }
    let c = encodeURIComponent(r === "label" ? `.${i}` : i);
    t = t.replace(l, c);
  }
  return t;
}, S = ({ allowReserved: e, array: a, object: t } = {}) => (n) => {
  let l = [];
  if (n && typeof n == "object") for (let o in n) {
    let s = n[o];
    if (s != null) if (Array.isArray(s)) {
      let r = x({ allowReserved: e, explode: !0, name: o, style: "form", value: s, ...a });
      r && l.push(r);
    } else if (typeof s == "object") {
      let r = $({ allowReserved: e, explode: !0, name: o, style: "deepObject", value: s, ...t });
      r && l.push(r);
    } else {
      let r = b({ allowReserved: e, name: o, value: s });
      r && l.push(r);
    }
  }
  return l.join("&");
}, D = (e) => {
  var t;
  if (!e) return "stream";
  let a = (t = e.split(";")[0]) == null ? void 0 : t.trim();
  if (a) {
    if (a.startsWith("application/json") || a.endsWith("+json")) return "json";
    if (a === "multipart/form-data") return "formData";
    if (["application/", "audio/", "image/", "video/"].some((n) => a.startsWith(n))) return "blob";
    if (a.startsWith("text/")) return "text";
  }
}, N = async ({ security: e, ...a }) => {
  for (let t of e) {
    let n = await U(t, a.auth);
    if (!n) continue;
    let l = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        a.query || (a.query = {}), a.query[l] = n;
        break;
      case "cookie":
        a.headers.append("Cookie", `${l}=${n}`);
        break;
      case "header":
      default:
        a.headers.set(l, n);
        break;
    }
    return;
  }
}, v = (e) => k({ baseUrl: e.baseUrl, path: e.path, query: e.query, querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : S(e.querySerializer), url: e.url }), k = ({ baseUrl: e, path: a, query: t, querySerializer: n, url: l }) => {
  let o = l.startsWith("/") ? l : `/${l}`, s = (e ?? "") + o;
  a && (s = W({ path: a, url: s }));
  let r = t ? n(t) : "";
  return r.startsWith("?") && (r = r.substring(1)), r && (s += `?${r}`), s;
}, j = (e, a) => {
  var n;
  let t = { ...e, ...a };
  return (n = t.baseUrl) != null && n.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = q(e.headers, a.headers), t;
}, q = (...e) => {
  let a = new Headers();
  for (let t of e) {
    if (!t || typeof t != "object") continue;
    let n = t instanceof Headers ? t.entries() : Object.entries(t);
    for (let [l, o] of n) if (o === null) a.delete(l);
    else if (Array.isArray(o)) for (let s of o) a.append(l, s);
    else o !== void 0 && a.set(l, typeof o == "object" ? JSON.stringify(o) : o);
  }
  return a;
}, w = class {
  constructor() {
    g(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  getInterceptorIndex(e) {
    return typeof e == "number" ? this._fns[e] ? e : -1 : this._fns.indexOf(e);
  }
  exists(e) {
    let a = this.getInterceptorIndex(e);
    return !!this._fns[a];
  }
  eject(e) {
    let a = this.getInterceptorIndex(e);
    this._fns[a] && (this._fns[a] = null);
  }
  update(e, a) {
    let t = this.getInterceptorIndex(e);
    return this._fns[t] ? (this._fns[t] = a, e) : !1;
  }
  use(e) {
    return this._fns = [...this._fns, e], this._fns.length - 1;
  }
}, P = () => ({ error: new w(), request: new w(), response: new w() }), H = S({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), J = { "Content-Type": "application/json" }, O = (e = {}) => ({ ...I, headers: J, parseAs: "auto", querySerializer: H, ...e }), B = (e = {}) => {
  let a = j(O(), e), t = () => ({ ...a }), n = (s) => (a = j(a, s), t()), l = P(), o = async (s) => {
    let r = { ...a, ...s, fetch: s.fetch ?? a.fetch ?? globalThis.fetch, headers: q(a.headers, s.headers) };
    r.security && await N({ ...r, security: r.security }), r.body && r.bodySerializer && (r.body = r.bodySerializer(r.body)), (r.body === void 0 || r.body === "") && r.headers.delete("Content-Type");
    let i = v(r), c = { redirect: "follow", ...r }, d = new Request(i, c);
    for (let f of l.request._fns) f && (d = await f(d, r));
    let R = r.fetch, u = await R(d);
    for (let f of l.response._fns) f && (u = await f(u, d, r));
    let y = { request: d, response: u };
    if (u.ok) {
      if (u.status === 204 || u.headers.get("Content-Length") === "0") return r.responseStyle === "data" ? {} : { data: {}, ...y };
      let f = (r.parseAs === "auto" ? D(u.headers.get("Content-Type")) : r.parseAs) ?? "json";
      if (f === "stream") return r.responseStyle === "data" ? u.body : { data: u.body, ...y };
      let h = await u[f]();
      return f === "json" && (r.responseValidator && await r.responseValidator(h), r.responseTransformer && (h = await r.responseTransformer(h))), r.responseStyle === "data" ? h : { data: h, ...y };
    }
    let m = await u.text();
    try {
      m = JSON.parse(m);
    } catch {
    }
    let p = m;
    for (let f of l.error._fns) f && (p = await f(m, u, d, r));
    if (p = p || {}, r.throwOnError) throw p;
    return r.responseStyle === "data" ? void 0 : { error: p, ...y };
  };
  return { buildUrl: v, connect: (s) => o({ ...s, method: "CONNECT" }), delete: (s) => o({ ...s, method: "DELETE" }), get: (s) => o({ ...s, method: "GET" }), getConfig: t, head: (s) => o({ ...s, method: "HEAD" }), interceptors: l, options: (s) => o({ ...s, method: "OPTIONS" }), patch: (s) => o({ ...s, method: "PATCH" }), post: (s) => o({ ...s, method: "POST" }), put: (s) => o({ ...s, method: "PUT" }), request: o, setConfig: n, trace: (s) => o({ ...s, method: "TRACE" }) };
};
const V = B(O({
  baseUrl: "https://localhost:44389"
}));
export {
  V as c
};
//# sourceMappingURL=client.gen-Ds4qzcQO.js.map
