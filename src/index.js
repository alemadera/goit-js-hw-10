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
    errorDisplay.textContent = message;
    errorDisplay.style.display = "block";
  }

  // Función para ocultar el mensaje de error
  function hideError() {
    errorDisplay.style.display = "none";
  }

  // Función para renderizar la información del gato
  function renderCatInfo(catData) {
    // Implementa la lógica para renderizar la información del gato en el DOM
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

    // Verifica si hay datos de razas de gatos
    if (breeds.length === 0) {
      showError("No cat breeds found.");
    } else {
      // Agrega "Choose a breed" como la primera opción en la lista de razas de gatos
      const breedOptions = [{ text: "Choose a breed", value: "" }, ...breeds.map(breed => ({ text: breed.name, value: breed.id }))];

      // Inicializa SlimSelect después de obtener la lista de razas de gatos
      const slim = new SlimSelect(".breed-select", {
        placeholder: 'Choose a breed',
        allowDeselect: true,
        deselectLabel: '',
        data: breedOptions,
        onChange: async (val) => {
          if (val){
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
          } else {
            catInfo.style.display = "none";
          }
        }
      });

      // Verifica si SlimSelect se ha inicializado correctamente
      if (slim && slim instanceof SlimSelect) {
        slim.setData(breedOptions);
        slim.set(""); // Deselecciona cualquier valor seleccionado por defecto
      } else {
        console.error("SlimSelect is not properly initialized.");
      }
    }
  } catch (error) {
    showError(" ");
  } finally {
    hideLoader();
  }
});