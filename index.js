/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }

}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});

/* -----------------------------------------
  Carousel
 ---------------------------------------- */

function pauseVideo(item) {
  const iframe = item.querySelector('iframe');
  if (iframe) {
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*'
    );
  }
}

function initCarousel(carouselEl) {
  const items = carouselEl.querySelectorAll('.carousel-inner .item');
  const indicators = carouselEl.querySelectorAll('.carousel-indicators li');
  const prevBtn = carouselEl.querySelector('.carousel-control.left');
  const nextBtn = carouselEl.querySelector('.carousel-control.right');

  let current = [...items].findIndex(item => item.classList.contains('active'));
  if (current === -1) current = 0;

  function goTo(index) {
    pauseVideo(items[current]);
    console.log('goTo called', { from: current, to: index, itemsLength: items.length });
    items[current].classList.remove('active');
    indicators[current]?.classList.remove('active');

    current = (index + items.length) % items.length;

    console.log('new current', current, items[current]);
    items[current].classList.add('active');
    indicators[current]?.classList.add('active');
  }

  prevBtn?.addEventListener('click', e => {
    e.preventDefault();
    goTo(current - 1);
  });

  nextBtn?.addEventListener('click', e => {
    e.preventDefault();
    goTo(current + 1);
  });

  indicators.forEach((li, i) => {
    li.addEventListener('click', () => goTo(i));
  });
}

document.querySelectorAll('.carousel').forEach(initCarousel);