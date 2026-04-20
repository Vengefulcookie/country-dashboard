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
    const [compareMode, setCompareMode] = useState(false);
    const [country2Name, setCountry2Name] = useState('');
    const [country2Data, setCountry2Data] = useState(null);
    const [suggestions2, setSuggestions2] = useState([]);
    const [showSuggestions2, setShowSuggestions2] = useState(false);

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

    async function searchCountryByName(name) {
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

    async function searchCountryByName2(name) {
        if (!name) return;
        
        const url = `https://restcountries.com/v3.1/name/${name}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Country not found');
            const data = await response.json();
            
            let bestMatch = data[0];
            const exactMatch = data.find(country => 
                country.name.common.toLowerCase() === name.toLowerCase()
            );
            
            if (exactMatch) {
                bestMatch = exactMatch;
            }
            
            setCountry2Data(bestMatch);
        } catch (err) {
            setCountry2Data(null);
        }
    }

    async function fetchCountry(){
        await searchCountryByName(countryName);
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setCompareMode(!compareMode)}
                    style={{
                        marginBottom: '20px',
                        background: compareMode ? '#e74c3c' : '#2ecc71'
                    }}
                >
                    {compareMode ? 'Exit Compare Mode' : 'Compare Two Countries'}
                </button>
                
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
                            <div 
                                key={suggestion.code}
                                onClick={async () => {
                                    setCountryName(suggestion.name);
                                    setShowSuggestions(false);
                                    await searchCountryByName(suggestion.name);
                                }}
                                style={{
                                    padding: '8px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                {suggestion.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <button onClick={fetchCountry}>Search</button>
            {loading && <p>🌍 Loading country data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {compareMode && (
                <div style={{ marginTop: '20px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
                    <h3>Compare with:</h3>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Second country..."
                            value={country2Name}
                            onChange={async (e) => {
                                const value = e.target.value;
                                setCountry2Name(value);

                                if (value.length > 1) {
                                    const all = await getAllCountries();
                                    const filtered = all.filter(country => 
                                        country.name.toLowerCase().includes(value.toLowerCase())
                                    ).slice(0, 5);
                                    setSuggestions2(filtered);
                                    setShowSuggestions2(true);
                                } else {
                                    setSuggestions2([]);
                                    setShowSuggestions2(false);
                                }
                            }}
                        />
                        {showSuggestions2 && suggestions2.length > 0 && (
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
                                {suggestions2.map(suggestion => (
                                    <div 
                                        key={suggestion.code}
                                        onClick={async () => {
                                            setCountry2Name(suggestion.name);
                                            setShowSuggestions2(false);
                                            await searchCountryByName2(suggestion.name);
                                        }}
                                        style={{
                                            padding: '8px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #eee'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                                        onMouseLeave={(e) => e.target.style.background = 'white'}
                                    >
                                        {suggestion.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
    
                {countryData && (
                    <div className="country-card" style={{ flex: 1 }}>
                        <img src={countryData.flags?.png} alt={`Flag of ${countryData.name?.common}`} width="200" />
                        <h2>{countryData.name?.common}</h2>
                        <p><strong>Capital:</strong> {countryData.capital?.[0]}</p>
                        <p><strong>Population:</strong> {countryData.population?.toLocaleString()}</p>
                        <p><strong>Region:</strong> {countryData.region}</p>
                        <p><strong>Subregion:</strong> {countryData.subregion}</p>
                        <p><strong>Currency:</strong> {Object.values(countryData.currencies || {})[0]?.name}</p>
                        <p><strong>Languages:</strong> {Object.values(countryData.languages || {}).join(', ')}</p>
                    </div>
                )}
                
                {compareMode && country2Data && (
                    <div className="country-card" style={{ flex: 1 }}>
                        <img src={country2Data.flags?.png} alt={`Flag of ${country2Data.name?.common}`} width="200" />
                        <h2>{country2Data.name?.common}</h2>
                        <p><strong>Capital:</strong> {country2Data.capital?.[0]}</p>
                        <p><strong>Population:</strong> {country2Data.population?.toLocaleString()}</p>
                        <p><strong>Region:</strong> {country2Data.region}</p>
                        <p><strong>Subregion:</strong> {country2Data.subregion}</p>
                        <p><strong>Currency:</strong> {Object.values(country2Data.currencies || {})[0]?.name}</p>
                        <p><strong>Languages:</strong> {Object.values(country2Data.languages || {}).join(', ')}</p>
                    </div>
                )}
            </div>
            
            {compareMode && !country2Data && countryData && (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    👆 Search for a second country above to compare
                </p>
            )}
        </>
    );
}

export default CountrySearch;