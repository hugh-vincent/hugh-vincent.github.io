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

  fetch('https://api.github.com/repos/hugh-vincent/hugh-vincent.github.io
/blueish')
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

////BUTTONS///////

const button = document.getElementById('myButton');
button.addEventListener('click', loadRandomPoem);

function handleInteraction(event) {
  event.preventDefault();
  this.style.backgroundColor = 'darkblue'; // changes button color when clicked or touched
}

function handleRelease() {
  this.style.backgroundColor = ''; // resets button color when released
}

button.addEventListener('mousedown', function() {
  const audio = new Audio('https://hugh-vincent.github.io/Click_SFX.mp3');
  audio.play();
  loadRandomPoem();
});

button.addEventListener('touchstart', function() {
  const audio = new Audio('https://hugh-vincent.github.io/Click_SFX.mp3');
  audio.play();
  loadRandomPoem();
});

button.addEventListener('mousedown', handleInteraction);
button.addEventListener('touchstart', handleInteraction);

button.addEventListener('mouseup', handleRelease);
button.addEventListener('touchend', handleRelease);


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

  document.addEventListener('mousemove', (event) => {
    cursorImage.style.left = event.pageX + 'px';
    cursorImage.style.top = event.pageY + 'px';
  });

  document.body.appendChild(cursorImage);

  const customCursor = document.getElementById('custom-cursor');

  document.addEventListener('mousemove', (event) => {
    customCursor.style.left = event.pageX + 'px';
    customCursor.style.top = event.pageY + 'px';
  });

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

////END OF BUTTONS///////


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

  document.addEventListener('mousemove', (event) => {
    cursorImage.style.left = event.pageX + 'px';
    cursorImage.style.top = event.pageY + 'px';
  });

  document.body.appendChild(cursorImage);

  const buttons = document.getElementsByTagName('button');
  const defaultCursor = document.querySelector('body');

  // Hide the default cursor
  defaultCursor.style.cursor = 'none';

  // Enlarge the custom cursor by 20% when hovering over a button
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseenter', () => {
      cursorImage.style.width = '38.4px';
      cursorImage.style.height = '38.4px';
    });

    // Reset the custom cursor size when leaving a button
    buttons[i].addEventListener('mouseleave', () => {
      cursorImage.style.width = '32px';
      cursorImage.style.height = '32px';
    });
  }
}
