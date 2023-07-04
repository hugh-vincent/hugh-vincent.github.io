let isLoadingImage = false;
const poems = [];

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function applyImageEffects(image, canvas) {
  // Your existing code for applying image effects
  // ...

  // Add custom cursor position update
  canvas.addEventListener('mousemove', (event) => {
    const customCursor = document.getElementById('custom-cursor');
    customCursor.style.left = event.clientX + 'px';
    customCursor.style.top = event.clientY + 'px';
  });
}

function loadRandomPoem() {
  if (isLoadingImage) {
    return;
  }

  isLoadingImage = true;

  // Your existing code for fetching poem and image
  // ...

  // Add custom cursor class to body
  document.body.classList.add('custom-cursor');
}

const button = document.getElementById('myButton');
button.addEventListener('mousedown', function () {
  this.style.backgroundColor = 'white';
});

button.addEventListener('mouseup', function () {
  this.style.backgroundColor = '';

  // Create an <audio> element and set its source URL
  const audio = new Audio('https://hugh-vincent.github.io/Click_SFX.mp3');

  // Play the audio
  audio.play();

  loadRandomPoem();
});

// Add custom cursor for desktop users
if (!window.matchMedia('(pointer: coarse)').matches) {
  const cursorImage = new Image();
  cursorImage.src = 'https://hugh-vincent.github.io/img_Cursor.png';
  cursorImage.style.position = 'fixed';
  cursorImage.style.pointerEvents = 'none';
  cursorImage.style.zIndex = '9999';

  const customCursor = document.createElement('div');
  customCursor.id = 'custom-cursor';
  customCursor.appendChild(cursorImage);

  document.body.appendChild(customCursor);
}
