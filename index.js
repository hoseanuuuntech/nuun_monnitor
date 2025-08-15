 function toggleDarkMode() {
      const body = document.body;
      const header = document.querySelector('header');
      const viewButtonsContainer = document.getElementById('viewButtonsContainer');
      const buttons = document.querySelectorAll('.view-button');
      const isDark = body.classList.contains('dark-mode');

      if (isDark) {
        // Ganti ke light mode
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        header.classList.remove('header-dark');
        header.classList.add('header-light');
          body.style.color = '#000';

        // Update view buttons container
        viewButtonsContainer.classList.remove('border-gray-800');
        viewButtonsContainer.classList.add('border-gray-300');
        
        // Update buttons
        buttons.forEach(btn => {
          btn.classList.remove('btn-dark');
          btn.classList.add('btn-light');
              btn.style.color = '#000'; 

        });
      } else {
        // Ganti ke dark mode
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        header.classList.remove('header-light');
        header.classList.add('header-dark');
          body.style.color = '#fff';

        // Update tampilan buttons container
        viewButtonsContainer.classList.remove('border-gray-300');
        viewButtonsContainer.classList.add('border-gray-800');
        
        // Update buttons
        buttons.forEach(btn => {
          btn.classList.remove('btn-light');
          btn.classList.add('btn-dark');
              btn.style.color = '#fff'; 

        });
      }
      
      lucide.createIcons();
    }

    function setView(view) {
      const splitContainer = document.getElementById('splitViewContainer');
      const gridContainer = document.getElementById('cameraGrid');
      const buttons = ['btn-split', 'btn-grid3', 'btn-grid4', 'btn-fullscreen'];
      
      // Remove active class from all buttons
      buttons.forEach(btn => {
        document.getElementById(btn).classList.remove('active');
      });

      switch(view) {
        case 'split':
          splitContainer.style.display = 'grid';
          gridContainer.style.display = 'none';
          document.getElementById('btn-split').classList.add('active');
          addCameraSwapListeners();
          break;
        case 'grid3':
          splitContainer.style.display = 'none';
          gridContainer.style.display = 'grid';
          gridContainer.className = 'grid grid-cols-3 gap-4 h-full';
          document.getElementById('btn-grid3').classList.add('active');
          break;
        case 'grid4':
          splitContainer.style.display = 'none';
          gridContainer.style.display = 'grid';
          gridContainer.className = 'grid grid-cols-4 gap-4 h-full';
          document.getElementById('btn-grid4').classList.add('active');
          break;
        case 'fullscreen':
          splitContainer.style.display = 'none';
          gridContainer.style.display = 'grid';
          gridContainer.className = 'grid grid-cols-1 gap-4 h-full';
          document.getElementById('btn-fullscreen').classList.add('active');
          break;
      }
      
      lucide.createIcons();
    }

    function updateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      document.getElementById('currentTime').textContent = timeString;
    }

   function setMainCameraFromSide(cameraElement) {
  const mainContainer = document.querySelector('.split-main-camera');
  if (!mainContainer || !cameraElement) return;

  // Animasi keluar
  mainContainer.classList.add('fade-out');
  cameraElement.classList.add('fade-out');

  setTimeout(() => {
    const oldCamera = mainContainer.cloneNode(true);
    const newCamera = cameraElement.cloneNode(true);

    mainContainer.replaceWith(newCamera);
    cameraElement.replaceWith(oldCamera);

    newCamera.classList.add('split-main-camera', 'fade-in');
    oldCamera.classList.remove('split-main-camera');
    oldCamera.classList.add('fade-in');

    addCameraSwapListeners();
    lucide.createIcons();

    // Hapus class animasi setelah selesai
    setTimeout(() => {
      newCamera.classList.remove('fade-in');
      oldCamera.classList.remove('fade-in');
    }, 400);
  }, 300);
}


    function addCameraSwapListeners() {
      const sideCameras = document.querySelectorAll('.split-side-cameras .split-view-camera');
      sideCameras.forEach(cam => {
        cam.addEventListener('click', () => setMainCameraFromSide(cam));
      });
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Initial setup
    document.addEventListener('DOMContentLoaded', () => {   addCameraSwapListeners();
      lucide.createIcons();
      setView('split');
    });