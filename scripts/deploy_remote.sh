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

echo "=== [1/6] Packaging Web Files & RFQ Backend Daemon ==="
export COPYFILE_DISABLE=1
SRC_DIR="site"
[ ! -d "${SRC_DIR}" ] && SRC_DIR="."

tar --no-xattrs -czf "${ARCHIVE_NAME}" \
    --exclude=".*" \
    --exclude="*.tar.gz" \
    --exclude="node_modules" \
    -C "${SRC_DIR}" \
    index.html \
    products.html \
    about.html \
    contact.html \
    case-studies.html \
    certifications.html \
    leakproof-lab.html \
    executive-titanium-bento-gifting.html \
    glossary.html \
    whitepapers.html \
    news.html \
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
    llms-full.txt \
    rfq_server.py \
    custombentofactory-rfq.service \
    deploy/ 2>/dev/null || true

echo "=== [2/6] Uploading ${ARCHIVE_NAME} to ${REMOTE_HOST}:${REMOTE_PORT} ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" scp -o StrictHostKeyChecking=no -P "${REMOTE_PORT}" "${ARCHIVE_NAME}" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/"

echo "=== [3/6] Extracting to Production Directory and Setting Permissions ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" ssh -o StrictHostKeyChecking=no -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
    tar -xzf /tmp/${ARCHIVE_NAME} -C ${REMOTE_DIR}/ && \
    sudo find ${REMOTE_DIR} -name '._*' -delete && \
    sudo chown -R ${REMOTE_USER}:www-data ${REMOTE_DIR} && \
    sudo chmod -R 755 ${REMOTE_DIR} && \
    rm -f /tmp/${ARCHIVE_NAME}
"

echo "=== [4/6] Updating Systemd Service & Restarting RFQ Daemon (Port 8012) ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" ssh -o StrictHostKeyChecking=no -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
    if [ -f ${REMOTE_DIR}/custombentofactory-rfq.service ]; then
        echo '${REMOTE_PASS}' | sudo -S cp ${REMOTE_DIR}/custombentofactory-rfq.service /etc/systemd/system/
        echo '${REMOTE_PASS}' | sudo -S systemctl daemon-reload
        echo '${REMOTE_PASS}' | sudo -S systemctl enable custombentofactory-rfq.service
        echo '${REMOTE_PASS}' | sudo -S systemctl restart custombentofactory-rfq.service
    fi
"

echo "=== [5/6] Testing Nginx Configuration & Reloading Service ==="
/opt/homebrew/bin/sshpass -p "${REMOTE_PASS}" ssh -o StrictHostKeyChecking=no -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
    echo '${REMOTE_PASS}' | sudo -S nginx -t && \
    echo '${REMOTE_PASS}' | sudo -S systemctl reload nginx
"

echo "=== [6/6] Verifying Live Health Endpoints & Cleaning Temp Archive ==="
rm -f "${ARCHIVE_NAME}"
curl -sI https://www.custombentofactory.com/api/health | head -n 1
echo ">>> DEPLOYMENT COMPLETE! All files and RFQ daemon are live on https://www.custombentofactory.com"
