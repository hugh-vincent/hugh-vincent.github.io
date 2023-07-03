// Array of poems
const poems = [
  `There are no poems here`,
  `Blueish TWO...`,
  `Blueish the third!`,
  // Add more poems as needed
];

let isLoadingImage = false; // Flag to track image loading state

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function loadRandomPoem() {
  if (isLoadingImage) {
    return; // Exit if an image is already loading
  }

  isLoadingImage = true; // Set the loading flag

  const randomIndex = Math.floor(Math.random() * poems.length);
  const poemText = poems[randomIndex];
  const poemContainer = document.getElementById('poem-container');
  poemContainer.innerHTML = poemText;

  // Fetch a random image from the internet
  fetch('https://source.unsplash.com/random')
    .then(response => response.url)
    .then(imageUrl => loadImage(imageUrl))
    .then(image => {
      const canvas = document.getElementById('random-image');
      const ctx = canvas.getContext('2d');

      // Set canvas size to desired stretched dimensions
      const width = 256;
      const height = 256;
      canvas.width = width;
      canvas.height = height;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pixelate the image
      const pixelSize = 3; // Adjust the pixel size as needed
      const scaledWidth = width / pixelSize;
      const scaledHeight = height / pixelSize;

      ctx.imageSmoothingEnabled = false; // Disable image smoothing
      ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
      ctx.drawImage(
        canvas,
        0,
        0,
        scaledWidth,
        scaledHeight,
        0,
        0,
        width,
        height
      );

      isLoadingImage = false; // Reset the loading flag
    })
    .catch(error => {
      console.log(error);
      isLoadingImage = false; // Reset the loading flag in case of an error
    });
}

const button = document.getElementById('MyButton');
button.addEventListener('mousedown', function () {
  this.style.backgroundColor = 'white'; // Change button color to white
});

button.addEventListener('mouseup', function () {
  this.style.backgroundColor = ''; // Reset button color to default
  loadRandomPoem(); // Call the function to load a random poem
});
