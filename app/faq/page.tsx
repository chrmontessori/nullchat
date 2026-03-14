"use client";

import Link from "next/link";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What is nullchat?",
    body: `nullchat is an anonymous, end-to-end encrypted chat room that requires no accounts, no emails, no phone numbers, and no personal information of any kind. You enter a shared secret — a password — and anyone else who enters the same password lands in the same room. That's it.`,
  },
  {
    title: "How do I join a room?",
    body: `You and the person you want to talk to agree on a shared secret ahead of time — in person, over a phone call, however you want. You both type that secret into nullchat and you're in the same encrypted room. There is no room list, no directory, no way to browse. If you don't know the secret, the room doesn't exist to you.`,
  },
  {
    title: "How should I choose a shared secret?",
    body: `Your shared secret is the single most important piece of your security. It is both the key to your room and the key to your encryption — if someone guesses it, they can read everything. Treat it like a password to a safe.

Choose something long, random, and unguessable. A strong secret is at least 5–6 random words or 20+ mixed characters. Avoid names, dates, common phrases, song lyrics, or anything someone could find on your social media. Never reuse a secret across different conversations or rooms.

Share your secret through a secure, out-of-band channel — in person is best. A phone call is acceptable. Never send it over text, email, DM, or any platform that logs messages. If you suspect a secret has been compromised, stop using it immediately and agree on a new one through a secure channel.

The strength indicator on the entry screen gives you a rough sense of how resistant your secret is to brute-force attacks, but no indicator is a substitute for good judgment. When in doubt, make it longer and more random.`,
  },
  {
    title: "How does the encryption work?",
    body: `When you enter your shared secret, two things happen entirely in your browser:

1. The secret is hashed using SHA-256 to produce a room ID. This hash is sent to the server so it knows which room to connect you to. The server never sees your actual secret.

2. The secret is run through PBKDF2 (100,000 iterations) to derive a 256-bit encryption key. This key never leaves your browser.

Every message you send is encrypted with NaCl secretbox (XSalsa20-Poly1305) using that key before it leaves your device. The server receives, stores, and relays only ciphertext — encrypted blobs that are meaningless without the key. We cannot read your messages. No one can, unless they know the shared secret.`,
  },
  {
    title: "What does the server see?",
    body: `The server sees:
• A SHA-256 hash (the room ID) — not your password
• Encrypted ciphertext blobs — not your messages
• The number of active connections in a room
• Timestamps of when encrypted blobs were received

The server does NOT see:
• Your shared secret / password
• Your message content
• Your identity or username (aliases are encrypted inside messages)
• Your IP address (stripped at the edge by our hosting provider)`,
  },
  {
    title: "What is message padding?",
    body: `Before encryption, every message is padded to a fixed block size (256 bytes). This means a short message like "hi" produces the same size ciphertext as a message like "meet me at the park." Without padding, an observer could guess message content based on ciphertext length. Padding eliminates this side channel.`,
  },
  {
    title: "What is timestamp obfuscation?",
    body: `Timestamps included in messages are rounded to the nearest minute before encryption. This prevents timing correlation attacks where an observer could match message patterns across different channels by comparing exact timestamps.`,
  },
  {
    title: "How long do messages last?",
    body: `Messages use a tiered timer system:

• Dead drop (first message): A message sits encrypted on the server for up to 24 hours, waiting for a response. The sender can leave and come back to check on it without triggering any countdown. Simply entering the room does not burn the message.

• Both users present: When a second person joins the room, all unread messages immediately begin a 5-minute burn countdown. Every new message sent while both users are present also auto-burns in 5 minutes. No action is required — presence alone confirms the message is being read.

• Received button: If you pick up a dead drop message while alone in the room, you can press the "Received" button to manually confirm receipt and start the 5-minute burn. This button only appears once — during the initial dead drop pickup — and is not available during active conversations.

• Active conversation: Once a room has seen replies, subsequent messages have a 6-hour window if the recipient is not present. If both users are connected, messages burn in 5 minutes automatically.

• Hard ceiling: Any unread message is deleted after its timer expires (24 hours for dead drops, 6 hours for active messages) regardless of whether it was acknowledged.

There is no archive, no backup, no way to recover a deleted message.`,
  },
  {
    title: "What is the dead drop?",
    body: `nullchat functions as a digital dead drop. In traditional intelligence tradecraft, a dead drop is a method of passing information between two people without them ever needing to meet or be in the same place at the same time. nullchat works the same way.

You enter the shared secret, leave an encrypted message, and disconnect. The message sits on the server — encrypted and unreadable by anyone, including us — for up to 24 hours. Your contact enters the same secret whenever they're ready, and picks up the message. When the recipient joins and both users are present, all waiting messages immediately begin a 5-minute burn countdown — presence alone is proof of receipt. If the recipient picks up the message while alone, they can press the one-time "Received" button to manually confirm receipt and start the burn, or simply reply. Once the burn starts, the message is permanently destroyed after 5 minutes.

The sender can safely reconnect at any time to check whether their message is still waiting — without triggering any countdown, as long as they are the only one in the room. Neither party needs to be online at the same time. Neither party needs an account. Neither party is identifiable. The server never knows who left the message or who picked it up — only that an encrypted blob was stored and later retrieved. After the burn, there is no evidence the exchange ever happened.`,
  },
  {
    title: "How long do rooms last?",
    body: `A room exists as long as it has active connections or unexpired messages. Once the last person disconnects and all messages have expired or burned, the room is gone. There is no persistent room state. If no messages are ever sent, the room is just a live connection — nothing is stored, and it vanishes the moment everyone leaves.`,
  },
  {
    title: "What is the Terminate button?",
    body: `Terminate immediately deletes every message you sent during your current session from the server for everyone in the room. Other participants will see your messages disappear from their screen in real time. You are then disconnected from the room. Use this if you need to leave without a trace.`,
  },
  {
    title: "What is the Leave button?",
    body: `Leave simply disconnects you from the room. Your messages remain on the server — unread messages continue waiting (up to 24 hours), and already-read messages continue their 5-minute burn countdown. If you rejoin the room later, you'll get a new random alias — there is no way to link your old and new identities.`,
  },
  {
    title: "What are the random aliases?",
    body: `When you enter a room, you are assigned a random 8-character hex code (like "a9f2b71c") as your alias. This alias is generated in your browser, encrypted inside each message, and is never sent to the server in plaintext. If you disconnect and reconnect, you get a new alias. There is no way to reserve, choose, or persist an alias.`,
  },
  {
    title: "Is there a participant limit?",
    body: `Each room supports up to 50 simultaneous connections. If the room is full, you'll see a "Room is full" message. This limit exists to keep rooms intimate and to prevent abuse.`,
  },
  {
    title: "Is there rate limiting?",
    body: `Yes. Each connection is limited to 1 message per second. This prevents spam and abuse without requiring any identity verification. If you send messages too quickly, you'll see a brief "Slow down" notice.`,
  },
  {
    title: "Can I access nullchat over Tor?",
    body: <>nullchat is available as a Tor hidden service for users in censored regions or anyone who wants an additional layer of anonymity. Open Tor Browser and navigate to:<br /><br /><span style={{ fontFamily: "monospace", fontSize: 13, color: "#3478f6", wordBreak: "break-all" }}>http://5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion</span><br /><br />Both the clearnet and Tor versions connect to the same backend — users on either can communicate with each other in the same rooms using the same shared secret. The .onion service routes through Tor's network with no Cloudflare, no CDN, and no third-party infrastructure between you and the server. Tor routes your connection through multiple encrypted relays, so neither the server nor any observer can determine your real IP address or location. The .onion service uses plain HTTP, which is expected and safe — Tor itself provides end-to-end encryption between your browser and the server. All the same application-level encryption (NaCl secretbox, PBKDF2 key derivation) applies on top of that. Note: Tor Browser must be set to "Standard" security level for nullchat to function, as the app requires JavaScript.</>,
  },
  {
    title: "What is the inactivity timeout?",
    body: `If you are inactive for 15 minutes — no typing, no tapping, no scrolling — nullchat will automatically disconnect you and return you to the password entry screen. A warning appears at 13 minutes giving you the option to stay. This protects your session if you walk away from your device, preventing messages from burning while no one is actively reading, and ensuring the chat is not left visible on an unattended screen.`,
  },
  {
    title: "What about IP addresses?",
    body: `On the clearnet (nullchat.org), the application is hosted on Cloudflare's network. Your IP address is handled at the edge infrastructure layer and is never read, logged, or stored by the application code. The server code does not access IP headers. We have no mechanism to identify you by network address.

On the Tor hidden service (.onion), your IP address is never visible to the server at all — Tor's onion routing ensures complete network-level anonymity. The server only sees connections from the Tor network, with no way to trace them back to you.`,
  },
  {
    title: "Are there any cookies or trackers?",
    body: `No. nullchat sets no cookies, uses no analytics, loads no third-party scripts, embeds no tracking pixels, and makes no external requests. The Content Security Policy headers enforce this at the browser level. You can verify this in your browser's developer tools.`,
  },
  {
    title: "Why can't I send links, images, or files?",
    body: `By design. nullchat is text-only — no links, images, file attachments, or media of any kind can be sent or rendered. This is a deliberate security decision, not a limitation. Clickable links and embedded media are the primary attack surface for zero-day exploits used by commercial spyware like Pegasus, Predator, and similar surveillance tools. A single malicious link or file can silently compromise an entire device. By stripping the chat down to plaintext only, nullchat eliminates this attack vector entirely. There is nothing to click, nothing to download, and nothing to render — which means nothing to exploit.`,
  },
  {
    title: "Can you read my messages?",
    body: `No. The server is a dumb relay. It receives encrypted blobs and forwards them. The encryption key is derived from your shared secret, which never leaves your browser. We do not have the key. We cannot decrypt the blobs. Even if the server were compromised, the attacker would only obtain meaningless ciphertext.`,
  },
  {
    title: "Can government agencies access my messages?",
    body: `We cannot provide what we do not have. There are no plaintext messages stored anywhere. There are no user accounts to look up. There are no IP logs to hand over. The encrypted blobs auto-delete on a fixed schedule. Even under a valid legal order, the most we could produce is a collection of encrypted blobs and room hashes — none of which are useful without the shared secret that only the participants know.`,
  },
  {
    title: "Who built nullchat?",
    body: <>nullchat is built by Artorias — a veteran-operated intelligence technology company based in New York City. Artorias exists to dismantle outdated systems and arm the most important organizations and individuals with tools purpose-built for operating in the dark. At its core, Artorias is about democratizing intelligence and anonymity — ensuring that the ability to communicate securely and operate without surveillance is not a privilege reserved for the few. nullchat is one expression of that mission: secure communication stripped to its essence, with no compromise on cryptographic integrity. Learn more at <a href="https://artorias.com" target="_blank" rel="noopener noreferrer" style={{ color: "#3478f6", textDecoration: "none" }}>artorias.com</a>.</>,
  },
];

export default function FAQ() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#000",
        color: "#fff",
        padding: "60px 20px 80px",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link
            href="/"
            style={{
              fontSize: 14,
              color: "#3478f6",
              textDecoration: "none",
            }}
          >
            &larr; Back
          </Link>
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          How it works
        </h1>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 56 }}>
          Full transparency on what nullchat does, how it protects you,
          and what we can and cannot see.
        </p>

        {/* Sections */}
        <div>
          {sections.map((s, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid #222",
                padding: "32px 0",
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: "#fff",
                }}
              >
                {s.title}
              </h2>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#aaa",
                  whiteSpace: "pre-line",
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #222",
            paddingTop: 32,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: "#444" }}>
            nullchat &mdash; encrypted &middot; anonymous &middot; ephemeral
          </p>
        </div>
      </div>
    </div>
  );
}
