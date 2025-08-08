let allImages = [];
let activeTag = null;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 根据窗口宽度设置列数
function updateGridColumns() {
  const gallery = document.getElementById('gallery');
  let cols = 3; // 默认 3 列
  const width = window.innerWidth;

  if (width >= 1280) cols = 8;
  else if (width >= 1024) cols = 7;
  else if (width >= 768) cols = 6;
  else if (width >= 640) cols = 5;
  else if (width >= 480) cols = 4;

  gallery.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function renderGallery(images) {
  const container = document.getElementById('gallery');
  container.innerHTML = '';
  images.forEach(item => {
    const div = document.createElement('div');
    div.className = 'grid-item';

    const img = document.createElement('img');
    img.src = 'images/' + item.filename;
    img.alt = item.label;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = item.label;

    div.appendChild(img);
    div.appendChild(label);
    container.appendChild(div);
  });

  updateGridColumns(); // 渲染后更新列数
}

function renderTags(images) {
  const tagSet = new Set();
  images.forEach(img => img.tags.forEach(tag => tagSet.add(tag)));

  const tagsDiv = document.getElementById('tags');
  tagsDiv.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.textContent = '全部';
  allBtn.className = 'tag-btn';
  allBtn.onclick = () => {
    activeTag = null;
    document.getElementById('search').value = '';
    renderGallery(allImages);
  };
  tagsDiv.appendChild(allBtn);

  tagSet.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.className = 'tag-btn';
    btn.onclick = () => {
      activeTag = tag;
      document.getElementById('search').value = '';
      renderGallery(allImages.filter(img => img.tags.includes(tag)));
    };
    tagsDiv.appendChild(btn);
  });
}

function setupSearch() {
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword === '') {
      renderGallery(allImages);
    } else {
      const results = allImages.filter(item =>
        item.label.toLowerCase().includes(keyword) ||
        item.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
      renderGallery(results);
    }
  });
}

fetch('images.json')
  .then(res => res.json())
  .then(data => {
    allImages = shuffleArray(data);
    renderTags(allImages);
    renderGallery(allImages);
    setupSearch();
  });

// 监听窗口大小变化动态调整列数
window.addEventListener('resize', updateGridColumns);

// 模态框功能
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalLabel = document.getElementById('modal-label');
const downloadBtn = document.getElementById('download-btn');
const closeBtn = document.querySelector('.close-btn');

// 点击图片 → 打开模态框
document.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG' && e.target.closest('.grid-item')) {
    const src = e.target.getAttribute('src');
    const label = e.target.nextElementSibling?.textContent || '图片';

    modalImg.src = src;
    modalLabel.textContent = label;
    downloadBtn.href = src;

    modal.style.display = 'flex';
  }

  if (e.target === modal || e.target === closeBtn) {
    modal.style.display = 'none';
    modalImg.src = '';
    modalLabel.textContent = '';
    downloadBtn.href = '#';
  }
});

// 随机一个 → 也使用模态框展示
document.getElementById('randomBtn').addEventListener('click', () => {
  if (allImages.length === 0) return;

  const randomIndex = Math.floor(Math.random() * allImages.length);
  const randomImg = allImages[randomIndex];

  modalImg.src = 'images/' + randomImg.filename;
  modalLabel.textContent = randomImg.label || '';
  downloadBtn.href = 'images/' + randomImg.filename;
  modal.style.display = 'flex';
});