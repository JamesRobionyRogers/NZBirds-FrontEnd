
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
    'Alphabetical A-Z',
    'Alphabetical Z-A',
    'Lightest to Heaviest',
    'Heaviest to Lightest',
    'Smallest to Largest',
    'Largest to Smallest'
];

// Default values 
let currentData = {}; 
let currentSort = sortOptions[0];
let currentFilter = 'Any';



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

const displayBirds = async ({ type, query }) => {
    const cardContainer = document.querySelector('.all_cards_container');

    // Clearing the card container
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }

    // Filtering the birds by search query 
    let filteredBirds = currentData;
    switch (type) {
        case 'search':
            filteredBirds = filterBirdsBySearch(allBirdData, query);
            filteredBirds = filterBirdsByStatus(filteredBirds, currentFilter);
            break;

        case 'status':
            filteredBirds = filterBirdsByStatus(allBirdData, query);
            filteredBirds = filterBirdsBySearch(filteredBirds, searchBar.value);
            break;

        default:
            break;
    }

    // Sort the filteredBirds 
    filteredBirds = sortBirds(filteredBirds, currentSort);

    // Using document fragment for more efficient DOM manipulation
    const cardFragment = document.createDocumentFragment();

    // Creating and appending cards to the fragment
    filteredBirds.forEach((bird) => {
        const card = constructCard(bird);
        const cardElement = document.createElement('div');
        cardElement.innerHTML = card; // If you need to parse HTML content
        cardFragment.appendChild(cardElement);
    });

    // Appending the fragment to the container
    cardContainer.appendChild(cardFragment);

    // Display a message for no results
    if (filteredBirds.length === 0) {
        cardContainer.innerHTML = '<h3>No results found</h3>';
    }

    currentData = filteredBirds;
};

const filterBirdsBySearch = (data, searchQuery) => {
    return data.filter((bird) => {
        const birdName = bird.primary_name.toLowerCase(); 
        const englishName = bird.english_name.toLowerCase();
        const scientificName = bird.scientific_name.toLowerCase();
        const otherNames = bird.other_names.map((name) => name.toLowerCase());

        return (birdName.includes(searchQuery.toLowerCase()) || 
            scientificName.includes(searchQuery.toLowerCase()) || 
            englishName.includes(searchQuery.toLowerCase()) ||
            otherNames.includes(searchQuery.toLowerCase())
        );
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
            // Alphabetical A-Z
            case sortOptions[0]:
                return a.primary_name.localeCompare(b.primary_name);
            
            // Alphabetical Z-A
            case sortOptions[1]:
                return b.primary_name.localeCompare(a.primary_name);

            // Lightest to Heaviest
            case sortOptions[2]:
                return a.size.weight.value - b.size.weight.value;

            // Heaviest to Lightest
            case sortOptions[3]:
                return b.size.weight.value - a.size.weight.value;
                
            // Smallest to Largest
            case sortOptions[4]:
                return a.size.length.value - b.size.length.value;

            // Largest to Smallest
            case sortOptions[5]:
                return b.size.length.value - a.size.length.value;

            default: 
                return; 
        }
    });
}

const constructCard = (bird) => {

    return `
    <div class="card_container">
        <div class="glass_effect" style="background-image: url(${bird.photo.source});"></div>

        <div class="card_data">
            <div class="card_img" style="background-image: url(${bird.photo.source});" alt="Photo by ${bird.photo.credit}">
                <p class="photo_credit">Photo by ${bird.photo.credit}</p>
            </div>

            <div class="card_text_container">
                <h4>${bird.primary_name}</h4>

                <table class="card_text">
                    <tr>
                        <td>English Name:</td>
                        <td>${bird.english_name}</td>
                    </tr>
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
        <table>
            <thead>
                <tr>
                    <th>Status Key</th>
                    <th style="text-align:center">Colour</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Not Threatened</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#02a028;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Naturally Uncommon</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#649a31;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Relict</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#99cb68;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Recovering</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#fecc33;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Declining</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#fe9a01;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Nationally Increasing</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#c26967;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Nationally Vulnerable</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#9b0000;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Nationally Endangered</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#660032;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Nationally Critical</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#320033;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Extinct</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#000;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
                <tr>
                    <td>Data Deficient</td>
                    <td style="text-align:center">
                        <div style="border:2px solid #000;background:#000;width:16px;height:16px;display:inline-block"></div>
                    </td>
                </tr>
            </tbody>
        </table>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        focusConfirm: false,
    })
}

const sortByHelp = () => {
    Swal.fire({
        title: 'Sort By',
        text: 'Use this filter to sort the birds by a specific attribute. For example, you can sort the birds by their weight from lightest to heaviest.',
        showCloseButton: true,
        showConfirmButton: false,
        focusConfirm: false,
    });
}

const resetFilters = () => {
    searchBar.value = '';
    conservationStatusFilter.value = 'Any';
    sortFilter.value = sortOptions[0];
    currentSort = sortOptions[0];
    currentFilter = 'Any';
    displayBirds({ type: 'search', query: '' });
}

// Adding an event listener to the search bar
const searchBar = document.getElementById('search_input');
searchBar.addEventListener('input', (event) => {
    const searchQuery = event.target.value;
    const payload = {
        type: 'search',
        query: searchQuery,
    };
    displayBirds(payload);
}); 

// Adding an event listener to the conservation status filter
const conservationStatusFilter = document.getElementById('filter_conservation_status');
conservationStatusFilter.addEventListener('change', (event) => {
    const query = event.target.value;
    const payload = {
        type: 'status', 
        query: query,
    };
    
    currentFilter = query;
    displayBirds(payload);
});

// Adding an event listener to the sort filter
const sortFilter = document.getElementById('sort_cards');
sortFilter.addEventListener('change', (event) => {
    const query = event.target.value;
    currentSort = query;
    displayBirds({ type: 'sort', query: query });
})


const main = async () => {
    try {
        allBirdData = await fetchData();
        populateFilterInfo(); 
        currentData = allBirdData;
        displayBirds({type: 'search', query: ''});
    } catch (error) {
        console.error(error);
        displayError();
    }
}

main(); 

