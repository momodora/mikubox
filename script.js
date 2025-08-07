let allImages = [];
let activeTag = null;

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
    allImages = data;
    renderTags(allImages);
    renderGallery(allImages);
    setupSearch();
  });

document.getElementById('randomBtn').addEventListener('click', () => {
  if (allImages.length === 0) return;

  const randomIndex = Math.floor(Math.random() * allImages.length);
  const randomImg = allImages[randomIndex];

  // 使用模态框展示而不是跳转
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const downloadBtn = document.getElementById('download-btn');

  modalImg.src = 'images/' + randomImg.filename;
  downloadBtn.href = 'images/' + randomImg.filename;
  modal.style.display = 'flex';
});


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
