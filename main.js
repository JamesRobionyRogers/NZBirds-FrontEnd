
let allBirdData = {}; 
const conservationStatusColors = {
    "Not Threatened": "#02a028",
    "Naturally Uncommon": "#649a31",
    "Relict": "#99cb68",
    "Recovering": "#fecc33",
    "Declining": "#fe9a01",
    "Nationally Increasing": "#c26967",
    "Nationally Vulnerable": "#9b0000",
    "Nationally Endangered": "#660032",
    "Nationally Critical": "#320033",
    "Extinct": "black",
    "Data Deficient": "black"
}; 

const sortOptions = [
    'Name A-Z',
    'Name Z-A',
    'Lightest to Heaviest',
    'Heaviest to Lightest',
    'Smallest to Largest',
    'Largest to Smallest'
];



// Fetch the information from the JSON file and store it in an object 
const fetchData = async () => {
    const response = await fetch('./data/nzbird.json');
    if (!response.ok) {
        console.error(response.status); // error handling
    }

    // convert JSON to object 
    return response.json(); 
}

const populateFilterInfo = () => {
    const filterContainer = document.querySelector('#filter_conservation_status');
    const sortContainer = document.querySelector('#sort_cards');

    const conservationStatus = Object.keys(conservationStatusColors);

    // Appending option children to the filter container
    conservationStatus.forEach((status) => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;

        filterContainer.appendChild(option);
    });

    // Appending option children to the sort container
    sortOptions.forEach((option) => {
        const sortOption = document.createElement('option');
        sortOption.value = option;
        sortOption.textContent = option;

        sortContainer.appendChild(sortOption);
    });
}

const displayBirds = async ({type, query}) => {
    const cardContainer = document.querySelector('.all_cards_container');
    cardContainer.innerHTML = '';       // Clearing the card container

    // Filtering the birds by search query 
    let filteredBirds = {}; 
    switch (type) {
        case 'search':
            filteredBirds = filterBirdsBySearch(allBirdData, query);
            break;

        case 'status':
            filteredBirds = filterBirdsByStatus(allBirdData, query);
            break; 

        case `sort`:
            filteredBirds = sortBirds(allBirdData, query);
            break;
    
        default:
            break;
    }

    // Displaying the cards
    filteredBirds.forEach((bird) => {
        const card = constructCard(bird); 
        cardContainer.innerHTML += card;
    });

    // Display a message for no results
    if (filteredBirds.length === 0) {
        cardContainer.innerHTML = '<h3>No results found</h3>';
    }
}

const filterBirdsBySearch = (data, searchQuery) => {
    return data.filter((bird) => {
        const birdName = bird.primary_name.toLowerCase(); 
        const scientificName = bird.scientific_name.toLowerCase();

        return birdName.includes(searchQuery.toLowerCase()) || scientificName.includes(searchQuery.toLowerCase());
    });
}

const filterBirdsByStatus = (data, status) => {
    return (status === 'Any') ? data : data.filter((bird) => {
        return bird.status == status;
    });
}

const sortBirds = (data, sortBy) => {
    return data.sort((a, b) => {
        switch (sortBy) {
            case 'Name A-Z':
                return a.primary_name.localeCompare(b.primary_name);
                break;
            
            case 'Name Z-A':
                return b.primary_name.localeCompare(a.primary_name);
                break;

            default: 
                break;
        }
    });
}

const constructCard = (bird) => {

    return `
    <div class="card_container">
        <div class="glass_effect" style="background-image: url(${bird.photo.source});"></div>

        <div class="card_data">
            <div class="card_img" style="background-image: url(${bird.photo.source});"></div>

            <div class="card_text_container">
                <h4>${bird.primary_name}</h4>

                <table class="card_text">
                    <tr>
                        <td>Scientific Name:</td>
                        <td>${bird.scientific_name}</td>
                    </tr>
                    <tr>
                        <td>Family:</td>
                        <td>${bird.family}</td>
                    </tr>
                    <tr>
                        <td>Order:</td>
                        <td>${bird.order}</td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td>${bird.status}</td>
                    </tr>
                    <tr>
                        <td>Length:</td>
                        <td>${bird.size.length.value} ${bird.size.length.units}</td>
                    </tr>
                    <tr>
                        <td>Weight:</td>
                        <td>${bird.size.weight.value} ${bird.size.weight.units}</td>
                    </tr>
                </table>
            </div>

        </div>

        <div class="card_conservation_status" style="background-color: ${conservationStatusColors[bird.status]};"></div>

    </div>
    `
}

const conservationKeyHelp = () => {
    Swal.fire({
        title: 'Conservation Status Key',
        html: `
        <table><thead><tr><th>Status Key</th><th>Hex Code</th><th style="text-align:center">Colour</th></tr></thead><tbody><tr><td>Not Threatened</td><td><code>#02a028</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#02a028;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Naturally Uncommon</td><td><code>#649a31</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#649a31;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Relict</td><td><code>#99cb68</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#99cb68;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Recovering</td><td><code>#fecc33</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#fecc33;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Declining</td><td><code>#fe9a01</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#fe9a01;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Nationally Increasing</td><td><code>#c26967</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#c26967;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Nationally Vulnerable</td><td><code>#9b0000</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#9b0000;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Nationally Endangered</td><td><code>#660032</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#660032;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Nationally Critical</td><td><code>#320033</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#320033;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Extinct</td><td><code>black</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#000;width:16px;height:16px;display:inline-block"></div></td></tr><tr><td>Data Deficient</td><td><code>black</code></td><td style="text-align:center"><div style="border:2px solid #000;background:#000;width:16px;height:16px;display:inline-block"></div></td></tr></tbody></table>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        customClass: {
            container: 'conservation_key_container',
            title: 'conservation_key_title',
            closeButton: 'conservation_key_close_button'
        }
    })
}

const sortByHelp = () => {
    Swal.fire({
        title: 'Sort Birds By: Help',
        text: 'Sort birds by a given parameter.',
        showCloseButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        customClass: {
            container: 'conservation_key_container',
            title: 'conservation_key_title',
            closeButton: 'conservation_key_close_button'
        }
    });
}

// Adding an event listener to the search bar
const searchBar = document.getElementById('search_input');
searchBar.addEventListener('input', (event) => {
    const searchQuery = event.target.value;
    const payload = {
        type: 'search',
        query: searchQuery
    };
    displayBirds(payload);
}); 

// Adding an event listener to the conservation status filter
const conservationStatusFilter = document.getElementById('filter_conservation_status');
conservationStatusFilter.addEventListener('change', (event) => {
    const query = event.target.value;
    const payload = {
        type: 'status', 
        query: query
    };

    displayBirds(payload);
});

// Adding an event listener to the sort filter
const sortFilter = document.getElementById('sort_cards');
sortFilter.addEventListener('change', (event) => {
    const query = event.target.value;
    const payload = {
        type: 'sort',
        query: query
    };

    displayBirds(payload);
})


const main = async () => {
    try {
        allBirdData = await fetchData();
        populateFilterInfo(); 
        // 
        displayBirds({type: 'search', query: ''});
    } catch (error) {
        console.error(error);
        displayError();
    }
}

main(); 

