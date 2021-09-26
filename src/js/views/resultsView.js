import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again.`;
  _message = '';
  _generateMarkup() {
    // short code in map, don't need to put parameter in the function to make it work, will automatically do it
    // reason why the function previewView is calling render and not _generateMarkup is so that the previewView will have all the data of the result to generate the new markup
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
