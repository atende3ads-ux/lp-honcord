(function () {
  'use strict';

  var form = document.getElementById('lead-form');
  var success = document.getElementById('form-success');
  if (!form || !success) return;
  var phone = form.elements.whatsapp;
  var status = document.getElementById('form-status');
  var button = form.querySelector('[type="submit"]');
  var params = new URLSearchParams(window.location.search);
  var tracking = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];

  function digits(value) { return String(value || '').replace(/\D/g, ''); }
  function validPhone(value) {
    var number = digits(value);
    var ddds = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
    if (![10, 11].includes(number.length) || !ddds.includes(Number(number.slice(0, 2)))) return false;
    var local = number.slice(2);
    if (/(\d)\1{4,}/.test(local) || ['12345678','123456789','98765432','987654321'].includes(local)) return false;
    return number.length === 11 ? local[0] === '9' : /^[2-5]/.test(local);
  }

  phone.addEventListener('input', function () {
    var d = digits(phone.value).slice(0, 11);
    if (d.length <= 2) { phone.value = d ? '(' + d : ''; return; }
    var split = d.length > 10 ? 7 : 6;
    phone.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, split) + (d.length > split ? '-' + d.slice(split) : '');
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (form.dataset.sending === 'true') return;
    if (!form.reportValidity()) return;
    if (!validPhone(phone.value)) {
      status.textContent = 'Informe um WhatsApp válido com DDD.';
      phone.focus();
      return;
    }
    if (window.location.hostname !== 'saude.honcord.com.br') {
      status.textContent = 'O formulário está disponível somente no site oficial da Honcord. Use o WhatsApp para falar com a equipe.';
      return;
    }

    var data = Object.fromEntries(new FormData(form));
    tracking.forEach(function (key) { data[key] = (params.get(key) || '').slice(0, 250); });
    form.dataset.submissionId = form.dataset.submissionId || (crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), function (byte) { return byte.toString(16).padStart(2, '0'); }).join(''));
    data.submission_id = form.dataset.submissionId;
    form.dataset.sending = 'true';
    button.disabled = true;
    status.textContent = 'Enviando sua solicitação…';
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 15000);
    try {
      var response = await fetch('/honcord-lead.php', {
        method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: controller.signal
      });
      var result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('not-confirmed');
      form.hidden = true;
      success.hidden = false;
      status.textContent = '';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event: 'generate_lead', form: 'honcord', lp: data.lp});
    } catch (_) {
      status.textContent = 'Não foi possível confirmar o envio. Tente novamente ou fale com a equipe pelo WhatsApp.';
    } finally {
      clearTimeout(timeout);
      delete form.dataset.sending;
      button.disabled = false;
    }
  });
})();
