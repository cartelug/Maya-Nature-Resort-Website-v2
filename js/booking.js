/* Booking — form validation + WhatsApp deep link */

const WHATSAPP_NUMBER = '256704602520';

/**
 * Compose and open a pre-filled WhatsApp message.
 * Accepts either form values (when called from the form) or an override room (when called from a card).
 */
function sendWhatsApp(overrideRoom) {
  const name   = document.getElementById('bName')?.value.trim()   || '(not given)';
  const phone  = document.getElementById('bPhone')?.value.trim()  || '(not given)';
  const cin    = document.getElementById('bIn')?.value            || '(flexible)';
  const cout   = document.getElementById('bOut')?.value           || '(flexible)';
  const room   = overrideRoom || document.getElementById('bRoom')?.value || '(any)';
  const guests = document.getElementById('bGuests')?.value || '(unspecified)';

  const lines = [
    `Hello Maya Nature Resort! I'd like to enquire about a booking.`,
    ``,
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    `*Room:* ${room}`,
    `*Guests:* ${guests}`,
    `*Check in:* ${cin}`,
    `*Check out:* ${cout}`,
    ``,
    `Thank you!`,
  ];

  const msg = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Light client-side validation — only checks that critical fields are sane,
 * doesn't block submission (WhatsApp confirms the booking interactively anyway).
 */
function validate() {
  const inEl  = document.getElementById('bIn');
  const outEl = document.getElementById('bOut');
  if (inEl?.value && outEl?.value) {
    const inDate = new Date(inEl.value);
    const outDate = new Date(outEl.value);
    if (outDate <= inDate) {
      outEl.setCustomValidity('Check-out must be after check-in');
      outEl.reportValidity();
      return false;
    } else {
      outEl.setCustomValidity('');
    }
  }
  return true;
}

export function initBooking() {
  const submitBtn = document.getElementById('bSubmit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (validate()) sendWhatsApp();
    });
  }

  // Wire the per-room "Book This Room" buttons — they jump to the booking section and pre-pick the room
  document.querySelectorAll('[data-room]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const room = btn.dataset.room;
      const select = document.getElementById('bRoom');
      if (select) {
        // Try to match the room option in the select; if found, set it
        const opt = Array.from(select.options).find(o =>
          o.value.toLowerCase().startsWith(room.split(' ')[0].toLowerCase())
        );
        if (opt) select.value = opt.value;
      }
      // Smooth scroll then send
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Slight delay so it feels intentional rather than abrupt
      setTimeout(() => sendWhatsApp(room), 600);
    });
  });

  // Set sensible defaults: check-in = tomorrow, check-out = day after
  const inEl  = document.getElementById('bIn');
  const outEl = document.getElementById('bOut');
  if (inEl && outEl) {
    const today = new Date();
    const tmr = new Date(today); tmr.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
    const iso = (d) => d.toISOString().split('T')[0];
    inEl.min = iso(today);
    outEl.min = iso(tmr);
  }
}
