import type { FaqKey } from "../faq-translations";

export const en: Record<FaqKey, string> = {
  faq_1_title: "What is nullchat?",
  faq_1_body: `nullchat is an anonymous, end-to-end encrypted chat room. It needs no account, no email, no phone number, and no personal information. You enter a shared secret (a password), and anyone else who enters the same secret lands in the same room.`,
  faq_2_title: "How do I join a room?",
  faq_2_body: `You and the person you want to talk to agree on a shared secret ahead of time, in person or over a phone call, whatever works for you. You both type that secret into nullchat and you are in the same encrypted room. There is no room list, no directory, and no way to browse. If you do not know the secret, the room does not exist to you.`,
  faq_3_title: "How should I choose a shared secret?",
  faq_3_body: `Your shared secret is the most important part of your security. It is both the key to your room and the key to your encryption, so if someone guesses it, they can read everything. Treat it like the combination to a safe.

Choose something long, random, and hard to guess. A strong secret is at least five or six random words, or 20 or more mixed characters. Avoid names, dates, common phrases, song lyrics, or anything someone could find on your social media. Never reuse a secret across different conversations or rooms.

Share your secret through a secure channel that is separate from nullchat. In person is best. A phone call is acceptable. Never send it over text, email, DM, or any platform that logs messages. If you think a secret has been exposed, stop using it and agree on a new one through a secure channel.

The strength indicator on the entry screen gives you a rough sense of how hard your secret is to brute-force, but it is no substitute for good judgment. When in doubt, make it longer and more random.`,
  faq_4_title: "How does the encryption work?",
  faq_4_body: `When you enter your shared secret, two things happen entirely in your browser:

1. The secret is run through Argon2id, a memory-hard key derivation function, using a domain-separated salt to produce a room ID. That hash is sent to the server so it knows which room to connect you to. The server never sees your actual secret.

2. The secret is run through a second, independent Argon2id derivation (16 MiB memory, 3 iterations) to produce a 256-bit encryption key. This key never leaves your browser. Because Argon2id needs a large block of RAM for every guess, it makes GPU and ASIC brute-force attacks on your password far harder than older key derivation functions.

Every message is encrypted with NaCl secretbox (XSalsa20-Poly1305) using that key before it leaves your device. The server receives, stores, and relays only ciphertext, which is meaningless without the key. We cannot read your messages, and no one can unless they know the shared secret.`,
  faq_5_title: "What does the server see?",
  faq_5_body: `The server sees:
• An Argon2id-derived hash (the room ID), not your password
• Encrypted ciphertext blobs, not your messages
• The number of active connections in a room
• Timestamps of when encrypted blobs arrived

The server does NOT see:
• Your shared secret or password
• Your message content
• Your identity or username (aliases are encrypted inside messages)
• Your IP address (stripped at the edge by our hosting provider)`,
  faq_6_title: "What is message padding?",
  faq_6_body: `Before encryption, every message is padded to a fixed 16,384-byte block: a 2-byte length prefix, then the message content, then random noise. A short message like "hi" ends up the same ciphertext size as a message at the maximum length. Without padding, someone watching the traffic could guess at message content from the size of the ciphertext. Filling the remainder with random bytes rather than zeros means the plaintext has no tell-tale pattern before encryption either.`,
  faq_7_title: "What is timestamp obfuscation?",
  faq_7_body: `Timestamps inside messages are rounded to the nearest minute before encryption. This makes it harder for someone to line up message patterns across different channels by comparing exact send times.`,
  faq_8_title: "How long do messages last?",
  faq_8_body: `Messages use a tiered timer:

• Dead drop (first message): A message sits encrypted on the server for up to 24 hours, waiting for a response. The sender can leave and come back to check on it without starting any countdown. Simply entering the room does not burn the message.

• Both people present: When a second person joins, all unread messages start a 5-minute burn countdown. Any new message sent while both people are present also burns 5 minutes after it is read. You do not have to do anything, because their presence confirms the message is being read.

• Received button: If you pick up a dead drop message while alone in the room, you can press "Received" to confirm receipt and start the 5-minute burn. This button appears only during the initial dead drop pickup, not during active conversations.

• Active conversation: Once a room has seen replies, later messages last up to 6 hours if the recipient is not present. If both people are connected, messages burn 5 minutes after being read.

• Hard ceiling: Any unread message is deleted once its timer runs out (24 hours for dead drops, 6 hours for active messages), whether or not it was acknowledged.

There is no archive, no backup, and no way to recover a deleted message.`,
  faq_9_title: "What is the dead drop?",
  faq_9_body: `nullchat works like a digital dead drop. In old-school intelligence tradecraft, a dead drop is a way to pass information between two people without them ever meeting or being in the same place at the same time. nullchat does the same thing.

You enter the shared secret, leave an encrypted message, and disconnect. The message sits on the server, encrypted and unreadable by anyone including us, for up to 24 hours. Your contact enters the same secret whenever they are ready and picks up the message. When they join and both of you are present, any waiting messages start a 5-minute burn countdown, because their presence is proof of receipt. If they pick up the message while alone, they can press the one-time "Received" button to confirm receipt and start the burn, or just reply. Once the burn starts, the message is destroyed for good after 5 minutes.

The sender can reconnect at any time to check whether the message is still waiting, and this starts no countdown as long as they are the only one in the room. Neither person needs to be online at the same time. Neither needs an account. Neither is identifiable. The server never knows who left the message or who picked it up, only that an encrypted blob was stored and later retrieved. Once it burns, there is no evidence the exchange ever happened.`,
  faq_10_title: "How long do rooms last?",
  faq_10_body: `A room exists as long as it has active connections or unexpired messages. Once the last person disconnects and every message has expired or burned, the room is gone. Nothing about it is kept. If no messages are ever sent, the room is just a live connection: nothing is stored, and it disappears the moment everyone leaves.`,
  faq_11_title: "What is the Terminate button?",
  faq_11_body: `Terminate immediately deletes every message you sent during your current session, for everyone in the room. Other people see your messages vanish from their screen in real time. You are then disconnected. Use this if you need to leave without a trace.`,
  faq_12_title: "What is the Leave button?",
  faq_12_body: `Leave just disconnects you from the room. Your messages stay on the server: unread ones keep waiting (up to 24 hours), and already-read ones keep their 5-minute burn countdown. If you rejoin later, you get a new random alias, and there is no way to link your old and new identities.`,
  faq_13_title: "What are the random aliases?",
  faq_13_body: `When you enter a room, you are given a random 8-character hex code (like "a9f2b71c") as your alias. This alias is generated in your browser, encrypted inside each message, and never sent to the server in plaintext. If you disconnect and reconnect, you get a new alias. There is no way to reserve, choose, or keep an alias.

An alias is a label, not a verified identity. Anyone who knows the shared secret can join the room and can set their alias to anything, so treat everyone in a room as someone who has the secret. If you need to be sure who you are talking to, confirm it out of band, for example by agreeing on a code word in advance. Only share a secret with people you trust.`,
  faq_14_title: "Is there a participant limit?",
  faq_14_body: `Each room supports up to 50 connections at once. If the room is full, you will see a "Room is full" message. This limit keeps rooms small and helps prevent abuse.`,
  faq_15_title: "Is there rate limiting?",
  faq_15_body: `Yes. Each connection is limited to one message per second. This prevents spam and abuse without asking for any identity verification. If you send messages too quickly, you will see a brief "Slow down" notice.`,
  faq_16_title: "Can I access nullchat over Tor?",
  faq_16_body_1: `nullchat is available as a Tor hidden service for people in censored regions or anyone who wants an extra layer of anonymity. Open Tor Browser and go to:`,
  faq_16_body_2: `By default, the clearnet and Tor versions connect to the same backend, so people on either side can talk to each other in the same rooms using the same shared secret. The .onion service routes through Tor's network with no Cloudflare, no CDN, and no third-party infrastructure between you and the server. Tor sends your connection through several encrypted relays, so neither the server nor anyone watching can work out your real IP address or location. The .onion service uses plain HTTP, which is expected and safe here, because Tor already encrypts everything between your browser and the server. All the usual application-level encryption (NaCl secretbox, Argon2id key derivation) still applies on top of that. Note: Tor Browser must be set to "Standard" security level for nullchat to work, because the app needs JavaScript.`,
  faq_17_title: "What is a Tor-only room?",
  faq_17_body: `When you use nullchat through the .onion hidden service, you can turn on "Tor-only room", a toggle on the password entry screen. With it on, your room goes into a separate namespace that only other Tor users with the same toggle on can reach. Clearnet users can never join a Tor-only room, even if they know the shared secret.

This is more secure than the default shared rooms:

• Both people are routed through Tor's multi-hop onion network, so neither person's real IP address or location is visible to anyone, including the server.
• No DNS lookups, no CDN, and no third-party infrastructure touch the connection at any point.
• Traffic analysis is much harder, because both sides get Tor's relay padding on top of nullchat's own connection padding (random dummy frames sent at random intervals).
• There is no clearnet participant whose weaker connection metadata could be tied to the conversation.

You are only as anonymous as the weakest link in the conversation. In a default room, a clearnet participant's connection passes through DNS resolvers, CDN infrastructure, and normal internet routing, all of which can be watched or subpoenaed for metadata about who connected, when, and from where. The Tor-only toggle removes that risk by giving every participant the same network-level anonymity.

Both people have to turn the toggle on, the same way you both agree on the shared secret. The chat header shows "TOR ONLY" in green when it is active, or "CLEARNET" in red for standard rooms, so you always know which mode you are in.`,
  faq_18_title: "What is the inactivity timeout?",
  faq_18_body: `If you go inactive for 15 minutes, with no typing, tapping, or scrolling, nullchat disconnects you and returns you to the password entry screen. A warning appears at 13 minutes so you can choose to stay. This protects your session if you walk away from your device: it keeps messages from burning while no one is reading, and it keeps the chat from sitting visible on an unattended screen.`,
  faq_19_title: "What about IP addresses?",
  faq_19_body: `On the clearnet (nullchat.org), the app is hosted on Cloudflare's edge network. Your IP address is handled at the infrastructure layer and is never read, logged, or stored by the application code. The server code does not touch IP headers. We have no way to identify you by network address.

On the Tor hidden service (.onion), your IP address is never visible to the server at all, because Tor's onion routing gives you full network-level anonymity. The server only sees connections coming from the Tor network, with no way to trace them back to you.`,
  faq_20_title: "Are there any cookies or trackers?",
  faq_20_body: `No. nullchat sets no cookies, uses no analytics, loads no third-party scripts, embeds no tracking pixels, and makes no external requests. The Content Security Policy headers enforce this at the browser level. You can check it yourself in your browser's developer tools.`,
  faq_21_title: "Why can't I send links, images, or files?",
  faq_21_body: `This is on purpose. nullchat is text only. No links, images, file attachments, or media of any kind can be sent or shown. That is a deliberate security choice, not a missing feature. Clickable links and embedded media are the main way commercial spyware like Pegasus and Predator delivers zero-day exploits. A single malicious link or file can quietly compromise a whole device. By keeping the chat to plain text, nullchat removes that attack surface. There is nothing to click, download, or render, so there is nothing to exploit.`,
  faq_22_title: "Can I copy or screenshot messages?",
  faq_22_body: `nullchat actively discourages capturing message content. Text selection and copying are turned off in the chat area, right-click menus are blocked, and common screenshot shortcuts are intercepted. The browser's Screen Capture API is also blocked through Permissions-Policy headers, which stops web-based screen recording tools from grabbing the page.

These are speed bumps, not guarantees. A determined person can always photograph the screen with another device or use operating-system tools that get around browser restrictions. The point is to make casual capture annoying and to set the expectation that conversations here are not meant to be saved.`,
  faq_23_title: "What is decoy traffic?",
  faq_23_body: `While you are connected to a room, nullchat sends encrypted dummy messages at random intervals, roughly every 10 to 60 seconds. These decoys look exactly like real messages: the same size (thanks to fixed padding), encrypted with the same key, and relayed over the same server path. The recipient's client quietly throws them away after decryption.

Decoy traffic defeats traffic analysis. Without it, someone watching the network could tell when real communication is happening from when encrypted blobs go out. With decoys, there is a steady stream of identical-looking traffic whether or not anyone is typing, so real messages cannot be picked out from the noise.`,
  faq_24_title: "What is connection padding?",
  faq_24_body: `The server sends random-length binary frames (64 to 512 bytes of random data) to every connected client at random intervals, roughly every 5 to 30 seconds. These frames are not messages. They are pure noise that the client ignores. Together with client-side decoy traffic, connection padding keeps network traffic patterns from revealing whether real communication is happening, how many messages are being exchanged, or when people are active.`,
  faq_25_title: "What is the panic key?",
  faq_25_body: `Triple-tapping the Escape key wipes your session at once. It sends a terminate command to the server (deleting all your messages), closes the WebSocket connection, zeroes the encryption key in memory, clears the page, wipes sessionStorage and localStorage, clears the clipboard, and sends your browser to google.com. The whole thing takes under a second. If the browser tries to restore the page from cache, for example when you hit the back button, the wipe runs again. Use this when you need to erase all sign of the conversation from your screen and browser right away.`,
  faq_26_title: "What is steganographic mode?",
  faq_26_body: `Steganographic mode disguises nullchat as a document editor. Press Shift five times quickly to turn it on. The whole interface changes: the dark chat view is replaced with a familiar-looking document editor, complete with a toolbar and menu bar. Messages show up as paragraphs in the document body, and your input blends in as if you are typing a document. Encryption, burn timers, and every other security feature keep running underneath.

This helps if someone is looking over your shoulder or your screen is visible to others. At a glance it looks like you are editing a document, not holding an encrypted conversation. Press Shift five times again to go back to the normal chat view.`,
  faq_27_title: "Does nullchat auto-clear the clipboard?",
  faq_27_body: `Yes. If anything is copied while you are in a chat room, nullchat clears your clipboard after 15 seconds. The clipboard is also wiped when you close the tab or navigate away, and right away if you use the panic key. This keeps message content from lingering in your clipboard after you leave the conversation.`,
  faq_28_title: "Can you read my messages?",
  faq_28_body: `No. The server is a plain relay. It receives encrypted blobs and forwards them. The encryption key comes from your shared secret, which never leaves your browser. We do not have the key, so we cannot decrypt the blobs. Even if the server were compromised, an attacker would get only meaningless ciphertext.`,
  faq_29_title: "Can government agencies access my messages?",
  faq_29_body: `We cannot hand over what we do not have. No plaintext messages are stored anywhere. There are no user accounts to look up and no IP logs to produce. The encrypted blobs auto-delete on a fixed schedule. Even under a valid legal order, the most we could provide is a pile of encrypted blobs and room hashes, none of which mean anything without the shared secret that only the participants know.`,
  faq_30_title: "Is nullchat open source?",
  faq_30_body_1: `Yes. The whole codebase (client, server, encryption, and infrastructure configuration) is public and open for audit at`,
  faq_30_body_2: `. You can check that the code running on the server matches what is published, build it yourself, or run your own instance. A tool that asks you to trust it with private conversations has to be open to inspection.`,
  faq_31_title: "Who built nullchat?",
  faq_31_body_1: `nullchat is built by Artorias, a veteran-operated intelligence technology company based in New York City. Artorias builds tools for organizations and individuals who need to communicate securely and operate without surveillance. The idea behind nullchat is that secure communication should not be a privilege reserved for the few. Learn more at`,

};
