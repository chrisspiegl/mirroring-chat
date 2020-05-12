# Changelog

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