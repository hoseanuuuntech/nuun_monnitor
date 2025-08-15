let currentView = 'split';
let currentMainCamera = 0;
let isTransitioning = false;

const cameraData = [
  { id: 'lobby', name: 'Lobby Lift', status: 'online', video: 'BigBuckBunny.mp4' },
  { id: 'entrance', name: 'Entrance', status: 'online', video: 'ElephantsDream.mp4' },
  { id: 'parking', name: 'Parking', status: 'online', video: 'ForBiggerBlazes.mp4' },
  { id: 'storage', name: 'Storage', status: 'offline', video: 'ForBiggerEscapes.mp4' },
  { id: 'hallway', name: 'Hallway', status: 'online', video: 'Sintel.mp4' },
  { id: 'office', name: 'Office', status: 'online', video: 'ForBiggerFun.mp4' },
  { id: 'kitchen', name: 'Kitchen', status: 'online', video: 'ForBiggerJoyrides.mp4' },
  { id: 'roof', name: 'Rooftop', status: 'online', video: 'ForBiggerMeltdowns.mp4' },
  { id: 'basement', name: 'Basement', status: 'offline', video: 'TearsOfSteel.mp4' }
];

function updateTimestamp() {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
  const elements = document.querySelectorAll('.camera-timestamp');
  elements.forEach(el => {
    const camera = el.closest('.camera-feed');
    if (camera && !camera.querySelector('.offline-overlay')) {
      el.textContent = timestamp;
    }
  });
}

