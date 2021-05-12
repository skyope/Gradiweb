//
const appId= 'd9e227ad79ad2f4b6cfc430bbfced03c';

const urlApi= `http://api.openweathermap.org/data/2.5/forecast?q=bogota&cnt=3&appid=${appId}`
const urlApiFrench= `https://api.openweathermap.org/data/2.5/weather?q=paris,france&appid=${appId}`
const urlApibogota= `https://api.openweathermap.org/data/2.5/weather?q=bogota,colombia&appid=${appId}`
const urlImagenes = "http://openweathermap.org/img/wn/"
// const urlImagenes =http://openweathermap.org/img/wn/${icon}@2x.png


document.addEventListener('DOMContentLoaded', cargaDocumento)

function cargaDocumento(){
    realizarPeticion(urlApi)
    realizarPeticionBog(urlApibogota)
    realizarPeticionFra(urlApiFrench)
}

//Seccion de peticion
const peticion = (url) =>{
    return new Promise((resolve , reject) =>{
        const xhttp = new XMLHttpRequest();
        xhttp.open('GET',url, true);
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState === 4){
              (xhttp.status ===200)
                ?resolve(JSON.parse(xhttp.responseText))
                :reject (new Error('Error', url))
            }
        }
        xhttp.send()
    })
}

//Desencadenamiento
const realizarPeticion  = async url =>{
    try {
        const data = await peticion(url)
        mostrarDiasSiguientes(data.list)
    } catch (error) {
        console.log(error)
    }
}
//Peticion Bogota
const realizarPeticionBog  = async url =>{
    try {
        const data = await peticion(url)
        mostrarTemperaturaBogota(data)
        mostrarIcono(data)
    } catch (error) {
        console.log(error)
    }
}
//Peticion francia
const realizarPeticionFra  = async url =>{
    try {
        const PeticionFran = await peticion(url)
        mostrarFrancia(PeticionFran)
    } catch (error) {
        console.log(error)
    }
}


//Seccion de pintar HTML
function mostrarTemperaturaBogota(datos){
    console.log(datos)
    const { main :{temp},name} = datos
    console.log(temp)
    let NombreCiudad = document.querySelector("#NombreCiudad");
    const climaActual = document.querySelector("#climaActual");

    NombreCiudad.textContent= name;
    let centigrados =  Centigrados(temp)
    console.log(centigrados)

    const clima = document.createElement('p');
    clima.classList.add('clima-actual')
    clima.innerHTML = `${centigrados}°`
    climaActual.appendChild(clima);
}

function mostrarIcono(datos){
        const { weather} = datos
        const urlImage = `${urlImagenes}${weather[0].icon}@2x.png`;
        let img = document.createElement('img');
        img.src = urlImage;
        let climaIcono = document.querySelector("#climaIcono");
        climaIcono.appendChild(img); 
}

function mostrarDiasSiguientes(data){
    let resultadoProximosDias = document.querySelector("#resultadoProximosDias");
    data.forEach(clima => {
        let { main :{temp_max, temp_min}, weather:[{icon,description}]} = clima
        temp_max =  Centigrados(temp_max);
        temp_min =  Centigrados(temp_min);
        let div = document.createElement('div')
        div.classList.add("contenedor-clima-proximo");
        div.innerHTML=`
                    <img src="${urlImagenes}${icon}@2x.png" alt="ico ${description}" title="ico ${description}">
                    <div class="texto-clima-proximo">
                        <p>Friday</p>
                        <p><span>${description}</span></p>
                    </div>
                    <div class="clima-proximo">
                        ${temp_max}°/${temp_min}°
                    </div>
        `
        resultadoProximosDias.appendChild(div)
    });
}
function mostrarFrancia(data){
    let resultadoInternacional = document.querySelector("#resultadoConsultaInternacional");
    let climaIcoResultados = document.querySelector("#climaIcoResultados");
    let { main :{temp , humidity },name, wind:{speed}, weather:[{icon,description}]} = data
    const centigrados =  Centigrados(temp)
    
    climaIcoResultados.src=`${urlImagenes}${icon}@2x.png`;

    let div = document.createElement('div');
    div.classList.add('clima-otro-pais')
    div.innerHTML=`
            <div class="seccion-img-paises">
                <div class="background-ico">
                    <img src="${urlImagenes}${icon}@2x.png" alt="Imagen con relacion al clima" title="imagen con relacion al clima">
                </div>
                <div class="datos-clima-otro-pais">
                    <p class="br-1"><span>${centigrados}°</span></p>
                    <div class="titulo-otro-pais">
                        <p> Lyon</p>
                        <p> ${name}</p>
                    </div>
                </div>
            </div>
            <div class="seccion-bottom">
                <p>Humidity ${humidity}%</p>
                <p>North</p>
                <p>${speed}km/h</p>
            </div>
    `
    resultadoInternacional.appendChild(div);
}

function Centigrados(grados){
    return parseInt(grados - 273.15)
}