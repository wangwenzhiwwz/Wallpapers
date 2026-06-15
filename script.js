// =========================================
// 1. 壁纸数据源 (自动支持跨年)
// =========================================
const wallpapers = [
    "images/2026-03-01 230302.png",
    "images/2026-03-02 233115.png",
    "images/2026-03-02 233219.png",
    "images/2026-02-09 073452.png",
    "images/2026-03-02 233125.png",
    "images/2026-03-02 233106.png",
    "images/2026-02-09 073516.png",
    "images/2026-03-01 230325.png",
    "images/2026-03-01 230835.png",
    "images/2026-03-01 230319.png",
    "images/2026-03-01 230902.png",
    "images/2026-03-02 233223.png"
];

// 全屏预览状态机
let currentImgIndex = 0;

// =========================================
// 2. DOM 元素获取
// =========================================
const yearNavMenu = document.getElementById('year-nav-menu');
const galleryWrapper = document.getElementById('gallery-wrapper');
const modal = document.getElementById('preview-modal');
const fullscreenImg = document.getElementById('fullscreen-img');
const modalDownloadLink = document.getElementById('modal-download-link');
const prevBtn = document.getElementById('prev-img-btn');
const nextBtn = document.getElementById('next-img-btn');

// =========================================
// 3. 数据层级清洗与降序排列
// =========================================
wallpapers.sort((a, b) => b.localeCompare(a));

const groupedWallpapers = wallpapers.reduce((acc, currentPath) => {
    const yearMatch = currentPath.match(/(\d{4})-\d{2}-\d{2}/);
    const year = yearMatch ? yearMatch[1] : "其他";
    if (!acc[year]) acc[year] = [];
    acc[year].push(currentPath);
    return acc;
}, {});

const sortedYears = Object.keys(groupedWallpapers).sort((a, b) => b - a);

// =========================================
// 4. DOM 渲染引擎
// =========================================
sortedYears.forEach(year => {
    // 渲染上方 Tab
    const navTab = document.createElement('a');
    navTab.href = `#year-sec-${year}`;
    navTab.className = 'year-tab';
    navTab.textContent = `${year} 年`;
    yearNavMenu.appendChild(navTab);

    // 创建 Section 区块
    const section = document.createElement('section');
    section.id = `year-sec-${year}`;
    section.className = 'year-section';

    const title = document.createElement('h2');
    title.className = 'year-title';
    title.textContent = `${year} 年`;
    section.appendChild(title);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'gallery-container';

    groupedWallpapers[year].forEach(imagePath => {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';
        // 改为传递当前图片在总全局数组中的位置索引
        card.addEventListener('click', () => {
            const index = wallpapers.indexOf(imagePath);
            openFullscreenPreview(index);
        });

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Wallpaper ${year}`;
        img.loading = "lazy";

        const overlay = document.createElement('div');
        overlay.className = 'card-download-overlay';
        overlay.textContent = '全屏预览';

        card.appendChild(img);
        card.appendChild(overlay);
        gridContainer.appendChild(card);
    });

    section.appendChild(gridContainer);
    galleryWrapper.appendChild(section);
});

// =========================================
// 5. 核心切换与沉浸式全屏逻辑
// =========================================

// 执行核心视图更新
function updatePreviewContent() {
    const imageSrc = wallpapers[currentImgIndex];
    fullscreenImg.src = imageSrc;
    modalDownloadLink.href = imageSrc;

    // 边界阻断：如果是第一张则隐藏左箭头，最后一张隐藏右箭头
    prevBtn.style.visibility = currentImgIndex === 0 ? 'hidden' : 'visible';
    nextBtn.style.visibility = currentImgIndex === wallpapers.length - 1 ? 'hidden' : 'visible';
}

function openFullscreenPreview(index) {
    currentImgIndex = index;
    updatePreviewContent();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeFullscreenPreview() {
    modal.style.display = 'none';
    setTimeout(() => {
        if(modal.style.display === 'none') fullscreenImg.src = '';
    }, 200);
    document.body.style.overflow = 'auto'; 
}

// 导航步进器
function nextImage() {
    if (currentImgIndex < wallpapers.length - 1) {
        currentImgIndex++;
        updatePreviewContent();
    }
}

function prevImage() {
    if (currentImgIndex > 0) {
        currentImgIndex--;
        updatePreviewContent();
    }
}

// =========================================
// 6. 全局多维交互绑定
// =========================================

// A. 左右实体按钮监听 (阻止冒泡，避免触发底层关闭事件)
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

// B. 智能关闭区分配：点击背景/图片本体关闭，点击下载按钮保持
modal.addEventListener('click', (e) => {
    if (e.target !== modalDownloadLink && e.target !== prevBtn && e.target !== nextBtn) {
        closeFullscreenPreview();
    }
});

// C. 桌面端键盘联动
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowRight' || e.key === 'd') nextImage();
        if (e.key === 'ArrowLeft' || e.key === 'a') prevImage();
        if (e.key === 'Escape') closeFullscreenPreview();
    }
});

// D. 移动端 Touch 经典手势检测
let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
    const swipeThreshold = 50; // 触发切换的最小滑动像素值
    if (touchEndX < touchStartX - swipeThreshold) {
        nextImage(); // 向左滑 -> 看下一张
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prevImage(); // 向右滑 -> 看上一张
    }
}