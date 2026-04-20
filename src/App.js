import CountrySearch from './components/CountrySearch';

function App() {
    return (
        <div className="country-container">
            <h1>🌍✨ Country Explorer ✨🌍</h1>
            <div className="subtitle">
                <span>Discover flags, capitals, populations & more! 🎈</span>
            </div>
            <CountrySearch />
        </div>
    );
}

export default App;