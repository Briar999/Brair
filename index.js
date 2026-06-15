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

// ========== 用户登录状态控制导航栏（修复版）==========
(async function checkLoginStatus() {
    // 替换为真实的 Supabase 密钥（从 login.html 中复制）
    const SUPABASE_URL = 'https://qwddwbwgichjhrxmswgk.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_nq5d-vnTaJ46JA0MfY-qmQ_kUqPi-Sq';
    
    // 初始化 Supabase 客户端
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 获取当前登录用户
    const { data: { user } } = await supabase.auth.getUser();
    const navProfile = document.getElementById('navProfile');
    const navAuth = document.getElementById('navAuth');

    if (!navProfile || !navAuth) return; // 避免元素不存在时报错

    if (user) {
        // ✅ 已登录状态：显示个人主页、替换登录为退出
        navProfile.style.display = 'inline-block';
        navAuth.textContent = '退出';
        navAuth.href = '#';
        // 绑定退出事件
        navAuth.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.reload(); // 刷新页面恢复未登录状态
        });
    } else {
        // ❌ 未登录状态：隐藏个人主页、显示登录按钮
        navProfile.style.display = 'none';
        navAuth.textContent = '登录';
        navAuth.href = 'login.html'; // 点击跳转登录页
    }
})();