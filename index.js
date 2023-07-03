const poems = [
  `Action Man arrived
in a lunar rover
dressed as an astronaut.
We turned the living room rug
into the red valleys of Mars
and drove all around.
I never could have been an astronaut -
the idea of space
terrifies me.
One slip and you’re lost forever.
Punch your way out of that one,
Action Man.`,

  
  `I spent all of my
pocket money
on plastic swords.
They transported me
as I walked down
the hot, sandy
pavement.
I felt so powerful-
I never wanted to be
born here.
I wanted to be a knight,
a warrior, I even said so!
But looking back,
it all seems so cosy
with words like
‘Turbo’, ‘Max’ and ‘Ultra’
everywhere.`,


  
  `I couldn’t believe
my luck
When Dad gave me
his old Apple Mac.
There was no internet,
there were no games.
Just me,
in the reflection.
I sat there in my
little green room.
Underneath the dormer window
pretending to be a writer.
Clack clack
clack.
Typing away
at my very own
Apple Mac.`,

  
  // Add more poems as needed

  
];

let isLoadingImage = false;

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

  // Convert the image to black and white
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);

  // Apply blue color overlay
  ctx.globalCompositeOperation = 'color';
  ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

function loadRandomPoem() {
  if (isLoadingImage) {
    return;
  }

  isLoadingImage = true;

  const randomIndex = Math.floor(Math.random() * poems.length);
  const poemText = poems[randomIndex];
  const poemContainer = document.getElementById('poem-container');
  poemContainer.innerHTML = poemText;

  fetch('https://source.unsplash.com/random')
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
