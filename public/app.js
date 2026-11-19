const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
toggle.addEventListener('click', () => {
  const expanded = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
});
document.querySelectorAll('#site-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});

const cart = [];
const announcement = document.querySelector('#cart-announcement');
const categories = {
  'Sanduíches na chapa': 'sanduiches',
  'Trio completo': 'trios',
  'Tapioca recheada': 'tapiocas',
  'Misto quente': 'classicos',
  'Cuscuz recheado': 'cuscuz',
  'Acompanhamentos': 'acompanhamentos',
  'Bebidas': 'bebidas'
};
document.querySelectorAll('.menu-card').forEach(card => {
  card.dataset.category = categories[card.querySelector('h3').textContent.trim()] || 'outros';
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(chip => {
      const active = chip === button;
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.menu-card').forEach(card => {
      card.hidden = selected !== 'todos' && card.dataset.category !== selected;
    });
  });
});
const dialog = document.querySelector('#checkout');
const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
function addItem(name, price) {
  const found = cart.find(item => item.name === name);
  if (found) found.qty += 1; else cart.push({ name, price, qty: 1 });
  updateCart();
  announcement.textContent = name + ' adicionado ao pedido.';
}
document.querySelectorAll('.menu-card li').forEach(row => {
  const name = `${row.closest('.menu-card').querySelector('h3').textContent.trim()} — ${row.querySelector('li > span').childNodes[0].textContent.trim()}`;
  const raw = row.querySelector('b').textContent.replace('R$', '').trim().replace('.', '').replace(',', '.');
  const price = Number(raw);
  const button = document.createElement('button');
  button.className = 'add-item'; button.type = 'button'; button.textContent = '+';
  button.setAttribute('aria-label', `Adicionar ${name} ao pedido`);
  button.addEventListener('click', () => addItem(name, price)); row.append(button);
});
const comboCard = document.querySelector('.combo-copy');
const comboButton = document.querySelector('#combo-order');
const isThursday = () => new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date()) === 'Thu';
function updateComboAvailability() {
  const available = isThursday();
  comboButton.disabled = !available;
  comboButton.textContent = available ? 'Adicionar combo ao pedido ↗' : 'Combo disponível somente na quinta-feira';
  document.querySelector('#combo-availability').textContent = available ? 'Oferta disponível hoje.' : 'Volte na quinta-feira para pedir este combo.';
  document.querySelector('.combo').classList.toggle('combo-unavailable', !available);
}
comboButton.addEventListener('click', () => {
  updateComboAvailability();
  if (!isThursday()) return;
  addItem('Combo dos Amigos — somente às quintas-feiras', 49.99); openCart();
});
updateComboAvailability();
function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-fab').setAttribute('aria-label', `Abrir carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`);
  document.querySelector('#cart-items').innerHTML = cart.length ? cart.map((item, index) => `<div class="cart-row"><div><b>${escapeHtml(item.name)}</b><small>${money(item.price)} cada</small></div><div class="qty"><button type="button" data-change="-1" data-index="${index}" aria-label="Diminuir">−</button><span>${item.qty}</span><button type="button" data-change="1" data-index="${index}" aria-label="Aumentar">+</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join('') : '<p class="empty-cart">Seu carrinho está vazio. Escolha seus favoritos no cardápio.</p>';
  document.querySelector('#cart-total').textContent = money(total);
  document.querySelectorAll('[data-change]').forEach(button => button.addEventListener('click', () => {
    const item = cart[Number(button.dataset.index)]; item.qty += Number(button.dataset.change);
    if (item.qty < 1) cart.splice(Number(button.dataset.index), 1); updateCart();
  }));
}
function escapeHtml(text) { return text.replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character])); }
function openCart() { updateCart(); if (!dialog.open) dialog.showModal(); }
document.querySelector('#cart-fab').addEventListener('click', openCart);
document.querySelector('#open-cart-bottom').addEventListener('click', openCart);
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelectorAll('[name="fulfillment"]').forEach(input => input.addEventListener('change', () => {
  const delivery = document.querySelector('[name="fulfillment"]:checked').value === 'Entrega';
  const address = document.querySelector('[name="address"]'); address.required = delivery;
  document.querySelector('.address-field').hidden = !delivery;
}));
document.querySelector('[name="address"]').required = true;
document.querySelector('#checkout-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!cart.length) { announcement.textContent = 'Selecione um item do cardápio antes de finalizar.'; document.querySelector('#cart-items').focus(); return; }
  if (!isThursday() && cart.some(item => item.name.startsWith('Combo dos Amigos'))) {
    alert('O Combo dos Amigos está disponível somente às quintas-feiras. Remova o combo para continuar com os outros itens.'); return;
  }
  const form = new FormData(event.currentTarget);
  const lines = cart.map(item => `• ${item.qty}x ${item.name} — ${money(item.qty * item.price)}`);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const text = [
    'Olá! Quero fazer um pedido no Sabor da Emily:', '', ...lines, '',
    `Subtotal: ${money(total)}`, `Nome: ${form.get('name')}`,
    `Recebimento: ${form.get('fulfillment')}`,
    form.get('fulfillment') === 'Entrega' ? `Endereço: ${form.get('address')}` : 'Retirada no local',
    `Pagamento: ${form.get('payment')}`,
    form.get('notes') ? `Observações: ${form.get('notes')}` : ''
  ].filter(Boolean).join('\n');
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const shareWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (!shareWindow) window.location.href = url;
});
updateCart();
