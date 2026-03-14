# nullchat

Anonymous, end-to-end encrypted, ephemeral chat rooms. No accounts. No logs. No metadata.

**Clearnet:** [nullchat.org](https://www.nullchat.org)
**Tor:** `http://5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion`

## How it works

1. Two people agree on a shared secret (a password) through a secure channel
2. Both enter the secret into nullchat
3. They land in the same encrypted room — no sign-up, no identity, no trace

The shared secret derives both the room ID and the encryption key using Argon2id (64 MiB memory-hard KDF, 3 iterations) with domain-separated salts. Messages are encrypted client-side with NaCl secretbox (XSalsa20-Poly1305) before leaving the browser. The server only sees encrypted blobs.

## What the server sees

- Encrypted ciphertext blobs — not your messages
- An Argon2id-derived room hash — not your password
- Connection count per room
- Timestamps of encrypted blobs

## What the server cannot see

- Your shared secret
- Your message content
- Your alias (encrypted inside messages)
- Your IP address (stripped at the infrastructure level)

## Message lifecycle

- **Dead drop:** First message waits up to 24 hours for a response
- **Active:** Once both users are present, messages burn in 5 minutes
- **Hard ceiling:** Unread messages auto-delete after their TTL expires
- **No archive, no backup, no recovery**

## Architecture

nullchat runs two frontends against a single WebSocket backend:

| | Clearnet | Tor |
|---|---|---|
| Frontend | Vercel (Next.js SSR) | Static export served by Node.js |
| WebSocket | `wss://ws.nullchat.org` | `ws://<onion>` (same origin) |
| Encryption | Client-side NaCl secretbox | Same |
| Backend | Shared standalone server | Same |

Both Tor and clearnet users connect to the same backend — same rooms, same messages.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Encryption:** TweetNaCl (XSalsa20-Poly1305), Argon2id (64 MiB, 3 iterations)
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
npm run build:tor    # static export + compile server
npm run start:tor    # starts on 127.0.0.1:3000
```

Configure Tor to route to localhost:

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

This disables swap, creates the service user, installs systemd units (with tmpfs working directory, sandboxing, and 6-hour restart timer), and disables core dumps.

To enable Tor-only mode (reject all non-Tor connections):

```bash
# Edit /etc/systemd/system/nullchat.service
# Uncomment: Environment=TOR_ONLY=1
systemctl daemon-reload && systemctl restart nullchat
```

## Server hardening

The production server runs with:

- Zero logging (nginx, Tor, Node.js, journald — all disabled)
- Firewall (ports 22, 80, 443 only)
- TLS 1.2+ with strong cipher suite
- IP headers stripped at nginx
- Gzip disabled (prevents BREACH attacks)
- Read-only application filesystem
- Memory-only tmpfs working directory (nothing touches disk)
- Swap disabled (prevents memory contents leaking to disk)
- Core dumps disabled system-wide
- Scheduled 6-hour restarts to clear accumulated in-memory state
- Connection padding (random-length dummy frames at random intervals defeat traffic analysis)
- WebSocket compression disabled (prevents CRIME-style compression side-channel attacks)
- WebSocket upgrade rate limiting (5 connections/min per IP)
- Delayed presence broadcasts (random 5–15s jitter defeats join/leave timing correlation)
- Encryption key zeroed on leave, terminate, and panic
- Clipboard auto-cleared on tab close and after 15 seconds of copy
- Dedicated unprivileged service user
- Systemd sandboxing (seccomp, no new privileges, restricted syscalls, private /tmp)
- Kernel hardening (no ping, no source routing, SYN flood protection)
- SRI hashes on all static assets
- Automatic security updates
- Optional Tor-only mode (`TOR_ONLY=1`) to reject all non-.onion connections

## Security model

The encryption is solid. The weak link in any web-based E2E tool is the delivery mechanism — the server could theoretically serve modified JavaScript that exfiltrates keys. This is true of every web app doing client-side encryption (Signal Web, WhatsApp Web, etc.).

Mitigations in place:
- Code is open source for public audit
- SRI hashes verify asset integrity at load time
- Application filesystem is read-only

The best protection is to verify the code yourself.

## License

MIT

---

Built by [Artorias](https://artorias.com)
