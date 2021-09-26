import { startsWith } from 'core-js/stable/string';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers';

export const state = {
  // Information on the entire recipe
  recipe: {},
  // Information when searching recipes
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // Rerformatting data variable
  // let  recipe  = data.data.recipe;
  // Since the variable in data is also called recipe, can use descontructing to atomatically get the variable recipe from data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // if recipe.key doesnt exist, then nothing happens, else add object
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);

    state.recipe = createRecipeObject(data);

    // When loading recipe check if it's bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.log(`${error}!`);
    throw error;
  }
};

export const updateServings = function (servingSize) {
  state.recipe.ingredients.forEach(ing => {
    // quantity of ingrediente = inicial quantity * servingSize / oldServingSize
    ing.quantity = (ing.quantity * servingSize) / state.recipe.servings;
  });
  // add new serving size to variable
  state.recipe.servings = servingSize;
};

export const loadSearchResults = async function (query) {
  state.search.query = query;
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  // return a part of the total results
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  // Find the location of the bookmark in the array
  const index = state.bookmarks.findIndex(el => el.id === id);
  // splice/delete array position
  state.bookmarks.splice(index, 1);

  // Mark current recipe as false
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

// API Request (async)
export const uploadRecipe = async function (newRecipe) {
  try {
    // Convert Object to Array to store into ingredients
    const ingredients = Object.entries(newRecipe)
      // Get only the ingredients that have value
      .filter(
        entry =>
          // 0 -> Key, 1->Value
          entry[0].startsWith('ingredient') && entry[1] !== ''
      )
      // create new array with said filtered array
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        // If not in the specific format, throw error
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient Format, Please use correct format!'
          );

        const [quantity, unit, description] = ingArr;

        // terciary if exist convert to int
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      // ingredients: ingredients
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
