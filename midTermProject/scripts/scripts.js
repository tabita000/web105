

/* The javascript syntax below lets you enter a ZIP Code and randomly pick a restaurant nearby. It gets a restaurant from the yelp developer, shows the chosen spot and keeps a list of places that have already Been selected.*/


//API Key from Yelp
const apiKey = 'a8mlpTGuiWIO23ljVJx_63w1CYV1ujbesRM0xLvPhvJIowDNmn7XxZaz4dbjIeuwTC0D7JSydpGkWSQnXHm5n7IonyDltzcdEuY3ElkCKoBP91d7ZmMSyGk_qUIRZ3Yx'; // This is the API key that I pasted from yelp developer

// Function to fetch restaurants based on zip code
async function fetchRestaurants(zipcode) {
  const response = await fetch(`https://api.yelp.com/v3/businesses/search?location=${zipcode}&categories=restaurants`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    alert('UUHH OHH! Invali ZIP Code. Please try again.');
    return [];
  }

  // Convert the response into a JSON object so we can work with the data

  const data = await response.json();

  // If no businesses are found
  if (data.businesses.length === 0) {
    alert('No restaurants found for this zip code.');
    return [];
  }

  // Map the fetched businesses to an array of restaurant objects
  return data.businesses.map(business => ({
    name: business.name,
    cuisine: business.categories[0].title,
    rating: business.rating,
    address: business.location.address1
  }));
}

// Function to randomly select a restaurant from the fetched list
function selectRestaurant(restaurantList) {
  const randomIndex = Math.floor(Math.random() * restaurantList.length);
  return restaurantList[randomIndex];
}

// Function to display the selected restaurant
function displayRestaurant(restaurant) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<h3>You should try: ${restaurant.name} (${restaurant.cuisine}) - ${restaurant.rating} stars</h3><p>Address: ${restaurant.address}</p>`;
}

// Function to update history of visited restaurants
function updateHistory(restaurant) {
  const historyList = document.getElementById('history');
  const listItem = document.createElement('li');
  listItem.textContent = `${restaurant.name} (${restaurant.cuisine})`;
  historyList.appendChild(listItem);
}

// Event listener for the "Pick Now" button to fetch restaurants based on the entered zip code

document.getElementById('spinBtn').addEventListener('click', async () => {
  const zipcode = document.getElementById('zipcode').value;

  if (!zipcode) {
    alert('Please enter a valid zip code.');
    return;
  }

  // Fetch restaurants based on the entered zip code
  const restaurantList = await fetchRestaurants(zipcode);

  // If no restaurants are returned, stop the function
  if (restaurantList.length === 0) {
    return;
  }

  // Pick a random restaurant
  const restaurant = selectRestaurant(restaurantList);

  // Display the selected restaurant
  displayRestaurant(restaurant);

  // Add the restaurant to the history list
  updateHistory(restaurant);
});
