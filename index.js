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
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  // Apply pixelate effect with pixel size 2
  const pixelSize = 4;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    canvas,
    0,
    0,
    width,
    height,
    0,
    0,
    width / pixelSize,
    height / pixelSize
  );
  ctx.drawImage(
    canvas,
    0,
    0,
    width / pixelSize,
    height / pixelSize,
    0,
    0,
    width,
    height
  );
}

function loadRandomPoem() {
  if (isLoadingImage) {
    return;
  }

  isLoadingImage = true;

  fetch('https://api.github.com/repos/hugh-vincent/hugh-vincent.github.io/contents')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch poem files.');
      }
      return response.json();
    })
    .then(data => {
      const poemFiles = data
        .filter(file => file.name.startsWith('Poem') && file.name.endsWith('.txt'))
        .map(file => file.download_url);
      if (poemFiles.length === 0) {
        throw new Error('No poem files found.');
      }
      poems.push(...poemFiles);
      const randomIndex = Math.floor(Math.random() * poems.length);
      const poemUrl = poems[randomIndex];
      return fetch(poemUrl);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch poem.');
      }
      return response.text();
    })
    .then(poemText => {
      const poemContainer = document.getElementById('poem-container');
      poemContainer.innerHTML = poemText;
      return fetch('https://source.unsplash.com/random');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch image.');
      }
      return response.url;
    })
    .then(imageUrl => loadImage(imageUrl))
    .then(image => {
      const canvas = document.getElementById('random-image');
      if (!canvas) {
        throw new Error('Canvas element not found.');
      }
      canvas.width = 256;
      canvas.height = 256;
      applyImageEffects(image, canvas);
      isLoadingImage = false;
    })
    .catch(error => {
      console.error(error);
      isLoadingImage = false;
    });
}

const button = document.getElementById('myButton');

button.addEventListener('mousedown', handleInteraction);
button.addEventListener('touchstart', handleInteraction);

button.addEventListener('mouseup', handleRelease);
button.addEventListener('touchend', handleRelease);

function handleInteraction() {
  this.style.backgroundColor = 'darkblue'; // changes button color when clicked or touched
}

function handleRelease() {
  this.style.backgroundColor = ''; // resets button color when released
}
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
  cursorImage.style.width = '32px'; // Adjust the initial width of the cursor image
  cursorImage.style.height = '32px'; // Adjust the initial height of the cursor image
  cursorImage.style.transform = 'translate(-50%, -50%)'; // Center the cursor image

  const button = document.getElementById('myButton');
  button.style.cursor = 'none'; // Hide the default cursor when hovering over the button

  button.addEventListener('mouseenter', () => {
    const currentWidth = parseFloat(cursorImage.style.width);
    const currentHeight = parseFloat(cursorImage.style.height);
    const newWidth = currentWidth * 1.2; // Increase width by 20%
    const newHeight = currentHeight * 1.2; // Increase height by 20%
    cursorImage.style.width = newWidth + 'px';
    cursorImage.style.height = newHeight + 'px';
  });

  button.addEventListener('mouseleave', () => {
    cursorImage.style.width = '32px'; // Reset the width to the initial value
    cursorImage.style.height = '32px'; // Reset the height to the initial value
  });

  document.addEventListener('mousemove', (event) => {
    if (!event.target.classList.contains('custom-cursor-ignore')) {
      cursorImage.style.left = event.pageX + 'px';
      cursorImage.style.top = event.pageY + 'px';
    }
  });

  document.body.appendChild(cursorImage);
}

