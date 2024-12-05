require('dotenv').config(); // Carga las variables de entorno

const cloudinary = require('cloudinary').v2; // Asegúrate de usar la versión v2
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Usa CloudinaryStorage
const multer = require('multer');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de almacenamiento con CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Carpeta en Cloudinary donde se almacenarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png'], // Formatos permitidos
  },
});

// Inicializa multer con la configuración de almacenamiento
const upload = multer({ storage });

module.exports = upload;
