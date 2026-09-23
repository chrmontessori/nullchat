# nullchat

Anonymous, end-to-end encrypted, ephemeral chat rooms. No accounts. No logs. No stored metadata about who you are.

**Clearnet:** [nullchat.org](https://www.nullchat.org)
**Tor:** `http://5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion`

## How it works

1. Two people agree on a shared secret (a password) through a channel they already trust.
2. Both enter the secret into nullchat.
3. They land in the same encrypted room. No sign-up, no identity, no trace.

The shared secret goes through two separate Argon2id derivations (16 MiB memory-hard KDF, 3 iterations), each with its own salt. One derivation produces the room ID. The other produces 64 bytes in a single pass, split into the encryption key and a room-access secret. Joining a room requires proof that you know the shared secret, so knowing the room ID alone is not enough. Messages are encrypted in the browser with NaCl secretbox (XSalsa20-Poly1305) before they leave the device. The server only ever handles encrypted blobs.

## What the server sees

- Encrypted ciphertext blobs, not your messages
- An Argon2id-derived room hash, not your password
- A value derived from the shared secret with Argon2id that proves you know it. The server keeps only a hash of it, and it reveals neither the secret nor the encryption key.
- The number of connections in a room
- Timestamps of encrypted blobs

## What the server cannot see

- Your shared secret
- Your message content
- Your alias (it is encrypted inside each message)
- Your IP address. The application server never receives or stores it: nginx does not forward it to the application and does not log it. The reverse proxy and, on clearnet, the page host (Vercel) necessarily see the connecting address at connection time. Over Tor, your IP address is never visible.

## Message lifecycle

- **Dead drop:** the first message waits up to 24 hours for a response.
- **Active:** once both people are present, messages burn 5 minutes after they are read.
- **Hard ceiling:** unread messages auto-delete when their TTL expires.
- No archive, no backup, no recovery.

## Architecture

nullchat runs two frontends against a single WebSocket backend:

| | Clearnet | Tor |
|---|---|---|
| Frontend | Vercel (Next.js SSR) | Static export served by Node.js |
| WebSocket | `wss://ws.nullchat.org` | `ws://<onion>` (same origin) |
| Encryption | Client-side NaCl secretbox | Same |
| Backend | Standalone Node.js server | Same server |

The clearnet WebSocket endpoint (`wss://ws.nullchat.org`) and the Tor service are the same standalone Node.js server (`server/`), running on one host. Clearnet connections reach it through nginx; Tor connections reach it through the onion service. Tor and clearnet users connect to the same backend, so they share the same rooms and the same messages.

The `party/` directory is legacy PartyKit code and is not used in production.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Encryption:** TweetNaCl (XSalsa20-Poly1305), Argon2id (16 MiB, 3 iterations)
- **Server:** Node.js, `ws` library
- **Infrastructure:** Tor hidden service, nginx (TLS 1.2+), Let's Encrypt

## Self-hosting

### Clearnet

```bash
npm install
npm run build
npm start
```

### Tor (standalone server)

```bash
npm install
npm run build:tor    # static export plus compiled server
npm run start:tor    # starts on 127.0.0.1:3000
```

Point Tor at localhost:

```
HiddenServiceDir /var/lib/tor/nullchat/
HiddenServicePort 80 127.0.0.1:3000
```

Your `.onion` address appears in `/var/lib/tor/nullchat/hostname`.

### Production hardening

After deploying to `/opt/nullchat`, run the hardening script as root:

```bash
bash /opt/nullchat/deploy/harden.sh
```

This disables swap, creates the service user, installs the systemd unit (sandboxed, with room data kept in a tmpfs RAM directory), and disables core dumps system-wide, including Ubuntu's apport crash handler.

To enable Tor-only mode (reject all non-Tor connections):

```bash
# Edit /etc/systemd/system/nullchat.service
# Uncomment: Environment=TOR_ONLY=1
systemctl daemon-reload && systemctl restart nullchat
```

## Server hardening

The production server runs with:

- Zero logging (nginx, Tor, Node.js, journald all disabled)
- Firewall (ports 22, 80, 443 only)
- TLS 1.2+ with a strong cipher suite
- Client IP addresses never reach the application: nginx does not forward them and does not log them
- Gzip disabled (prevents BREACH attacks)
- Read-only application filesystem, with room state held in a tmpfs (RAM) directory that never touches disk (0700/0600, auto-purged on expiry)
- Swap disabled (keeps memory contents off disk)
- Core dumps disabled system-wide, including Ubuntu's apport crash handler
- Connection padding (random-length dummy frames at random intervals frustrate traffic analysis)
- Cover traffic (decoy messages look the same as real messages in size and in the sequence of frames exchanged)
- WebSocket compression disabled (prevents CRIME-style compression side channels)
- Per-address connection limits at the reverse proxy (clearnet)
- Onion-service proof-of-work defenses (Tor)
- Connection caps in the app: 50 connections per room, plus a global capacity limit
- Message rate limits in the app: 1 message per second per connection, plus a per-room flood limit
- Immediate presence broadcasts (no artificial delay)
- Encryption key zeroed on leave, terminate, and panic
- Clipboard cleared on tab close and 15 seconds after a copy
- Language preference kept only in sessionStorage for the current tab, and cleared when the tab closes
- Dedicated unprivileged service user
- Systemd sandboxing (seccomp, no new privileges, restricted syscalls, private /tmp)
- Kernel hardening (no ping, no source routing, SYN flood protection)
- Subresource Integrity hashes on the Tor build's scripts (tamper detection in transit; see [Mitigations](#mitigations))
- Automatic security updates
- Optional Tor-only mode (`TOR_ONLY=1`) to reject all non-onion connections

### What persists, and where

Room state (the encrypted message blobs plus their expiry metadata) is held in `/run/nullchat`, which systemd backs with tmpfs, so it lives in RAM and never touches disk. It survives a `systemctl restart`, so restarting the service does not drop in-flight conversations, and it is cleared on reboot. Each room file is also deleted the moment its messages expire. With swap disabled, a seized or powered-down machine holds no room data or metadata at rest. To place room data somewhere else, override `NULLCHAT_DATA_DIR`; keep it on a tmpfs mount if you want the same no-disk guarantee.

Clearnet and Tor rooms are held by the same server, so this applies to both.

## Security model

The cryptography is standard and well-reviewed. The hard part of any web-based end-to-end tool is delivery: the server could in principle serve modified JavaScript that leaks keys. This is true of every web app that does client-side encryption, including Signal Web and WhatsApp Web.

### Why not a native app?

A downloadable client would close the JavaScript delivery gap, but it opens a worse one for these users: it leaves evidence. A binary on a device can be found in a forensic search and tied to a person through app store accounts, download logs, browser history, or device backups. For someone who needs anonymity, not just encryption, that is the wrong trade.

The web leaves the least behind. There is nothing to install, nothing to find on the device, and nothing that survives closing the tab. nullchat is built for people who need to communicate without leaving proof that they communicated at all, so it accepts the JavaScript delivery risk rather than force a download.

### Mitigations

- Source is open for public audit.
- Subresource Integrity (SRI) hashes let the browser detect scripts that a cache or CDN modified between the origin and you. The Tor build adds them; the clearnet build does not yet. They cannot protect against a compromised origin, because the origin serves both the page and the hashes. The real defense there is verifying the code yourself.
- The application filesystem is read-only.
- Builds are reproducible: clone the repo at a release, run `npm run build:tor`, and compare the `out/` directory file by file against what the onion service serves. Two clean builds of the same commit produce byte-identical output.

The strongest protection is to verify the code yourself.

## Security updates

For the protection of our users, nullchat does not disclose, discuss, or confirm security issues until a fix is available and deployed.

- **nullchat 2.0 — 22 September 2026:** This update includes important security and reliability improvements and is recommended for all users. Rooms created before this update do not carry over; start a new room with a new shared secret.

## What changed and why

This is a record of the meaningful changes made to nullchat before version 2.0, and the reason behind each one. Some entries describe how nullchat worked at the time; the sections above describe how it works now. Later updates are listed under [Security updates](#security-updates).

- **Room data now lives in RAM, not on disk.** Room state used to be written to `/var/lib/nullchat` on the disk. That meant a seized or powered-off server still held the encrypted blobs and their metadata (timing, message counts, who replied to who). We moved room state to a tmpfs directory at `/run/nullchat`, so it lives in memory only. It survives a service restart so live conversations do not drop, and it is gone on reboot. With swap off, nothing about a room ever hits the disk.
- **Bigger message frame so other languages work.** Every message is padded to a fixed size before encryption so all ciphertext looks the same length. The old frame was 8 KB, which was too small for a full-length message in Chinese, Arabic, or any script that uses more bytes per character. Those messages overflowed the frame and silently failed to send. We raised the frame to 16 KB so a full message in any language fits, and added a guard so the send path can never crash on oversized input.
- **Integrity hashes are applied in the Tor build.** We advertised SRI hashes, which let the browser detect scripts modified in transit, but the build was not adding them. The Tor build then started running the SRI step, so the scripts the page loads carry a hash the browser checks.
- **Cover traffic runs on both networks.** The app sends decoy messages at random intervals to hide when real conversation is happening. The Tor server relayed them, but the separate clearnet backend used at the time was dropping them, so the protection only worked over Tor. Both backends relayed decoys after this change, and clearnet and Tor now run on the same server.
- **Rate limiting no longer trusts a spoofable header.** The connection rate limit keyed off the leftmost `X-Forwarded-For` value, which a client can fake to rotate the key and get around the cap. This change switched it to the address the reverse proxy sets, which a client cannot forge. Per-address connection limits have since moved into the reverse proxy itself, and the application no longer receives client addresses at all.
- **Tor-only rooms check the exact onion address.** The Tor-only check accepted any host ending in `.onion`, so a forged `Host` header could slip into a Tor-only room. It now matches this service's exact onion address.
- **Host is validated before it goes into the security policy.** The server used to reflect the request `Host` straight into the Content Security Policy. It now checks that the host looks like a plain hostname first, and falls back to the known onion address otherwise.
- **Aliases are labels, not identities.** The FAQ now spells this out. Anyone who has the shared secret can join a room and set their alias to anything, so treat everyone in a room as someone who knows the secret, and confirm who you are talking to out of band if it matters.

## License

MIT

---

Built by [Artorias](https://artorias.com)
