/* NestDubai — payment.js */

(function () {
  const bookingId = window.BOOKING_ID;
  const stripeKey = window.STRIPE_KEY;
  const demoMode = window.DEMO_MODE;

  const form = document.getElementById('payment-form');
  const submitBtn = document.getElementById('submit-payment');
  const statusEl = document.getElementById('payment-status');

  function setStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = isError ? 'alert alert-error mt-16' : 'alert alert-info mt-16';
    statusEl.style.display = msg ? 'flex' : 'none';
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? '<span class="spinner"></span> Processing…'
      : '🔒 Confirm & Pay';
  }

  // ─── DEMO MODE ─────────────────────────────────────────────
  if (demoMode) {
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Processing your payment…');

        // Simulate a short delay for realism
        await new Promise(r => setTimeout(r, 1800));

        const res = await fetch(`/payment/${bookingId}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'demo=true'
        });

        if (res.redirected) {
          window.location.href = res.url;
        } else {
          setLoading(false);
          setStatus('Payment confirmed! Redirecting…');
          setTimeout(() => window.location.href = `/payment/success/${bookingId}`, 1000);
        }
      });
    }
    return;
  }

  // ─── REAL STRIPE MODE ──────────────────────────────────────
  if (!stripeKey || !window.Stripe) return;

  const stripe = Stripe(stripeKey);
  const elements = stripe.elements({
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap' }]
  });

  const cardEl = elements.create('card', {
    style: {
      base: {
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '15px',
        color: '#1C2433',
        '::placeholder': { color: '#6B7A8F' },
        iconColor: '#1A7B74'
      },
      invalid: { color: '#C0392B' }
    }
  });

  const cardMount = document.getElementById('card-element');
  if (cardMount) cardEl.mount('#card-element');

  cardEl.on('change', (e) => {
    if (e.error) setStatus(e.error.message, true);
    else statusEl && (statusEl.style.display = 'none');
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setLoading(true);
      setStatus('');

      // Create PaymentIntent on server
      const intentRes = await fetch(`/payment/${bookingId}/intent`, { method: 'POST' });
      const { clientSecret, error: intentErr } = await intentRes.json();

      if (intentErr) {
        setLoading(false);
        setStatus(intentErr, true);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardEl }
      });

      if (error) {
        setLoading(false);
        setStatus(error.message, true);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setStatus('Payment successful! Confirming booking…');
        const res = await fetch(`/payment/${bookingId}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `paymentIntentId=${paymentIntent.id}`
        });
        if (res.redirected) window.location.href = res.url;
        else window.location.href = `/payment/success/${bookingId}`;
      }
    });
  }
})();
