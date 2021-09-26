import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupNext(curPage);
    }
    // Last Page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupPrev(curPage);
    }
    // Other Random Page
    if (curPage < numPages) {
      return (
        this._generateMarkupNext(curPage) + this._generateMarkupPrev(curPage)
      );
    }
    // Page 1 and no other pages
    return '';
  }
  _generateMarkupNext(curPage) {
    return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }
  _generateMarkupPrev(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
    </button>
    `;
  }

  addHandlerBtn(handler) {
    //   Parent element listens to both buttons at the same time
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      //   + converts string to number
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
