(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5bb8e355"],{2919:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-container",{staticClass:"pa-0 my-0 fill-height"},[s("div",{staticClass:"boxToFillHeight"},[s("div",[s("v-toolbar",{attrs:{dense:""}},[s("v-card-title",{staticClass:"justify-center"},[e._v("All Chat Messages")])],1)],1),s("v-row",[s("v-col",[s("div",{staticClass:"boxToFillHeight",staticStyle:{height:"100%"}},[s("v-card",[s("v-toolbar",{attrs:{dense:""}},[s("v-toolbar-title",[e._v(e._s(e.chatMessagesUndone.length)+" Unacknoweledged Messages")]),s("v-spacer")],1)],1),s("div",{staticClass:"chat-container"},[s("vue-scroll",{ref:"vuescrollDone",attrs:{ops:e.vuescrollOptionsDone}},[e._l(e.chatMessagesUndone,(function(t,a){return e.chatMessagesUndone.length>0?s("message",{key:t.idChatMessage,attrs:{provider:t.provider,message:t,index:a,actionMessageDone:e.actionMessageDone,actionMessageReply:e.actionMessageReply,actionUserBan:e.actionUserBan,actionUserTimeout:e.actionUserTimeout,actionMessageHighlight:e.actionMessageHighlight}}):e._e()})),0===e.chatMessagesUndone.length&&0!==e.chatMessages.length?s("v-card",{staticClass:"mb-2"},[s("v-card-title",{staticClass:"justify-center"},[e._v("INBOX ZERO")]),s("v-card-subtitle",{staticClass:"text-center"},[e._v("You reached the bottom.")])],1):e._e(),0===e.chatMessagesUndone.length?s("v-card",{staticClass:"mb-2"},[s("v-card-title",{staticClass:"justify-center"},[e._v("Nothing yet…")]),s("v-card-subtitle",{staticClass:"text-center"},[e._v("Invite some people to your strem and let's chat.")])],1):e._e()],2)],1)],1)]),s("v-col",[s("div",{staticClass:"boxToFillHeight",staticStyle:{height:"100%"}},[s("v-card",[s("v-toolbar",{attrs:{dense:""}},[s("v-toolbar-title",[e._v("Live Chat with "+e._s(e.chatMessagesReversed.length)+" Messages")]),s("v-spacer")],1)],1),s("div",{staticClass:"chat-container"},[s("vue-scroll",{ref:"vuescrollLive",attrs:{ops:e.vuescrollOptionsLive}},[e._l(e.chatMessagesReversed,(function(t,a){return e.chatMessagesReversed.length>0?s("message",{key:t.idChatMessage,style:{opacity:t.doneAt?.5:1},attrs:{provider:t.provider,message:t,index:a,actionMessageDone:e.actionMessageDone,actionMessageReply:e.actionMessageReply,actionUserBan:e.actionUserBan,actionUserTimeout:e.actionUserTimeout,actionMessageHighlight:e.actionMessageHighlight}}):e._e()})),0===e.chatMessagesReversed.length?s("v-card",{staticClass:"mb-2"},[s("v-card-title",{staticClass:"justify-center"},[e._v("Nothing yet…")]),s("v-card-subtitle",{staticClass:"text-center"},[e._v("Invite some people to your strem and let's chat.")])],1):e._e()],2)],1)],1)])],1),s("div",[s("v-toolbar",[s("v-text-field",{attrs:{label:"Send Message","hide-details":"auto"}}),s("v-item-group",{staticClass:"pr-4"},[s("v-btn",{attrs:{icon:"",title:"Send to All"}},[s("v-icon",{attrs:{size:"1rem"}},[e._v("$chat")])],1),s("v-btn",{staticClass:"twitch-bg",attrs:{icon:"",title:"Send to Twitch"}},[s("v-icon",{attrs:{size:"1rem"}},[e._v("$twitch")])],1),s("v-btn",{staticClass:"youtube-bg",attrs:{icon:"",title:"Send to YouTube"}},[s("v-icon",{attrs:{size:"1rem"}},[e._v("$youtube")])],1),s("v-btn",{staticClass:"facebook-bg",attrs:{icon:"",title:"Send to Facebook"}},[s("v-icon",{attrs:{size:"1rem"}},[e._v("$facebook")])],1)],1),e.chatMessagesLastUpdated&&e.chatMessages.length>0?s("span",[e._v("Last updated "),s("abbr",{attrs:{title:e.chatMessagesLastUpdated}},[e._v(e._s(e._f("moment")(e.chatMessagesLastUpdated,"from",e.time)))])]):e._e()],1)],1)],1)])},i=[],o=s("2f62"),n=s("d84b"),c=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-expand-transition",[s("v-card",{staticClass:"mb-2",class:e.message.provider+"-bg",attrs:{outlined:""}},[s("v-list-item",[s("v-list-item-avatar",{staticClass:"mr-2 my-0",attrs:{size:"30"}},[s("v-img",{attrs:{src:e.avatar(e.message)}})],1),s("v-list-item-content",[s("v-list-item-title",[s("v-icon",{attrs:{size:"1rem"}},[e._v("$"+e._s(e.message.provider))]),e._v("/"+e._s(e.message.displayName))],1)],1),s("v-list-item-action-text",[s("v-card-actions",[s("v-btn",{attrs:{icon:"",title:"Ban"},on:{click:function(t){return e.actionUserBan(e.index,e.message)}}},[s("v-icon",[e._v("$ban")])],1),s("v-btn",{attrs:{icon:"",title:"Timeout"},on:{click:function(t){return e.actionUserTimeout(e.index,e.message)}}},[s("v-icon",[e._v("$timeout")])],1),s("v-btn",{attrs:{icon:"",title:"Highlight this message"},on:{click:function(t){return e.actionMessageHighlight(e.index,e.message)}}},[s("v-icon",[e._v("$highlight")])],1),s("v-btn",{attrs:{icon:"",title:"Reply to this message"},on:{click:function(t){return e.actionMessageReply(e.index,e.message)}}},[s("v-icon",[e._v("$reply")])],1),s("v-btn",{attrs:{icon:"",title:"Archive"},on:{click:function(t){return e.actionMessageDone(e.index,e.message)}}},[s("v-icon",[e._v("$check")])],1)],1)],1)],1),s("v-card-text",[s("v-list-item-action-text",{staticStyle:{float:"right"}},[e._v(e._s(e._f("moment")(e.message.sentAt,"from",e.time)))]),s("div",{domProps:{innerHTML:e._s(e.message.message)}})],1)],1)],1)},r=[],l={props:["message","provider","index","actionMessageDone","actionMessageReply","actionUserBan","actionUserTimeout","actionMessageHighlight"],computed:{...Object(o["c"])(["getProfile","isAuthenticated","isProfileLoaded"]),...Object(o["d"])({channelName:e=>e.user.profile.idUser,user:e=>e.user.profile,time:e=>e.time.now})},created(){},methods:{avatar(e){let t=`https://api.adorable.io/avatars/285/${e.displayName}.png`;switch(e.provider){case"twitch":e.providerObject&&e.providerObject.userHelix&&(t=e.providerObject.userHelix.profile_image_url);break;case"youtube":t=e.providerObject.authorDetails.profileImageUrl;break;default:break}return t}}},d=l,h=(s("7243"),s("2877")),g=s("6544"),v=s.n(g),m=s("8336"),u=s("b0af"),b=s("99d9"),p=s("0789"),f=s("132d"),y=s("adda"),M=s("da13"),_=s("5d23"),C=s("8270"),$=Object(h["a"])(d,c,r,!1,null,null,null),x=$.exports;v()($,{VBtn:m["a"],VCard:u["a"],VCardActions:b["b"],VCardText:b["d"],VExpandTransition:p["e"],VIcon:f["a"],VImg:y["a"],VListItem:M["a"],VListItemActionText:_["e"],VListItemAvatar:C["a"],VListItemContent:_["g"],VListItemTitle:_["k"]});var T={components:{Message:x},computed:{...n["a"],...n["c"],...Object(o["d"])({channelName:e=>e.auth.userCurrent.idUser,time:e=>e.time.now})},data(){return{vuescrollOptionsDone:{scrollPanel:{scrollingX:!1,scrollingY:!0}},vuescrollOptionsLive:{scrollPanel:{scrollingX:!1,scrollingY:!0}}}},mounted(){this.$log.debug("Chat.vue mounted"),this.fetchChatMessages()},watch:{chatMessages(e){this.$log.debug("Currently displaying "+e.length)}},methods:{...n["d"],actionMessageDone(e,t){this.markChatMessageDone(t).then(()=>{this.$toast(`Message by ${t.displayName} marked done.`)}).catch(e=>{this.$log.error("PUT /v1/chat/message/"+t.idChatMessage,e)})},actionMessageReply(e,t){},async actionUserBan(e,t){const s=await this.$confirm(`Do you really want to ban <b>${t.displayName}</b>?`,{color:"error",title:"Banning - "+t.displayName,buttonTrueText:"Yes",buttonFalseText:"No"});s&&this.banChatMessage(t).then(e=>{this.$toast(e.message)}).catch(e=>{this.$toast(`Failed to ban ${t.displayName} from the live chat.`),this.$log.error("Failed to ban user",e)})},async actionUserTimeout(e,t){const s=await this.$confirm(`Do you really want to send <b>${t.displayName}</b> into timeout?`,{color:"warning",title:"Timeout for "+t.displayName,buttonTrueText:"Yes",buttonFalseText:"No"});s&&this.banChatMessage(t).then(e=>{this.$toast(`Sent ${t.displayName} into timeout.`)}).catch(e=>{this.$toast(`Failed to timeout ${t.displayName} from the live chat.`),this.$log.error("Failed to timeout user",e)})},actionMessageHighlight(e,t){}},sockets:{connect(){this.$log.debug("chat socket connected")},hello(e){this.$log.debug("socket on *hello* with",e)},server(e){this.$log.debug("server: ",e)}},created(){this.sockets.subscribe("message-to-"+this.channelName,e=>{this.$log.debug("socket received message for "+this.channelName),e.data.messages.forEach(e=>{this.messages.push(e),this.chatMessagesLastUpdated=new Date})}),this.$socket.emit("hello","client says hey"),this.$socket.emit("chat-channel-connect",{channelName:this.channelName})},updated(){},destroyed(){this.$socket.emit("chat-channel-disconnect",{channelName:this.channelName})}},k=T,U=(s("814c"),s("62ad")),w=s("a523"),V=s("604c"),N=s("0fd9"),L=s("2fa4"),D=s("8654"),O=s("71d9"),H=s("2a7f"),R=Object(h["a"])(k,a,i,!1,null,"6d954d7c",null);t["default"]=R.exports;v()(R,{VBtn:m["a"],VCard:u["a"],VCardSubtitle:b["c"],VCardTitle:b["e"],VCol:U["a"],VContainer:w["a"],VIcon:f["a"],VItemGroup:V["b"],VRow:N["a"],VSpacer:L["a"],VTextField:D["a"],VToolbar:O["a"],VToolbarTitle:H["c"]})},7243:function(e,t,s){"use strict";var a=s("943b"),i=s.n(a);i.a},"814c":function(e,t,s){"use strict";var a=s("ec7e"),i=s.n(a);i.a},"943b":function(e,t,s){},ec7e:function(e,t,s){}}]);