const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const grayscale = document.getElementById('grayscale');
const monotone = document.getElementById('monotone');
const duotone = document.getElementById('duotone');
const reset = document.getElementById('reset');
const download = document.getElementById('download');
const input = document.getElementById('image');

let imageWidth, imageHeight, originalData = null;
const image = new Image();

image.addEventListener('load', () => {
  // Dynamisch schalen naar de beschikbare breedte
  const maxW = Math.min(window.innerWidth * 0.9, 800);
  const scale = maxW / image.width;
  imageWidth = image.width * scale;
  imageHeight = image.height * scale;

  canvas.width = imageWidth;
  canvas.height = imageHeight;
  context.drawImage(image, 0, 0, imageWidth, imageHeight);
  originalData = canvas.toDataURL();
});

const reader = new FileReader();
reader.addEventListener('load', () => (image.src = reader.result));
input.addEventListener('change', () => reader.readAsDataURL(input.files[0]));

const filters = {
  applyGrayscale: (gray) => [gray, gray, gray],
  applyMonotone: (gray) => [gray - 40, gray - 40, gray + 80],
  applyDuotone: (gray) => {
    const diff = Math.round((150 / 100) * gray);
    return [gray + diff, gray, 255 - diff];
  },
};

function applyFilter(type) {
  if (!imageWidth) return alert("Veuillez d'abord télécharger une image !");
  const imgData = context.getImageData(0, 0, imageWidth, imageHeight);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const rgb = filters[type](gray);
    [data[i], data[i + 1], data[i + 2]] = rgb;
  }
  context.putImageData(imgData, 0, 0);
  download.href = canvas.toDataURL();
}

function resetFilter() {
  if (!originalData) return;
  image.src = originalData;
}

grayscale.addEventListener('click', () => applyFilter('applyGrayscale'));
monotone.addEventListener('click', () => applyFilter('applyMonotone'));
duotone.addEventListener('click', () => applyFilter('applyDuotone'));
reset.addEventListener('click', resetFilter);
