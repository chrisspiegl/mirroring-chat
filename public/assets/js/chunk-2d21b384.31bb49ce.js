(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21b384"],{bf9c:function(t,e,i){"use strict";i.r(e);var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",{staticClass:"account"},[i("h1",[t._v("Account "+t._s(t.userCurrent.displayName))]),i("v-card",[i("v-list-item",[i("v-list-item-content",[i("v-list-item-title",[t._v("Connected Accounts")])],1)],1),i("v-card-text",[i("p",[t._v("Twitch: "),t.userCurrent.UserTwitch?t._e():i("a",{attrs:{href:"/auth/twitch"}},[t._v("Link")]),t.userCurrent.UserTwitch?[i("span",[t._v(t._s(t.userCurrent.UserTwitch.displayName))]),t._v(" "),i("a",{on:{click:function(e){return t.unlink("twitch")}}},[t._v("Unlink")])]:t._e()],2),i("p",[t._v("YouTube: "),t.userCurrent.UserGoogle?t._e():i("a",{attrs:{href:"/auth/google"}},[t._v("Link")]),t.userCurrent.UserGoogle?[i("span",[t._v(t._s(t.userCurrent.UserGoogle.displayName))]),t._v(" "),i("a",{on:{click:function(e){return t.unlink("google")}}},[t._v("Unlink")])]:t._e()],2),i("p",[t._v("Telegram: "),t.userCurrent.UserTelegram?t._e():i("a",{attrs:{href:"/account/telegram"}},[t._v("Link")]),t.userCurrent.UserTelegram?[i("span",[t._v(t._s(t.userCurrent.UserTelegram.displayName))]),t._v(" "),i("a",{on:{click:function(e){return t.unlink("telegram")}}},[t._v("Unlink")])]:t._e()],2)])],1),i("v-card",{staticClass:"mt-8"},[i("v-list-item",[i("v-list-item-content",[i("v-list-item-title",[t._v("Account Settings")])],1)],1),i("v-card-text",[i("v-list",[t.userCurrent.UserGoogle?i("v-list-item",[i("v-switch",{staticClass:"mx-2",model:{value:t.youtubeCrawlForActiveStreams,callback:function(e){t.youtubeCrawlForActiveStreams=e},expression:"youtubeCrawlForActiveStreams"}}),i("v-list-item-title",[i("v-icon",{attrs:{size:"1rem"}},[t._v("$youtube")]),t._v(" YouTube Track for Active Streams")],1)],1):t._e(),t.userCurrent.UserGoogle?i("v-list-item",[i("v-switch",{staticClass:"mx-2",model:{value:t.youtubeCrawlForUpcomingStreams,callback:function(e){t.youtubeCrawlForUpcomingStreams=e},expression:"youtubeCrawlForUpcomingStreams"}}),i("v-list-item-title",[i("v-icon",{attrs:{size:"1rem"}},[t._v("$youtube")]),t._v(" YouTube Track for Upcoming Streams")],1)],1):t._e(),t.userCurrent.UserTelegram?i("v-list-item",[i("v-switch",{staticClass:"mx-2",model:{value:t.telegramForward,callback:function(e){t.telegramForward=e},expression:"telegramForward"}}),i("v-list-item-title",[i("v-icon",{attrs:{size:"1rem"}},[t._v("$telegram")]),t._v(" Forward Messages to Telegram")],1)],1):t._e()],1)],1)],1),i("v-card",{staticClass:"mt-8"},[i("v-list-item",[i("v-list-item-content",[i("v-list-item-title",[t._v("Live & Permanent Broadcasts")])],1)],1),i("v-card-text",[i("v-list",t._l(t.chatsActiveOrPermanent,(function(e,r){return i("v-list-item",{key:e.idChat},[i("v-list-item-content",[i("v-list-item-title",[i("v-icon",{attrs:{size:"1rem"}},[t._v("$"+t._s(e.provider))]),t._v(" "),i("a",{attrs:{href:"twitch"===e.provider?"https://twitch.com/"+e.idChatProvider:"https://youtu.be/"+e.idChatProvider}},[t._v(t._s(e.title))])],1)],1),i("v-list-item-action-text",[i("v-switch",{staticClass:"mx-2",attrs:{"input-value":e.isTracked,label:"tracking new messages"},on:{change:function(i){return t.isTrackedToggle(e)}}})],1)],1)})),1)],1)],1),i("v-card",{staticClass:"mt-8"},[i("v-list-item",[i("v-list-item-content",[i("v-list-item-title",[t._v("Upcoming Live Broadcasts")])],1)],1),i("v-card-text",[i("v-list",t._l(t.chatsUpcoming,(function(e,r){return i("v-list-item",{key:e.idChat},[i("v-list-item-content",[i("v-list-item-title",[i("v-icon",{attrs:{size:"1rem"}},[t._v("$"+t._s(e.provider))]),t._v(" "),i("a",{attrs:{href:"twitch"===e.provider?"https://twitch.com/"+e.idChatProvider:"https://youtu.be/"+e.idChatProvider}},[t._v(t._s(e.title))])],1),t._v("Scheduled for "+t._s(t._f("moment")("youtube"===e.provider?e.providerObject.snippet.scheduledStartTime:"","YYYY-MM-DD HH:mm:ss"))+" which is "+t._s(t._f("moment")("youtube"===e.provider?e.providerObject.snippet.scheduledStartTime:"","from")))],1),i("v-list-item-action-text",[i("v-card-actions",[i("v-switch",{staticClass:"mx-2",attrs:{"input-value":e.isTracked,label:"tracking new messages"},on:{change:function(i){return t.isTrackedToggle(e)}}})],1)],1)],1)})),1)],1)],1),i("v-card",{staticClass:"mt-8"},[i("v-list-item",[i("v-list-item-content",[i("v-list-item-title",[t._v("Past Broadcasts")])],1)],1),i("v-card-text",[i("v-list",t._l(t.chatsPast,(function(e,r){return i("v-list-item",{key:e.idChat},[i("v-list-item-content",[i("v-list-item-title",[i("v-icon",{attrs:{size:"1rem"}},[t._v("$"+t._s(e.provider))]),t._v(" "),i("a",{attrs:{href:"twitch"===e.provider?"https://twitch.com/"+e.idChatProvider:"https://youtu.be/"+e.idChatProvider}},[t._v(t._s(e.title))])],1)],1),i("v-list-item-action-text",{attrs:{disabled:""}},[i("v-card-actions",[i("v-switch",{staticClass:"mx-2",attrs:{"input-value":e.isTracked,label:"tracking new messages",disabled:""},on:{change:function(i){return t.isTrackedToggle(e)}}})],1)],1)],1)})),1)],1)],1)],1)},s=[],a=i("e1e5"),n=i("d84b"),o={computed:{...n["a"],...n["g"],...n["e"],youtubeCrawlForActiveStreams:{get(){return this.getUserSettingValueByKey({key:"youtubeCrawlForActiveStreams"})},set(t){this.updateUserSetting({key:"youtubeCrawlForActiveStreams",value:t})}},youtubeCrawlForUpcomingStreams:{get(){return this.getUserSettingValueByKey({key:"youtubeCrawlForUpcomingStreams"})},set(t){this.updateUserSetting({key:"youtubeCrawlForUpcomingStreams",value:t})}},telegramForward:{get(){return this.getUserSettingValueByKey({key:"telegramForward"})},set(t){this.updateUserSetting({key:"telegramForward",value:t})}}},methods:{...n["h"],...n["f"],async updateUserSetting({key:t,value:e}){this.updateUserSettingByKey({key:t,value:e}).then(()=>{this.$toast(`${e?"Activated":"Deactivated"} ${t}.`)}).catch(i=>{this.$toast(`Error while ${e?"activating":"deactivating"} of ${t}.`),this.$log.error(`Error while ${e?"activating":"deactivating"} of ${t}.`,i)})},async isTrackedToggle(t){console.log("isTrackedToggle -> chat",t);const e=!t.isTracked;await this.updateChat({chat:t,changes:{isTracked:e}}),this.$toast(`Chat ${t.title} marked to be ${e?"tracked":"not tracked"}.`)},unlink(t){Object(a["a"])({url:`/v1/auth/${t}/unlink`}).then(t=>{t.ok?this.$store.dispatch("USER_REQUEST"):this.$log.debug("Unlink with not ok response",t)}).catch(t=>{this.$log.debug("Unlink failed with error",t)})}},components:{},mounted(){this.$log.debug("Account.vue mounted"),this.fetchChats()}},c=o,l=i("2877"),u=i("6544"),v=i.n(u),m=i("b0af"),d=i("99d9"),h=i("a523"),g=i("132d"),_=i("8860"),p=i("da13"),k=i("5d23"),C=i("b73d"),w=Object(l["a"])(c,r,s,!1,null,null,null);e["default"]=w.exports;v()(w,{VCard:m["a"],VCardActions:d["b"],VCardText:d["d"],VContainer:h["a"],VIcon:g["a"],VList:_["a"],VListItem:p["a"],VListItemActionText:k["e"],VListItemContent:k["g"],VListItemTitle:k["k"],VSwitch:C["a"]})}}]);