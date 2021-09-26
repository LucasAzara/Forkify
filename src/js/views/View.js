import icons from 'url:../../img/icons.svg';
// Exporting class becuase it will never become an object, just a parent to the other views
export default class View {
  _data;
  //   public API, recieves data and sets it
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //   Getting data from model.js
    this._data = data;
    // markup html to apply to parentElement
    const markup = this._generateMarkup();

    if (!render) return markup;

    // Clear parent element
    this._clear();

    // Insert new html markup to this._parentElement
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    //   Getting data from model.js
    this._data = data;

    const newMarkup = this._generateMarkup();

    // convert markup to object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Convert newDOM into an array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Convert currentDOM into an array
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // Updates Change text in views
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // A way to compare is nodes are equal && only the text that isn't empty
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // If false then current element with be like the new element
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        // Create an array for each attribute that has changed in the dom
        Array.from(newEl.attributes).forEach(attr =>
          // Update the current element attrinbutes with the ones found in the new
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Render Loading
  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
