import { elements, elementStrings } from './base';

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }

            return acc + curr.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
                <button class="${elementStrings.paginationButton} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>                    
                </button>
`;

const renderPaginationButtons = (page, numResults, resultsPerPage) => {
    const pages = Math.ceil(numResults / resultsPerPage);
    let button;

    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `${createButton(page, 'prev')}${createButton(page, 'next')}`
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const getInput = () => elements.searchInput.value;

// using function notation to prevent implicit return as we're not returning anything...
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe); // current element is automatically passed

    renderPaginationButtons(page, recipes.length, resultsPerPage);
};