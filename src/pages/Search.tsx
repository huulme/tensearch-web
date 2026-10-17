import { useEffect, useState } from 'preact/hooks';
import { useRoute } from 'preact-iso';

type TitledbItem = {
	name: string;
	publisher: string;
	id: string;
	titleId: string;
	iconUrl: string | null;
};

type TitledbResponse = {
	results?: TitledbItem[];
};

export function Search() {
	const { params } = useRoute();
	const q = params.q ?? '';
	const [items, setItems] = useState<TitledbItem[]>([]);

	useEffect(() => {
		if (!q) {
			setItems([]);
			return;
		}

		let cancelled = false;

		fetch(`https://api.tensear.ch/titledb?query=${encodeURIComponent(q)}`)
			.then((res) => res.json())
			.then((data: TitledbResponse) => {
				if (!cancelled) setItems(data.results ?? []);
			})
			.catch(() => {
				if (!cancelled) setItems([]);
			});

		return () => {
			cancelled = true;
		};
	}, [q]);

	return (
		<section class="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 justify-center items-center">
			{items.map((item) => (
				<Listing
					key={item.titleId ?? item.id}
					name={item.name}
					publisher={item.publisher}
					titleId={item.titleId ?? item.id}
					iconUrl={item.iconUrl}
				/>
			))}
		</section>
	);
}

function Listing(props: { name: string; publisher: string; titleId: string; iconUrl: string | null }) {
	return (
		<a href={`/game/${props.titleId}`} class="flex flex-col w-50 rounded-xl bg-surface hover:-translate-y-0.5 transition-all hover:shadow-xl border-2 border-line hover:border-line-strong overflow-hidden">
			<img src={`https://wsrv.nl?url=${props.iconUrl}&output=webp&w=512`} alt={props.name} class="border-b-2 border-inherit"/>
			<div class="p-2 *:truncate">
				<h2 class="font-bold">{props.name}</h2>
				<p>{props.publisher}</p>
			</div>
		</a>
	);
}