const head = document.head;
const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
let pageTitle = document.querySelector('h1 span');
link.href = 'https://SkovdeKommun.github.io/easit/onboardingportalen.css';
document.title = 'Onboardingportalen';
newPageTitle = 'ONBOARDINGPORTALEN'
head.appendChild(link);

var meta = document.createElement('meta');
meta.name = "theme-color";
meta.content = "#008c9b";
head.appendChild(meta);

const replaceSwedish = (source) => {
    let result = source.toLowerCase().replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ /g, '_').replace(/,/g, '').replace(/\//g, '')
    return result
}

let breadcrumbs = document.querySelector('.breadcrumbs')

let currentForm
let currentURL

let historyStack = []

window.history.replaceState({currentURL: window.location.origin+window.location.pathname+window.location.search}, document.title, window.location.origin+window.location.pathname+window.location.search)
currentURL = window.location.origin+window.location.pathname+window.location.search
let mo = new MutationObserver(function(mutations){
    let activeCategory
    if(pageTitle = document.querySelector('h1 span')){
        pageTitle.textContent = newPageTitle;
    }
    breadcrumbs = document.querySelector(".breadcrumbs")
    if(breadcrumbs){
        if(breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent.includes("Frågor & svar")){
            breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent = "Sökresultat"
            let faqCategoriesList = document.querySelector('#faqCategoriesList')
            activeCategory = faqCategoriesList.querySelector('li.active')
            document.title = activeCategory.textContent.replace(/\d+/g, '');
        }
        if(breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent.includes("On- och offboarding")){         
            let regex = /^(\d+) - /;
            let match = breadcrumbs.firstChild.lastChild.querySelector(".empty-dummy").textContent.match(regex)
            if(match){
                document.title = breadcrumbs.firstChild.lastChild.querySelector(".empty-dummy").textContent
            }else{
                let itemViewsList = document.querySelector('#itemViewsList')
                activeItem = itemViewsList.querySelector('li.active')
                document.title = activeItem.textContent.replace(/\d+/g, '');
            }
        }
    }else{
        document.title = "Onboardingportalen"
    }
});


const interval = setInterval(function() {
    breadcrumbs = document.querySelector(".breadcrumbs")
    if(breadcrumbs){
        if(breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent.includes("Pågående onboarding") || breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent.includes("On- och Offboarding") || breadcrumbs.firstChild.children[1].textContent.match(/\d+ - /)){
            if(breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent.includes("Sökresultat")){
                currentURL = `${window.location.origin}/selfservice/FAQ?operation=verksamhet_onboarding`
                return
            }
            let regex = /^(\d+) - /;
            let match = breadcrumbs.firstChild.lastChild.querySelector(".empty-dummy").textContent.match(regex)
            if(match){
                currentURL = `${window.location.origin}/selfservice/Item/moduleId/1003/id/${match[1]}?operation=verksamhet_onboarding`
                let listitems = document.querySelectorAll('.z-listitem')
                for(i = 0; i < listitems.length; i++){
                    regex = /^[^,]*/;
                    let match = listitems[i].querySelector('span').textContent.match(regex)
                    listitems[i].addEventListener('click', () => {  
                        window.open(`${window.location.origin}/selfservice/Item/moduleId/1003/id/${match[0]}?operation=verksamhet_onboarding`)
                    })
                }
            }else{
                currentURL = `${window.location.origin}/selfservice/Node/nodeId/onoffboarding?operation=verksamhet_onboarding`
            }
        }else if(breadcrumbs.firstChild.children[1].querySelector(".empty-dummy").textContent.includes("Sökresultat")){
            currentURL = `${window.location.origin}/selfservice/FAQ?operation=verksamhet_onboarding`
        }else{
            currentForm = replaceSwedish(breadcrumbs.firstChild.lastChild.children[1].textContent.trim())
            currentURL = `${window.location.origin}/selfservice/Node/nodeId/${currentForm}?operation=verksamhet_onboarding`
        }   
    }else{
        currentURL = `${window.location.origin}/selfservice?operation=verksamhet_onboarding`
    }
    
    if(!breadcrumbs && currentURL != history.state?.currentURL){
        window.history.replaceState({currentURL: currentURL}, document.title, currentURL) 
        historyStack.push(currentURL) 
    }
    if(breadcrumbs && currentURL != history.state?.currentURL){
        window.history.replaceState({currentURL: currentURL}, document.title, currentURL)
        historyStack.push(currentURL)    
    
    }
 }, 1000);

/*window.addEventListener('popstate', function(event) {
    // Handle the change in history here
    const state = event.state;
    // You can access the state data and update your page accordingly
    console.log(state)
    //window.location.href = historyStack.pop()
   if(state){
 //window.location.href = state.currentURL
 console.log(history.state)
    }
    
});*/

mo.observe(document.body, {
    //childList: true,
    //attributes: true,
    //characterData: true,
    subtree: true,
    attributeOldValue: true,
    //characterDataOldValue: true
});
