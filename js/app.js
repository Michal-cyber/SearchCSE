/**
 * Konstanty a potrebne premenne, API kluc, cx, vysledky a buttony
 */
const apiKey = 'AIzaSyDwJPkSjcW1XRunlQRwxh7VJzAkcCDzeHE';
const cx = '473f7e602069a40d0';  // Získaj ID z Google CSE;
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const CSVButton = document.getElementById('downloadCSV');
const JSONButton = document.getElementById('downloadJSON');
const Cookies = document.getElementById('cookieConsent');
let searchData;

// schovame buttony na zaciatku stranky
CSVButton.style.display = 'none';
JSONButton.style.display = 'none';

 // Kontrola súhlasu s cookies
 const checkCookieConsent = () => {
    const consentGiven = localStorage.getItem('cookieConsent');
    consentGiven? Cookies.style.display = 'none' : Cookies.style.display = 'block';
};

const setCookieConsent = () => {
    localStorage.setItem('cookieConsent', 'true');
    Cookies.style.display = 'none';
};

document.getElementById('acceptCookies').addEventListener('click', setCookieConsent);

// Funkcia na vykonanie vyhľadávania
const searchGoogle = async (query) => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json(); 
        return data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return null;
    }
};

/**
 * 
 * Zobrazujem vysledky, najskor si to vynulujem, keby nahodou tam nieco bolo, stale mi to moze vratit prazdny objekt
 * 
 */
const displayResults = (data) => {
    resultsDiv.innerHTML = '';
    if (data && data.items) {
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<h3><a href="${item.link}">${item.title}</a></h3><p>${item.snippet}</p>`;
            resultsDiv.appendChild(div);
        });
        searchData = data; // Uložíme výsledky do premennej
        // zobrazi buttony
        CSVButton.style.display = 'inline-block';
        JSONButton.style.display = 'inline-block';
    } else {
        resultsDiv.innerHTML = 'Neboli nájdené žiadne výsledky.';
        // schova buttony
        CSVButton.style.display = 'none';
        JSONButton.style.display = 'none';
    }
};
/**
 * 
 * Stahujem vyhladavanie do JSON file
 */
const downloadJSON = () => {
    if (!searchData || !searchData.items) return;

    const jsonString = JSON.stringify(searchData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'google_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * 
 * Stahujem vyhladavanie do CSV file
 */

const downloadCSV = () => {
    if (!searchData || !searchData.items) return;

    const rows = [
        ['Title', 'Link', 'Snippet'], // Header row
        ...searchData.items.map(item => [item.title, item.link, item.snippet])
    ];

    let csvContent = 'data:text/csv;charset=utf-8,'
        + rows.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'google_results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Vyhladavam po kliknuti na button v mojom CSE
 * alebo stlacim enter
 */
    document.getElementById('searchbtn').addEventListener('click', async () => {
        const query = searchInput.value;
        const data = await searchGoogle(query);
        if (data) {
            displayResults(data);
        }
    });

    searchInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Zabraňuje predvolenému správaniu formulára
            const query = searchInput.value;
            const data = await searchGoogle(query);
                   if (data) {
            displayResults(data);
        }
        }
    });
    
  /**
   * Stahujem cez button, ked budeme chciet rozsirovat download, napriklad, na xml, alebo ine, jednoducho pridame do casea nemusime opakovat vela kodu.
   * 
   */
   const handleDownload = (type) => {
    if (!searchData) return;

    switch (type) {
        case 'json':
            downloadJSON();
            break;
        case 'csv':
            downloadCSV();
            break;
        default:
            console.error('Unknown download type');
    }
};
// pridane "pocuvacov" na tlacidla
   JSONButton.addEventListener('click', () => handleDownload('json'));
   CSVButton.addEventListener('click', () => handleDownload('csv'));


    /**
     * Welcome to the dark side
     */
    document.getElementById('darkModeSwitch').addEventListener('change', () => {
        const body = document.body;
        const label = document.getElementById('darkModeLabel');
        
        // Prepnúť tmavý režim
        body.classList.toggle('dark-mode');
        
        // Zmeniť text
        if (body.classList.contains('dark-mode')) {
            label.textContent = 'Prepnúť na svetlý režim';
        } else {
            label.textContent = 'Prepnúť na tmavý režim';
        }
    });

// Inicializácia
checkCookieConsent();
