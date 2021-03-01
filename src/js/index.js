import Search from './models/search';
import recipe from './models/Recipe';
import { elements, renderLoader, clearLoader} from './views/base';   
import * as searchView  from "./views/searchView"; 
import * as recipeView  from "./views/recipeView"; 


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

elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline')
    if (btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        console.log(goToPage)
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
           recipeView.renderRecipe(state.recipe)
            console.log(state.recipe)

        }catch(err){
                alert('Error Processing Recipe')
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
 

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe))

