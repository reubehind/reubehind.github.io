(() => {
  const gallery = document.querySelector('.case-gallery');
  if (!gallery) return;
  const images = [...gallery.querySelectorAll('img')];
  const icon = kind => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter">${kind === 'close' ? '<path d="m6 6 12 12M18 6 6 18"/>' : kind === 'prev' ? '<path d="m15 5-7 7 7 7"/>' : '<path d="m9 5 7 7-7 7"/>'}</svg>`;
  document.querySelectorAll('.case-controls [data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', '作品图片全屏查看');
  dialog.innerHTML = `<header><span class="viewer-status" aria-live="polite"></span><div class="case-controls"><button type="button" aria-label="上一张图片">${icon('prev')}</button><button type="button" aria-label="下一张图片">${icon('next')}</button><button type="button" aria-label="关闭图片，返回案例">${icon('close')}</button></div></header><div class="viewer-stage"><img alt=""></div>`;
  document.body.append(dialog);
  const [prev, next, close] = dialog.querySelectorAll('button');
  const fullImage = dialog.querySelector('.viewer-stage img');
  let current = 0, trigger;
  function show(index) {
    current = (index + images.length) % images.length;
    fullImage.src = images[current].src;
    fullImage.alt = images[current].alt;
    dialog.querySelector('.viewer-status').textContent = `${current + 1} / ${images.length}`;
    prev.disabled = next.disabled = images.length < 2;
  }
  images.forEach((img, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'gallery-open';
    button.setAttribute('aria-label', `全屏查看：${img.alt}`);
    img.replaceWith(button); button.append(img);
    button.addEventListener('click', () => {
      trigger = button; show(index); dialog.showModal();
      document.body.classList.add('viewer-open'); close.focus();
    });
  });
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    trigger?.focus({preventScroll:true});
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
})();
