#!/usr/bin/env python3
"""
verify_endpoints.py - Automated HTTP/2 200 OK Verification for B2B Bento Websites
Verifies all web pages, image assets, AI endpoints, and sitemaps.
"""

import sys
import urllib.request
import ssl

ENDPOINTS = [
    # Core Pages
    "https://www.custombentofactory.com/",
    "https://www.custombentofactory.com/products.html",
    "https://www.custombentofactory.com/leakproof-lab.html",
    "https://www.custombentofactory.com/executive-titanium-bento-gifting.html",
    "https://www.custombentofactory.com/kids-lunch-boxes-oem-manufacturer.html",
    "https://www.custombentofactory.com/stainless-steel-lunch-boxes-factory.html",
    "https://www.custombentofactory.com/wheat-straw-bento-boxes-wholesale.html",
    "https://www.custombentofactory.com/insulated-lunch-bags-supplier.html",
    "https://www.custombentofactory.com/certifications.html",
    "https://www.custombentofactory.com/about.html",
    "https://www.custombentofactory.com/contact.html",

    # C-End Viral Trend Landing Pages (Clean URLs)
    "https://www.custombentofactory.com/viral-tiktok-snackle-box-manufacturer",
    "https://www.custombentofactory.com/microwave-safe-stainless-steel-bento-factory",
    "https://www.custombentofactory.com/rattle-free-portable-cutlery-sets-supplier",

    # AI & GEO Endpoints
    "https://www.custombentofactory.com/llms.txt",
    "https://www.custombentofactory.com/llms-full.txt",
    "https://www.custombentofactory.com/ai/summary.json",
    "https://www.custombentofactory.com/ai/faq.json",
    "https://www.custombentofactory.com/ai/vendor-comparison.json",
    "https://www.custombentofactory.com/sitemap.xml",
    "https://www.custombentofactory.com/robots.txt",

    # 8 Viral Product Hero Images
    "https://www.custombentofactory.com/images/snackle_box_hero.jpg",
    "https://www.custombentofactory.com/images/microwave_stainless_bento_hero.jpg",
    "https://www.custombentofactory.com/images/salad_bento_bowl_hero.jpg",
    "https://www.custombentofactory.com/images/rattle_free_cutlery_hero.jpg",
    "https://www.custombentofactory.com/images/collapsible_silicone_bento_hero.jpg",
    "https://www.custombentofactory.com/images/kawaii_stackable_tiffin_hero.jpg",
    "https://www.custombentofactory.com/images/silicone_dip_containers_hero.jpg",
    "https://www.custombentofactory.com/images/portion_control_prep_bento_hero.jpg",
]

def check_endpoint(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={"User-Agent": "BentoEndpointVerifier/1.0"})

    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            status = response.getcode()
            content_type = response.headers.get("Content-Type", "")
            return status, content_type, None
    except Exception as e:
        return 0, "", str(e)

def main():
    print(f"Starting verification of {len(ENDPOINTS)} production endpoints on CustomBentoFactory.com...\n")
    failed = 0
    passed = 0

    for url in ENDPOINTS:
        status, ctype, err = check_endpoint(url)
        if status == 200:
            print(f"  [PASS] 200 OK  {url} ({ctype.split(';')[0]})")
            passed += 1
        else:
            print(f"  [FAIL] {status} {url} - Error: {err}")
            failed += 1

    print(f"\nVerification Results: {passed} PASSED, {failed} FAILED.")
    if failed > 0:
        sys.exit(1)
    print("All endpoints verified healthy!")

if __name__ == "__main__":
    main()