function setView(viewType) {
  // force reset
  isTransitioning = false;

  currentView = viewType;
  const grid = document.getElementById('cameraGrid');
  const buttons = document.querySelectorAll('.view-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${viewType}`).classList.add('active');

  grid.className = `camera-grid ${
    viewType === 'split'
      ? 'split-view'
      : viewType === 'grid3'
      ? 'grid-3x3'
      : viewType === 'grid4'
      ? 'grid-4x4'
      : 'fullscreen'
  }`;

  if (viewType === 'split') {
    grid.classList.add('grid-rows-1', 'overflow-hidden', 'gap-2', 'my-4', 'mx-2');
    setupSplitView();
  } else {
    setupGridView(viewType);
  }

  window.lucide && window.lucide.createIcons();

}

function setupSplitView() {
  const grid = document.getElementById('cameraGrid');
  grid.innerHTML = `
    <div class="main-camera camera-feed active" id="mainCamera" data-camera="lobby">
      <video class="camera-video" autoplay muted loop>
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
      </video>
      <div class="camera-overlay"></div>
      <div class="camera-timestamp">2025-08-15 08:08:47</div>
      <div class="camera-info"><div class="status-indicator status-online"></div><span>Lobby Lift</span></div>
    </div>
    <div class="side-cameras">
      ${cameraData.slice(1, 4).map(camera => `
        <div class="camera-feed" data-camera="${camera.id}" onclick="switchToMain(this)">
          <video class="camera-video" autoplay muted loop ${camera.status === 'offline' ? 'style="filter: grayscale(100%)"' : ''}>
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${camera.video}" type="video/mp4">
          </video>
          <div class="camera-overlay"></div>
          ${camera.status === 'offline' ? '<div class="offline-overlay"><span>OFFLINE</span></div>' : ''}
          <div class="camera-timestamp">${camera.status === 'offline' ? '--:--:--' : '2025-08-15 08:08:47'}</div>
          <div class="camera-info"><div class="status-indicator status-${camera.status}"></div><span>${camera.name}</span></div>
        </div>
      `).join('')}
    </div>
  `;
}

function setupGridView(viewType) {
  document.querySelectorAll('.camera-feed.active').forEach(el => el.classList.remove('active'));

  const grid = document.getElementById('cameraGrid');
  const max = cameraData.length;
  const cameraCount = viewType === 'grid3' ? Math.min(9, max) : viewType === 'grid4' ? Math.min(16, max) : 1;
  const cameras = viewType === 'fullscreen' ? [cameraData[currentMainCamera]] : cameraData.slice(0, cameraCount);

  grid.innerHTML = cameras.map(camera => `
    <div class="camera-feed ${viewType === 'fullscreen' ? 'active' : ''}" data-camera="${camera.id}" 
         onclick="${viewType !== 'fullscreen' ? 'switchToMain(this)' : ''}">
      <video class="camera-video" autoplay muted loop ${camera.status === 'offline' ? 'style="filter: grayscale(100%)"' : ''}>
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${camera.video}" type="video/mp4">
      </video>
      <div class="camera-overlay"></div>
      ${camera.status === 'offline' ? '<div class="offline-overlay"><span>OFFLINE</span></div>' : ''}
      <div class="camera-timestamp">${camera.status === 'offline' ? '--:--:--' : '2025-08-15 08:08:47'}</div>
      <div class="camera-info"><div class="status-indicator status-${camera.status}"></div><span>${camera.name}</span></div>
    </div>
  `).join('');
}

function switchToMain(element) {
  if (isTransitioning || currentView === 'fullscreen') return;
  isTransitioning = true;

  const mainCamera = document.getElementById('mainCamera') || document.querySelector('.camera-feed.active');
  if (!mainCamera) return;

  element.classList.add('camera-transitioning');
  mainCamera.classList.add('camera-transitioning');

  setTimeout(() => {
    const tmp = mainCamera.innerHTML;
    const tmpData = mainCamera.getAttribute('data-camera');

    mainCamera.innerHTML = element.innerHTML;
    mainCamera.setAttribute('data-camera', element.getAttribute('data-camera'));

    element.innerHTML = tmp;
    element.setAttribute('data-camera', tmpData);

    element.classList.remove('camera-transitioning');
    mainCamera.classList.remove('camera-transitioning');

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }, 300);
}

function nextCamera() {
  if (currentView === 'split') {
    const sideCameras = document.querySelectorAll('.side-cameras .camera-feed');
    if (sideCameras.length) switchToMain(sideCameras[Math.floor(Math.random() * sideCameras.length)]);
  } else if (currentView === 'fullscreen') {
    currentMainCamera = (currentMainCamera + 1) % cameraData.length;
    setupGridView('fullscreen');
    window.lucide && window.lucide.createIcons();

  }
}

function previousCamera() {
  if (currentView === 'split') {
    const sideCameras = document.querySelectorAll('.side-cameras .camera-feed');
    if (sideCameras.length) switchToMain(sideCameras[Math.floor(Math.random() * sideCameras.length)]);
  } else if (currentView === 'fullscreen') {
    currentMainCamera = (currentMainCamera - 1 + cameraData.length) % cameraData.length;
    setupGridView('fullscreen');
    window.lucide && window.lucide.createIcons();

  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft': previousCamera(); break;
    case 'ArrowRight': nextCamera(); break;
    case '1': setView('split'); break;
    case '2': setView('grid3'); break;
    case '3': setView('grid4'); break;
    case '4': setView('fullscreen'); break;
  }
});

// Auto-hide toolbar on idle
let hideToolbarTimeout;

function hideToolbar() {
  document.querySelector('.view-selector').style.top = '-70px';
  document.querySelector('.control-buttons').style.bottom = '-60px';
}

function showToolbar() {
  document.querySelector('.view-selector').style.top = '0';
  document.querySelector('.control-buttons').style.bottom = '20px';
}

window.addEventListener('mousemove', () => {
  showToolbar();
  clearTimeout(hideToolbarTimeout);
  hideToolbarTimeout = setTimeout(hideToolbar, 3000); // 3 detik jika mouse tidak gerak maka hidden
});

window.onload = () => {
  setInterval(updateTimestamp, 1000);
  updateTimestamp();
  setView('split');
  window.lucide && window.lucide.createIcons();

};
