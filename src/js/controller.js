import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import { async } from 'regenerator-runtime/runtime';
import { _ } from 'core-js';

// asynch function to get information from API
const controlRecipes = async function () {
  try {
    // get hash id from url
    const id = window.location.hash.slice(1);

    // if there is no hash id, just return function
    if (!id) return;

    // 1) Loading Recipe
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // Since it is a async function, needs to wait for function to finish
    await model.loadRecipe(id);

    // 2) Loading Recipe to Page
    // add data into class using render
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // Add the spinner in the search results while getting all of the results from the API
    resultsView.renderSpinner();
    // Get Query search result
    const query = searchView.getQuery();
    if (!query) return;

    // wait for results to come back and set into variable for model use
    await model.loadSearchResults(query);

    // Render Results
    resultsView.render(model.getSearchResultPage());

    // Render Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  // Render Results
  resultsView.render(model.getSearchResultPage(goToPage));

  // Render Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (servingSize) {
  // Update recipe serving size
  model.updateServings(servingSize);
  // Update the view of the recipe
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    // Add bookmark to recipe for user
    model.addBookmark(model.state.recipe);
  } else {
    // Add bookmark to recipe for user
    model.removeBookmark(model.state.recipe.id);
  }
  // Update the recipe view so that the bookmark symbol will be updated
  recipeView.update(model.state.recipe);

  // Render bookmarks in bookmark tab
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Loading Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // History API / Change ID in URL
    // Change url without reloading page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Sucess Message
    addRecipeView.renderMessage();
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSeach(controlSearchResults);
  paginationView.addHandlerBtn(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
