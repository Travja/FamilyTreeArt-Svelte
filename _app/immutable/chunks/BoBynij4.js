import{h as E,B as V,H as k,I as b,J as m,K as H,C as O,L as q,M as $,N as j,O as F,P as S,Q as G,R as J,S as T,U as w,G as P,F as K,c as p,V as Q,W as U,X,Y as Z,Z as x,A as z,a as tt,p as rt,v as et,f as at}from"./CAcDOI3n.js";import{b as nt}from"./C2I-aopX.js";const st=["touchstart","touchmove"];function it(t){return st.includes(t)}function _t(t){E&&V(t)!==null&&k(t)}let D=!1;function ot(){D||(D=!0,document.addEventListener("reset",t=>{Promise.resolve().then(()=>{var r;if(!t.defaultPrevented)for(const e of t.target.elements)(r=e.__on_r)==null||r.call(e)})},{capture:!0}))}function M(t){var r=H,e=O;b(null),m(null);try{return t()}finally{b(r),m(e)}}function dt(t,r,e,i=e){t.addEventListener(r,()=>M(e));const n=t.__on_r;n?t.__on_r=()=>{n(),i(!0)}:t.__on_r=()=>i(!0),ot()}const W=new Set,N=new Set;function ut(t,r,e,i={}){function n(a){if(i.capture||y.call(r,a),!a.cancelBubble)return M(()=>e==null?void 0:e.call(this,a))}return t.startsWith("pointer")||t.startsWith("touch")||t==="wheel"?F(()=>{r.addEventListener(t,n,i)}):r.addEventListener(t,n,i),n}function vt(t,r,e,i,n){var a={capture:i,passive:n},u=ut(t,r,e,a);(r===document.body||r===window||r===document)&&q(()=>{r.removeEventListener(t,u,a)})}function ht(t){for(var r=0;r<t.length;r++)W.add(t[r]);for(var e of N)e(t)}function y(t){var A;var r=this,e=r.ownerDocument,i=t.type,n=((A=t.composedPath)==null?void 0:A.call(t))||[],a=n[0]||t.target,u=0,d=t.__root;if(d){var c=n.indexOf(d);if(c!==-1&&(r===document||r===window)){t.__root=r;return}var v=n.indexOf(r);if(v===-1)return;c<=v&&(u=c)}if(a=n[u]||t.target,a!==r){$(t,"currentTarget",{configurable:!0,get(){return a||e}});var L=H,f=O;b(null),m(null);try{for(var s,o=[];a!==null;){var l=a.assignedSlot||a.parentNode||a.host||null;try{var _=a["__"+i];if(_!==void 0&&!a.disabled)if(j(_)){var[B,...C]=_;B.apply(a,[t,...C])}else _.call(a,t)}catch(g){s?o.push(g):s=g}if(t.cancelBubble||l===r||l===null)break;a=l}if(s){for(let g of o)queueMicrotask(()=>{throw g});throw s}}finally{t.__root=r,delete t.currentTarget,b(L),m(f)}}}let I=!0;function pt(t,r){var e=r==null?"":typeof r=="object"?r+"":r;e!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=e,t.nodeValue=e==null?"":e+"")}function ft(t,r){return Y(t,r)}function yt(t,r){S(),r.intro=r.intro??!1;const e=r.target,i=E,n=p;try{for(var a=V(e);a&&(a.nodeType!==8||a.data!==G);)a=J(a);if(!a)throw T;w(!0),P(a),K();const u=Y(t,{...r,anchor:a});if(p===null||p.nodeType!==8||p.data!==Q)throw U(),T;return w(!1),u}catch(u){if(u===T)return r.recover===!1&&X(),S(),k(e),w(!1),ft(t,r);throw u}finally{w(i),P(n)}}const h=new Map;function Y(t,{target:r,anchor:e,props:i={},events:n,context:a,intro:u=!0}){S();var d=new Set,c=f=>{for(var s=0;s<f.length;s++){var o=f[s];if(!d.has(o)){d.add(o);var l=it(o);r.addEventListener(o,y,{passive:l});var _=h.get(o);_===void 0?(document.addEventListener(o,y,{passive:l}),h.set(o,1)):h.set(o,_+1)}}};c(Z(W)),N.add(c);var v=void 0,L=x(()=>{var f=e??r.appendChild(z());return tt(()=>{if(a){rt({});var s=at;s.c=a}n&&(i.$$events=n),E&&nt(f,null),I=u,v=t(f,i)||{},I=!0,E&&(O.nodes_end=p),a&&et()}),()=>{var l;for(var s of d){r.removeEventListener(s,y);var o=h.get(s);--o===0?(document.removeEventListener(s,y),h.delete(s)):h.set(s,o)}N.delete(c),f!==e&&((l=f.parentNode)==null||l.removeChild(f))}});return R.set(v,L),v}let R=new WeakMap;function gt(t,r){const e=R.get(t);return e?(R.delete(t),e(r)):Promise.resolve()}export{ot as a,I as b,ht as d,vt as e,yt as h,dt as l,ft as m,_t as r,pt as s,gt as u};
