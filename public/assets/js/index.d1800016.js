(function(e){function t(t){for(var n,o,i=t[0],c=t[1],u=t[2],d=0,l=[];d<i.length;d++)o=i[d],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&l.push(s[o][0]),s[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);h&&h(t);while(l.length)l.shift()();return r.push.apply(r,u||[]),a()}function a(){for(var e,t=0;t<r.length;t++){for(var a=r[t],n=!0,o=1;o<a.length;o++){var i=a[o];0!==s[i]&&(n=!1)}n&&(r.splice(t--,1),e=c(c.s=a[0]))}return e}var n={},o={index:0},s={index:0},r=[];function i(e){return c.p+"assets/js/"+({}[e]||e)+"."+{"chunk-2d0ac46b":"6ca33887","chunk-2d0b5d0d":"50a661ce","chunk-2d0c18c2":"bc4bfc2c","chunk-2d0c1ec8":"2ef15206","chunk-2d0c911b":"73b9a4b9","chunk-2d20f6be":"05cdb126","chunk-2d2102da":"57311261","chunk-2d216085":"290c8037","chunk-2d216614":"90df699d","chunk-2d2167f3":"fe70f07b","chunk-e3b7ca1c":"68e31c7b","chunk-0052f2cc":"ec3ab93a","chunk-2d21b384":"cbe95eb2"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,c),a.l=!0,a.exports}c.e=function(e){var t=[],a={"chunk-0052f2cc":1};o[e]?t.push(o[e]):0!==o[e]&&a[e]&&t.push(o[e]=new Promise((function(t,a){for(var n="assets/css/"+({}[e]||e)+"."+{"chunk-2d0ac46b":"31d6cfe0","chunk-2d0b5d0d":"31d6cfe0","chunk-2d0c18c2":"31d6cfe0","chunk-2d0c1ec8":"31d6cfe0","chunk-2d0c911b":"31d6cfe0","chunk-2d20f6be":"31d6cfe0","chunk-2d2102da":"31d6cfe0","chunk-2d216085":"31d6cfe0","chunk-2d216614":"31d6cfe0","chunk-2d2167f3":"31d6cfe0","chunk-e3b7ca1c":"31d6cfe0","chunk-0052f2cc":"7ea1fe6f","chunk-2d21b384":"31d6cfe0"}[e]+".css",s=c.p+n,r=document.getElementsByTagName("link"),i=0;i<r.length;i++){var u=r[i],d=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(d===n||d===s))return t()}var l=document.getElementsByTagName("style");for(i=0;i<l.length;i++){u=l[i],d=u.getAttribute("data-href");if(d===n||d===s)return t()}var h=document.createElement("link");h.rel="stylesheet",h.type="text/css",h.onload=t,h.onerror=function(t){var n=t&&t.target&&t.target.src||s,r=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");r.code="CSS_CHUNK_LOAD_FAILED",r.request=n,delete o[e],h.parentNode.removeChild(h),a(r)},h.href=s;var p=document.getElementsByTagName("head")[0];p.appendChild(h)})).then((function(){o[e]=0})));var n=s[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise((function(t,a){n=s[e]=[t,a]}));t.push(n[2]=r);var u,d=document.createElement("script");d.charset="utf-8",d.timeout=120,c.nc&&d.setAttribute("nonce",c.nc),d.src=i(e);var l=new Error;u=function(t){d.onerror=d.onload=null,clearTimeout(h);var a=s[e];if(0!==a){if(a){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+n+": "+o+")",l.name="ChunkLoadError",l.type=n,l.request=o,a[1](l)}s[e]=void 0}};var h=setTimeout((function(){u({type:"timeout",target:d})}),12e4);d.onerror=d.onload=u,document.head.appendChild(d)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,a){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(c.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(a,n,function(t){return e[t]}.bind(null,n));return a},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],d=u.push.bind(u);u.push=t,u=u.slice();for(var l=0;l<u.length;l++)t(u[l]);var h=d;r.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("5269")},"02f3":function(e,t,a){"use strict";a.r(t),a.d(t,"state",(function(){return s})),a.d(t,"getters",(function(){return r})),a.d(t,"mutations",(function(){return i})),a.d(t,"actions",(function(){return c}));var n=a("2b0e"),o=a("e1e5");const s={status:"",ready:!1,hasLoadedOnce:!1,chats:[]},r={chatsActiveOrPermanent:e=>e.chats.filter(e=>!!e.isPermanent||"active"===e.status),chatsUpcoming:e=>e.chats.filter(e=>"upcoming"===e.status),chatsPast:e=>e.chats.filter(e=>!["upcoming","permanent","live","active"].includes(e.status))},i={SET_CHATS(e,t){return t.forEach(t=>{e.chats.push(t)}),e.status="success",e.ready=!0,e.hasLoadedOnce=!0,t},UPDATE_CHAT(e,t){const a=e.chats.findIndex(e=>e.idChat===t.idChat);-1!==a&&n["default"].set(e.chats,a,t)}},c={init({commit:e}){},fetchChats({commit:e,state:t}){return t.ready?t.chats:Object(o["a"])({url:"/v1/chats",method:"get"}).then(t=>{e("SET_CHATS",t)}).catch(e=>{throw new Error("load chats "+e)})},updateChat({commit:e},{chat:t,changes:a}){console.log("updateChat -> changes",a);const n={...t,...a};console.log("updateChat -> changes",n.isTracked),Object(o["a"])({url:"/v1/chat/"+t.idChat,method:"put",data:n}).then(t=>{e("UPDATE_CHAT",t)}).catch(e=>{throw new Error("updateChat "+e)})}}},"0343":function(e,t){e.exports={title:"mirroring.chat",description:"All Your Live Streaming Chat's in One Place"}},1:function(e,t){},"101b":function(e,t,a){"use strict";var n=a("2b0e"),o=a("2f62"),s=a("9224"),r=a("5cac"),i=a("828f");n["default"].use(o["a"]);const c=new o["a"].Store({modules:i["a"],state:{isMobile:!1,windowHeight:450,windowWidth:450,version:s.version},mutations:{CHANGE_IS_MOBILE(e,t){e.windowHeight=t.height,e.windowWidth=t.width,e.isMobile=t.width<500}},strict:!1});t["a"]=c,Object(r["a"])("init")},1527:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{staticClass:"loading"},[a("h1",[e._v("Loading…")])])},o=[],s={page:{title:"Loading page...",meta:[{name:"description",content:"Loading page..."}]}},r=s,i=a("2877"),c=a("6544"),u=a.n(c),d=a("a523"),l=Object(i["a"])(r,n,o,!1,null,null,null);t["default"]=l.exports;u()(l,{VContainer:d["a"]})},"267e":function(e,t,a){"use strict";a.r(t),a.d(t,"state",(function(){return n})),a.d(t,"actions",(function(){return o})),a.d(t,"mutations",(function(){return s}));const n={now:new Date},o={init({commit:e}){setInterval(()=>{e("UPDATE_TIME")},1e3)}},s={UPDATE_TIME:e=>{e.now=new Date}}},5146:function(e,t,a){},5269:function(e,t,a){"use strict";a.r(t);var n=a("2b0e"),o=a("323e"),s=a.n(o),r=(a("a5d8"),a("85ff")),i=a.n(r);const c=!0,u={isEnabled:!0,logLevel:c?"error":"debug",stringifyArguments:!1,showLogLevel:!0,showMethodName:!0,separator:":",showConsoleColors:!0};n["default"].use(i.a,u);var d=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",{attrs:{id:"inspire"}},[a("navigation"),a("v-content",[a("v-container",{staticClass:"fill-height",staticStyle:{padding:"0"},attrs:{fluid:""}},[a("transition",[a("keep-alive",[e.$route.meta.keepAlive?a("router-view",{key:e.$route.fullPath}):e._e()],1)],1),e.$route.meta.keepAlive?e._e():a("router-view",{key:e.$route.fullPath})],1)],1)],1)},l=[],h=a("0343"),p=a.n(h),m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("v-app-bar",{attrs:{app:"","clipped-left":"",dense:""}},[a("v-app-bar-nav-icon",{on:{click:function(t){t.stopPropagation(),e.interfaceHasSidebarClosed=!e.interfaceHasSidebarClosed}}}),a("v-toolbar-title",[e._v("mirroring.chat "),a("em",{staticStyle:{"font-size":".7rem"}},[e._v("v"+e._s(e.version))])]),a("v-spacer"),a("v-toolbar-items",{staticClass:"hidden-sm-and-down"},[a("v-btn",{attrs:{to:"/home"}},[e._v("Home")]),e.loggedIn?e._e():a("v-btn",{attrs:{to:"/login"}},[e._v("Login")]),e.loggedIn?a("v-btn",{on:{click:e.actionLogOut}},[e._v("Logout")]):e._e()],1)],1),a("v-navigation-drawer",{attrs:{app:"",top:"",clipped:"",permanent:!e.isMobile,"mini-variant":e.interfaceHasSidebarClosed&&!e.isMobile},scopedSlots:e._u([{key:"append",fn:function(){return[a("v-btn",{staticClass:"py-8",attrs:{block:"",href:"https://ChrisSpiegl.com",title:"Made by Chris",target:"_self"}},[e.interfaceHasSidebarClosed?a("v-icon",[e._v("$madeBy")]):e._e(),e.interfaceHasSidebarClosed?e._e():a("span",[e._v("Made with ❤ by Chris")])],1)]},proxy:!0}]),model:{value:e.interfaceHasSidebarClosed,callback:function(t){e.interfaceHasSidebarClosed=t},expression:"interfaceHasSidebarClosed"}},[a("vue-scroll",[a("v-list",{attrs:{nav:"",dense:""}},[a("v-list-item",{class:e.loggedIn&&e.activated?"hidden-md-and-up":"",attrs:{link:"",to:"/home"}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"Home"}},[e._v("$home")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Home")])],1)],1),a("v-list-item",{staticClass:"hidden-md-and-up",attrs:{link:"",to:"/about"}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"About"}},[e._v("$about")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("About")])],1)],1),a("v-divider",{staticClass:"hidden-md-and-up"}),e.loggedIn?e._e():a("v-list-item",{staticClass:"hidden-md-and-up",attrs:{link:"",to:"/login"}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"Login"}},[e._v("$user")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Login")])],1)],1),e.loggedIn&&e.activated?a("v-list-item",{attrs:{link:"",to:"/dashboard"}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"Dashboard"}},[e._v("$dashboard")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Dashboard")])],1)],1):e._e(),e.loggedIn&&e.activated?a("v-list-item",{attrs:{link:"",to:"/chat"}},[a("v-list-item-action",[a("v-badge",{attrs:{color:"green",value:e.chatMessagesUndone.length,content:e.chatMessagesUndone.length<10?e.chatMessagesUndone.length:"9+"}},[a("v-icon",{attrs:{title:"Chat"}},[e._v("$chat")])],1)],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Chat")])],1)],1):e._e(),e.loggedIn&&e.activated?a("v-divider"):e._e(),e.loggedIn&&e.activated?a("v-list-item",{attrs:{link:"",to:"/account"}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"Account"}},[e._v("$user")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Account")])],1)],1):e._e(),e.loggedIn?a("v-list-item",{staticClass:"hidden-md-and-up",on:{click:e.actionLogOut}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"Logout"}},[e._v("$logout")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Logout")])],1)],1):e._e(),a("v-divider"),a("v-list-item",{attrs:{link:"",to:"/support"}},[a("v-list-item-action",[a("v-icon",{attrs:{title:"Support/Help"}},[e._v("$help")])],1),a("v-list-item-content",[a("v-list-item-title",[e._v("Support/Help")])],1)],1)],1)],1)],1)],1)},f=[],g=a("2f62"),v=a("d84b"),b={name:"navigation",data(){return{interfaceHasSidebarClosed:!0}},computed:{...v["a"],...v["c"],...Object(g["d"])({version:e=>e.version,isMobile:e=>e.isMobile})},methods:{...v["b"],actionLogOut(){this.$router.push({name:"home"}).then(()=>{this.logOut().then(()=>{console.log("action Log Out Success")})})}},mounted(){this.$log.debug("components/navigation/index.vue mounted")}},S=b,E=a("2877"),T=a("6544"),_=a.n(T),C=a("40dc"),O=a("5bc1"),y=a("4ca6"),w=a("8336"),A=a("ce7e"),k=a("132d"),U=a("8860"),I=a("da13"),N=a("1800"),R=a("5d23"),M=a("f774"),j=a("2fa4"),x=a("2a7f"),L=Object(E["a"])(S,m,f,!1,null,null,null),D=L.exports;function $(e,t,a){let n;return(...o)=>{const s=this,r=()=>{n=null,a||e.apply(s,o)},i=a&&!n;clearTimeout(n),n=setTimeout(r,t),i&&e.apply(s,o)}}_()(L,{VAppBar:C["a"],VAppBarNavIcon:O["a"],VBadge:y["a"],VBtn:w["a"],VDivider:A["a"],VIcon:k["a"],VList:U["a"],VListItem:I["a"],VListItemAction:N["a"],VListItemContent:R["g"],VListItemTitle:R["k"],VNavigationDrawer:M["a"],VSpacer:j["a"],VToolbarItems:x["b"],VToolbarTitle:x["c"]});var P={name:"App",components:{Navigation:D},page:{titleTemplate(e){const t="function"===typeof e?e(this.$store):e;return t?`${t} | ${p.a.title}`:p.a.title}},props:{source:String},methods:{onResize(){this.$store.commit("CHANGE_IS_MOBILE",{width:window.innerWidth,height:window.innerHeight})}},mounted(){this.$log.debug("App.vue mounted"),window.addEventListener("resize",$(this.onResize,250))},beforeDestroy(){window.removeEventListener("resize",this.onResize)},created(){this.$vuetify.theme.dark=!0,this.onResize()}},H=P,V=(a("82cc"),a("7496")),B=a("a523"),G=a("a75b"),K=Object(E["a"])(H,d,l,!1,null,"2a5ea5f7",null),q=K.exports;_()(K,{VApp:V["a"],VContainer:B["a"],VContent:G["a"]});var z=a("8c4f"),F=a("58ca"),W=a("101b"),J=e=>{const t=()=>({component:e,loading:a("1527").default,delay:400,error:a("afbf").default,timeout:1e4});return Promise.resolve({functional:!0,render(e,{data:a,children:n}){return e(t,a,n)}})},Q=[{path:"/home",alias:"/",name:"home",component:()=>J(a.e("chunk-2d216085").then(a.bind(null,"c178"))),meta:{beforeResolve:async(e,t,a)=>"/home"!==e.path&&W["a"].getters["auth/loggedIn"]?a({name:"dashboard"}):a()}},{path:"/login",name:"login",component:()=>J(a.e("chunk-2d0c1ec8").then(a.bind(null,"47b1"))),meta:{beforeResolve(e,t,a){return W["a"].getters["auth/loggedIn"]?a({name:"dashboard"}):a()}}},{path:"/login/success",name:"loginSuccess",component:()=>J(a.e("chunk-2d2102da").then(a.bind(null,"b77f")))},{path:"/login/failed",name:"loginFailed",component:()=>J(a.e("chunk-2d0ac46b").then(a.bind(null,"199f")))},{path:"/logout",name:"logout",meta:{authRequired:!0,beforeResolve(e,t,a){W["a"].dispatch("auth/logOut");const n=t.matched.some(e=>e.meta.authRequired);return a(n?{name:"home"}:{...t})}}},{path:"/not-activated",name:"notActivated",component:()=>J(a.e("chunk-2d20f6be").then(a.bind(null,"b40f"))),meta:{authRequired:!0,beforeResolve:(e,t,a)=>W["a"].getters["auth/activated"]?a({name:"dashboard"}):a()}},{path:"/account",name:"account",component:()=>J(Promise.all([a.e("chunk-e3b7ca1c"),a.e("chunk-2d21b384")]).then(a.bind(null,"bf9c"))),meta:{authRequired:!0,activationRequired:!0}},{path:"/account/telegram",name:"accountTelegram",component:()=>J(a.e("chunk-2d0b5d0d").then(a.bind(null,"1b06"))),meta:{authRequired:!0,activationRequired:!0}},{path:"/dashboard",name:"dashboard",component:()=>J(a.e("chunk-2d2167f3").then(a.bind(null,"c35b"))),meta:{authRequired:!0,activationRequired:!0}},{path:"/chat",name:"chat",component:()=>J(Promise.all([a.e("chunk-e3b7ca1c"),a.e("chunk-0052f2cc")]).then(a.bind(null,"2919"))),meta:{authRequired:!0,activationRequired:!0,keepAlive:!0}},{path:"/admin",name:"admin",component:()=>J(a.e("chunk-2d216614").then(a.bind(null,"c1e5"))),meta:{authRequired:!0,activationRequired:!0}},{path:"/about",name:"about",component:()=>J(a.e("chunk-2d0c18c2").then(a.bind(null,"4709")))},{path:"/support",name:"support",component:()=>J(a.e("chunk-2d0c911b").then(a.bind(null,"5824")))},{path:"/404",alias:"*",name:"404",component:a("d12b").default,props:!0}];n["default"].use(z["a"]),n["default"].use(F["a"],{keyName:"page"});const X=new z["a"]({routes:Q,mode:"history",scrollBehavior(e,t,a){return a||{x:0,y:0}}});X.beforeEach(async(e,t,a)=>{function n(){a({name:"login",query:{redirectFrom:e.fullPath}})}null!==t.name&&s.a.start();const o=e.matched.some(e=>e.meta.authRequired);if(!o)return a();if(!W["a"].getters["auth/loggedIn"])return n();const r=await W["a"].dispatch("auth/validate");if(!r)return n();await W["a"].dispatch("userSettings/fetchUserSettings");const i=e.matched.some(e=>e.meta.activationRequired);return i?W["a"].getters["auth/activated"]?a():a({name:"notActivated",replace:!0}):a()}),X.beforeResolve(async(e,t,a)=>{try{for(const n of e.matched)await new Promise((o,r)=>{n.meta&&n.meta.beforeResolve?n.meta.beforeResolve(e,t,(...e)=>{e.length?(t.name===e[0].name&&s.a.done(),a(...e),r(new Error("redirected"))):o()}):o()})}catch(o){return void("redirected"!==o.message&&n["default"].$log.error("beforeResolve hook error: ",o))}a()}),X.afterEach((e,t)=>{s.a.done()});var Y=X,Z=a("f309"),ee=a("2db4"),te=a("ecee"),ae=a("ad3d"),ne=a("6381"),oe=a("0a34"),se=a("d841"),re=a("f43d"),ie=a("51b7"),ce=a("2915"),ue=a("2d00"),de=a("6bcb"),le=a("4ba3"),he=a("552c"),pe=a("7ac7"),me=a("8928"),fe=a("83c1"),ge=a("a17a"),ve=a("cca2"),be=a("dfe7"),Se=a("8d79"),Ee=a("c474"),Te=a("5621"),_e=a("7f18"),Ce=a("b7e5"),Oe=a("f01e"),ye=a("6ded");n["default"].component("font-awesome-icon",ae["a"]),te["c"].add(ye["faBullhorn"],Oe["faCheck"],ne["faDiscord"],oe["faFacebookF"],le["faHeartbeat"],se["faTelegram"],re["faTwitch"],ie["faYoutube"],ce["faLaughBeam"],ue["faBan"],de["faBandAid"],he["faBars"],pe["faCog"],me["faColumns"],fe["faComment"],ge["faHome"],ve["faInfoCircle"],be["faQuestionCircle"],Se["faReply"],Ee["faShareAlt"],Te["faSignOutAlt"],_e["faUser"],Ce["faUsers"]);var we={menu:{component:ae["a"],props:{icon:["fas","bars"]}},madeBy:{component:ae["a"],props:{icon:["fas","heartbeat"]}},twitch:{component:ae["a"],props:{icon:["fab","twitch"]}},facebook:{component:ae["a"],props:{icon:["fab","facebook-f"]}},telegram:{component:ae["a"],props:{icon:["fab","telegram"]}},youtube:{component:ae["a"],props:{icon:["fab","youtube"]}},discord:{component:ae["a"],props:{icon:["fab","discord"]}},dashboard:{component:ae["a"],props:{icon:["fas","columns"]}},home:{component:ae["a"],props:{icon:["fas","home"]}},logout:{component:ae["a"],props:{icon:["fas","sign-out-alt"]}},chat:{component:ae["a"],props:{icon:["fas","comment"]}},user:{component:ae["a"],props:{icon:["fas","user"]}},help:{component:ae["a"],props:{icon:["fas","question-circle"]}},info:{component:ae["a"],props:{icon:["fas","info-circle"]}},about:{component:ae["a"],props:{icon:["fas","users"]}},settings:{component:ae["a"],props:{icon:["fas","cog"]}},laughBeam:{component:ae["a"],props:{icon:["far","laugh-beam"]}},ban:{component:ae["a"],props:{icon:["fas","ban"]}},timeout:{component:ae["a"],props:{icon:["fas","band-aid"]}},reply:{component:ae["a"],props:{icon:["fas","reply"]}},share:{component:ae["a"],props:{icon:["fas","share-alt"]}},check:{component:ae["a"],props:{icon:["fas","check"]}},highlight:{component:ae["a"],props:{icon:["fas","bullhorn"]}}};n["default"].$log.debug("fontawesome.js initialized"),n["default"].use(Z["a"],{components:{VSnackbar:ee["a"],VBtn:w["a"],VIcon:k["a"]}});const Ae={theme:{dark:!0,themes:{}},icons:{iconfont:"faSvg",values:we}};var ke=new Z["a"](Ae);n["default"].$log.debug("vuetify.js initialized");var Ue=a("5132"),Ie=a.n(Ue),Ne=a("8055"),Re=a.n(Ne);const Me="/mirroring",je=Re()(Me,{}),xe=new Ie.a({debug:!0,connection:je,vuex:{store:W["a"],actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}});n["default"].use(xe);n["default"].$log.debug("socket.client.js initialized");var Le=a("2901"),De=a.n(Le);n["default"].use(De.a,{ops:{bar:{onlyShowBarOnScroll:!1,keepShow:!0,background:"#cc5630",opacity:.8,hoverStyle:!1,specifyBorderRadius:!1,minSize:0,size:"6px",disable:!1}}}),n["default"].$log.debug("scroll.js initialized");var $e=a("87f6"),Pe=a.n($e);n["default"].use(Pe.a,{x:"right",y:"top",color:"info",icon:"",iconColor:"",timeout:3e3,dismissable:!0,multiLine:!1,vertical:!1,queueable:!1,showClose:!0,closeText:"x",closeIcon:"",closeColor:"",slot:[],shorts:{custom:{color:"purple"}},property:"$toast"}),n["default"].$log.debug("toast.js initialized");var He=a("9eed"),Ve=a.n(He);n["default"].use(Ve.a,{vuetify:ke,buttonTrueText:"Accept",buttonFalseText:"Discard",color:"warning",icon:"",title:"Warning",width:350,property:"$confirm"}),n["default"].$log.debug("confirmDialog.js initialized");var Be=a("123d"),Ge=a.n(Be);n["default"].use(Ge.a),n["default"].$log.debug("chatScroll.js initialized");var Ke=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"loader loader--style2"},[a("svg",{staticStyle:{"enable-background":"new 0 0 50 50"},attrs:{version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",x:"0px",y:"0px",width:"40px",height:"40px",viewBox:"0 0 50 50","xml:space":"preserve"}},[a("path",{attrs:{fill:"#000",d:"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"}},[a("animateTransform",{attrs:{attributeType:"xml",attributeName:"transform",type:"rotate",from:"0 25 25",to:"360 25 25",dur:"0.6s",repeatCount:"indefinite"}})],1)])])},qe=[],ze={name:"loading",props:{},components:{},data(){return{}}},Fe=ze,We=(a("d799"),Object(E["a"])(Fe,Ke,qe,!1,null,"75557e1f",null)),Je=We.exports,Qe=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"center-container"},[e._t("default")],2)},Xe=[],Ye={name:"center-container"},Ze=Ye,et=(a("926c"),Object(E["a"])(Ze,Qe,Xe,!1,null,"6a63fd1c",null)),tt=et.exports;n["default"].config.productionTip=!0,"e2e"===Object({NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_TEST&&(n["default"].config.errorHandler=window.Cypress.cy.onUncaughtException);const at="The .native modifier for v-on is only valid on components but it was used on <svg>.";n["default"].config.warnHandler=(e,t,a)=>{e!==at&&n["default"].$log.error(e+a)},n["default"].component("loading",Je),n["default"].component("center-container",tt);t["default"]=new n["default"]({router:Y,store:W["a"],template:"<App/>",vuetify:ke,render(e){return e(q)}}).$mount("#app");"e2e"===Object({NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_TEST&&(window.__app__=app),n["default"].$log.debug("main.js initialized"),console.info("Welcome to mirroring.chat - The application is running in production mode.")},"5cac":function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a("828f"),o=a("101b");function s(e,{modules:t=n["a"],modulePrefix:a="",flags:r={}}={}){for(const n in t){const i=t[n];i.actions&&i.actions[e]&&(i.namespaced?o["a"].dispatch(`${a}${n}/${e}`):r.dispatchGlobal=!0),i.modules&&s(e,{modules:i.modules,modulePrefix:a+n+"/",flags:r})}!a&&r.dispatchGlobal&&o["a"].dispatch(e)}},"5d9a":function(e,t,a){var n={"./auth.js":"c264","./chatMessages.js":"8cad","./chats.js":"02f3","./time.js":"267e","./userSettings.js":"9c49"};function o(e){var t=s(e);return a(t)}function s(e){if(!a.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}o.keys=function(){return Object.keys(n)},o.resolve=s,e.exports=o,o.id="5d9a"},6441:function(e,t,a){},"828f":function(e,t,a){"use strict";var n=a("bba4"),o=a.n(n);const s={},r={modules:{}};function i(e,t){if(1===t.length)return e;const a=t.shift();return e.modules[a]={modules:{},namespaced:!0,...e.modules[a]},i(e.modules[a],t)}(function(){const e=a("5d9a");e.keys().forEach(t=>{const a=e(t).default||e(t);if(s[t]===a)return;s[t]=a;const n=t.replace(/^\.\//,"").replace(/\.\w+$/,"").split(/\//).map(o.a),{modules:c}=i(r,n);c[n.pop()]={namespaced:!0,...a}})})(),t["a"]=r.modules},"82cc":function(e,t,a){"use strict";var n=a("8861"),o=a.n(n);o.a},8861:function(e,t,a){},"8cad":function(e,t,a){"use strict";a.r(t),a.d(t,"state",(function(){return r})),a.d(t,"getters",(function(){return i})),a.d(t,"mutations",(function(){return c})),a.d(t,"actions",(function(){return u}));var n=a("2b0e"),o=a("5269"),s=a("e1e5");const r={status:"",ready:!1,hasLoadedOnce:!1,chatMessages:[],chatMessagesLastUpdated:{}},i={chatMessagesUndone:e=>e.chatMessages.filter(e=>!e.doneAt&&!e.message.startsWith("!drop")),chatMessagesReversed:e=>e.chatMessages.slice().reverse()},c={SET_CHAT_MESSAGES(e,t){return t.forEach(t=>{e.chatMessages.push(t)}),e.status="success",e.ready=!0,e.hasLoadedOnce=!0,e.chatMessagesLastUpdated=new Date,t},UPDATE_CHAT_MESSAGE(e,t){const a=e.chatMessages.findIndex(e=>e.idChatMessage===t.idChatMessage);-1!==a&&(n["default"].set(e.chatMessages,a,t),e.chatMessagesLastUpdated=new Date)},ADD_CHAT_MESSAGE(e,t){e.chatMessages.push(t),e.chatMessagesLastUpdated=new Date},REMOVE_CHAT_MESSAGE(e,t){e.chatMessages.splice(e.chatMessages.findIndex(e=>e.idChatMessage===t.idChatMessage),1)}},u={init({commit:e}){},afterAuth({dispatch:e,rootGetters:t}){t["auth/loggedInAndActivated"]&&(e("fetchChatMessages"),e("CONNECT_CHAT_SOCKET"))},afterAuthLogOut({dispatch:e}){e("DISCONNECT_CHAT_SOCKET")},fetchChatMessages({commit:e,dispatch:t,state:a}){return a.ready?a.chatMessages:Object(s["a"])({url:"/v1/chat/messages",method:"get"}).then(t=>e("SET_CHAT_MESSAGES",t)).catch(e=>{throw new Error("load chatMessages "+e)})},async markChatMessageDone({commit:e},t){Object(s["a"])({url:"/v1/chat/message/"+t.idChatMessage,method:"PUT",data:{...t,doneAt:new Date}}).then(t=>{e("UPDATE_CHAT_MESSAGE",t)})},async timeoutChatMessage({dispatch:e},t){return new Promise((a,n)=>{Object(s["a"])({url:`/v1/chat/message/${t.idChatMessage}/timeout`,method:"POST",data:t}).then(n=>{e("removeChatMessagesByAuthor",t),a(n)}).catch(e=>n(e))})},async banChatMessage({dispatch:e},t){return new Promise((a,n)=>{Object(s["a"])({url:`/v1/chat/message/${t.idChatMessage}/ban`,method:"POST",data:t}).then(n=>{e("removeChatMessagesByAuthor",t),a(n)}).catch(e=>n(e))})},CONNECT_CHAT_SOCKET({rootState:e}){n["default"].$log.debug("CONNECT_CHAT_SOCKET"),o["default"].$socket.emit("CHAT_CONNECT",{idUser:e.auth.userCurrent.idUser})},removeChatMessagesByAuthor({commit:e,state:t},a){const{idAuthorProvider:n}=a,o=t.chatMessages.filter(e=>e.idAuthorProvider===n);o.forEach(t=>e("REMOVE_CHAT_MESSAGE",t))},DISCONNECT_CHAT_SOCKET({rootState:e}){n["default"].$log.debug("DISCONNECT_CHAT_SOCKET"),o["default"].$socket.emit("CHAT_DISCONNECT")},SOCKET_CHAT_CONNECTED({commit:e},t){n["default"].$log.debug("SOCKET_CHAT_CONNECTED -> message",t)},SOCKET_CHAT_DISCONNECTED({commit:e},t){n["default"].$log.debug("SOCKET_CHAT_DISCONNECTED -> message",t)},SOCKET_ADD_CHAT_MESSAGE({commit:e},t){n["default"].$log.debug("SOCKET_ADD_CHAT_MESSAGE -> message",t),e("ADD_CHAT_MESSAGE",t.data)}}},9224:function(e){e.exports=JSON.parse('{"name":"mirroring-chat","version":"0.1.0","description":"mirroring.chat","main":"index.js","scripts":{"start":"echo \\"Restart - PM2 RELOAD - production\\" && NODE_ENV=production pm2 reload ecosystem.config.js --only mir-chat-web --env production","stop":"npx pm2 stop ecosystem.config.js","nsupdate":"echo \\"Update - WITHOUT SAVING TO CONFIG FILES\\" && npm update --no-save","nsinstall":"echo \\"Install - WITHOUT SAVING TO CONFIG FILES\\" && npm install --no-save","nsauditfix":"echo \\"Audit Fix - WITHOUT SAVING TO CONFIG FILES\\" && npm audit fix --no-save","test":"echo \\"Error: no test specified\\" && exit 1","vueBuild":"vue-cli-service build --watch","vueBuildProduction":"vue-cli-service build --mode production","vueLint":"vue-cli-service lint"},"author":"Chris Spiegl <chris@chrisspiegl.com>","private":true,"license":"UNLICENSED","dependencies":{"@d-fischer/passport-twitch":"^1.0.5","@fortawesome/fontawesome-svg-core":"^1.2.28","@fortawesome/free-brands-svg-icons":"^5.13.0","@fortawesome/free-regular-svg-icons":"^5.13.0","@fortawesome/free-solid-svg-icons":"^5.13.0","@fortawesome/vue-fontawesome":"^0.1.9","axios":"^0.19.2","bad-words":"^3.0.3","bluebird":"^3.7.2","body-parser":"^1.19.0","boom":"^7.3.0","cache-manager":"^3.3.0","cache-manager-fs-hash":"0.0.8","cache-manager-redis-store":"^2.0.0","compression":"^1.7.4","connect-redis":"^4.0.4","connect-slashes":"^1.4.0","cors":"^2.8.5","cron":"^1.8.2","csurf":"^1.11.0","date-fns":"^2.14.0","debug":"^4.1.1","dompurify":"^2.0.11","express":"^4.17.1","express-async-handler":"^1.1.4","express-boom":"git+https://github.com/scottcorgan/express-boom.git","express-flash":"0.0.2","express-session":"^1.17.1","express-status-monitor":"^1.3.3","express-useragent":"^1.0.13","googleapis":"^51.0.0","helmet":"^3.22.0","jquery":"^3.5.1","jsdom":"^16.2.2","jsonwebtoken":"^8.5.1","lodash":"^4.17.15","marked":"^1.1.0","moment":"^2.26.0","moment-timezone":"^0.5.31","morgan":"^1.10.0","mysql2":"^2.1.0","naughty-words":"^1.1.0","node-telegram-bot-api":"^0.50.0","node-telegram-bot-api-middleware":"^0.1.3","nprogress":"^0.2.0","p-queue":"^6.4.0","passport":"^0.4.1","passport-discord":"^0.1.3","passport-facebook":"^3.0.0","passport-google-oauth20":"^2.0.0","passport-jwt":"^4.0.0","passport-oauth2-refresh":"^2.0.0","pm2":"^4.4.0","pmx":"^1.6.7","pug":"^2.0.4","pug-plain-loader":"^1.0.0","pushnotice":"^0.1.6","redis":"^3.0.2","sequelize":"^5.21.11","sequelize-cli":"^5.5.1","socket.io":"^2.3.0","socket.io-client":"^2.3.0","tmi.js":"^1.5.0","twitch":"^4.0.10","uuid":"^8.1.0","vue":"^2.6.11","vue-chat-scroll":"^1.4.0","vue-meta":"^2.3.4","vue-moment":"^4.1.0","vue-router":"^3.3.2","vue-socket.io":"3.0.5","vuejs-logger":"^1.5.4","vuescroll":"^4.15.1","vuetify":"^2.2.30","vuetify-confirm":"^2.0.3","vuetify-toast-snackbar":"^0.6.1","vuex":"^3.4.0"},"devDependencies":{"@vue/cli-plugin-eslint":"^4.4.1","@vue/cli-plugin-router":"^4.4.1","@vue/cli-plugin-vuex":"^4.4.1","@vue/cli-service":"^4.4.1","@vue/eslint-config-airbnb":"^5.0.2","async":"^3.2.0","browser-sync":"^2.26.7","eslint":"^7.1.0","eslint-plugin-import":"^2.20.2","eslint-plugin-vue":"^6.2.2","gulp":"^4.0.2","gulp-changed":"^4.0.2","gulp-clean":"^0.4.0","gulp-concat":"^2.6.1","gulp-if":"^3.0.0","gulp-multi-process":"^1.3.1","gulp-nodemon":"^2.5.0","gulp-notify":"^3.2.0","gulp-sass":"^4.1.0","gulp-sourcemaps":"^2.6.5","gulp-uglify":"^3.0.2","pump":"^3.0.0","sass":"^1.26.7","sass-loader":"^8.0.2","uglify-es":"^3.3.9","vue-cli-plugin-vuetify":"^2.0.5","vue-template-compiler":"^2.6.11","vuetify-loader":"^1.4.4"}}')},"926c":function(e,t,a){"use strict";var n=a("5146"),o=a.n(n);o.a},"9c49":function(e,t,a){"use strict";a.r(t),a.d(t,"state",(function(){return r})),a.d(t,"getters",(function(){return i})),a.d(t,"mutations",(function(){return c})),a.d(t,"actions",(function(){return u}));var n=a("2b0e"),o=a("e1e5");const s=!1,r={status:"",ready:!1,hasLoadedOnce:!1,userSettings:[]},i={getUserSettingValueByKey:(e,t)=>({key:e,defaultValue:a})=>{const n=t.getUserSettingByKey({key:e});return n?t.getUserSettingByKey({key:e}).value:a||s},getUserSettingByKey:e=>({key:t})=>{const a=e.userSettings.findIndex(e=>e.key===t);return e.userSettings[a]}},c={SET_USER_SETTINGS(e,t){return t.forEach(t=>{e.userSettings.push(t)}),e.status="success",e.ready=!0,e.hasLoadedOnce=!0,t},ADD_USER_SETTING(e,t){e.userSettings.push(t)},REMOVE_USER_SETTING(e,t){e.userSettings.splice(e.userSettings.findIndex(e=>e.idUserSetting===t.idUserSetting||e.key===t.key),1)},UPDATE_USER_SETTING(e,t){const a=e.userSettings.findIndex(e=>e.idUserSetting===t.idUserSetting);-1!==a&&n["default"].set(e.userSettings,a,t)}},u={init({commit:e}){},afterAuth({dispatch:e}){e("fetchUserSettings")},fetchUserSettings({commit:e,state:t}){return t.ready?t.userSettings:Object(o["a"])({url:"/v1/userSettings",method:"get"}).then(t=>{e("SET_USER_SETTINGS",t)}).catch(e=>{throw new Error("loadUserSettings "+e)})},createUserSetting({commit:e},t){Object(o["a"])({url:"/v1/userSetting",method:"post",data:t}).then(t=>{e("ADD_USER_SETTING",t)}).catch(e=>{throw new Error("createUserSetting "+e)})},updateUserSettingByKey({dispatch:e,getters:t},{key:a,value:n}){const o=t.getUserSettingByKey({key:a});o?e("updateUserSetting",{...o,value:n}):e("createUserSetting",{key:a,value:n})},updateUserSetting({commit:e},t){Object(o["a"])({url:"/v1/userSetting/"+t.idUserSetting,method:"put",data:t}).then(t=>{console.log("updateUserSetting -> userSetting",t),e("UPDATE_USER_SETTING",t)}).catch(e=>{throw new Error("updateUserSetting "+e)})}}},afbf:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{staticClass:"timeout"},[a("h1",[e._v("Timeout")]),a("p",[e._v("The page timed out while loading. Are you sure you're still cnnected to the internet?")])])},o=[],s={page:{title:"Page timeout",meta:[{name:"description",content:"The page timed out while loading."}]}},r=s,i=a("2877"),c=a("6544"),u=a.n(c),d=a("a523"),l=Object(i["a"])(r,n,o,!1,null,null,null);t["default"]=l.exports;u()(l,{VContainer:d["a"]})},c264:function(e,t,a){"use strict";a.r(t),a.d(t,"state",(function(){return d})),a.d(t,"mutations",(function(){return l})),a.d(t,"getters",(function(){return h})),a.d(t,"actions",(function(){return p}));var n=a("2b0e"),o=a("1212"),s=a("6b78"),r=a("5cac"),i=a("e1e5");function c(e){return JSON.parse(window.localStorage.getItem(e))}function u(e,t){return t?window.localStorage.setItem(e,JSON.stringify(t)):window.localStorage.removeItem(e)}const d={userCurrent:c("auth.userCurrent"),userToken:c("auth.userToken"),userTokenLastValidation:null,userTokenWasValidatedOnce:!1},l={SET_CURRENT_USER(e,t){e.userCurrent=t,u("auth.userCurrent",e.userCurrent)},SET_CURRENT_USER_TOKEN(e,t){e.userToken=t,u("auth.userToken",e.userToken),Object(i["b"])(e.userToken)},SET_LAST_VALIDATION(e,t){e.userTokenLastValidation=t,e.userTokenWasValidatedOnce=!!t}},h={loggedIn(e){return!!e.userToken&&!!e.userCurrent},activated(e){return!!e.userCurrent.activatedAt},loggedInAndActivated(e,t){return t.loggedIn&&t.activated}},p={async init({state:e,dispatch:t,getters:a}){Object(i["b"])(e.userToken),await t("validate")},logIn({commit:e,dispatch:t,getters:a}={}){return a.loggedIn?t("validate"):Object(i["a"])({url:"/v1/auth/token",method:"post",data:{}}).then(t=>(e("SET_CURRENT_USER",t.user),e("SET_CURRENT_USER_TOKEN",t.token),t)).catch(t=>(t.response&&401===t.response.status?(e("SET_CURRENT_USER",null),e("SET_CURRENT_USER_TOKEN",null)):n["default"].$log.warn(t),null))},logOut({dispatch:e}){Object(i["a"])({method:"get",url:"/v1/auth/logout"}).then(t=>{e("invalidate"),Object(r["a"])("afterAuthLogOut"),console.log("LOGOUT INVALIDATION API REQUEST RESPONSE: ",t)})},validate({commit:e,dispatch:t,getters:a,state:c}){return n["default"].$log.debug("LOGGED IN :",a.loggedIn),a.loggedIn?Object(o["a"])(c.userTokenLastValidation,Object(s["a"])(new Date,5))?Promise.resolve(!0):(n["default"].$log.debug("VALIDATION HAS NOT HAPPENED OR EXPIRED"),Object(i["a"])({url:"/v1/auth/token",method:"get"}).then(t=>(c.userTokenWasValidatedOnce||Object(r["a"])("afterAuth"),e("SET_CURRENT_USER",t.user),e("SET_CURRENT_USER_TOKEN",t.token),e("SET_LAST_VALIDATION",new Date),Promise.resolve(!0))).catch(e=>(e.response&&401===e.response.status?t("invalidate"):n["default"].$log.warn(e),Promise.resolve(!1)))):Promise.resolve(!1)},invalidate({commit:e,getters:t,state:a}){n["default"].$log.debug("USER TOKEN EXPIRED OR NOT VALID"),e("SET_CURRENT_USER",null),e("SET_CURRENT_USER_TOKEN",null),e("SET_LAST_VALIDATION",null)}}},d12b:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{staticClass:"error404"},[a("h1",[e._v("Error 404 — Not Found")])])},o=[],s={name:"About",components:{},mounted(){this.$log.debug("404.vue mounted")}},r=s,i=a("2877"),c=a("6544"),u=a.n(c),d=a("a523"),l=Object(i["a"])(r,n,o,!1,null,null,null);t["default"]=l.exports;u()(l,{VContainer:d["a"]})},d799:function(e,t,a){"use strict";var n=a("6441"),o=a.n(n);o.a},d84b:function(e,t,a){"use strict";a.d(t,"a",(function(){return o})),a.d(t,"b",(function(){return s})),a.d(t,"g",(function(){return r})),a.d(t,"h",(function(){return i})),a.d(t,"e",(function(){return c})),a.d(t,"f",(function(){return u})),a.d(t,"c",(function(){return d})),a.d(t,"d",(function(){return l}));var n=a("2f62");const o={...Object(n["d"])("auth",{userCurrent:e=>e.userCurrent}),...Object(n["c"])("auth",["loggedIn","activated"])},s=Object(n["b"])("auth",["logIn","logOut"]),r={...Object(n["d"])("userSettings",{userSettings:e=>e.userSettings}),...Object(n["c"])("userSettings",["getUserSettingValueByKey","getUserSettingByKey"])},i=Object(n["b"])("userSettings",["updateUserSettingByKey"]),c={...Object(n["d"])("chats",{chats:e=>e.chats}),...Object(n["c"])("chats",["chatsActiveOrPermanent","chatsUpcoming","chatsPast"])},u=Object(n["b"])("chats",["fetchChats","updateChat"]),d={...Object(n["d"])("chatMessages",{chatMessages:e=>e.chatMessages,chatMessagesLastUpdated:e=>e.chatMessagesLastUpdated}),...Object(n["c"])("chatMessages",["chatMessagesUndone","chatMessagesReversed"])},l=Object(n["b"])("chatMessages",["fetchChatMessages","markChatMessageDone","banChatMessage","timeoutChatMessage"])},e1e5:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return i}));var n=a("2b0e"),o=a("bc3a"),s=a.n(o);s.a.interceptors.response.use(void 0,e=>new Promise((t,a)=>{throw 401===e.status&&e.config&&!e.config.__isRetryRequest&&(void 0).$store.dispatch("auth/invalidate"),e}));const r=({url:e,method:t,data:a={}})=>new Promise((o,r)=>{if(!e)throw new Error("apiCall - url must be defined in options object");const i="/api"+e;let c=t||"GET";c=c.toLowerCase();const u={},d=["post","put","patch"].includes(c)?s.a[c](i,a,u):s.a[c](i,u);d.then(e=>(n["default"].$log.debug(`Api Call Success for ${c}:${i}`,e),e.data?o(e.data):o({}))).catch(e=>(n["default"].$log.debug(`Api Call Error for ${c}:${i}`,e),r(e)))}),i=e=>{s.a.defaults.headers.common.Authorization="Bearer "+e}}});