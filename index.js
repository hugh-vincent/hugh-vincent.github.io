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

const button = document.getElementById('MyButton');
button.addEventListener('mousedown', function () {
  this.style.backgroundColor = 'white';
});

button.addEventListener('mouseup', function () {
  this.style.backgroundColor = '';
  loadRandomPoem();
  
  // Play sound when button is released
  var audio = new Audio("http://soundfxcenter.com/video-games/final-fantasy-xi/8d82b5_Final_Fantasy_XI_Menu_Selection_Sound_Effect.mp3");
  audio.play();
});
