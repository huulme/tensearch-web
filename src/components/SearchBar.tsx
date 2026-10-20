import { useLocation } from 'preact-iso';

export function SearchBar() {
	const { route } = useLocation();

	function handleSubmit(e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get('q');

		route(`/search/${encodeURIComponent(String(query ?? ''))}`);
	}

	return (
		<form className="flex-1 min-w-0 sm:flex-none sm:w-75 md:w-100 lg:w-125 xl:w-150 bg-surface rounded-xl p-1 border-line transition-all border-2" onSubmit={handleSubmit}>
			<input type="search" name={"q"} className="size-full min-w-0 text-center placeholder:text-muted" placeholder="search" />
		</form>
	);
}