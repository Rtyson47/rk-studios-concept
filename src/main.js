import Lenis from 'lenis'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

/* ---------------------------------------------------------------------------
   Hero choreography — fire once fonts are ready so type doesn't reflow mid-rise
--------------------------------------------------------------------------- */
const ready = () => document.body.classList.add('is-ready')
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(ready)
  setTimeout(ready, 800) // safety net
} else {
  ready()
}

/* ---------------------------------------------------------------------------
   Image blur-up — fade each frame in as it decodes
--------------------------------------------------------------------------- */
$$('.media img, .hero-media img').forEach((img) => {
  if (img.complete && img.naturalWidth) {
    img.classList.add('is-loaded')
  } else {
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true })
    img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true })
  }
})

/* ---------------------------------------------------------------------------
   Lenis momentum scrolling (native scroll when reduced motion)
--------------------------------------------------------------------------- */
let lenis = null
if (!reduceMotion) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 })
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}
const scrollTo = (target) => {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.2 })
  else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
}

/* In-page anchor links → smooth scroll */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (id === '#' || id.length < 2) return
    const el = $(id)
    if (!el) return
    e.preventDefault()
    closeMenu()
    scrollTo(el)
    history.replaceState(null, '', id)
  })
})

/* ---------------------------------------------------------------------------
   Scroll reveal
--------------------------------------------------------------------------- */
if (reduceMotion) {
  $$('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
      }
    })
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 })
  $$('[data-reveal]').forEach((el) => io.observe(el))
}

/* ---------------------------------------------------------------------------
   Header condense + persistent CTA + light parallax
--------------------------------------------------------------------------- */
const header = $('.site-header')
const ctaFloat = $('[data-cta-float]')
const parallaxEls = $$('[data-parallax]')
let ticking = false

const onScroll = (y) => {
  if (header) header.classList.toggle('is-condensed', y > 40)
  if (ctaFloat) {
    const show = y > window.innerHeight * 0.9
    ctaFloat.classList.toggle('translate-y-24', !show)
    ctaFloat.classList.toggle('opacity-0', !show)
  }
  if (!reduceMotion) {
    parallaxEls.forEach((img) => {
      const r = img.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      img.style.transform = `translate3d(0, ${(-progress * 40).toFixed(2)}px, 0) scale(1.1)`
    })
  }
}
const queueScroll = (y) => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => { onScroll(y); ticking = false })
}
if (lenis) lenis.on('scroll', ({ scroll }) => queueScroll(scroll))
window.addEventListener('scroll', () => queueScroll(window.scrollY), { passive: true })
onScroll(window.scrollY)

/* ---------------------------------------------------------------------------
   Mobile menu
--------------------------------------------------------------------------- */
const menu = $('[data-menu]')
const menuToggle = $('[data-menu-toggle]')
function openMenu() {
  if (!menu) return
  menu.classList.add('is-open')
  menuToggle?.setAttribute('aria-expanded', 'true')
  if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden'
}
function closeMenu() {
  if (!menu || !menu.classList.contains('is-open')) return
  menu.classList.remove('is-open')
  menuToggle?.setAttribute('aria-expanded', 'false')
  if (lenis) lenis.start(); else document.body.style.overflow = ''
}
menuToggle?.addEventListener('click', openMenu)
$('[data-menu-close]')?.addEventListener('click', closeMenu)

/* ---------------------------------------------------------------------------
   Custom "View" cursor (fine pointers only)
--------------------------------------------------------------------------- */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
if (finePointer && !reduceMotion) {
  const cursor = $('[data-cursor-el]')
  if (cursor) {
    document.documentElement.classList.add('has-custom-cursor')
    let x = window.innerWidth / 2, y = window.innerHeight / 2
    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }, { passive: true })
    $$('[data-cursor="view"]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'))
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'))
    })
  }
}

