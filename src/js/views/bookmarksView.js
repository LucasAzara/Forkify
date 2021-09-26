import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BooksmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // short code in map, don't need to put parameter in the function to make it work, will automatically do it
    // reason why the function previewView is calling render and not _generateMarkup is so that the previewView will have all the data of the bookmark to generate the new markup
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BooksmarkView();
