from django.core.management.base import BaseCommand
from django.utils import timezone
from policies.models import Policy, PolicySection, PolicyContentItem, PolicyContact

class Command(BaseCommand):
    help = 'Seed the database with initial policies for Nexus Nutraceuticals'

    def handle(self, *args, **options):
        self.stdout.write('Seeding policies...')
        
        # 1. Create a global PolicyContact
        contact, _ = PolicyContact.objects.update_or_create(
            company_name="Nexus Nutraceuticals / Shivay Healthcare",
            defaults={
                "support_email": "hello.nexusnutra@gmail.com",
                "support_phone": "+91 63570 02100",
                "support_whatsapp": "+91 63570 02100",
                "business_address": "Vastral, Ahmedabad - 382418, Gujarat, India",
                "is_active": True
            }
        )

        policies_data = [
            {
                "slug": "privacy-policy",
                "title": "Privacy Policy",
                "short_description": "Your privacy and personal information matter to us.",
                "icon": "shield-check",
                "sections": [
                    {
                        "title": "Information We Collect",
                        "display_order": 1,
                        "items": [
                            {"item_type": "paragraph", "content": "We collect only the necessary information required to process your orders, communicate delivery updates, and provide customer support:", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Contact & Identity Details:</strong> Full name, active mobile number, and email address.</li><li><strong>Delivery Information:</strong> Complete shipping address, landmark, city, state, and PIN code.</li><li><strong>Order & Transaction Details:</strong> Product selections, quantity, transaction reference numbers, and order history.</li><li><strong>Technical Information:</strong> IP address, browser type, device information, operating system, and browsing activity collected automatically through standard cookies and analytics tools.</li></ul>", "display_order": 2},
                        ]
                    },
                    {
                        "title": "Payment Information & Security",
                        "display_order": 2,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>We operate on a 100% Prepaid Model using Direct UPI QR Code Scanning and Direct Bank Transfers.</li><li>When making a payment, transactions occur directly through your personal UPI application or bank portal.</li><li>We do NOT collect, store, or have access to sensitive payment credentials such as your bank account password, UPI MPIN, debit/credit card CVV, or OTPs.</li><li>Transaction confirmation is verified solely via the payment screenshot, UPI reference ID, or UTR number you provide.</li></ul>", "display_order": 1},
                        ]
                    },
                    {
                        "title": "How We Use Your Information",
                        "display_order": 3,
                        "items": [
                            {"item_type": "paragraph", "content": "We utilize the collected information strictly for legitimate business operations:", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li>To process, package, dispatch, and fulfill your dietary supplement orders.</li><li>To coordinate with third-party courier services for fast and safe doorstep delivery.</li><li>To send order confirmations, invoice receipts, and real-time shipping tracking alerts via WhatsApp, SMS, or Email.</li><li>To address customer queries, support requests, and process replacements or refunds where applicable.</li><li>To safeguard against fraud, unauthorized transactions, or misuse of our services.</li><li>To comply with statutory food safety regulations (FSSAI) and Indian e-commerce laws.</li></ul>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Data Sharing & Third Parties",
                        "display_order": 4,
                        "items": [
                            {"item_type": "paragraph", "content": "We do not sell, rent, trade, or monetize your personal data with any third party. We share essential data only with trusted operational partners:", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Logistics & Courier Partners:</strong> Name, shipping address, and phone number are shared solely to ensure accurate delivery.</li><li><strong>Customer Support & Communication Tools:</strong> To send automated shipping tracking alerts and handle customer service requests.</li><li><strong>Legal Authorities:</strong> Information may be disclosed if required by law, court order, or governmental authorities to prevent fraudulent activity.</li></ul>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Cookies and Web Analytics",
                        "display_order": 5,
                        "items": [
                            {"item_type": "paragraph", "content": "Our website uses standard cookies and tracking technologies to:", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li>Remember your cart selections and preferences.</li><li>Analyze overall web traffic, popular pages, and user experience.</li></ul>", "display_order": 2},
                            {"item_type": "important_notice", "content": "You may choose to disable cookies through your browser settings. However, doing so may impact some shopping functionalities on the website.", "display_order": 3}
                        ]
                    },
                    {
                        "title": "Data Retention & Safeguards",
                        "display_order": 6,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>We implement robust technical, physical, and administrative security measures to protect your personal details against unauthorized access, loss, misuse, or alteration.</li><li>We retain transaction and invoicing records for the duration required by applicable Indian taxation, accounting, and consumer protection laws.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Marketing & Communications",
                        "display_order": 7,
                        "items": [
                            {"item_type": "paragraph", "content": "With your consent, we may occasionally share updates on wellness tips, new product launches, or seasonal promotions. You can opt out of promotional messages at any time by contacting our support team or using the unsubscribe option. (You will continue to receive transactional order and shipping alerts).", "display_order": 1}
                        ]
                    }
                ]
            },
            {
                "slug": "refund-return-policy",
                "title": "Refund & Return Policy",
                "short_description": "Clear and transparent information about returns, replacements, and refunds.",
                "icon": "arrow-path",
                "sections": [
                    {
                        "title": "100% Prepaid Orders Only",
                        "display_order": 1,
                        "items": [
                            {"item_type": "paragraph", "content": "We operate strictly on a 100% Prepaid Order Model. Cash on Delivery (COD) is currently NOT available.", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li>Direct UPI QR Code Scan (via Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app)</li><li>Direct Bank Transfer (NEFT / IMPS / RTGS to our official bank account)</li></ul>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Consumable Goods & Hygiene Policy",
                        "display_order": 2,
                        "items": [
                            {"item_type": "important_notice", "content": "Because our products (including Vitamin B12 + D3 Water-Soluble Powder) are health and dietary supplements intended for direct human consumption, we strictly enforce a NO RETURN / NO REFUND policy once the product packaging, container, or safety seal has been opened, broken, or tampered with. This ensures maximum safety, hygiene, and product integrity for all customers.", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Eligibility for Replacement or Refund",
                        "display_order": 3,
                        "items": [
                            {"item_type": "paragraph", "content": "We offer a free replacement or a full refund only under the following verified circumstances:", "display_order": 1},
                            {"item_type": "eligibility_card", "content": "<ul><li><strong>Transit Damage:</strong> The product is received in a cracked, broken, crushed, or leaked condition.</li><li><strong>Incorrect Item / Flavor:</strong> You received an incorrect flavor or a different product from what you ordered.</li><li><strong>Missing Items:</strong> Any missing item from a multi-item package.</li><li><strong>Expired Product:</strong> The product received has passed its expiry date at the time of delivery.</li></ul>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Claim Procedure & Reporting Window",
                        "display_order": 4,
                        "items": [
                            {"item_type": "warning_card", "content": "<strong>Timeframe:</strong> You must notify our customer support team within 48 hours of delivery. Requests received after 48 hours will not be accepted.", "display_order": 1},
                            {"item_type": "numbered_list", "content": "<ol><li>Your Order ID and registered mobile number.</li><li>Payment reference / Transaction screenshot (UPI reference ID / Bank UTR number).</li><li>Clear unboxing photos or a video showing the outer shipping box, the courier label, the damaged/incorrect product, and the batch number on the container.</li></ol>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Order Cancellation Policy",
                        "display_order": 5,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Pre-Dispatch:</strong> You may cancel your order before it has been processed and dispatched from our warehouse. Contact us immediately.</li><li><strong>Post-Dispatch:</strong> Once an order is packed, dispatched, and assigned a courier tracking number, the order cannot be cancelled.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Refund Processing Timelines",
                        "display_order": 6,
                        "items": [
                            {"item_type": "paragraph", "content": "Since all orders are prepaid via direct UPI scan or direct bank transfer, approved refunds will be credited directly to the customer's UPI ID / Google Pay / PhonePe number or Bank Account (via NEFT/IMPS).", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li>We will request your verified bank details or UPI ID for processing.</li><li>Approved refunds are credited within 5 to 7 business days following verification.</li></ul>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Non-Refundable Circumstances",
                        "display_order": 7,
                        "items": [
                            {"item_type": "eligibility_card", "content": "<ul><li>Incorrect or incomplete delivery address or unreachable contact number provided at checkout.</li><li>Failed delivery after multiple attempts by the courier partner.</li><li>Products returned with broken outer seals, missing original packaging, or missing scoops.</li><li>Personal preference regarding taste, sweetness, or individual health expectations.</li></ul>", "display_order": 1}
                        ]
                    }
                ]
            },
            {
                "slug": "shipping-policy",
                "title": "Shipping Policy",
                "short_description": "Everything you need to know about order processing, shipping, and delivery.",
                "icon": "truck",
                "sections": [
                    {
                        "title": "Payment Confirmation & Order Processing",
                        "display_order": 1,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li><strong>100% Prepaid Orders:</strong> Orders are confirmed and queued for packing immediately after payment verification.</li><li><strong>Dispatch Timeline:</strong> All orders are processed, quality-checked, and dispatched from our Ahmedabad facility within 24 to 48 business hours.</li><li>Orders placed after business hours or on weekends/public holidays are processed on the next business day.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Estimated Delivery Timelines",
                        "display_order": 2,
                        "items": [
                            {"item_type": "paragraph", "content": "We ship across all serviceable PIN codes in India through trusted logistics partners (such as Delhivery, Blue Dart, DTDC, Xpressbees, and India Post):", "display_order": 1},
                            {"item_type": "delivery_card", "content": "<p><strong>Gujarat & Ahmedabad:</strong> 2 to 3 Business Days</p><p><strong>Metro Cities:</strong> 3 to 5 Business Days</p><p><strong>Rest of India (Tier 2/3):</strong> 4 to 7 Business Days</p><p><strong>Remote, J&K, North-East:</strong> 6 to 9 Business Days</p>", "display_order": 2},
                            {"item_type": "important_notice", "content": "Delivery times are estimates and may occasionally experience minor delays due to adverse weather, local restrictions, or regional transit delays.", "display_order": 3}
                        ]
                    },
                    {
                        "title": "Shipping Charges",
                        "display_order": 3,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Standard Shipping:</strong> A flat shipping charge of ₹50 applies on orders below ₹499.</li><li><strong>Free Shipping:</strong> Applicable on promotional thresholds or prepaid bundle offers.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Shipment Tracking",
                        "display_order": 4,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>Once your package is dispatched, tracking information containing the Courier Name, AWB / Tracking Number, and Tracking Link will be sent to your registered WhatsApp number, SMS, and Email.</li><li>You can monitor the real-time transit status of your parcel directly via the courier tracking portal.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Delivery Attempts & Accurate Details",
                        "display_order": 5,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Accurate Information:</strong> Please ensure your full shipping address, reachable landmark, correct PIN code, and active mobile number are provided during order placement.</li><li><strong>Delivery Attempts:</strong> Our courier partners attempt delivery up to 3 times. If delivery fails due to incorrect address details, customer unavailability, or non-response to courier calls, the package will be returned to our warehouse (RTO). Re-shipping fees may apply for re-dispatching.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Damaged or Tampered Packaging",
                        "display_order": 6,
                        "items": [
                            {"item_type": "warning_card", "content": "If the outer delivery box is visibly damaged, crushed, open, or tampered with at the time of delivery, please: <ul><li>Do not accept the parcel from the delivery agent and request them to mark it as \"Refused due to damage\".</li><li>If accepted, record a clear unboxing video before opening the outer carton seal.</li><li>Notify our support team within 48 hours with photos/video to claim a swift replacement.</li></ul>", "display_order": 1}
                        ]
                    }
                ]
            },
            {
                "slug": "terms-of-service",
                "title": "Terms of Service",
                "short_description": "Please read the terms and conditions governing the use of our website and services.",
                "icon": "document-text",
                "sections": [
                    {
                        "title": "Acceptance of Terms & Eligibility",
                        "display_order": 1,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>By using this website, you represent that you are at least 18 years of age or that you are accessing the website under the supervision of a parent or legal guardian.</li><li>We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion if any fraudulent or unauthorized activity is suspected.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Nutraceutical & Health Disclaimer",
                        "display_order": 2,
                        "items": [
                            {"item_type": "important_notice", "content": "Our health and wellness products are not intended to diagnose, treat, cure, or prevent any disease unless specifically permitted and stated in accordance with applicable law.", "display_order": 1},
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Proprietary Dietary Supplement:</strong> Products sold on this website (including our Vitamin B12 + D3 Water-Soluble Powder) are dietary / nutraceutical supplements and are NOT FOR MEDICINAL USE.</li><li><strong>Medical Consultation:</strong> The information provided on this website is for general informational and educational purposes only. Always consult a qualified physician or healthcare professional before taking any dietary supplement.</li><li><strong>Dosage Adherence:</strong> Do not exceed the recommended daily serving size (one 5g scoop daily or as directed by a healthcare professional).</li></ul>", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Product Details, Pricing & Availability",
                        "display_order": 3,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li><strong>Pricing:</strong> All prices listed on nexusnutraceuticals.com are in Indian Rupees (INR) and are inclusive of applicable GST (MRP ₹399.00 per 100g pack).</li><li><strong>Product Formats:</strong> Our Vitamin B12 + D3 powder is available in Strawberry and Orange flavors.</li><li><strong>Modifications:</strong> We reserve the right to modify prices, discontinue products, or alter promotional offers without prior notice.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "100% Prepaid Payment Terms",
                        "display_order": 4,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>We operate exclusively on a 100% Prepaid Order Model.</li><li>Accepted payment methods include Direct UPI QR Code Scan and Direct Bank Transfer.</li><li>Cash on Delivery (COD) is not accepted.</li><li>Orders are confirmed and scheduled for dispatch only after payment verification.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Accuracy of Billing and Shipping Information",
                        "display_order": 5,
                        "items": [
                            {"item_type": "paragraph", "content": "You agree to provide complete, current, and accurate purchase, delivery address, landmark, PIN code, and active phone number details for all orders placed on our website.", "display_order": 1},
                            {"item_type": "paragraph", "content": "We are not responsible for delivery failures or delays resulting from incorrect address details or unreachable contact numbers provided by the customer.", "display_order": 2}
                        ]
                    },
                    {
                        "title": "Intellectual Property Rights",
                        "display_order": 6,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>All content on this website—including the brand name \"Nexus Nutraceuticals\", logos, slogans, product packaging designs, graphics, images, and text—is the exclusive intellectual property of Shivay Healthcare / Nexus Nutraceuticals.</li><li>Unauthorized copying, reproduction, redistribution, or commercial exploitation of any site content is strictly prohibited.</li></ul>", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Limitation of Liability",
                        "display_order": 7,
                        "items": [
                            {"item_type": "paragraph", "content": "Nexus Nutraceuticals, Shivay Healthcare, Zenics Nutraceuticals LLP, and their respective owners or affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from the improper usage or storage of our products, non-compliance with dosage guidelines, or temporary website technical disruptions.", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Indemnification",
                        "display_order": 8,
                        "items": [
                            {"item_type": "paragraph", "content": "You agree to indemnify, defend, and hold harmless Nexus Nutraceuticals, Shivay Healthcare, manufacturing partner Zenics Nutraceuticals LLP, and their affiliates from any third-party claims, liabilities, damages, or costs resulting from your breach of these Terms of Service or violation of applicable laws.", "display_order": 1}
                        ]
                    },
                    {
                        "title": "Governing Law & Dispute Resolution",
                        "display_order": 9,
                        "items": [
                            {"item_type": "bullet_list", "content": "<ul><li>These Terms of Service and any transactional agreements shall be governed by and construed in accordance with the laws of India.</li><li>Any dispute, controversy, or claim arising out of the use of this website or purchases made through it shall be subject to the exclusive jurisdiction of the competent courts located in Ahmedabad, Gujarat, India.</li></ul>", "display_order": 1}
                        ]
                    }
                ]
            }
        ]

        for p_data in policies_data:
            policy, created = Policy.objects.update_or_create(
                slug=p_data['slug'],
                defaults={
                    'title': p_data['title'],
                    'short_description': p_data['short_description'],
                    'icon': p_data['icon'],
                    'status': 'Published',
                    'contact_info': contact,
                }
            )
            self.stdout.write(f"Seeded Policy: {policy.title}")
            
            # Clear existing sections to prevent duplication issues during rapid dev
            if not created:
                policy.sections.all().delete()
                
            for s_data in p_data['sections']:
                section = PolicySection.objects.create(
                    policy=policy,
                    title=s_data['title'],
                    display_order=s_data['display_order'],
                    is_active=True
                )
                
                for i_data in s_data['items']:
                    PolicyContentItem.objects.create(
                        policy_section=section,
                        item_type=i_data['item_type'],
                        content=i_data['content'],
                        display_order=i_data['display_order'],
                        is_active=True
                    )

        self.stdout.write(self.style.SUCCESS('Successfully seeded policies!'))
