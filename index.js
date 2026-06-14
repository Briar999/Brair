// 初始化轮播图
const swiper = new Swiper('.hero-swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    speed: 800,
    slidesPerView: 1,
    centeredSlides: false
});

// 禁止前3秒内页面滚动（针对鼠标滚轮和触摸滑动）
let scrollDisabled = true;
const disableScroll = (e) => {
    if (scrollDisabled) {
        e.preventDefault();
        return false;
    }
};
// 监听 wheel 和 touchmove 事件
document.addEventListener('wheel', disableScroll, { passive: false });
document.addEventListener('touchmove', disableScroll, { passive: false });
// 3秒后解除禁止滚动
setTimeout(() => {
    scrollDisabled = false;
    document.removeEventListener('wheel', disableScroll);
    document.removeEventListener('touchmove', disableScroll);
}, 3000);