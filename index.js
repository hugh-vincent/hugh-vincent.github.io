let isLoadingImage = false;
const poems = []; // Store the poem URLs fetched from the backend

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

  fetch('https://api.github.com/repos/hugh-vincent/hugh-vincent.github.io) // Adjust with your GitHub username and repository
    .then(response => response.json())
    .then(data => {
      const poemFiles = data
        .filter(file => file.name.startsWith('Poem') && file.name.endsWith('.txt'))
        .map(file => file.download_url);
      poems.push(...poemFiles);
      const randomIndex = Math.floor(Math.random() * poems.length);
      const poemUrl = poems[randomIndex];
      return fetch(poemUrl);
    })
    .then(response => response.text())
    .then(poemText => {
      const poemContainer = document.getElementById('poem-container');
      poemContainer.innerHTML = poemText;
      return fetch('https://source.unsplash.com/random');
    })
    .then(response => response.url)
    .then(imageUrl => loadImage(imageUrl))
    .then(image => {
      const canvas = document.getElementById('random-image');
      canvas.width = 256;
      canvas.height = 256;
      applyImageEffects(image, canvas);
      isLoadingImage = false;
    })
    .catch(error => {
      console.log(error);
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
});
