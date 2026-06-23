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

// 禁止前3秒内页面滚动
let scrollDisabled = true;
const disableScroll = (e) => {
    if (scrollDisabled) {
        e.preventDefault();
        return false;
    }
};
document.addEventListener('wheel', disableScroll, { passive: false });
document.addEventListener('touchmove', disableScroll, { passive: false });
setTimeout(() => {
    scrollDisabled = false;
    document.removeEventListener('wheel', disableScroll);
    document.removeEventListener('touchmove', disableScroll);
}, 3000);

// ========== 用户登录状态控制导航栏 ==========
(async function checkLoginStatus() {
    const SUPABASE_URL = 'https://qwddwbwgichjhrxmswgk.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_nq5d-vnTaJ46JA0MfY-qmQ_kUqPi-Sq';
    
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: { user } } = await supabase.auth.getUser();
    const navProfile = document.getElementById('navProfile');
    const navAuth = document.getElementById('navAuth');

    if (!navProfile || !navAuth) return;

    if (user) {
        navProfile.style.display = 'inline-block';
        navAuth.textContent = '退出';
        navAuth.href = '#';
        navAuth.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.reload();
        });
    } else {
        navProfile.style.display = 'none';
        navAuth.textContent = '登录';
        navAuth.href = 'login.html';
    }
})();

// ========== 加载导航栏头像 ==========
async function loadNavbarAvatar() {
    const SUPABASE_URL = 'https://qwddwbwgichjhrxmswgk.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_nq5d-vnTaJ46JA0MfY-qmQ_kUqPi-Sq';
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    const DEFAULT_AVATAR_URL = 'https://qwddwbwgichjhrxmswgk.supabase.co/storage/v1/object/public/avatars/1.png';
    const navAvatar = document.getElementById('navAvatar');
    
    if (user && navAvatar) {
        const avatarUrl = user.user_metadata?.avatar_url || DEFAULT_AVATAR_URL;
        navAvatar.src = avatarUrl;
        navAvatar.style.display = 'block';
        navAvatar.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
        
        // 监听用户信息变化
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'USER_UPDATED' && session?.user) {
                const newAvatarUrl = session.user.user_metadata?.avatar_url || DEFAULT_AVATAR_URL;
                navAvatar.src = newAvatarUrl;
            }
        });
    } else if (navAvatar) {
        navAvatar.style.display = 'none';
    }
}

// 监听跨页面头像更新
window.addEventListener('storage', (e) => {
    if (e.key === 'avatarUpdated') {
        loadNavbarAvatar();
    }
});

loadNavbarAvatar();
// ========== 加载首页活动公告 ==========
async function loadHomeEvents() {
    const SUPABASE_URL = 'https://qwddwbwgichjhrxmswgk.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_nq5d-vnTaJ46JA0MfY-qmQ_kUqPi-Sq';
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
    
    const container = document.getElementById('homeEventList');
    if (error || !data || data.length === 0) {
        container.innerHTML = '<div class="event-item"><div class="event-content"><p style="color:#8a7a64;">暂无活动公告</p></div></div>';
        return;
    }
    
    container.innerHTML = data.map(event => `
        <div class="event-item" onclick="window.location.href='event_detail.html?id=${event.id}'" style="cursor:pointer;">
            <div class="event-date">${event.event_date || '即将开始'}</div>
            <div class="event-content">
                <h4>${event.title}</h4>
                <p>${event.content ? event.content.substring(0, 50) + '...' : ''}</p>
            </div>
        </div>
    `).join('');
}

// 在页面加载时调用
document.addEventListener('DOMContentLoaded', function() {
    if (typeof loadHomeEvents === 'function') {
        loadHomeEvents();
    }
});