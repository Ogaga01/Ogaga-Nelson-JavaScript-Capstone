import './styles.css';
import img from './assets/OD-image.png';

const logo = document.getElementById('logo1');
logo.src = img;

document.querySelector('#logo_img').setAttribute('src', logo);

const artContainer = document.getElementById('art-container');
const artContent = document.createElement('div');