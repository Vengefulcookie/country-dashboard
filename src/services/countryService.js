
let allCountriesData = null;

export async function getAllCountries() {
    if (allCountriesData) return allCountriesData;

    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
    const data = await response.json();
    allCountriesData = data.map(country => ({
        name: country.name.common,
        code: country.cca2
    })).sort((a, b) => a.name.localeCompare(b.name));
    return allCountriesData;
}

export async function getCountryByCode(code) {
    const response = await fetch (`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) throw new Error('Country not found');
    const data = await response.json();
    return data;
}