import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ApiService from './api-service';
import oneGalleryItemTpl from './gallery-template.hbs';
import LoadMoreBtn from './load-more-btn';


const refs = {
    searchForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
};


const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
});

loadMoreBtn.hide();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);

function onInitializationSimpleLightbox() {
    let gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250 });
    gallery.on('show.simplelightbox', function () {     
    });
    gallery.refresh();
            
    return gallery;
}


function onSearch(e) {
    e.preventDefault();

    apiService.query = e.currentTarget.elements.searchQuery.value;
    
    if (!apiService.query) return;

    loadMoreBtn.show();
    apiService.resetPage();
    clearGalleryContainer();
    
    fetchHits(); 
}

async function onLoadMoreBtn() {

     loadMoreBtn.disable();
    try {

        const data = await apiService.fetchArticles();
            
        appendHitsMarkup(data.hits);
        onInitializationSimpleLightbox(); 
          
            loadMoreBtn.enable();
           
        if (data.hits.length < 40 && data.totalHits > 40) {
            loadMoreBtn.hide();
            return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);  
        } 
    
       
} catch (error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}
}

async function fetchHits() {
    loadMoreBtn.disable();
    if (!apiService.query) return;

    try {
        const data = await apiService.fetchArticles();

            if (data.hits.length) {
                appendHitsMarkup(data.hits);
                onInitializationSimpleLightbox();   
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                loadMoreBtn.enable();
            } else {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                loadMoreBtn.enable();
            };

            data.totalHits <= 40 && loadMoreBtn.hide();
      
        
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
}


function appendHitsMarkup(hits) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', oneGalleryItemTpl(hits));
    
    // if (!addMarkup) {
    //     onInitializationSimpleLightbox();   
    // }
}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}

