#!/bin/bash
# Server hardening script for nullchat VPS
# Run as root on the production server
set -euo pipefail

echo "=== nullchat server hardening ==="

# --- Disable swap (prevents memory contents leaking to disk) ---
echo "[1/4] Disabling swap..."
swapoff -a
# Remove swap entries from fstab so it stays off after reboot
sed -i '/\sswap\s/d' /etc/fstab
echo "  Swap disabled permanently."

# --- Create unprivileged service user ---
echo "[2/4] Creating nullchat user..."
if ! id -u nullchat &>/dev/null; then
  useradd --system --no-create-home --shell /usr/sbin/nologin nullchat
  echo "  User created."
else
  echo "  User already exists."
fi

# --- Install systemd unit ---
echo "[3/4] Installing systemd unit..."
cp /opt/nullchat/deploy/nullchat.service /etc/systemd/system/
systemctl daemon-reload
echo "  Unit installed."

# --- Enable and start service ---
echo "[3/4] Enabling service..."
systemctl enable --now nullchat.service
echo "  Service running."

# --- Prevent core dumps system-wide ---
echo "[4/4] Disabling core dumps..."
echo "* hard core 0" > /etc/security/limits.d/99-no-coredump.conf
echo "kernel.core_pattern=|/bin/false" > /etc/sysctl.d/99-no-coredump.conf
sysctl -p /etc/sysctl.d/99-no-coredump.conf 2>/dev/null || true
echo "  Core dumps disabled."

echo ""
echo "=== Hardening complete ==="
echo ""
echo "Verify:"
echo "  systemctl status nullchat"
echo "  swapon --show  (should be empty)"
echo "  cat /proc/sys/kernel/core_pattern  (should be |/bin/false)"
echo ""
echo "To enable Tor-only mode (reject all clearnet connections):"
echo "  Edit /etc/systemd/system/nullchat.service"
echo "  Uncomment: Environment=TOR_ONLY=1"
echo "  Then: systemctl daemon-reload && systemctl restart nullchat"
