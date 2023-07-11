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
  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const pixelSize = 4;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, width, height, 0, 0, width / pixelSize, height / pixelSize);
  ctx.drawImage(canvas, 0, 0, width / pixelSize, height / pixelSize, 0, 0, width, height);
}

let lastPoemUrl = '';

function loadRandomPoem() {
  if (isLoadingImage) {
    return;
  }

  isLoadingImage = true;

  fetch('https://api.github.com/repos/hugh-vincent/hugh-vincent.github.io/contents/blueish')
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

      const filteredPoemFiles = poemFiles.filter(url => url !== lastPoemUrl);
      const randomIndex = Math.floor(Math.random() * filteredPoemFiles.length);
      const poemUrl = filteredPoemFiles[randomIndex];
      lastPoemUrl = poemUrl;

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
      return fetch('https://source.unsplash.com/random/?blue');
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
button.addEventListener('click', loadRandomPoem);

const handleInteraction = (event) => {
  event.preventDefault();
  button.style.backgroundColor = 'darkblue';
};

const handleRelease = () => {
  button.style.backgroundColor = '';
};

button.addEventListener('mousedown', () => {
  const audio = new Audio('https://hugh-vincent.github.io/Click_SFX.mp3');
  audio.play();
  loadRandomPoem();
});

button.addEventListener('touchstart', () => {
  const audio = new Audio('https://hugh-vincent.github.io/Click_SFX.mp3');
  audio.play();
  loadRandomPoem();
});

button.addEventListener('mousedown', handleInteraction);
button.addEventListener('touchstart', handleInteraction);

button.addEventListener('mouseup', handleRelease);
button.addEventListener('touchend', handleRelease);

if (!window.matchMedia('(pointer: coarse)').matches) {
  const cursorImage = new Image();
  cursorImage.src = 'https://hugh-vincent.github.io/img_Cursor.png';
  cursorImage.style.position = 'fixed';
  cursorImage.style.pointerEvents = 'none';
  cursorImage.style.zIndex = '9999';
  cursorImage.style.width = '32px';
  cursorImage.style.height = '32px';
  cursorImage.style.transform = 'translate(-50%, -50%)';

  document.addEventListener('mousemove', (event) => {
    cursorImage.style.left = event.pageX + 'px';
    cursorImage.style.top = event.pageY + 'px';
  });

  document.body.appendChild(cursorImage);

  const ignoreElements = document.getElementsByClassName('custom-cursor-ignore');

  for (let i = 0; i < ignoreElements.length; i++) {
    ignoreElements[i].addEventListener('mouseenter', () => {
      customCursor.style.opacity = 0;
    });
    ignoreElements[i].addEventListener('mouseleave', () => {
      customCursor.style.opacity = 1;
    });
  }
}

if (!window.matchMedia('(pointer: coarse)').matches) {
  const cursorImage = new Image();
  cursorImage.src = 'https://hugh-vincent.github.io/img_Cursor.png';
  cursorImage.style.position = 'fixed';
  cursorImage.style.pointerEvents = 'none';
  cursorImage.style.zIndex = '9999';
  cursorImage.style.width = '32px';
  cursorImage.style.height = '32px';
  cursorImage.style.transform = 'translate(-50%, -50%)';

  document.addEventListener('mousemove', (event) => {
    cursorImage.style.left = event.pageX + 'px';
    cursorImage.style.top = event.pageY + 'px';
  });

  document.body.appendChild(cursorImage);

  const buttons = document.getElementsByTagName('button');

  const style = document.createElement('style');
  style.innerHTML = `
    body {
      cursor: none;
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseenter', () => {
      cursorImage.style.width = '38.4px';
      cursorImage.style.height = '38.4px';
    });

    buttons[i].addEventListener('mouseleave', () => {
      cursorImage.style.width = '32px';
      cursorImage.style.height = '32px';
    });
  }
}
