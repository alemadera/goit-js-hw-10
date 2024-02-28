import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

document.addEventListener("DOMContentLoaded", async function() {
  const breedSelect = document.querySelector(".breed-select");
  const loader = document.querySelector(".loader");
  const catInfo = document.querySelector(".cat-info");
  const errorDisplay = document.querySelector(".error");

  // Función para mostrar el cargador
  function showLoader() {
    loader.style.display = "block";
  }

  // Función para ocultar el cargador
  function hideLoader() {
    loader.style.display = "none";
  }

  // Función para mostrar el mensaje de error
  function showError(message) {
    Notiflix.Report.failure('Error', message, 'OK');
  }

  // Función para ocultar el mensaje de error
  function hideError() {
    errorDisplay.style.display = "none";
  }

  // Función para renderizar la información del gato
  function renderCatInfo(catData) {
    // Implementa la lógica para renderizar la información del gato en el DOM
    const catInfo = document.querySelector(".cat-info");
    catInfo.style.display = "flex";
    catInfo.style.alignItems = "center";
  
    // Crea elementos HTML para mostrar la información del gato
    const imageElement = document.createElement("img");
    imageElement.src = catData.imageUrl;
    imageElement.alt = "Cat Image";
    imageElement.style.maxWidth = "50%";

    const textElement = document.createElement("div");
    textElement.textContent = `Name: ${catData.breedName}\nDescription: ${catData.description}\nTemperament: ${catData.temperament}`;
    textElement.style.flex = "1"; // La otra columna toma todo el espacio disponible

    // Limpia cualquier contenido previo en el elemento catInfo
    catInfo.innerHTML = "";

    // Agrega los elementos creados al elemento catInfo para mostrar la información
  
    catInfo.appendChild(imageElement);
    catInfo.appendChild(textElement);
  }

  try {
    showLoader();
    const breeds = await fetchBreeds();
    const breedOptions = breeds.map(breed => ({ text: breed.name, value: breed.id }));

    // Inicializa SlimSelect después de obtener la lista de razas de gatos
    const slim = new SlimSelect(".breed-select", {
      placeholder: 'Select a breed',
      allowDeselect: true,
      onChange: async (val) => {
        showLoader();
        hideError(); // Oculta cualquier mensaje de error anterior
        try {
          const catData = await fetchCatByBreed(val);
          renderCatInfo(catData);
        } catch (error) {
          showError("Error fetching cat information. Please try again later.");
        } finally {
          hideLoader();
        }
      }
    });

    // Verifica si SlimSelect se ha inicializado correctamente
    if (slim && slim instanceof SlimSelect) {
      slim.setData(breedOptions);
    } else {
      console.error("SlimSelect is not properly initialized.");
    }
  } catch (error) {
    showError("Error fetching cat breeds. Please try again later.");
  } finally {
    hideLoader();
  }
});