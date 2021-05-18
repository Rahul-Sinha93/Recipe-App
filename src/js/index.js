import Search from './models/search';
import recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader} from './views/base';   
import * as searchView  from "./views/searchView"; 
import * as recipeView  from "./views/recipeView"; 
import * as listView  from "./views/listView"; 
import * as likesView  from "./views/likesView"; 

// Global state of the App
const state = {};

// Search Controller
const controlSearch = async () =>{
    const query = searchView.getInput();

    if(query){
        state.search = new Search(query);
        
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)
        
        await state.search.getResults();
        
        clearLoader();
        searchView.randerResults(state.search.result);
    }
}
//  showing the search on the click of the search button
elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault();
    controlSearch();
})

// changing the page and the search results of recipes
elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline')
    if (btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        // console.log(goToPage)
        searchView.clearResults();
        searchView.randerResults(state.search.result, goToPage);
    }
    // console.log(btn)
})

//Recipe Controller

const controlRecipe  = async () =>{
    const id = window.location.hash.replace('#', '');
    if(id){
        //Prepare Ui for Changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)
        
        //highlight selected search item
        if(state.search) searchView.highlightSelected(id);

        //create New Recipe object
        state.recipe = new recipe(id)

        // //testing
        // window.r = state.recipe;

        try{

            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
     
            //Render Recipe
           clearLoader();
           recipeView.renderRecipe(
               state.recipe,
               state.likes.isLiked(id))

            // console.log(state.recipe)

        }catch(err){
                alert('Error Processing Recipe')
        }
    }
}

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe))


// List controller

const controlList = () =>{
    // create a new list if there is none 
    if(!state.List) state.list = new List();

    //Add each ingredient to the list and to UI
    state.recipe.ingredients.forEach(el =>{
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.randerItem(item);
    })
}
// handling delete and update shopping list Item 

elements.shopping.addEventListener('click' , e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle Delete Button 
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from state 
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id)

    //Handle the count update
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat( e.target.value,10);
        state.list.updateCount(id, val)
    }
})


// Like controller 
const controlLike = () =>{
    if(!state.likes)  state.likes = new Likes();
    const currentId = state.recipe.id;

    if(!state.likes.isLiked(currentId)){
    //user has not liked recipe 

        // add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )


        //toggle the like button 
        likesView.toggleLikeBtn(true);
        
        //add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes)
        
    } else {
        // user has already liked recipe 
        
        
        // remove like from the state
        state.likes.deleteLike(currentId)
        
        
        //toggle the like button 
        likesView.toggleLikeBtn(false);

        //remove like from the UI list
        likesView.deleteLike(currentId)
        console.log(state.likes)

    }
   likesView.toggleLikeMenu(state.likes.getNumLikes());
    
}
// Restore likes recipe on page load 
window.addEventListener('load' , () =>{
    state.likes = new Likes();

    //restore likes 
    state.likes.readStorage();

    //Toggle the like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render existing likes 
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

// Handling recipe Button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked 
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked 
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe);
    }else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        // add ingredient to shopping list
        controlList();
    }else if (e.target.matches('.recipe__love,.recipe__love *')){
        // add recipe to like list
        controlLike();
    }
})
