import CountrySearch from './components/CountrySearch';

function App() {
    return (
        <div className="country-container">
            <h1>🌍✨ Country Explorer ✨🌍</h1>
            <div className="subtitle">
                <span>Discover flags, capitals, populations & more! 🎈</span>
            </div>
            <CountrySearch />
            <footer className="project-footer">
                <p>This AI project was coded by Snethemba Shangase 🖤 and is on <a href="https://github.com/Vengefulcookie/country-dashboard" target="_blank" rel="noopener noreferrer"> GitHub </a> and hosted on <a href="https://vcookie-country-dashboard.netlify.app/" target="_blank" rel="noopener noreferrer"> Netlify</a>.</p>
            </footer>
        </div>
    );
}

export default App;