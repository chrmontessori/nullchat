import type { FaqKey } from "../faq-translations";

export const en: Record<FaqKey, string> = {
  faq_1_title: "What is nullchat?",
  faq_1_body: `nullchat is an anonymous, end-to-end encrypted chat room that requires no accounts, no emails, no phone numbers, and no personal information of any kind. You enter a shared secret — a password — and anyone else who enters the same password lands in the same room. That's it.`,
  faq_2_title: "How do I join a room?",
  faq_2_body: `You and the person you want to talk to agree on a shared secret ahead of time — in person, over a phone call, however you want. You both type that secret into nullchat and you're in the same encrypted room. There is no room list, no directory, no way to browse. If you don't know the secret, the room doesn't exist to you.`,
  faq_3_title: "How should I choose a shared secret?",
  faq_3_body: `Your shared secret is the single most important piece of your security. It is both the key to your room and the key to your encryption — if someone guesses it, they can read everything. Treat it like a password to a safe.

Choose something long, random, and unguessable. A strong secret is at least 5–6 random words or 20+ mixed characters. Avoid names, dates, common phrases, song lyrics, or anything someone could find on your social media. Never reuse a secret across different conversations or rooms.

Share your secret through a secure, out-of-band channel — in person is best. A phone call is acceptable. Never send it over text, email, DM, or any platform that logs messages. If you suspect a secret has been compromised, stop using it immediately and agree on a new one through a secure channel.

The strength indicator on the entry screen gives you a rough sense of how resistant your secret is to brute-force attacks, but no indicator is a substitute for good judgment. When in doubt, make it longer and more random.`,
  faq_4_title: "How does the encryption work?",
  faq_4_body: `When you enter your shared secret, two things happen entirely in your browser:

1. The secret is processed through Argon2id — a memory-hard key derivation function — using a domain-separated salt to produce a room ID. This hash is sent to the server so it knows which room to connect you to. The server never sees your actual secret.

2. The secret is run through a second, independent Argon2id derivation (16 MiB memory, 3 iterations) to produce a 256-bit encryption key. This key never leaves your browser. Argon2id requires large blocks of RAM per guess, making GPU and ASIC brute-force attacks on your password orders of magnitude harder than traditional KDFs.

Every message you send is encrypted with NaCl secretbox (XSalsa20-Poly1305) using that key before it leaves your device. The server receives, stores, and relays only ciphertext — encrypted blobs that are meaningless without the key. We cannot read your messages. No one can, unless they know the shared secret.`,
  faq_5_title: "What does the server see?",
  faq_5_body: `The server sees:
• An Argon2id-derived hash (the room ID) — not your password
• Encrypted ciphertext blobs — not your messages
• The number of active connections in a room
• Timestamps of when encrypted blobs were received

The server does NOT see:
• Your shared secret / password
• Your message content
• Your identity or username (aliases are encrypted inside messages)
• Your IP address (stripped at the edge by our hosting provider)`,
  faq_6_title: "What is message padding?",
  faq_6_body: `Before encryption, every message is padded to a fixed 8,192-byte block using a 2-byte length prefix followed by the message content and random noise. This means a short message like "hi" produces the exact same size ciphertext as a message at the maximum length. Without padding, an observer could guess message content based on ciphertext length. The random noise fill (not zeros) ensures there is no distinguishable pattern in the plaintext before encryption. Padding eliminates this side channel entirely.`,
  faq_7_title: "What is timestamp obfuscation?",
  faq_7_body: `Timestamps included in messages are rounded to the nearest minute before encryption. This prevents timing correlation attacks where an observer could match message patterns across different channels by comparing exact timestamps.`,
  faq_8_title: "How long do messages last?",
  faq_8_body: `Messages use a tiered timer system:

• Dead drop (first message): A message sits encrypted on the server for up to 24 hours, waiting for a response. The sender can leave and come back to check on it without triggering any countdown. Simply entering the room does not burn the message.

• Both users present: When a second person joins the room, all unread messages immediately begin a 5-minute burn countdown. Every new message sent while both users are present also auto-burns in 5 minutes. No action is required — presence alone confirms the message is being read.

• Received button: If you pick up a dead drop message while alone in the room, you can press the "Received" button to manually confirm receipt and start the 5-minute burn. This button only appears once — during the initial dead drop pickup — and is not available during active conversations.

• Active conversation: Once a room has seen replies, subsequent messages have a 6-hour window if the recipient is not present. If both users are connected, messages burn in 5 minutes automatically.

• Hard ceiling: Any unread message is deleted after its timer expires (24 hours for dead drops, 6 hours for active messages) regardless of whether it was acknowledged.

There is no archive, no backup, no way to recover a deleted message.`,
  faq_9_title: "What is the dead drop?",
  faq_9_body: `nullchat functions as a digital dead drop. In traditional intelligence tradecraft, a dead drop is a method of passing information between two people without them ever needing to meet or be in the same place at the same time. nullchat works the same way.

You enter the shared secret, leave an encrypted message, and disconnect. The message sits on the server — encrypted and unreadable by anyone, including us — for up to 24 hours. Your contact enters the same secret whenever they're ready, and picks up the message. When the recipient joins and both users are present, all waiting messages immediately begin a 5-minute burn countdown — presence alone is proof of receipt. If the recipient picks up the message while alone, they can press the one-time "Received" button to manually confirm receipt and start the burn, or simply reply. Once the burn starts, the message is permanently destroyed after 5 minutes.

The sender can safely reconnect at any time to check whether their message is still waiting — without triggering any countdown, as long as they are the only one in the room. Neither party needs to be online at the same time. Neither party needs an account. Neither party is identifiable. The server never knows who left the message or who picked it up — only that an encrypted blob was stored and later retrieved. After the burn, there is no evidence the exchange ever happened.`,
  faq_10_title: "How long do rooms last?",
  faq_10_body: `A room exists as long as it has active connections or unexpired messages. Once the last person disconnects and all messages have expired or burned, the room is gone. There is no persistent room state. If no messages are ever sent, the room is just a live connection — nothing is stored, and it vanishes the moment everyone leaves.`,
  faq_11_title: "What is the Terminate button?",
  faq_11_body: `Terminate immediately deletes every message you sent during your current session from the server for everyone in the room. Other participants will see your messages disappear from their screen in real time. You are then disconnected from the room. Use this if you need to leave without a trace.`,
  faq_12_title: "What is the Leave button?",
  faq_12_body: `Leave simply disconnects you from the room. Your messages remain on the server — unread messages continue waiting (up to 24 hours), and already-read messages continue their 5-minute burn countdown. If you rejoin the room later, you'll get a new random alias — there is no way to link your old and new identities.`,
  faq_13_title: "What are the random aliases?",
  faq_13_body: `When you enter a room, you are assigned a random 8-character hex code (like "a9f2b71c") as your alias. This alias is generated in your browser, encrypted inside each message, and is never sent to the server in plaintext. If you disconnect and reconnect, you get a new alias. There is no way to reserve, choose, or persist an alias.`,
  faq_14_title: "Is there a participant limit?",
  faq_14_body: `Each room supports up to 50 simultaneous connections. If the room is full, you'll see a "Room is full" message. This limit exists to keep rooms intimate and to prevent abuse.`,
  faq_15_title: "Is there rate limiting?",
  faq_15_body: `Yes. Each connection is limited to 1 message per second. This prevents spam and abuse without requiring any identity verification. If you send messages too quickly, you'll see a brief "Slow down" notice.`,
  faq_16_title: "Can I access nullchat over Tor?",
  faq_16_body_1: `nullchat is available as a Tor hidden service for users in censored regions or anyone who wants an additional layer of anonymity. Open Tor Browser and navigate to:`,
  faq_16_body_2: `By default, both the clearnet and Tor versions connect to the same backend — users on either can communicate with each other in the same rooms using the same shared secret. The .onion service routes through Tor's network with no Cloudflare, no CDN, and no third-party infrastructure between you and the server. Tor routes your connection through multiple encrypted relays, so neither the server nor any observer can determine your real IP address or location. The .onion service uses plain HTTP, which is expected and safe — Tor itself provides end-to-end encryption between your browser and the server. All the same application-level encryption (NaCl secretbox, Argon2id key derivation) applies on top of that. Note: Tor Browser must be set to "Standard" security level for nullchat to function, as the app requires JavaScript.`,
  faq_17_title: "What is a Tor-only room?",
  faq_17_body: `When accessing nullchat through the .onion hidden service, you have the option to enable "Tor-only room" — a toggle that appears on the password entry screen. When enabled, your room is placed in a separate namespace that only other Tor users with the same toggle enabled can access. Clearnet users can never join a Tor-only room, even if they know the shared secret.

This provides a higher level of security than the default shared rooms:

• Both parties are routed through Tor's multi-hop onion network — neither party's real IP address or location is visible to anyone, including the server.
• No DNS lookups, no CDN, and no third-party infrastructure touches the connection at any point.
• Traffic analysis is significantly harder because both sides benefit from Tor's relay padding combined with nullchat's own connection padding (random dummy frames sent at random intervals).
• There is no clearnet participant whose weaker connection metadata could be correlated with the conversation.

You are only as anonymous as the weakest link in the conversation. In a default room, a clearnet participant's connection touches DNS resolvers, CDN infrastructure, and standard internet routing — all of which can be observed or subpoenaed for metadata about who connected, when, and from where. The Tor-only toggle eliminates this risk entirely by ensuring every participant has the same level of network-layer anonymity.

Both parties must agree to enable the toggle — it works the same way as agreeing on the shared secret. The chat header displays "TOR ONLY" in green when active, or "CLEARNET" in red for standard rooms, so you always know which mode you are in.`,
  faq_18_title: "What is the inactivity timeout?",
  faq_18_body: `If you are inactive for 15 minutes — no typing, no tapping, no scrolling — nullchat will automatically disconnect you and return you to the password entry screen. A warning appears at 13 minutes giving you the option to stay. This protects your session if you walk away from your device, preventing messages from burning while no one is actively reading, and ensuring the chat is not left visible on an unattended screen.`,
  faq_19_title: "What about IP addresses?",
  faq_19_body: `On the clearnet (nullchat.org), the application is hosted on Cloudflare's edge network. Your IP address is handled at the infrastructure layer and is never read, logged, or stored by the application code. The server code does not access IP headers. We have no mechanism to identify you by network address.

On the Tor hidden service (.onion), your IP address is never visible to the server at all — Tor's onion routing ensures complete network-level anonymity. The server only sees connections from the Tor network, with no way to trace them back to you.`,
  faq_20_title: "Are there any cookies or trackers?",
  faq_20_body: `No. nullchat sets no cookies, uses no analytics, loads no third-party scripts, embeds no tracking pixels, and makes no external requests. The Content Security Policy headers enforce this at the browser level. You can verify this in your browser's developer tools.`,
  faq_21_title: "Why can't I send links, images, or files?",
  faq_21_body: `By design. nullchat is text-only — no links, images, file attachments, or media of any kind can be sent or rendered. This is a deliberate security decision, not a limitation. Clickable links and embedded media are the primary attack surface for zero-day exploits used by commercial spyware like Pegasus, Predator, and similar surveillance tools. A single malicious link or file can silently compromise an entire device. By stripping the chat down to plaintext only, nullchat eliminates this attack vector entirely. There is nothing to click, nothing to download, and nothing to render — which means nothing to exploit.`,
  faq_22_title: "Can I copy or screenshot messages?",
  faq_22_body: `nullchat actively discourages capturing message content. Text selection and copying are disabled in the chat area, right-click context menus are blocked, and common screenshot keyboard shortcuts are intercepted. The browser's Screen Capture API is also blocked via Permissions-Policy headers, preventing web-based screen recording tools from capturing the page.

These are friction-based protections, not absolute guarantees. A determined user can always photograph their screen with another device or use OS-level tools that bypass browser restrictions. The goal is to make casual capture difficult and to reinforce the expectation that conversations in nullchat are not meant to be saved.`,
  faq_23_title: "What is decoy traffic?",
  faq_23_body: `nullchat automatically sends encrypted dummy messages at random intervals (every 10–60 seconds) while you are connected to a room. These decoy messages are indistinguishable from real messages — they are the same size (thanks to fixed padding), encrypted with the same key, and relayed through the same server path. The recipient's client silently discards them after decryption.

Decoy traffic defeats traffic analysis. Without it, an observer monitoring network traffic could determine when real communication is happening based on when encrypted blobs are sent. With decoys, there is a constant stream of identical-looking traffic regardless of whether anyone is actually typing — making it impossible to distinguish real messages from noise.`,
  faq_24_title: "What is connection padding?",
  faq_24_body: `The server sends random-length binary frames (64–512 bytes of random data) to every connected client at random intervals (every 5–30 seconds). These frames are not messages — they are pure noise that the client silently ignores. Combined with client-side decoy traffic, connection padding ensures that network traffic patterns reveal nothing about whether real communication is occurring, how many messages are being exchanged, or when participants are active.`,
  faq_25_title: "What is the panic key?",
  faq_25_body: `Triple-tapping the Escape key instantly wipes your session. When triggered, nullchat sends a terminate command to the server (deleting all your messages), closes the WebSocket connection, zeroes out the encryption key in memory, clears the DOM, wipes sessionStorage and localStorage, clears the clipboard, and redirects your browser to google.com. The entire process takes less than a second. If the browser attempts to restore the page from cache (e.g., via the back button), the wipe is automatically re-triggered. Use this if you need to immediately erase all evidence of the conversation from your screen and browser.`,
  faq_26_title: "What is steganographic mode?",
  faq_26_body: `Steganographic mode disguises the nullchat interface as a document editor. Press Shift five times rapidly to activate it. The entire UI transforms — the dark chat interface is replaced with a familiar-looking document editing interface complete with toolbar and menu bar. Messages appear as paragraphs in the document body, and your input blends in as active typing. All encryption, burn timers, and security features continue to operate normally underneath.

This is useful if someone is looking over your shoulder or if your screen is visible to others. At a glance, it looks like you're editing a document, not having an encrypted conversation. Press Shift five times again to return to the normal chat view.`,
  faq_27_title: "Does nullchat auto-clear the clipboard?",
  faq_27_body: `Yes. If anything is copied while you are in a chat room, nullchat automatically clears your clipboard after 15 seconds. The clipboard is also wiped when you close the tab or navigate away, and immediately if you use the panic key. This prevents message content from lingering in your clipboard after you've left the conversation.`,
  faq_28_title: "Can you read my messages?",
  faq_28_body: `No. The server is a dumb relay. It receives encrypted blobs and forwards them. The encryption key is derived from your shared secret, which never leaves your browser. We do not have the key. We cannot decrypt the blobs. Even if the server were compromised, the attacker would only obtain meaningless ciphertext.`,
  faq_29_title: "Can government agencies access my messages?",
  faq_29_body: `We cannot provide what we do not have. There are no plaintext messages stored anywhere. There are no user accounts to look up. There are no IP logs to hand over. The encrypted blobs auto-delete on a fixed schedule. Even under a valid legal order, the most we could produce is a collection of encrypted blobs and room hashes — none of which are useful without the shared secret that only the participants know.`,
  faq_30_title: "Is nullchat open source?",
  faq_30_body_1: `Yes. The entire codebase — client, server, encryption, and infrastructure configuration — is publicly available for audit at`,
  faq_30_body_2: `. You can verify that the code running on the server matches what is published, build it yourself, or self-host your own instance. Transparency is not optional for a tool that asks you to trust it with your private communications.`,
  faq_31_title: "Who built nullchat?",
  faq_31_body_1: `nullchat is built by Artorias — a veteran-operated intelligence technology company based in New York City. Artorias exists to dismantle outdated systems and arm the most important organizations and individuals with tools purpose-built for operating in the dark. At its core, Artorias is about democratizing intelligence and anonymity — ensuring that the ability to communicate securely and operate without surveillance is not a privilege reserved for the few. nullchat is one expression of that mission: secure communication stripped to its essence, with no compromise on cryptographic integrity. Learn more at`,

};
