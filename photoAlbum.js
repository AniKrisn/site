const photos = [
    'photos/1.jpg',
    'photos/2.jpg',
    'photos/3.jpg',
    'photos/4.jpg',
    'photos/5.jpg',
    'photos/6.jpg',
    'photos/7.jpg',
    'photos/8.jpg',
    'photos/9.jpg',
    'photos/10.jpg',
    'photos/11.jpg',
    'photos/12.jpg',
    'photos/13.jpg',
    'photos/14.jpg',
    'photos/15.jpg',
];

let currentPhotoIndex = 0;


const leftMarker = document.getElementById('left-marker');
const rightMarker = document.getElementById('right-marker');
const photoElement = document.getElementById('photo');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');


function updatePhoto() {
    photoElement.src = photos[currentPhotoIndex];
    if (window.innerWidth > 800) {
        updateWideMarkers(currentPhotoIndex);
    } else {
        updateTallMarkers(currentPhotoIndex);  
    }
}

function updateWideMarkers(photoIndex) {
    let markerCount = photoIndex + 1; 
    const cols = 3;  

    let rightMarkers = ['', '', ''];

    for (let i = 0; i < markerCount; i++) {
        let col = i % cols;
        rightMarkers[col] += '|<br>';
    }

    rightMarker.innerHTML = `<div>${rightMarkers[0]}</div><div>${rightMarkers[1]}</div><div>${rightMarkers[2]}</div>`;
}

function updateTallMarkers(photoIndex) {
    let markerCount = photoIndex + 1; 
    let markers = '';

    for (let i = 0; i < markerCount; i++) {
        markers += '|<br>';
    }

    rightMarker.innerHTML = markers;
}


prevBtn.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updatePhoto();
});

nextBtn.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updatePhoto();
});


// Also works with arrow keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        updatePhoto();
    } else if (event.key === 'ArrowRight') {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        updatePhoto();
    }
});

// Initialize with the first photo
updatePhoto();
