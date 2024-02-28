import axios from "axios";

// Establecer la clave API en la cabecera por defecto para todas las solicitudes
axios.defaults.headers.common["x-api-key"] = "live_4GKnCRc94j14SLqeuAx178No8qXxKhrRbjCZ6r6XXS55HTVdY9VXpePMhiK1EhuN";

// Función para hacer una petición HTTP GET a la API de The Cat API para obtener la colección de razas
async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data; // Devolver el array de razas
  } catch (error) {
    console.error('Error:', error);
    throw error; // Propagar el error
  }
}

// Función para hacer una petición HTTP GET a la API de The Cat API para obtener información completa sobre un gato por identificador de raza
async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
    const catData = response.data[0]; // Tomamos el primer resultado asumiendo que es el único
    return {
      breedName: catData.breeds[0].name,
      description: catData.breeds[0].description,
      temperament: catData.breeds[0].temperament,
      imageUrl: catData.url
    };
  } catch (error) {
    console.error('Error:', error);
    throw error; // Propagar el error
  }
}

// Ejemplo de uso de la función fetchBreeds
fetchBreeds()
  .then(breeds => {
    // Hacer algo con el array de razas, por ejemplo, rellenar un select
    const select = document.querySelector('.breed-select');
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      select.appendChild(option);
    });

    // Manejar el cambio en el select de razas
    select.addEventListener('change', async (event) => {
      const breedId = event.target.value;
      try {
        const catData = await fetchCatByBreed(breedId);
        // Mostrar información del gato en el bloque .cat-info
        const catInfo = document.querySelector('.cat-info');
        catInfo.innerHTML = `
          <h2>${catData.breedName}</h2>
          <p>Description: ${catData.description}</p>
          <p>Temperament: ${catData.temperament}</p>
          <img src="${catData.imageUrl}" alt="Cat Image">
        `;
      } catch (error) {
        console.error('Error al obtener la información del gato:', error);
      }
    });
  })
  .catch(error => {
    // Manejar errores de la petición
    console.error('Error al obtener las razas de gatos:', error);
  });

export { fetchBreeds, fetchCatByBreed };
