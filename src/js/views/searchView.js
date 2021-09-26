import View from './View.js';
class SearchView extends View {
  // Get entire form
  _parentEl = document.querySelector('.search');
  //   Get the value that is in the textfield in the form and return it
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSeach(handler) {
    // Add event listenr to entire form to see when it will be submited, preventing it and getting the string to realize the search in javascript
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
