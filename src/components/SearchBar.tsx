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
		<form className="sm:w-full sm:max-w-75 md:max-w-100 lg:max-w-125 xl:max-w-150 bg-surface rounded-xl p-1 border-line transition-all border-2" onSubmit={handleSubmit}>
			<input type="search" name={"q"} className="size-full text-center placeholder:text-muted" placeholder="search" />
		</form>
	);
}