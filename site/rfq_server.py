#!/usr/bin/env python3
"""
Jinjiang Naike Gifts Co., Ltd. / Naike Tableware
Custom Bento Factory (custombentofactory.com)
B2B RFQ & Sourcing Inquiry Ingestion Server
Port: 8012
Target Routing Emails: info@naiketableware.com, cnproduct@gmail.com
"""

import http.server
import socketserver
import json
import os
import csv
import urllib.parse
import urllib.request
import threading
import hashlib
import random
from datetime import datetime
import secrets

PORT = 8012
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
JSON_FILE = os.path.join(DATA_DIR, 'inquiries.json')
CSV_FILE = os.path.join(DATA_DIR, 'inquiries.csv')
ADMIN_KEY = 'naike2026admin'
FORWARD_EMAILS = ['info@naiketableware.com', 'cnproduct@gmail.com']
CAPTCHA_SECRET = secrets.token_hex(16)

os.makedirs(DATA_DIR, exist_ok=True)

def generate_captcha():
    a = random.randint(3, 19)
    b = random.randint(2, 15)
    ans = str(a + b)
    token = hashlib.sha256((ans + CAPTCHA_SECRET).encode('utf-8')).hexdigest()
    cid = secrets.token_hex(6)
    return {
        "captcha_id": cid,
        "question": f"{a} + {b} = ?",
        "captcha_token": token
    }

def verify_captcha(answer, token):
    if not answer or not token:
        return False
    ans_clean = str(answer).strip()
    expected = hashlib.sha256((ans_clean + CAPTCHA_SECRET).encode('utf-8')).hexdigest()
    return expected == token

class RFQHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {args[0]} {args[1]} -> {args[2]}")

    def _set_cors_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. Health check
        if path in ('/api/health', '/api/status'):
            self._set_cors_headers(200)
            self.wfile.write(json.dumps({
                "status": "healthy",
                "service": "Custom Bento Factory RFQ Server",
                "routing_emails": FORWARD_EMAILS,
                "timestamp": datetime.now().isoformat()
            }).encode('utf-8'))
            return

        # 2. Get Captcha Challenge
        if path == '/api/captcha':
            c = generate_captcha()
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(c).encode('utf-8'))
            return

        # 3. Admin Inquiries Dashboard / CSV Export
        if path == '/api/inquiries':
            key = query.get('key', [''])[0]
            if key != ADMIN_KEY:
                self._set_cors_headers(403)
                self.wfile.write(json.dumps({"error": "Unauthorized. Provide valid key."}).encode('utf-8'))
                return

            inquiries = []
            if os.path.exists(JSON_FILE):
                try:
                    with open(JSON_FILE, 'r', encoding='utf-8') as f:
                        inquiries = json.load(f)
                except Exception:
                    inquiries = []

            # Format: CSV
            if query.get('format', [''])[0] == 'csv':
                self.send_response(200)
                self.send_header('Content-Type', 'text/csv; charset=utf-8-sig')
                self.send_header('Content-Disposition', 'attachment; filename="cbf_inquiries_' + datetime.now().strftime('%Y%m%d') + '.csv"')
                self.end_headers()
                if os.path.exists(CSV_FILE):
                    with open(CSV_FILE, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.wfile.write(b"No data available.")
                return

            # Format: HTML Dashboard
            rows = ""
            for item in reversed(inquiries):
                rows += f"""<tr>
                    <td><strong style="color:#008290;">{item.get('rfq_id', '-')}</strong></td>
                    <td style="font-size:0.8rem; color:#64748b;">{item.get('created_at', '-')}</td>
                    <td><strong>{item.get('name', '-')}</strong><br><small style="color:#64748b;">{item.get('company', '-')}</small></td>
                    <td><a href="mailto:{item.get('email', '')}" style="color:#008290; font-weight:600;">{item.get('email', '-')}</a></td>
                    <td>{item.get('phone', '-')}</td>
                    <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-weight:700; font-size:0.8rem;">{item.get('product', '-')}</span></td>
                    <td><strong>{item.get('volume', '-')}</strong></td>
                    <td style="max-width:280px; font-size:0.82rem; word-break:break-word;">{item.get('message', '-')}</td>
                    <td style="font-size:0.75rem; color:#94a3b8;">{item.get('ip', '-')}</td>
                </tr>"""

            html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Custom Bento Factory RFQ Leads Inbox</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
        .card {{ max-width: 1350px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04); overflow: hidden; }}
        header {{ padding: 24px 32px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #fafafa; }}
        h1 {{ margin: 0; font-size: 1.35rem; font-weight: 800; color: #0f172a; }}
        .badge {{ background: #10b981; color: #fff; font-size: 0.75rem; padding: 3px 10px; border-radius: 999px; margin-left: 8px; font-weight: 700; }}
        .btn {{ display: inline-block; padding: 8px 18px; background: #008290; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }}
        table {{ width: 100%; border-collapse: collapse; font-size: 0.88rem; }}
        th {{ background: #f1f5f9; padding: 12px 16px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; }}
        td {{ padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }}
        tr:hover td {{ background: #f8fafc; }}
        .empty {{ text-align: center; padding: 60px; color: #94a3b8; font-size: 1.05rem; }}
    </style>
</head>
<body>
    <div class="card">
        <header>
            <div>
                <h1>🍱 Custom Bento Factory RFQ Leads Inbox <span class="badge">{len(inquiries)} Leads</span></h1>
                <p style="margin: 4px 0 0; font-size: 0.85rem; color: #64748b;">Jinjiang Naike Tableware · Direct Factory Sales Desk · Routed to: <strong>{", ".join(FORWARD_EMAILS)}</strong></p>
            </div>
            <div>
                <a href="/api/inquiries?key={ADMIN_KEY}&format=csv" class="btn">⬇️ Export CSV</a>
            </div>
        </header>

        <table>
            <thead>
                <tr>
                    <th>RFQ ID</th>
                    <th>Date / Time</th>
                    <th>Buyer / Company</th>
                    <th>Corporate Email</th>
                    <th>Phone / WhatsApp</th>
                    <th>Target Product</th>
                    <th>Volume / MOQ</th>
                    <th>Notes / Custom Specs</th>
                    <th>Client IP</th>
                </tr>
            </thead>
            <tbody>
                {rows if rows else '<tr><td colspan="9" class="empty">No inquiries received yet. Submit an RFQ on the website to test!</td></tr>'}
            </tbody>
        </table>
    </div>
</body>
</html>"""
            self._set_cors_headers(200, 'text/html; charset=utf-8')
            self.wfile.write(html.encode('utf-8'))
            return

        self._set_cors_headers(404, 'application/json')
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path not in ('/api/submit-rfq', '/api/rfq'):
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))
            return

        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length).decode('utf-8')

        data = {}
        content_type = self.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            try:
                data = json.loads(post_body)
            except Exception:
                data = {}
        else:
            parsed_qs = urllib.parse.parse_qs(post_body)
            for k, v in parsed_qs.items():
                data[k] = v[0] if v else ''

        # 1. Verification code check
        captcha_answer = data.get('captcha_answer') or data.get('captcha') or ''
        captcha_token = data.get('captcha_token') or ''
        
        # If captcha_token was supplied, verify it
        if captcha_token:
            if not verify_captcha(captcha_answer, captcha_token):
                self._set_cors_headers(400)
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": "Security verification code is incorrect. Please try again."
                }).encode('utf-8'))
                return

        email = data.get('email') or data.get('corporate_email') or data.get('work_email') or ''
        name = data.get('name') or data.get('full_name') or 'B2B Procurement Buyer'
        company = data.get('company') or data.get('company_name') or 'Not specified'
        phone = data.get('phone') or data.get('whatsapp') or data.get('mobile') or ''
        product = data.get('product') or data.get('target_product') or 'Bentgo-Style Custom Bento Lunch Box'
        volume = data.get('volume') or data.get('quantity') or '1,000 pcs (Initial Trial)'
        message = data.get('message') or data.get('notes') or data.get('inquiry_message') or 'Factory OEM/ODM quotation request'
        source_page = data.get('source_page') or self.headers.get('Referer', 'custombentofactory.com')

        if not email or '@' not in email:
            self._set_cors_headers(400)
            self.wfile.write(json.dumps({
                "success": False,
                "error": "A valid corporate email address is required."
            }).encode('utf-8'))
            return

        client_ip = self.headers.get('X-Real-IP') or self.headers.get('X-Forwarded-For') or self.client_address[0]
        if ',' in client_ip:
            client_ip = client_ip.split(',')[0].strip()

        rfq_id = f"CBF-{datetime.now().strftime('%Y%m%d')}-{secrets.token_hex(2).upper()}"
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')

        record = {
            "rfq_id": rfq_id,
            "created_at": created_at,
            "name": name.strip(),
            "company": company.strip(),
            "email": email.strip(),
            "phone": phone.strip(),
            "product": product.strip(),
            "volume": volume.strip(),
            "message": message.strip(),
            "source_page": source_page,
            "ip": client_ip,
            "routed_to": ", ".join(FORWARD_EMAILS)
        }

        # 1. Save to inquiries.json
        inquiries = []
        if os.path.exists(JSON_FILE):
            try:
                with open(JSON_FILE, 'r', encoding='utf-8') as f:
                    inquiries = json.load(f)
            except Exception:
                inquiries = []
        inquiries.append(record)
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(inquiries, f, indent=2, ensure_ascii=False)

        # 2. Append to inquiries.csv
        file_exists = os.path.exists(CSV_FILE)
        with open(CSV_FILE, 'a', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["RFQ ID", "Created At", "Name", "Company", "Corporate Email", "Phone/WhatsApp", "Target Product", "Volume/MOQ", "Message", "Source Page", "Client IP", "Routed To"])
            writer.writerow([
                record["rfq_id"],
                record["created_at"],
                record["name"],
                record["company"],
                record["email"],
                record["phone"],
                record["product"],
                record["volume"],
                record["message"],
                record["source_page"],
                record["ip"],
                record["routed_to"]
            ])

        print(f"✅ [CBF RFQ] {rfq_id} from {name} ({email}) for '{product}' ({volume}) -> Saved to disk")

        # 3. Asynchronously dispatch email notification via FormSubmit
        def send_email_async(rec):
            for target_mail in FORWARD_EMAILS:
                try:
                    url = f"https://formsubmit.co/ajax/{target_mail}"
                    email_payload = json.dumps({
                        "RFQ ID": rec["rfq_id"],
                        "Submission Time (UTC)": rec["created_at"],
                        "Buyer Name": rec["name"],
                        "Company": rec["company"],
                        "Corporate Email": rec["email"],
                        "Phone / WhatsApp": rec["phone"] or "Not provided",
                        "Target Bento Model": rec["product"],
                        "Estimated Volume": rec["volume"],
                        "Specifications / Requirements": rec["message"],
                        "Source Page": rec["source_page"],
                        "Buyer IP": rec["ip"],
                        "_subject": f"[Custom Bento Factory RFQ] {rec['product']} - {rec['name']} ({rec['volume']})",
                        "_template": "table"
                    }).encode('utf-8')

                    req = urllib.request.Request(
                        url,
                        data=email_payload,
                        headers={
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'User-Agent': 'CustomBentoFactory-RFQ/1.0'
                        }
                    )
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        print(f"📧 Notification sent to {target_mail} (HTTP {resp.status})")
                except Exception as e:
                    print(f"⚠️ Email dispatch notice for {target_mail}: {e}")

        t = threading.Thread(target=send_email_async, args=(record,))
        t.daemon = True
        t.start()

        self._set_cors_headers(200)
        self.wfile.write(json.dumps({
            "success": True,
            "rfq_id": rfq_id,
            "message": "Thank you! Your sourcing RFQ has been received. Our sales engineer will email you a formal quote and packaging dossier within 12 hours.",
            "routed_to": FORWARD_EMAILS
        }).encode('utf-8'))

def run_server():
    server_address = ('127.0.0.1', PORT)
    httpd = socketserver.TCPServer(server_address, RFQHandler)
    print(f"🚀 Custom Bento Factory RFQ Service listening on http://127.0.0.1:{PORT}")
    print(f"   Forwarding Targets: {FORWARD_EMAILS}")
    print(f"   Admin Inquiries: http://127.0.0.1:{PORT}/api/inquiries?key={ADMIN_KEY}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
