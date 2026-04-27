
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));
const menuBtn = $('.mobile-toggle');
const navLinks = $('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => observer.observe(el));
$$('.faq-q').forEach((btn) => btn.addEventListener('click', () => btn.closest('.faq-item').classList.toggle('open')));
const year = $('[data-year]');
if (year) year.textContent = new Date().getFullYear();
const sticky = $('.sticky-call');
const mobileViewport = window.matchMedia('(max-width: 980px)');
const updatePrimaryCtas = () => {
  const pastFold = window.scrollY > 520;
  const showSticky = pastFold && mobileViewport.matches;
  if (sticky) sticky.classList.toggle('show', showSticky);
  document.body.classList.toggle('show-nav-cta', pastFold && !mobileViewport.matches);
};
window.addEventListener('scroll', updatePrimaryCtas, { passive: true });
mobileViewport.addEventListener('change', updatePrimaryCtas);
updatePrimaryCtas();

const calculators = [
  { root: $('#quoteCalc'), service: $('#serviceType'), urgent: $('#urgent'), address: $('#serviceAddress'), button: $('#checkDistance'), out: $('#quoteOut'), items: $('#quoteItems'), why: $('#whyBox'), result: $('#distanceResult') },
  { root: $('#bookingDistanceCalc'), service: $('#bookingServiceType'), urgent: null, address: $('#bookingServiceAddress'), button: $('#bookingCheckDistance'), out: $('#bookingQuoteOut'), items: $('#bookingQuoteItems'), why: null, result: $('#bookingDistanceResult') }
];
const activeCalculators = calculators.filter((calc) => calc.root && calc.service && calc.out && calc.items && calc.result);
if (activeCalculators.length) {
  const origin = { lat: 41.8240, lon: -71.4128, label: 'Providence service area' }; // Public service-area reference point, not a private address.
  const includedMiles = 10;
  const extraMileRate = 2;
  const roundToNearest = 5;
  const services = {
    quick: { name: 'Mobile Check', labor: 25, parts: 'No parts included', why: 'Best for quick issues we can reasonably assess in about 20 minutes or less without teardown, disassembly, pressure testing, electrical tracing, leak testing, or deeper troubleshooting.', bullets: ['Quick symptom review', 'Basic visual check', 'Basic scan when appropriate', 'Plain-English next step', 'Repair quote before any repair work starts'], note: '$25 includes travel up to 10 driving miles within the Providence service area.' },
    diagnostic: { name: 'Additional Diagnostic', labor: 125, parts: 'Parts not included', why: 'Used when the issue needs diagnostic labor beyond a quick mobile check. We explain the next step and quote it before testing starts.', bullets: ['Symptom review', 'Scan tool check when useful', 'System testing', 'Access checks when needed', 'Clear repair path before repair labor starts'], note: 'Deeper diagnostic labor is quoted before testing starts.' },
    nostart: { name: 'No-Start Diagnostic', labor: 125, parts: 'Parts not included', why: 'No-start issues need structured testing so we narrow the problem between battery, starter, charging, fuel, ignition, sensor, or electrical causes.', bullets: ['Battery and charging checks', 'Starter circuit direction', 'Fuel and ignition direction', 'Scan when needed', 'Repair quote after cause is narrowed down'], note: 'Simple causes are checked first. Deeper testing is quoted before it starts.' },
    brakes: { name: 'Brake Service', labor: 175, parts: 'Pads, rotors, calipers, hardware, and fluid are separate', why: 'Brake labor starts clearly, then parts are quoted by vehicle based on rotor size, parts quality, caliper condition, and rust.', bullets: ['Brake noise and pulsation review', 'Pads and rotor inspection', 'Hardware and caliper direction', 'Labor quote before work starts', 'Parts quoted by vehicle'], note: 'We inspect before selling brakes and quote vehicle-specific parts before installation.' },
    suspension: { name: 'Suspension/Steering', labor: 125, parts: 'Control arms, struts, shocks, tie rods, bearings, and hardware are separate', why: 'Suspension labor starts clearly, then parts and rust or access issues are quoted by vehicle before repair approval.', bullets: ['Noise and clunk direction', 'Visual suspension check', 'Steering and safety concerns', 'Rust or access warning if needed', 'Parts quoted by vehicle'], note: 'We separate urgent safety issues from noises that can wait.' },
    ac: { name: 'AC/Heat Diagnostic', labor: 99, parts: 'Refrigerant, dye, compressor, blower, sensors, and other parts are separate', why: 'AC issues are diagnosed first so we can tell whether the problem is refrigerant, a leak, airflow, electrical, compressor, or heat related.', bullets: ['AC performance check', 'Leak direction when needed', 'Compressor and electrical direction', 'Blower and airflow direction', 'Repair quote before parts'], note: 'We diagnose the cause before recommending refrigerant, compressor, blower, sensor, or electrical work.' },
    ppi: { name: 'Pre-Purchase Check', labor: 50, parts: 'No parts included', why: 'A pre-purchase check helps catch obvious problems before you buy. Choose the $50 Working Diagnostic or the $125 Maintenance Report.', bullets: ['Starting, charging, and warning light check', 'Brakes, tires, leaks, AC and heat basics, and obvious red flags', '$125 Maintenance Report includes concise written recommended services', 'Repair pricing is quoted separately'], note: '$50 Working Diagnostic. $125 Maintenance Report includes concise service recommendations.' },
    inspection: { name: 'RI Inspection Help', labor: 25, parts: 'Repairs are separate', why: 'Built for Rhode Island inspection pressure. We review common failure points and give a clear repair path if something needs attention.', bullets: ['Failed report review', 'Lights and wipers', 'Brakes and tires', 'Leaks and warning lights', 'Repair plan if something will fail'], note: 'We focus on what helps the vehicle pass safely and tell you which repairs can wait.' },
    second: { name: 'Second Opinion', labor: 99, parts: 'No parts included', why: 'For customers who already received a quote and want a clear second opinion on what is urgent, what can wait, and what may not be needed.', bullets: ['Review existing quote', 'Inspect claimed issue', 'Urgent, soon, optional sorting', 'Not-needed notes when appropriate'], note: 'We help you understand whether the quote is fair, urgent, optional, or worth challenging.' }
  };
  const money = (n) => '$' + Math.ceil(n).toLocaleString();
  const roundUp = (amount) => Math.ceil(amount / roundToNearest) * roundToNearest;
  async function geocodeAddress(raw) {
    const query = encodeURIComponent(raw + ', Rhode Island, USA');
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${query}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Address lookup failed');
    const data = await res.json();
    if (!data || !data.length) throw new Error('Address not found');
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name };
  }
  async function routeMiles(destination) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Route lookup failed');
    const data = await res.json();
    if (!data.routes || !data.routes.length) throw new Error('Route not found');
    return data.routes[0].distance / 1609.344;
  }
  function travelFromMiles(miles) {
    if (miles == null) return { amount: 0, display: 'Enter address', status: 'unknown', note: `Enter the vehicle address to check whether it falls inside the local mobile zone.` };
    if (miles <= includedMiles) return { amount: 0, display: 'Included', status: 'inside', note: `This address falls inside the local mobile zone.` };
    const extraMiles = miles - includedMiles;
    const amount = roundUp(extraMiles * extraMileRate);
    return { amount, display: `${money(amount)} added travel`, status: 'outside', note: `This address falls outside the local mobile zone, so an added travel charge applies.` };
  }
  function update(calc) {
    const selected = services[calc.service.value] || services.quick;
    const travel = travelFromMiles(calc.miles ?? null);
    const rush = calc.urgent && calc.urgent.checked ? 50 : 0;
    const total = selected.labor + travel.amount + rush;
    calc.out.innerHTML = money(total) + '<small> starting at</small>';
    const rows = [['Starting service: ' + selected.name, money(selected.labor)], ['Parts', selected.parts], ['Driving distance', calc.miles == null ? 'Enter address' : `${calc.miles.toFixed(1)} miles`], ['Travel', travel.display]];
    if (calc.urgent) rows.push(['Rush or same-day priority', rush ? money(rush) + ' starting' : '$0']);
    calc.items.innerHTML = rows.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
    if (calc.why) calc.why.innerHTML = `<h4>${selected.name}</h4><p>${selected.why}</p><ul>${selected.bullets.map((b) => `<li>${b}</li>`).join('')}</ul><p class="mini-note"><strong>On Point Advantage:</strong> ${selected.note}<br><span>${travel.note}</span></p>`;
  }
  async function calculate(calc) {
    const raw = (calc.address?.value || '').trim();
    if (!raw) { calc.miles = null; calc.result.textContent = 'Enter an address to check your mobile zone and estimated starting point.'; update(calc); return; }
    calc.result.textContent = 'Calculating driving distance...';
    try {
      const destination = await geocodeAddress(raw);
      const miles = await routeMiles(destination);
      calc.miles = miles;
      const travel = travelFromMiles(miles);
      calc.result.innerHTML = travel.status === 'inside'
        ? `<strong>Inside local mobile zone.</strong> Your estimated starting point is shown above.`
        : `<strong>Outside local mobile zone.</strong> An added travel charge applies, and your estimated starting point is shown above.`;
    } catch (err) {
      calc.miles = null;
      calc.result.innerHTML = '<strong>Address could not be verified.</strong> Submit the request and we will confirm travel before dispatch.';
    }
    update(calc);
  }
  activeCalculators.forEach((calc) => {
    calc.miles = null;
    ['change', 'input'].forEach((eventName) => calc.root.addEventListener(eventName, () => update(calc)));
    calc.button?.addEventListener('click', () => calculate(calc));
    calc.address?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); calculate(calc); } });
    calc.address?.addEventListener('blur', () => { if (calc.address.value.trim()) calculate(calc); });
    update(calc);
  });
}

