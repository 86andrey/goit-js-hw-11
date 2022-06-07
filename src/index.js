import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const submitForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '27913920-68ceae66209fe678afbf6b110';
const BASE_URL = 'https://pixabay.com/api/?key=';
const OPTIONS =
  '}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
