       lucide.createIcons();

        function setView(view) {
            const splitContainer = document.getElementById('splitViewContainer');
            const gridContainer = document.getElementById('cameraGrid');
            const buttons = ['btn-split', 'btn-grid3', 'btn-grid4', 'btn-fullscreen'];
            
            // Hapus active class dari semua butten
            buttons.forEach(btn => {
                document.getElementById(btn).classList.remove('active');
            });

            switch(view) {
                case 'split':
                    splitContainer.style.display = 'grid';
                    gridContainer.style.display = 'none';
                    document.getElementById('btn-split').classList.add('active');
                    break;
                case 'grid3':
                    splitContainer.style.display = 'none';
                    gridContainer.style.display = 'grid';
                    gridContainer.className = 'grid grid-cols-3 gap-4 h-[calc(100vh-200px)]';
                    document.getElementById('btn-grid3').classList.add('active');
                    break;
                case 'grid4':
                    splitContainer.style.display = 'none';
                    gridContainer.style.display = 'grid';
                    gridContainer.className = 'grid grid-cols-4 gap-4 h-[calc(100vh-200px)]';
                    document.getElementById('btn-grid4').classList.add('active');
                    break;
                case 'fullscreen':
                    splitContainer.style.display = 'none';
                    gridContainer.style.display = 'grid';
                    gridContainer.className = 'grid grid-cols-1 gap-4 h-[calc(100vh-200px)]';
                    document.getElementById('btn-fullscreen').classList.add('active');
                    break;
            }
        }

        function updateTime() {
            const now = new Date();
            const timeString = now.toISOString().slice(0, 19).replace('T', ' ');
            document.getElementById('currentTime').textContent = timeString;
            document.getElementById('lastUpdate').textContent = timeString;
        }

        setInterval(updateTime, 1000);
        updateTime(); 

        // Tampilan  Awalnya di split view
        setView('split');