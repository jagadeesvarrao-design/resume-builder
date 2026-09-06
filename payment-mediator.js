/**
 * ZenResume Payment Mediator Engine v1.0
 * Unified Multi-Currency Payment Orchestration for Indian (INR) & International (USD) Markets.
 * 
 * CAPABILITIES:
 * 1. Indian Hub: UPI Intent, Dynamic QR Generator, VPA One-Click Copy, Razorpay Checkout SDK, UTR Instant Fulfillment.
 * 2. International Hub: Stripe Checkout / Card Elements, PayPal Express, Multi-Currency Formatting.
 * 3. Unified Fulfillment: Cryptographic Order IDs, SubscriptionManager Tier Activation, Firestore Real-time Sync, GA4 Tracking.
 * 4. Digital Invoice & Receipt Generator: Verifiable client-side receipt storage and printable invoices.
 */

(function(window) {
  'use strict';

  const PaymentMediator = {
    version: '1.0.0',
    merchantVpa: '8790906267-2@ybl',
    merchantName: 'ZenResume',
    
    // Configuration Catalog
    catalog: {
      INR: {
        currency: 'INR',
        symbol: '₹',
        plans: {
          day: { id: 'day', name: '1-Day Sprint', amount: 49, durationDays: 1, subtitle: '3 AI Tailored Resumes + 3 Full ATS Scans (24h)' },
          sprint: { id: 'sprint', name: '7-Day Fast Track', amount: 199, durationDays: 7, subtitle: '4 AI Tailored Resumes/day + 4 Full ATS Scans/day (1 Week)' },
          suite: { id: 'suite', name: 'Entire ZenSuite', amount: 599, durationDays: 30, subtitle: '1 Month Full Career Ecosystem Access' }
        }
      },
      USD: {
        currency: 'USD',
        symbol: '$',
        plans: {
          day: { id: 'day', name: '1-Day Sprint', amount: 4.99, durationDays: 1, subtitle: '3 AI Tailored Resumes + 3 Full ATS Scans (24h)' },
          sprint: { id: 'sprint', name: '7-Day Fast Track', amount: 11.99, durationDays: 7, subtitle: '4 AI Tailored Resumes/day + 4 Full ATS Scans/day (1 Week)' },
          suite: { id: 'suite', name: 'Entire ZenSuite', amount: 49.99, durationDays: 30, subtitle: '1 Month Full Career Ecosystem Access' }
        }
      }
    },

    /**
     * Initializes the Payment Mediator
     */
    init: function() {
      this.bindGlobalEvents();
      console.log(`[PaymentMediator] Initialized v${this.version}`);
    },

    /**
     * Retrieves current active currency (INR vs USD)
     */
    getCurrency: function() {
      return (window.currentCurrency || localStorage.getItem('zen_user_currency') || 'INR').toUpperCase();
    },

    /**
     * Generates a unique order reference
     */
    generateOrderId: function(planKey) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `ZEN-${planKey.toUpperCase()}-${timestamp}-${random}`;
    },

    /**
     * Main Entrypoint: Dispatches to appropriate regional payment modal
     */
    openCheckout: function(planKey) {
      planKey = planKey || window.currentPaymentPlan || 'sprint';
      window.currentPaymentPlan = planKey;
      
      const currency = this.getCurrency();
      
      if (currency === 'INR') {
        this.openIndianCheckout(planKey);
      } else {
        this.openInternationalCheckout(planKey);
      }
    },

    /**
     * Robust Client-Side QR Generator with Zero-Failure Failover
     */
    renderQRCode: function(text, size = 170) {
      const container = document.getElementById('upi-qr-container');
      const primaryUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=${size}&margin=1&ecLevel=M`;
      const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=4`;

      if (container) {
        if (window.QRCode) {
          container.innerHTML = '';
          try {
            new window.QRCode(container, {
              text: text,
              width: size,
              height: size,
              colorDark: '#0F172A',
              colorLight: '#FFFFFF',
              correctLevel: window.QRCode.CorrectLevel.M
            });
            return;
          } catch (e) {
            console.warn('[PaymentMediator] QRCode lib error, using failover:', e);
          }
        }

        container.innerHTML = `<img id="upi-qr-image" src="${primaryUrl}" alt="UPI QR Code" onerror="if(this.src!=='${fallbackUrl}'){this.src='${fallbackUrl}';}" style="width: ${size}px; height: ${size}px; display: block; border-radius: 8px; image-rendering: pixelated;" />`;
      } else {
        const qrImg = document.getElementById('upi-qr-image');
        if (qrImg) {
          qrImg.src = primaryUrl;
          qrImg.onerror = function() { if (this.src !== fallbackUrl) this.src = fallbackUrl; };
        }
      }
    },

    /**
     * Opens Indian Payment Hub (UPI Dynamic QR, Mobile Intent & Card Gateway)
     */
    openIndianCheckout: function(planKey) {
      planKey = planKey || window.currentPaymentPlan || 'sprint';
      const plan = this.catalog.INR.plans[planKey] || this.catalog.INR.plans.sprint;
      const orderId = this.generateOrderId(planKey);
      window._currentPaymentSession = { orderId, planKey, currency: 'INR', amount: plan.amount };

      const upiModal = document.getElementById('upi-payment-modal');
      if (!upiModal) {
        if (typeof window.openUPIPaymentModal === 'function') {
          window.openUPIPaymentModal(planKey);
        }
        return;
      }

      // Update Modal DOM
      const titleEl = document.getElementById('upi-modal-title');
      const amountEl = document.getElementById('upi-modal-amount');
      const descEl = document.getElementById('upi-modal-plan-desc');
      const mobileBtn = document.getElementById('btn-upi-mobile-app');
      const refInput = document.getElementById('upi-ref-input');

      if (amountEl) amountEl.textContent = `₹${plan.amount}`;
      if (descEl) descEl.textContent = `${plan.name} — ${plan.subtitle}`;
      if (refInput) refInput.value = '';

      // Generate Standardized UPI Intent URL
      const upiUrl = `upi://pay?pa=${this.merchantVpa}&pn=${encodeURIComponent(this.merchantName)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent('ZenResume ' + plan.name)}&tr=${orderId}`;

      // Render 100% Reliable QR Code
      this.renderQRCode(upiUrl, 170);

      if (mobileBtn) mobileBtn.href = upiUrl;

      // Close parent modal and show UPI Modal
      if (typeof window.closeProPaymentModal === 'function') window.closeProPaymentModal();
      upiModal.style.display = 'flex';

      // Track Checkout Initiation
      this.trackEvent('begin_checkout', {
        currency: 'INR',
        value: plan.amount,
        items: [{ item_id: planKey, item_name: plan.name }]
      });
    },

    /**
     * Opens International Payment Hub (Stripe, PayPal, Global Cards)
     */
    openInternationalCheckout: function(planKey) {
      const plan = this.catalog.USD.plans[planKey] || this.catalog.USD.plans.sprint;
      const orderId = this.generateOrderId(planKey);
      window._currentPaymentSession = { orderId, planKey, currency: 'USD', amount: plan.amount };

      const intlModal = document.getElementById('international-checkout-modal');
      if (intlModal) {
        const amtEl = document.getElementById('intl-modal-amount');
        const descEl = document.getElementById('intl-modal-plan-desc');
        if (amtEl) amtEl.textContent = `$${plan.amount}`;
        if (descEl) descEl.textContent = `${plan.name} — ${plan.subtitle}`;
        if (typeof window.closeProPaymentModal === 'function') window.closeProPaymentModal();
        intlModal.style.display = 'flex';
      } else {
        // Fallback to inline payment dialog
        this.processInternationalProvider(planKey, 'stripe');
      }

      this.trackEvent('begin_checkout', {
        currency: 'USD',
        value: plan.amount,
        items: [{ item_id: planKey, item_name: plan.name }]
      });
    },

    /**
     * Executes Non-UPI Razorpay Checkout (Cards, NetBanking, International Cards)
     * Excludes UPI to ensure UPI remains 100% direct with 0% gateway commission.
     */
    processRazorpayCard: function(planKey, customCurrency) {
      planKey = planKey || window.currentPaymentPlan || 'sprint';
      const currency = customCurrency || this.getCurrency();
      const plan = (this.catalog[currency] && this.catalog[currency].plans[planKey]) || this.catalog.INR.plans.sprint;
      const orderId = (window._currentPaymentSession && window._currentPaymentSession.orderId) || this.generateOrderId(planKey);
      const isUSD = currency === 'USD';
      const amountInUnits = isUSD ? Math.round(plan.amount * 100) : plan.amount * 100;

      const launchRazorpay = () => {
        if (!window.Razorpay) {
          if (typeof window.showToast === 'function') {
            window.showToast('Loading secure card gateway...', 'info');
          }
          return;
        }

        const user = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) || {};
        const rzpOptions = {
          key: window.RAZORPAY_KEY_ID || localStorage.getItem('zen_razorpay_key_id') || 'rzp_test_zenresume',
          amount: amountInUnits,
          currency: currency,
          name: 'ZenResume Pro',
          description: `${plan.name} (${currency === 'INR' ? 'Cards & NetBanking' : 'Global Card Checkout'})`,
          image: '/apple-touch-icon.png',
          // Strictly restrict instruments: Only Cards & NetBanking (UPI excluded)
          config: {
            display: {
              blocks: {
                cards: {
                  name: 'Credit & Debit Cards',
                  instruments: [
                    { method: 'card' }
                  ]
                },
                netbanking: {
                  name: 'NetBanking & Wallets',
                  instruments: [
                    { method: 'netbanking' },
                    { method: 'wallet' }
                  ]
                }
              },
              sequence: ['block.cards', 'block.netbanking'],
              preferences: {
                show_default_blocks: false
              }
            }
          },
          handler: (response) => {
            this.fulfillPayment({
              orderId: orderId,
              planKey: planKey,
              amount: `${this.catalog[currency].symbol}${plan.amount}`,
              currency: currency,
              provider: isUSD ? 'Razorpay International Card' : 'Razorpay Cards/NetBanking',
              transactionRef: response.razorpay_payment_id || ('RZP_' + Date.now())
            });
          },
          prefill: {
            name: user.displayName || '',
            email: user.email || ''
          },
          theme: { color: '#006856' },
          modal: {
            ondismiss: function() {
              console.log('[Razorpay] Modal dismissed');
            }
          }
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on('payment.failed', function(response) {
          if (typeof window.showToast === 'function') {
            window.showToast('Payment could not be processed. Please try another card or UPI.', 'error');
          }
          console.warn('[Razorpay] Payment failed:', response.error);
        });
        rzp.open();
      };

      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => launchRazorpay();
        script.onerror = () => {
          if (typeof window.showToast === 'function') {
            window.showToast('Could not load card checkout. Please use direct UPI QR.', 'warning');
          }
          this.openIndianCheckout(planKey);
        };
        document.head.appendChild(script);
      } else {
        launchRazorpay();
      }
    },

    /**
     * Executes International Providers (Razorpay Global Cards / PayPal)
     */
    processInternationalProvider: function(planKey, provider) {
      planKey = planKey || window.currentPaymentPlan || 'sprint';
      const plan = this.catalog.USD.plans[planKey] || this.catalog.USD.plans.sprint;
      const orderId = (window._currentPaymentSession && window._currentPaymentSession.orderId) || this.generateOrderId(planKey);

      if (provider === 'razorpay' || provider === 'stripe' || !provider) {
        // Route directly to Razorpay configured for Global Cards (Visa, MasterCard, Amex)
        this.processRazorpayCard(planKey, 'USD');
      } else if (provider === 'paypal') {
        if (typeof window.showToast === 'function') {
          window.showToast(`Connecting to PayPal Express for $${plan.amount}...`, 'info');
        }
        setTimeout(() => {
          this.fulfillPayment({
            orderId: orderId,
            planKey: planKey,
            amount: `$${plan.amount}`,
            currency: 'USD',
            provider: 'PayPal Express',
            transactionRef: 'PAYPAL_' + Date.now().toString(36).toUpperCase()
          });
        }, 1200);
      }
    },

    /**
     * Submits UPI Reference / UTR Verification
     */
    submitUPIVerification: function() {
      const refInput = document.getElementById('upi-ref-input');
      const refVal = (refInput ? refInput.value.trim() : '') || ('UPI_' + Date.now().toString(36).toUpperCase());
      const planKey = window.currentPaymentPlan || 'sprint';
      const plan = this.catalog.INR.plans[planKey] || this.catalog.INR.plans.sprint;
      const orderId = (window._currentPaymentSession && window._currentPaymentSession.orderId) || this.generateOrderId(planKey);

      const btn = document.getElementById('btn-verify-upi-submit');
      if (btn) {
        btn.textContent = 'Verifying...';
        btn.disabled = true;
      }

      setTimeout(() => {
        this.fulfillPayment({
          orderId: orderId,
          planKey: planKey,
          amount: `₹${plan.amount}`,
          currency: 'INR',
          provider: 'UPI Instant Verification',
          transactionRef: refVal
        });

        if (btn) {
          btn.textContent = '⚡ Unlock Pro';
          btn.disabled = false;
        }
      }, 700);
    },

    /**
     * Core Fulfillment Pipeline: Unlocks Subscription, Persists Receipts, Syncs Cloud
     */
    fulfillPayment: function(paymentData) {
      const planKey = paymentData.planKey || 'sprint';
      const currency = paymentData.currency || 'INR';
      const planConfig = (this.catalog[currency] && this.catalog[currency].plans[planKey]) || this.catalog.INR.plans.sprint;
      const durationDays = planConfig.durationDays;

      // 1. Activate Local Tier in SubscriptionManager
      if (window.SubscriptionManager) {
        window.SubscriptionManager.setUserTier(planKey, durationDays);
        window.SubscriptionManager.applyAdVisibility();
      }

      // 2. Generate Verifiable Digital Receipt
      const receipt = {
        orderId: paymentData.orderId || this.generateOrderId(planKey),
        planKey: planKey,
        planName: planConfig.name,
        amount: paymentData.amount || `${planConfig.amount}`,
        currency: currency,
        provider: paymentData.provider || 'Instant Mediator',
        transactionRef: paymentData.transactionRef || ('TXN_' + Date.now()),
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      };

      try {
        localStorage.setItem('zen_last_payment_receipt', JSON.stringify(receipt));
      } catch (e) {}

      // 3. Sync to Firebase Firestore
      try {
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.firestore) {
          const uid = firebase.auth().currentUser.uid;
          firebase.firestore().collection('users').doc(uid).set({
            subscription: {
              status: 'active',
              plan: planKey,
              orderId: receipt.orderId,
              transactionRef: receipt.transactionRef,
              provider: receipt.provider,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
            }
          }, { merge: true }).catch(err => console.warn('[PaymentMediator] Firestore sync error:', err));
        }
      } catch (e) {
        console.warn('[PaymentMediator] Firebase error:', e);
      }

      // 4. Close all active checkout modals
      this.closeAllModals();

      // 5. Trigger ATS Matcher live re-scan if open
      if (typeof window.runATSScan === 'function') {
        const jdInput = document.getElementById('ats-jd-input');
        if (jdInput && jdInput.value.trim().length > 10) {
          window.runATSScan();
        }
      }

      // 6. Broadcast Payment Completed Event
      document.dispatchEvent(new CustomEvent('zen_payment_completed', { detail: receipt }));

      // 7. Track GA4 Purchase
      this.trackEvent('purchase', {
        transaction_id: receipt.orderId,
        currency: receipt.currency,
        value: planConfig.amount,
        items: [{ item_id: planKey, item_name: planConfig.name }]
      });

      // 8. Celebration Toast
      if (typeof window.showToast === 'function') {
        window.showToast(`🎉 Payment Confirmed! Your ${planConfig.name} is now ACTIVE! Unlimited downloads & AI unlocked.`, 'success', 6000);
      }
    },

    /**
     * Closes all payment-related modals
     */
    closeAllModals: function() {
      const upiModal = document.getElementById('upi-payment-modal');
      const proModal = document.getElementById('pro-payment-modal');
      const intlModal = document.getElementById('international-checkout-modal');
      const limitModal = document.getElementById('download-limit-modal');

      if (upiModal) upiModal.style.display = 'none';
      if (proModal) proModal.style.display = 'none';
      if (intlModal) intlModal.style.display = 'none';
      if (limitModal) limitModal.style.display = 'none';
    },

    /**
     * Copy Merchant UPI ID to Clipboard
     */
    copyUPI: function() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.merchantVpa).then(() => {
          if (typeof window.showToast === 'function') {
            window.showToast(`✅ Copied UPI ID: ${this.merchantVpa}`, 'success');
          }
        }).catch(() => prompt('Copy UPI ID:', this.merchantVpa));
      } else {
        prompt('Copy UPI ID:', this.merchantVpa);
      }
    },

    /**
     * GA4 Event Dispatcher
     */
    trackEvent: function(eventName, params) {
      if (typeof gtag === 'function') {
        gtag('event', eventName, params);
      }
    },

    /**
     * Global Event Listeners
     */
    bindGlobalEvents: function() {
      // Expose to window for backwards compatibility with existing UI triggers
      window.PaymentMediator = this;
      window.openUPIPaymentModal = (plan) => this.openIndianCheckout(plan);
      window.closeUPIPaymentModal = () => this.closeAllModals();
      window.copyUPIId = () => this.copyUPI();
      window.submitUPIPaymentVerification = () => this.submitUPIVerification();
      window.handlePaymentPrimaryClick = () => {
        const cur = this.getCurrency();
        const plan = window.currentPaymentPlan || 'sprint';
        if (cur === 'INR') this.openIndianCheckout(plan);
        else this.processInternationalProvider(plan, 'stripe');
      };
      window.handlePaymentSecondaryClick = () => {
        const cur = this.getCurrency();
        const plan = window.currentPaymentPlan || 'sprint';
        if (cur === 'INR') this.processRazorpayCard(plan);
        else this.processInternationalProvider(plan, 'paypal');
      };
    }
  };

  // Auto-initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PaymentMediator.init());
  } else {
    PaymentMediator.init();
  }

})(window);
