# Changelog

## 2020-05-18 08:57

- Backend: replace self made middleware for async route functions in express.js with a public npm package called `const asyncHandler = require('express-async-handler')`. In the future I may move to `fastify` or a different server implementation but for now I am sticking with `express.js` because I know it.
- Backend: Socket.io cleanup. `Express Status Monitor` had to be changed because it was highjacking my socket.io connection, now it uses the same socket.io connection as the rest of the backend.
- Backend: Socket.io chat messages are being sent again and working.

## 2020-05-18 00:50

- Frontend: vue.js added a component functionality to scroll the chat to the bottom automatically if it's already at the bottom.
- Tried to fix the socket.io connection, but I can't figure out for some reason. It just is not working :( will have to get back to that with a clear mind.

## 2020-05-17 17:28

- Frontend: vue.js implemented Json Web Token based authentication flow (user is redirected to callback based server authentication oauth flow based on provider chosen, then the backend redirects to `/login/success` which calls the api `/api/v1/auth/token` to retreave the jwt token for the session) (Note: this can be improved with a frontend only flow but right now, this works and will be used for the time being. Eventually there will be a solution without session cookies)
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
