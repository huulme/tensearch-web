export function Home() {
	return (
		<section class="">
			<div class="flex justify-center flex-row gap-3 *:bg-surface *:border-line *:hover:border-line-strong *:transition-all *:hover:shadow-xl *:hover:-translate-y-0.5 *:p-2 *:border-2 *:rounded-xl">
				<a href="/search/mario">Mario</a>
				<a href="/search/pok%C3%A9mon">Pokémon</a>
				<a href="/search/kirby">Kirby</a>
				<a href="/search/zelda">Zelda</a>
			</div>
			<h1 class="text-4xl mt-10">welcome to tensearch!</h1>
			<p>very early alpha, improvements daily</p>
			<p>join the <a
				class="text-accent-text underline hover:no-underline"
				href="https://hulme.rocks/"
				target="_blank">
				discord</a> server to report bugs or suggest hosts/features</p>
		</section>
	);
}