/* ---------------------------------------------------------------------------
   Lightbox with FLIP open/close, keyboard + swipe
--------------------------------------------------------------------------- */
const lb = $('[data-lightbox-root]')
if (lb) {
  const lbImg = $('[data-lightbox-img]', lb)
  const lbCaption = $('[data-lightbox-caption]', lb)
  const lbCounter = $('[data-lightbox-counter]', lb)
  const items = $$('[data-lightbox]').map((btn) => ({
    btn,
    img: $('img', btn),
    full: $('img', btn).getAttribute('src'),
    title: btn.dataset.title || '',
    meta: btn.dataset.meta || '',
    alt: $('img', btn).getAttribute('alt') || '',
  }))
  let current = -1
  let opener = null

  const setMeta = () => {
    const it = items[current]
    lbCaption.textContent = it.meta ? `${it.title} — ${it.meta}` : it.title
    lbCounter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
  }

  function flipFrom(thumb) {
    if (reduceMotion) return
    const first = thumb.getBoundingClientRect()
    const last = lbImg.getBoundingClientRect()
    if (!last.width) return
    const dx = (first.left + first.width / 2) - (last.left + last.width / 2)
    const dy = (first.top + first.height / 2) - (last.top + last.height / 2)
    const sx = first.width / last.width
    const sy = first.height / last.height
    lbImg.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6 }, { transform: 'none', opacity: 1 }],
      { duration: 540, easing: EASE }
    )
  }

  function show(index, thumb) {
    current = (index + items.length) % items.length
    const it = items[current]
    lbImg.src = it.full
    lbImg.alt = it.alt
    setMeta()
    const run = () => { if (thumb) flipFrom(thumb) }
    if (lbImg.complete && lbImg.naturalWidth) requestAnimationFrame(run)
    else lbImg.onload = () => requestAnimationFrame(run)
  }

  function open(index) {
    opener = items[index].btn
    lb.classList.add('is-open')
    lb.setAttribute('aria-hidden', 'false')
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden'
    show(index, items[index].img)
    $('[data-lightbox-close]', lb)?.focus()
  }

  function navigate(dir) {
    if (reduceMotion) { show(current + dir); return }
    lbImg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease' }).finished.then(() => {
      show(current + dir)
      lbImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE })
    })
  }

  function close() {
    const thumb = items[current]?.img
    const finish = () => {
      lb.classList.remove('is-open')
      lb.setAttribute('aria-hidden', 'true')
      if (lenis) lenis.start(); else document.body.style.overflow = ''
      opener?.focus()
    }
    if (reduceMotion || !thumb) { finish(); return }
    const first = lbImg.getBoundingClientRect()
    const last = thumb.getBoundingClientRect()
    const dx = (last.left + last.width / 2) - (first.left + first.width / 2)
    const dy = (last.top + last.height / 2) - (first.top + first.height / 2)
    const sx = last.width / first.width
    const sy = last.height / first.height
    $('[data-lightbox-backdrop]', lb).style.opacity = '0'
    lbImg.animate(
      [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.4 }],
      { duration: 460, easing: EASE }
    ).finished.then(() => { $('[data-lightbox-backdrop]', lb).style.opacity = ''; finish() })
  }

  items.forEach((it, i) => it.btn.addEventListener('click', () => open(i)))
  $('[data-lightbox-close]', lb)?.addEventListener('click', close)
  $('[data-lightbox-prev]', lb)?.addEventListener('click', () => navigate(-1))
  $('[data-lightbox-next]', lb)?.addEventListener('click', () => navigate(1))
  $('[data-lightbox-backdrop]', lb)?.addEventListener('click', close)

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowRight') navigate(1)
    else if (e.key === 'ArrowLeft') navigate(-1)
    else if (e.key === 'Tab') {
      // trap focus among the dialog controls
      const f = [$('[data-lightbox-close]', lb), $('[data-lightbox-prev]', lb), $('[data-lightbox-next]', lb)]
      const i = f.indexOf(document.activeElement)
      e.preventDefault()
      f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i >= f.length - 1 ? 0 : i + 1)].focus()
    }
  })

  // touch: swipe horizontal to navigate, swipe down to close
  let tsx = 0, tsy = 0
  lb.addEventListener('touchstart', (e) => { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY }, { passive: true })
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tsx
    const dy = e.changedTouches[0].clientY - tsy
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1)
    else if (dy > 80) close()
  }, { passive: true })
}

/* ---------------------------------------------------------------------------
   Inquiry form — validate, then build a pre-filled WhatsApp message
   (no backend). Point data-endpoint at Formspree/Netlify to capture by email.
--------------------------------------------------------------------------- */
const form = $('[data-inquiry]')
if (form) {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const setError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`)?.closest('.field')
    const out = form.querySelector(`[data-error-for="${name}"]`)
    if (field) field.toggleAttribute('data-error', !!msg)
    if (out) out.textContent = msg || ''
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form).entries())
    let firstBad = null
    const checks = [
      ['name', !data.name?.trim() && 'Please add your name'],
      ['email', !data.email?.trim() ? 'Please add your email' : !emailRe.test(data.email) && "That email doesn't look right"],
      ['shoot', !data.shoot && 'Pick a shoot type'],
      ['message', !data.message?.trim() && 'A sentence or two helps'],
    ]
    checks.forEach(([n, msg]) => { setError(n, msg || ''); if (msg && !firstBad) firstBad = n })
    if (firstBad) { form.querySelector(`[name="${firstBad}"]`)?.focus(); return }

    const lines = [
      'New shoot inquiry — RK Studios',
      '———————————',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Shoot: ${data.shoot}`,
      `Date: ${data.date || 'Flexible'}`,
      '',
      data.message,
    ].join('\n')
    const waUrl = `https://wa.me/13459178203?text=${encodeURIComponent(lines)}`

    const successWa = $('[data-success-wa]')
    if (successWa) successWa.href = waUrl
    const success = $('[data-success]')
    form.style.display = 'none'
    success?.classList.add('is-visible')
    success?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
  })

  // clear an error as the visitor fixes it
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    el.addEventListener('input', () => setError(el.name, ''))
  })
}

/* ---------------------------------------------------------------------------
   Footer year
--------------------------------------------------------------------------- */
const yearEl = $('[data-year]')
if (yearEl) yearEl.textContent = new Date().getFullYear()
