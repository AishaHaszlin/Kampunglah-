const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');


// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function quitWebsite() {
    window.close();
}

// Fetch and display meals based on ingredient or meal name
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    if (searchInputTxt === '') return;

    // Determine whether to search by ingredient or meal name
    let apiUrl;
    if (searchInputTxt.includes(" ")) {
        // Search by meal name if there are spaces
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`;
    } else {
        // Otherwise, search by ingredient
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        })
        .catch(error => console.error('Error fetching meals:', error));
}

// Fetch and display meal details in a modal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals[0]));
    }
}

// Display meal details in a modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Fetch and display meal details in a modal
function mealRecipeModal(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <button onclick="saveToPlanner('${meal.idMeal}', '${meal.strMeal}', '${ingredients.join(', ')}', '${meal.strInstructions}')" class="recipe-btn">Save to Planner</button>

    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Save the recipe to localStorage using meal.idMeal and open CRUD.html
function saveToPlanner(idMeal, name, ingredients, instructions) {
    const recipe = {
        id: idMeal,  // Use meal.idMeal as the unique ID
        name: name,
        ingredients: ingredients,
        instructions: instructions,
        dateCreated: new Date().toLocaleString()
    };

    // Retrieve the current list let recipes = JSON.parse(localStorage.getItem('recipes') || '[]')of recipes from localStorage
    ;
    
    // Check if the recipe is already saved by idMeal
    const existingRecipeIndex = recipes.findIndex(recipe => recipe.id === idMeal);
    if (existingRecipeIndex !== -1) {
        alert('This recipe is already saved to your planner.');
    } else {
        // Save the new recipe if it's not already in the planner
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        alert('Recipe saved to your planner!');
        window.location.href = 'CRUD.html'; // Redirect to CRUD.html
    }
}


// Load recipes from localStorage and display on CRUD.html
function loadSavedRecipes() {
    const recipeList = document.getElementById('recipeList');
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    recipeList.innerHTML = recipes.map(recipe => `
        <div class="meal-card">
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong><br>${recipe.ingredients.replace(/,/g, ', ')}</p>
            <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
            <p><small>Created: ${recipe.dateCreated}</small></p>
            <button class="crud-btn" onclick="editRecipe(${recipe.id})">Edit</button>
            <button class="crud-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
        </div>
    `).join('');
}

// Show/Hide the create/edit recipe form
function showCreateForm(isEdit = false) {
    const form = document.getElementById('createForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';

    if (!isEdit) {
        document.getElementById('recipeName').value = '';
        document.getElementById('ingredients').value = '';
        document.getElementById('instructions').value = '';
    }
}

// Save or update recipe
function saveRecipe() {
    const recipeId = document.getElementById('recipeId').value;  // Get the id from hidden input
    const recipeName = document.getElementById('recipeName').value.trim();
    const ingredients = document.getElementById('ingredients').value.trim();
    const instructions = document.getElementById('instructions').value.trim();

    if (!recipeName || !ingredients || !instructions) {
        alert('Please fill in all fields');
        return;
    }

    let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');

    if (recipeId) {
        // Update existing recipe
        recipes = recipes.map(recipe => recipe.id == recipeId ? { ...recipe, name: recipeName, ingredients, instructions } : recipe);
        alert('Recipe updated successfully!');
    } else {
        // Add new recipe
        const newRecipe = {
            id: Date.now(),
            name: recipeName,
            ingredients: ingredients,
            instructions: instructions,
            dateCreated: new Date().toLocaleString()
        };
        recipes.push(newRecipe);
        alert('Recipe saved successfully!');
    }

    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadSavedRecipes();
    showCreateForm(false);
    document.getElementById('recipeId').value = '';  // Clear hidden input
}

// Edit recipe by ID
function editRecipe(id) {
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const recipe = recipes.find(r => r.id === id);

    if (recipe) {
        document.getElementById('recipeId').value = recipe.id;  // Set hidden input with recipe id
        document.getElementById('recipeName').value = recipe.name;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;

        showCreateForm(true);
    } else {
        alert('Recipe not found');
    }
}


// Delete recipe by ID
function deleteRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    recipes = recipes.filter(recipe => recipe.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadSavedRecipes();
    alert('Recipe deleted successfully!');
}



// Initialize by loading saved recipes
document.addEventListener('DOMContentLoaded', loadSavedRecipes);