// Service detail accordion: direct links from homepage open the matching service automatically.
const serviceDetails = $$('[data-service-detail]');
function openServiceDetail(target, shouldScroll = false) {
  if (!target) return;
  serviceDetails.forEach((item) => {
    const isTarget = item === target;
    item.classList.toggle('open', isTarget);
    const button = $('.service-detail-toggle', item);
    if (button) button.setAttribute('aria-expanded', String(isTarget));
  });
  target.classList.add('targeted');
  window.setTimeout(() => target.classList.remove('targeted'), 1500);
  if (shouldScroll) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
if (serviceDetails.length) {
  serviceDetails.forEach((item) => {
    const button = $('.service-detail-toggle', item);
    button?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      serviceDetails.forEach((other) => {
        other.classList.remove('open');
        $('.service-detail-toggle', other)?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        if (history.replaceState) history.replaceState(null, '', '#' + item.id);
      }
    });
  });
  const aliases = { '#used-car': '#service-ppi', '#repairs': '#service-brakes' };
  function openFromHash(shouldScroll = true) {
    const rawHash = window.location.hash;
    const hash = aliases[rawHash] || rawHash;
    if (!hash) return;
    const target = document.querySelector(hash + '[data-service-detail]');
    if (target) window.setTimeout(() => openServiceDetail(target, shouldScroll), 80);
  }
  openFromHash(true);
  window.addEventListener('hashchange', () => openFromHash(true));
}
