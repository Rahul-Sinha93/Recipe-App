import Search from './models/search';
import { elements, renderLoader, clearLoader} from './views/base';   
import * as searchView  from "./views/searchview"; 


const state = {};

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






