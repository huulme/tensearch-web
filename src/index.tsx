import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.js';
import { Home } from './pages/Home.js';
import { Search } from './pages/Search.js';
import { Game } from './pages/Game.js';
import { NotFound } from './pages/_404.jsx';
import './global.css'

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main class="flex justify-center">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/search/:q?" component={Search} />
					<Route path="/game/:q?" component={Game} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<Footer />
		</LocationProvider>
	);
}

const root = document.getElementById('app');
if (root) render(<App />, root);
