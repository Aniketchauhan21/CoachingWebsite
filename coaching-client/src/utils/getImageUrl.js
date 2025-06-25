// utils/getImageUrl.js
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return `${API_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};
