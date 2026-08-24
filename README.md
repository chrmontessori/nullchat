# nullchat

Anonymous, end-to-end encrypted, ephemeral chat rooms. No accounts. No logs. No stored metadata about who you are.

**Clearnet:** [nullchat.org](https://www.nullchat.org)
**Tor:** `http://5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion`

## How it works

1. Two people agree on a shared secret (a password) through a channel they already trust.
2. Both enter the secret into nullchat.
3. They land in the same encrypted room. No sign-up, no identity, no trace.

The shared secret derives both the room ID and the encryption key using Argon2id (16 MiB memory-hard KDF, 3 iterations) with a different salt for each. Messages are encrypted in the browser with NaCl secretbox (XSalsa20-Poly1305) before they leave the device. The server only ever handles encrypted blobs.

## What the server sees

- Encrypted ciphertext blobs, not your messages
- An Argon2id-derived room hash, not your password
- The number of connections in a room
- Timestamps of encrypted blobs

## What the server cannot see

- Your shared secret
- Your message content
- Your alias (it is encrypted inside each message)
- Your IP address (stripped at the infrastructure level)

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
| Backend | Shared standalone server | Same |

Tor and clearnet users connect to the same backend, so they share the same rooms and the same messages.

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

This disables swap, creates the service user, installs the systemd unit (sandboxed, with room data kept in a tmpfs RAM directory), and disables core dumps.

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
- IP headers stripped at nginx
- Gzip disabled (prevents BREACH attacks)
- Read-only application filesystem, with room state held in a tmpfs (RAM) directory that never touches disk (0700/0600, auto-purged on expiry)
- Swap disabled (keeps memory contents off disk)
- Core dumps disabled system-wide
- Connection padding (random-length dummy frames at random intervals frustrate traffic analysis)
- WebSocket compression disabled (prevents CRIME-style compression side channels)
- WebSocket upgrade rate limiting (5 connections per minute per IP)
- Immediate presence broadcasts (no artificial delay)
- Encryption key zeroed on leave, terminate, and panic
- Clipboard cleared on tab close and 15 seconds after a copy
- Dedicated unprivileged service user
- Systemd sandboxing (seccomp, no new privileges, restricted syscalls, private /tmp)
- Kernel hardening (no ping, no source routing, SYN flood protection)
- SRI hashes on all static assets
- Automatic security updates
- Optional Tor-only mode (`TOR_ONLY=1`) to reject all non-onion connections

### What persists, and where

Room state (the encrypted message blobs plus their expiry metadata) is held in `/run/nullchat`, which systemd backs with tmpfs, so it lives in RAM and never touches disk. It survives a `systemctl restart`, so restarting the service does not drop in-flight conversations, and it is cleared on reboot. Each room file is also deleted the moment its messages expire. With swap disabled, a seized or powered-down machine holds no room data or metadata at rest. To place room data somewhere else, override `NULLCHAT_DATA_DIR`; keep it on a tmpfs mount if you want the same no-disk guarantee.

The clearnet WebSocket backend runs on PartyKit, which keeps the same room state in its own managed storage rather than this tmpfs directory. Clearnet therefore trusts that platform with the encrypted blobs and their metadata; the Tor standalone server does not.

## Security model

The cryptography is standard and well-reviewed. The hard part of any web-based end-to-end tool is delivery: the server could in principle serve modified JavaScript that leaks keys. This is true of every web app that does client-side encryption, including Signal Web and WhatsApp Web.

### Why not a native app?

A downloadable client would close the JavaScript delivery gap, but it opens a worse one for these users: it leaves evidence. A binary on a device can be found in a forensic search and tied to a person through app store accounts, download logs, browser history, or device backups. For someone who needs anonymity, not just encryption, that is the wrong trade.

The web leaves the least behind. There is nothing to install, nothing to find on the device, and nothing that survives closing the tab. nullchat is built for people who need to communicate without leaving proof that they communicated at all, so it accepts the JavaScript delivery risk rather than force a download.

### Mitigations

- Source is open for public audit.
- SRI hashes verify asset integrity at load time.
- The application filesystem is read-only.
- Builds are reproducible: clone the repo, run `npm run build`, and compare against what is deployed.

The strongest protection is to verify the code yourself.

## License

MIT

---

Built by [Artorias](https://artorias.com)
