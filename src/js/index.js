import Search from './models/search';
import recipe from './models/Recipe';
import { elements, renderLoader, clearLoader} from './views/base';   
import * as searchView  from "./views/searchview"; 


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

const r = new recipe(47746);
r.getRecipe();
console.log(r)




