import { useState } from "react";
import './CountrySearch.css';
import { getAllCountries } from "../services/countryService";

function CountrySearch() {
    const [loading, setLoading] = useState(false);
    const [countryName, setCountryName] = useState('');
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
   
    async function handleInputChange(e) {
        const value = e.target.value;
        setCountryName(value);

        if (value.length > 1) {
            const all = await getAllCountries();
            const filtered = all.filter(country => country.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    async function searchcountryByName(name) {
        if (!name) return;

        setError('');
        setLoading(true);

        const url = `https://restcountries.com/v3.1/name/${name}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Country not found');
            const data = await response.json();

            let bestMatch = data[0];
            const exactMatch = data.find(country => country.name.common.toLowerCase() === name.toLowerCase())
            
            if (exactMatch) {
                bestMatch = exactMatch;
            } else {
                const startsWithMatch = data.find(country => country.name.common.toLowerCase().startsWith(name.toLowerCase()));
                if (startsWithMatch) {
                    bestMatch = startsWithMatch;
                }

            }
            setCountryData(bestMatch);
        } catch (err) {
            setError(err.message);
            setCountryData(null);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCountry(){
        await searchcountryByName(countryName);
    }
    return (
        <div className="country-container">
            <div style= {{ position: 'relative'}}>
            <input
            type="text"
            placeholder="Type a country... e.g Japan"
            value={countryName}
            onChange={handleInputChange}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                {suggestions.map(suggestion => (
                    <div key={suggestion.code}
                    onClick={async () => {
                        setCountryName(suggestion.name);
                        setShowSuggestions(false);
                        await searchcountryByName(suggestion.name);
                    }}
                    style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) => e.target.style.background ='#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                        {suggestion.name}
                    </div>
                ))}
                </div>
            )}
            </div>
            <button onClick = {fetchCountry}>Search</button>
            {loading && <p>🌍 Loading country data... </p>}
            {error && <p style= {{color: 'red'}}>{error}</p>}

            {countryData && (
                <div className="country-card">
                    <img src={countryData.flags?.png} alt={`Flag of ${countryData.name?.common}`} width="200" />
                    <h2>{countryData.name?.common}</h2>
                    <p>Capital: {countryData.capital?.[0]}</p>
                    <p>Population: {countryData.population?.toLocaleString()}</p>
                    <p>Region: {countryData.region}</p>
                    <p>Subregion: {countryData.subregion}</p>
                    <p>Currency: {Object.values(countryData.currencies || {})[0]?.name}</p>
                    <p>Languages: {Object.values(countryData.languages || {}).join(', ')}</p>
                </div>
            )}
        </div>
    );
}

export default CountrySearch;