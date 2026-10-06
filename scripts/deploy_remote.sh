#!/usr/bin/env bash
# ==============================================================================
# deploy_remote.sh - Automated Remote Deployment & Nginx Reloader
# Dedicated for CustomBentoFactory.com and B2B Bento GEO Websites
# ==============================================================================

set -euo pipefail

# Configuration
REMOTE_HOST="43.130.32.54"
REMOTE_PORT="2222"
REMOTE_USER="ubuntu"
REMOTE_PASS="WHJCwhjc2026"
REMOTE_DIR="/var/www/CustomBentoFactory.com"
ARCHIVE_NAME="bento_site_update_$(date +%Y%m%d_%H%M%S).tar.gz"

echo "=== [1/5] Packaging Local Web Files (Ignoring macOS xattrs) ==="
export COPYFILE_DISABLE=1
tar --no-xattrs -czf "${ARCHIVE_NAME}" \
    --exclude=".*" \
    --exclude="*.tar.gz" \
    --exclude="node_modules" \
    index.html \
    products.html \
    *.html \
    js/ \
    css/ \
    images/ \
    data/ \
    ai/ \
    .well-known/ \
    sitemap.xml \
    robots.txt \
    llms.txt \
    llms-full.txt 2>/dev/null || true

echo "=== [2/5] Uploading ${ARCHIVE_NAME} to ${REMOTE_HOST}:${REMOTE_PORT} ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" scp -o StrictHostKeyChecking=no -P "${REMOTE_PORT}" "${ARCHIVE_NAME}" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/"

echo "=== [3/5] Extracting to Production Directory and Setting Permissions ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" ssh -o StrictHostKeyChecking=no -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
    tar -xzf /tmp/${ARCHIVE_NAME} -C ${REMOTE_DIR}/ && \
    sudo find ${REMOTE_DIR} -name '._*' -delete && \
    sudo chown -R ${REMOTE_USER}:www-data ${REMOTE_DIR} && \
    sudo chmod -R 755 ${REMOTE_DIR} && \
    rm -f /tmp/${ARCHIVE_NAME}
"

echo "=== [4/5] Testing Nginx Configuration & Reloading Service ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" ssh -o StrictHostKeyChecking=no -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
    echo '${REMOTE_PASS}' | sudo -S nginx -t && \
    echo '${REMOTE_PASS}' | sudo -S systemctl reload nginx
"

echo "=== [5/5] Cleaning Local Temp Archive ==="
rm -f "${ARCHIVE_NAME}"

echo ">>> DEPLOYMENT COMPLETE! All files are live on https://www.custombentofactory.com"
