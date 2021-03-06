# Changelog

## 2020-06-03 15:58

- Frontend: `/login` now has buttons instead of text links
- Frontend: Fixed: login error "request to user Settings failed" only do this after login has happend?!
- Frontend: Fixed: system is trying to request `userSettings` even when loading the `/home` page?! needs fixing…
- Frontend: Fixed: upon hitting "logout" it prints cannot read property `displayName` of null?
- Frontend: implement chatMessages socket connection through VUEX Store
- Frontend: implement "afterAuth" and "afterAuthLogOut" global vuex actions
- Frontend: move away from `moment.js` in `vue.js` to => `date-fns`
- Frontend: Chat: button to send reply and prepopulate the send message field with `@+username`
- Frontend: Chat: make chat message sender name a link to their profile or channel
- Frontend: Chat: add ability to destroy all chat messages by a certain author
- Frontend: `/chat` screen should be fully functional with ban and timeout calling the API and asking for those actions…
- Backend: Chat Actions: send redis notifications
- Backend: Chat Actions: make chatMessage permanent (aka never delete anything)
- Backend: Chat Actions: and `destroy` all messages by the user that is put in `timeout` or `banned`
- Backend: Chat Actions / Twitch Crawler / YouTube Crawler: added the idAuthorProvider so that I can destroy all messages by a certain author
- Frontend: Chat: `/chat` screen should work with `reply button`
- Frontend: Chat: send text to api with knowledge which system should send the message
- Frontend: Chat: send that text message onto the redis notification system for the respective services to pick it up and send away…

## 2020-06-02 22:01

