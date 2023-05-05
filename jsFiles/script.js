let currentTab=document.querySelector('.btn1');
let searchTab=document.querySelector('.btn2');
let access=document.querySelector('.grantAccess');
let search=document.querySelector('.search_form');
let userInfo=document.querySelector('.yourWeather');
let loader=document.querySelector('.dataLoad');
let fetchCity=document.querySelector("[place]");
let err404=document.querySelector('.not-found');
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let presentTab=currentTab;
let newtab=searchTab;
fetchBg(presentTab,newtab);

// getTab();
getCurrentSession();

function fetchBg(presentTab,newtab){
    presentTab.classList.add('active');
    newtab.classList.remove('active');
    if(presentTab==currentTab){
        access.classList.add('grantAccess-active');
        userInfo.classList.remove('yourWeather-remove');
        userInfo.classList.add('yourWeather-active');
        search.classList.add('search_form-remove');
        getCurrentSession();
    }
    else{
        access.classList.remove('grantAccess-active');
        access.classList.add('grantAccess-remove');
        userInfo.classList.add('yourWeather-remove');
     
        search.classList.remove('search_form-remove');
        search.classList.add("search_form-active");
    }
}
//changing the tab

// function getTab(){
    currentTab.addEventListener('click',()=>{
        presentTab=currentTab;
        fetchBg(presentTab,searchTab);
       
    })
    searchTab.addEventListener('click',()=>{
        presentTab=searchTab;
        fetchBg(presentTab,currentTab);
        // access.classList.add('to-remove');
        // userInfo.classList.remove("to-show");
        // search.classList.add("to-show");
    })

// }
function getCurrentSession(){
    const coordinates=sessionStorage.getItem("usercoordinates");
    if(!coordinates){
        access.classList.add('grantAccess-active');
    }
    else{
        const local=coordinates;
        getWeather(JSON.parse(coordinates));
    }
}
function getCoordinates(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
}
function showPosition(position){
     let usercoordinates={
        lat:position.coords.latitude ,
        lon:position.coords.longitude
     }
     sessionStorage.setItem("usercoordinates",JSON.stringify(usercoordinates));
     getWeather(usercoordinates);
}
async function getWeather(usercoordinates){
    const {lat,lon}=usercoordinates;
    access.classList.remove('grantAccess-active');
    access.classList.add('grantAccess-remove');
    loader.classList.add('dataLoad-active');
    userInfo.classList.remove('yourWeather-active');
    userInfo.classList.add('yourWeather-remove');
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();
        console.log(data);
       
        renderData(data);
    }
    catch(e){
        alert("NOt able to fetch the data");
    }
    loader.classList.remove('dataLoad-active');
    loader.classList.add('dataLoad-remove');
    userInfo.classList.add('yourWeather-active');
    userInfo.classList.remove('yourWeather-remove');
}
function renderData(data){
    let city=document.querySelector('.cityName');
    let icon=document.querySelector("[dataCountryicon]");
    let desc=document.querySelector('.dataWeatherDes');
    let dataIcon=document.querySelector('.dataweatherIcon');
    let temp=document.querySelector('.dataTemp');
    let windSpeed=document.querySelector('.dataWind');
    let humid=document.querySelector('.dataHumidity');
    let cloud=document.querySelector('.dataclouds');
    if(data?.name==null){
        err404.classList.add("not-found-active");
        loader.classList.remove('dataLoad-active');
        loader.classList.add('dataLoad-remove');
    }
    else{
        err404.classList.remove("not-found-active");
    }
    city.innerText=data?.name;
    icon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    desc.innerText=data?.weather?.[0]?.description;
    temp.innerText=`${data?.main?.temp}°C`;
    dataIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    windSpeed.innerText=`${data?.wind?.speed}m/s`;
    humid.innerText=`${data?.main?.humidity}%`;
    cloud.innerText=data?.weather?.[0]?.description;
}
access.addEventListener('click',getCoordinates());

async function getWeatherInfo(place){
    access.classList.add('grantAccess-active');
    loader.classList.add('dataLoad-active');
    userInfo.classList.add('yourWeather-remove');
    try{
        let weatherData=await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}&units=metric`) ;
        let info=await weatherData.json();
       
        
            renderData(info);
            
       
        

        
       
    }
    catch(e){
        alert("Not a Vaild Place");
       
    }
    if(!err404.classList.contains("not-found-active")){
    loader.classList.remove('dataLoad-active');
    loader.classList.add('dataLoad-remove');
    userInfo.classList.remove('yourWeather-remove');
    userInfo.classList.add('yourWeather-active');
    }
}
function renderWeather(info){
    let city=document.querySelector('.cityName');
    let icon=document.querySelector("[dataCountryicon]");
    let desc=document.querySelector('.dataWeatherDes');
    let dataIcon=document.querySelector('.dataweatherIcon');
    let temp=document.querySelector('.dataTemp');
    let windSpeed=document.querySelector('.dataWind');
    let humid=document.querySelector('.dataHumidity');
    let cloud=document.querySelector('.dataclouds');
    city.innerText=info?.name;
    // icon.src=`https://flagcdn.com/144x108/${info?.sys?.country.toLowerCase()}.png`
    desc.innerText=info?.weather?.[0]?.description;
    temp.innerText=info?.main?.temp;
    // dataIcon.src=`http://openweathermap.org/img/w/${info?.weather?.[0]?.icon}.png`
    windSpeed.innerText=info?.wind?.speed;
    humid.innerText=info?.main?.humidity;
    cloud.innerText=info?.weather?.[0]?.description;
}
let searchIcon=document.querySelector("[dataSearch]")
searchIcon.addEventListener('click',()=>{
   
        // alert("Please enter a valid place lala");
        let place=fetchCity.value;
        getWeatherInfo(place);
    
});
fetchCity.addEventListener('input',()=>{
    let place=fetchCity.value;
    if(place==""){
        userInfo.classList.add('yourWeather-remove');
        
    }
   
})
