import './styles.css';
import img from './assets/OD-image.png';

const logo = document.getElementById('logo1');
logo.src = img;

document.querySelector('#logo_img').setAttribute('src', logo);

const artContainer = document.getElementById('art-container');
const artContent = document.createElement('div');

let images = [];

const baseUrl = 'https://api.artic.edu/api/v1/artworks?limit=15';
const getImages = async () => {
  const response = await fetch(baseUrl);
  const data = await response.json();
  images = data.data;
  images = images.map((image) => ({
    id: image.id,
    image_id: image.image_id,
    title: image.title,
    date: image.date_start,
    artist: image.artist_title,
  })).filter((image) => image.image_id !== null && image.artist !== null);

  const imageString = images.map((img, index) => `
  <article class="article-style">
     <h2 class="title">${img.title},
       ${img.date}</h2>
     <h3 class="artist">${img.artist}</h3>
     <img class="image-style" src="https://www.artic.edu/iiif/2/${img.image_id}/full/843,/0/default.jpg"
       alt="image of artwork">
     <figure class="caption-container">
       <figcaption class="caption-content">
         <img class="like" id="${img.id}" src="/src/heart-empty.png" alt="like icon">&nbsp;
           <span class="like-count">
          
           </span>