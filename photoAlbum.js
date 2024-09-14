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

const photoElement = document.getElementById('photo');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function updatePhoto() {
    photoElement.src = photos[currentPhotoIndex];
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