- Frontend: update the implementation of the `userSettings` store to work properly (including updates, and also the proper observed bindings for interface updates)
- Frontend: took the learnings by recoding the `userSettings` to now also move all the `chats` into it's own module as well as all the `chatMessages` for the `Chat.vue` page
- Backend: updated the api endpoints to be more minimalist and without the whole warper object which was just more stuff to write each time (may come back at some point in the future but for now it's all about smaller == better)
- Backend: api cleanup (no longer specify the whole application header manually, instead using `res.json(content)`)
- Backend: simplified the error handling by adding `express-boom` to the project
- Frontend: Added the toolbars in the `Chat.vue`
- Frontend: make sure that all the user settings are definitely fetched on routes that are logged in only (pre-fetch each route request, but only once, and then cached)

## 2020-06-01 18:17

- Frontend: update complete vuex state/store implementation
- Frontend: update complete router implementation
- Frontend: update the vuex auth implementation to be much simpler
- Frontend: update all views and components to the new auth implementation
- DevOps: update all dependencies
- Frontend: updating smaller things and changes for later testability and page title updates
- Backend: update the auth api endpoint to include the users details
- Backend: remove the `/api/v1/users/me` endpoint becuase that is now done inside the `/api/v1/auth/token1` route

## 2020-05-30 17:05

- Implement manual account activation for live system.
- Normalize the UserProvider models by adding `displayName` to the telegram database model.
- Initial implementation of user setting model & api routes
- Initial implementation of the `/account` page for the frontend which now shows:
  - linked platforms and their usernames/displaynames
  - account settings for youtube tracking (disable / enable the tracking of active and upcomign streams)
    - implemented so that the database stores the values
  - display all live, permanent, upcoming, and past streams
  - ability to set the stream 'tracking or not tracking' (and the database stores the information)

## 2020-05-29

- Test and Fix Markdown parsing
- Test and Fix Twitch Emotes
- Test and Fix Bad Word Filter
- Frontend: implement `live` & `done` chat message side by side.
- Frontend: implement basic `mark as done` button
- Frontend: flip scroll order to have `latest at the top` for live chat and `oldest undone at the top` for the acknowledge section
- Frontend: implement confirm dialogs
- Frontend: implement snackbar / toasts for notifications
- Frontend: api util separate post, put, patch so that they provide the data separate
- Frontend: implement api calls for button actions (ban, timeout, reply)
- Backend: add support for twitch emoticons
- Backend: prepare routes for ban, timeout, and reply
- Frontend: moved footer to the navigation drawer
- Frontend: chat view smaller last message footer message
- Frontend: check chat view on mobile

## 2020-05-28 11:56

- Backend: messagesStore: add bad word filtering
- Backend: TelegramBot: make all functions onlyPrivate so that the bot does not share anything in groups except for the message to go private.
- Backend: TelegramBot: update `/start` and `/help` commands to be more helpful.
- Backend: TelegramBot: should display first line of new messages in __italic__.
- Backend: Twitch: implement basic emote replace as seen in coding garden twitch bot
- Backend: Twitch: implement basic markdown parsing and html sanitization based on coding garden twitch bot implementation
- Backend: TwitchBot: Support action messages to also be displayed

## 2020-05-27 08:32

- DevOps: update the ecosystem file for PM2 so that it includes all the necessary processes for deploy.
- DevOps: separate production and development api keys so that I don't accidentally overrun any quota for users.
- DevOps: update all config files to represent the new api keys, client ids, and app secrets.
- DevOps: create the nginx.conf file so that the server can run the application nice and easy.
- DevOps: first deploy on [https://mirroring.chat](https://mirroring.chat)
- Frontend: add debug logger `vuejs-logger` and replace all console.log with it.
- Frontend: use `webpack-bundle-analyzer` to reduce the file size of the build product (article <https://medium.com/js-dojo/how-to-reduce-your-vue-js-bundle-size-with-webpack-3145bf5019b7)>
- Frontend: found out that I had to put my own check for `NODE_ENV==='production'` for the source map setting in order to not have source maps in the code for production builds.
- Frontend: make Font Awesome specific to only include all the icons that I am actually requesting by manual tree shaking.
- Frontend: removed roboto and all Material Design Icons since that only bloats the bundled size for the code.
- Frontend: setup font paths for system and monospace system stacks.
- Frontend: use monospace font satck for all things in the user interface.
- DevOps: update the `npm run vueBuildProduction` task to include `--report` so that all file sizes are logged in the output.
- DevOps: noticed that `npm run vueBuildProduction --report` does the same thing as the webpack analyzer so I don't need that one.
- Frontend: initial public commit of built for production code in `./public`
- Backend: found out that the file `config/index.js` (which is responsible for loading the config files and merging the NODE_ENV based file with the `all.js` file) was not in the git repo and thus the server could not start.
- DevOps: fix `nginx.conf` to serve static files statically and all others processed by node backend
- Frontend: make moment.js `fromNow` show seconds from the start and not `a few seconds ago`.
- Frontend: add action icons to the chat view to later implement `ban`, `timeout`, `highlight`, `reply`, and `archive`.
- Frontend: add new font awesome icons as per above.
- Frontend: Move the time to the bottom right of chat messages.
- DevOps: testing production installation and noticing some issues (but it works now). Will develop further in the next few days.

## 2020-05-26 22:47

- Backend: TwitchListener: make it so that the `CHAT_CREATED` and `CHAT_UPDATED` only make the chat join if `isTracked` is set to true.
- Backend: Added npm package `twitch` for api access for things like requesting userHelix objects with avatar image link.
- Backend: Rename the `this.client` to `this.clientTmi` to be more compatible with having the secondary `this.clientTwitch` come from the new package.
- Backend: Added avatar requesting for the twitch users including a 10 minute cache on the user object.
- Backend: Adding a memory stored cache manager and a multiCache manager as well (super fast in memory with max 100 keys and redis following that).
- Frontend: Added avatar logic to front end to request youtube or twitch avatar, depending on the message provider.
- Frontend: Make the chat list have no individual background.
- Frontend: tested first 'production' build and it showed that I needed to make the brand colors stick harder.
- Frontend: Making the brand colors available globally as variables and as classes.
- Frontend: Forcing the brand colors with `!important` because they tend to get overwritten by some things (may need a cleaner way to do this in the future).

## 2020-05-26 15:20

- Backend: Twitch: completely rewrite twitch irc bot with all kinds of event listening (things that twitch is sending, as well as events like `CHAT_CREATED` and `CHAT_UPDATED` so that we can join and leave a chat and such things based on that information)
- Backend: minor cleanup of filenames and stuff
- Backend: Twitch: testing how I could implement a interval based queue to be used to not run into rate limiting with the twitch IRC server (aka 20 commands per 30 seconds) found p-queue which can do this relatively easily and with a simple implementation. Stored in TwitchListener for later.
- Backend: Twitch: Listening for `CHAT_CREATED`, `CHAT_UPDATED`, and `CHAT_DELETED` to `join`, `part&join`, and `part` the channel that is being updated.

## 2020-05-25 15:43

- Frontend: Adding vuescroll for a smoother and more beautiful scrollbar implementation.
- Frontend: Update to use fontawesome for brand icons and all others as well.
- Frontend: Disable special warning for fontawesome stuff.
- Backend: Update messagesStore to return the correct sort order and limitations of chat messages (no pagination at this time)
- Backend: Make messagesStore subscribe and unsubscribe unique id based so that it's easy to unsubscribe from events again via a given id. This makes it possible to have a telegram chat or a socket.io socket uniquely being subscribed just once. This also makes it possible that two chat windows can be open in separate browsers and both receive the same notifications (before one would always disconnect because the second would get the message 'already connected')
- Frontend: Update the chat windows with a manual way of keeping the scroll at the bottom while using vuescroll as a beautiful scroll bar.
- Frontend: Additionally implemented a new card layout with images, and headlines, and icons for the different providers, and time being displayed based on the time that has passed since the message was received.
- Frontend: make project version exposed in vuex store to be displayed to users.
- Frontend: add home page text with project description and a FAQ section.
- Frontend/Backend: made sure that the socket.io settings are set to infinitely try to reconnect on connection loss so that the streaming chat's and stuff are going to automatically continue even when the server restarts.

## 2020-05-24 15:23

- Backend: Implement RedisKeyGenerator so that all redis keys are generated in a central location and can easily be updated in the future.
- Backend: Database based store for all Chat Messages implemented (updated Twitch and YouTube Crawler as well as Socket.io and Telegram Notification sending)
- Backend: Put Redis Subscribe code into message store for easier notification listening on new messages
- Backend: Make YouTube Crawler database based and automatically disable / enable crawling based on database settings for channels
- Backend: Make channels/broadcasts separate in the mysql database
- Backend: YouTube: Make Broadcast Search and new Chat Messages Crawl via Cron Job
- Backend: Implemented a Redis Pub Sub Manager to have all those notifications go through one central class. This way we do not have multiple listeners and do not have to be careful to close any listeners while others are still listening. While doing so, I also (for now) decided to not 'minimize' the messages when sending through redis… over optimizing in early stages is only a source for errors.
- Backend: added a global event stack which goes through the RedisPubSubManager and thus is available to all instances that may be listening to these events. Events include but are not limited to USER_LOGIN, USER_CREATED, CHAT_CREATED, CHAT_UPDATED, CHAT_MESSAGE_RECEIVED, and more. This gives the possibility to react to things across processes and applications (even across multiple servers if need be). These events do not guarantee delivery! THat's what RSMQ is for. But these events make it possible for me to have settings for a twitch channel be updated on the web-interface, and the twitch bot process can then update itself accordingly.

## 2020-05-19 08:57

- Backend: Database - make 'strict mode' compatible again.
- Backend: Database - cleanup all eslint warnings and errors
- Gulpfile: cleanup of gulpfile with eslintrc fixes and some minor cleanup
- Backend/Frontend: Telegram - Add telegram link functionality and streaming ability to make chat messages available on mobile devices through telegram bot.
- Backend/Frontend: Telegram - Also already implemented functionality to limit the bot to only be used in private chats or by admins (use as needed on a per command level bases)
- General code cleaning in some respects.

## 2020-05-18 19:23

- Backend: YouTube Chat Listener - Implemented bot to automatically auth with youtube api based on oAuth2 login details.
- Backend: YouTube Chat Listener - Implemented function to check which streams are `upcoming` and `active` for a specified user.
- Backend: YouTube Chat Listener - Implemented function to watch a stream for new messages and to do so on an interval (this however comes with the problem that the api cost of polling needs to be considered 😕).
- Backend: YouTube Chat Listener - Implemented a redis key to remember the broadcast nextPage variable which makes sure that a specific broadcasts messages are not crawled multiple times into the chat redis (this may change in the future to a database based system to store the chat messages and not just put them into redis)?
- Backend: YouTube Chat Listener - opted for a once per minute check for now to reduce the API Quota needs and reduce the risk of running into those limits while testing already.
- Backend/Frontend: made sure the chat messages are associated to the `idUser` instead of the twitch `channelName` in redis storage and socket communication.
- Backend: MessageStore to store the original provider message object additionally to a cleaned version so that the frontend can show those details eventually (verified badge, moderator, and more).
- Code Formatting

## 2020-05-18 08:57

- Backend: replace self made middleware for async route functions in express.js with a public npm package called `const asyncHandler = require('express-async-handler')`. In the future I may move to `fastify` or a different server implementation but for now I am sticking with `express.js` because I know it.
- Backend: Socket.io cleanup. `Express Status Monitor` had to be changed because it was hijacking my socket.io connection, now it uses the same socket.io connection as the rest of the backend.
- Backend: Socket.io chat messages are being sent again and working.

## 2020-05-18 00:50

- Frontend: vue.js added a component functionality to scroll the chat to the bottom automatically if it's already at the bottom.
- Tried to fix the socket.io connection, but I can't figure out for some reason. It just is not working :( will have to get back to that with a clear mind.

## 2020-05-17 17:28

- Frontend: vue.js implemented Json Web Token based authentication flow (user is redirected to callback based server authentication oauth flow based on provider chosen, then the backend redirects to `/login/success` which calls the api `/api/v1/auth/token` to retrieve the jwt token for the session) (Note: this can be improved with a frontend only flow but right now, this works and will be used for the time being. Eventually there will be a solution without session cookies)
- Frontend: vue.js updated 'link & unlink' functionality to work with the new frontend implementation
- Frontend: vue.js updated chat to use twitch username of logged in user as channel name (needs improving in the future to be a `idUser` based chat instead)
- Frontend: vue.js started to use pug for templating (much easier to write and read in my opinion)
- Backend: Passport.js refresh was broken because of missing `require('./passport)` so that the used strategies are available.

## 2020-05-12 18:58

- Frontend: vue.js build system (understanding, learning, setup, trial and error)
- Frontend: vue.js integrate moment date filter
- Frontend: vue.js integrate socket.io (had to downgrade to earlier version of vue-socket.io because of a bug)
- Frontend: vue.js show chat messages (load via API call)
- Backend: API: implement api file structure and `/api/v1/chat/messages/:channel` as first route
- Backend: make `redisSubscriber` one reusable client connection just like `redisClient`
- Backend: message store to provide encode and decode methods for smaller redis storage while staying readable in code
- Backend: Twitch Crawler: added configuration setting for twitch bot username
- Backend: Twitch Crawler: twitch bot automatically listens to all active users on the platform (will change in the future)
- Backend/Frontend: made redis keys a bit cleaner, never use twitch channel name with `#` in the beginning (just confusing), and update all the pub/sub to work together again
- Backend/Frontend: Socket: implement disconnect to close down redis.subscribe for certain channel once view left or socket disconnected

## 2020-05-11

- PM2 deploy setup and git repository (not deployed but at least a step closer)
- socket.io trial and error
- redis lpush, ltrim, and such things

## 2020-05-09 22:11

- registered mirroring.chat
- registered mirroring.live
- registered mirroring.stream
- created mirroring.chat and mirroring.stream groups on Telegram
- setup @MirroringChatBot on Telegram for use with this whole project.

## 2020-05-07 17:37

- Auth: Setup Google
- Auth: Setup Facebook
- Auth: Setup Twitch
- Auth: Setup Discord
- Auth: Simplified and made most things reusable (less duplicate code is always a good thing)
- Auth: Make logins work to actually have a session and be able to stay logged in on the website
- Auth: Have a page on the dashboard display which platforms are linked with an "unlink" button and if they are not linked a "link" button, and a "relink" button for those that are already connected
- Auth: Get all of the auth methods working with a "connect" to others
- Bot Twitch: First test implementation to receive and send messages
- Bot Twitch: Created special `MirroringBot` account to be able to use for multiple channels
- MessagingStore: A redis based store to collect messages from all platforms
- Bot Twitch: store all received messages into a channel based message store (this needs to change later to be mapped to the user and not channel based)
- Caching: learned a lot about `node-cache-manager` and implemented a handler for a file based as well as redis based cache storing
- Bot Twitch / Passport: trained passport with a add on to be able to self refresh the oauth tokens upon request (needed to login to twitch for example when user hasn't logged in / out in a while)
