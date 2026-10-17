import { useEffect, useState } from 'preact/hooks';
import { useRoute } from 'preact-iso';

type GameLink = {
	url: string;
	host: string | null;
	version?: string | null;
	part?: number;
};

type HostSource = {
	base?: GameLink[];
	update?: GameLink[];
	dlc?: GameLink[];
	notes?: string | null;
	error?: string | null;
	title?: string;
	link?: string;
	pubDate?: string;
	[key: string]: unknown;
};

type GameResponse = {
	titleId: string;
	query: string;
	iconUrl: string | null;
	bannerUrl: string | null;
	hosts: Record<string, HostSource | null>;
};

type ErrorResponse = {
	error: string;
};

const SUBSECTIONS = [
	{ key: 'base', label: 'base' },
	{ key: 'update', label: 'update' },
	{ key: 'dlc', label: 'dlc' },
] as const;

type SubsectionKey = (typeof SUBSECTIONS)[number]['key'];

function linksOf(source: HostSource | null | undefined, key: SubsectionKey): GameLink[] {
	const links = source?.[key];
	return Array.isArray(links) ? (links as GameLink[]) : [];
}

function countLinks(source: HostSource | null | undefined): number {
	if (!source) return 0;
	return linksOf(source, 'base').length + linksOf(source, 'update').length + linksOf(source, 'dlc').length;
}

type UpdateGroup = {
	version: string | null;
	links: GameLink[];
};

type PartGroup = {
	part: number | null;
	links: GameLink[];
};

function groupUpdates(links: GameLink[]): UpdateGroup[] {
	const groups: UpdateGroup[] = [];
	const byVersion = new Map<string | null, GameLink[]>();
	for (const link of links) {
		const key = link.version ?? null;
		let group = byVersion.get(key);
		if (!group) {
			group = [];
			byVersion.set(key, group);
			groups.push({ version: key, links: group });
		}
		group.push(link);
	}
	return groups;
}

function groupParts(links: GameLink[]): PartGroup[] {
	const groups: PartGroup[] = [];
	const byPart = new Map<number | null, GameLink[]>();
	for (const link of links) {
		const key = link.part ?? null;
		let group = byPart.get(key);
		if (!group) {
			group = [];
			byPart.set(key, group);
			groups.push({ part: key, links: group });
		}
		group.push(link);
	}
	return groups;
}

function needsPartGrouping(groups: PartGroup[]): boolean {
	return groups.length > 1 || groups[0]?.part != null;
}

function notesOf(source: HostSource | null | undefined): string | null {
	const notes = source?.notes;
	if (typeof notes !== 'string') return null;
	const trimmed = notes.trim();
	return trimmed || null;
}

export function Game() {
	const { params } = useRoute();
	const titleId = params.q ?? '';
	const [data, setData] = useState<GameResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!titleId) {
			setData(null);
			setError(null);
			return;
		}

		let cancelled = false;
		setLoading(true);
		setError(null);
		setData(null);

		fetch(`https://api.tensear.ch/search?titleid=${encodeURIComponent(titleId)}`)
			.then(async (res) => {
				const body = await res.json().catch(() => null);
				if (!res.ok) {
					throw new Error((body as ErrorResponse | null)?.error ?? `request failed (${res.status})`);
				}
				return body as GameResponse;
			})
			.then((game) => {
				if (!cancelled) setData(game);
			})
			.catch((err: unknown) => {
				if (!cancelled) setError(err instanceof Error ? err.message : 'failed to load links');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [titleId]);

	if (!titleId) {
		return (
			<section class="m-10 text-center">
				<p class="text-muted">no game selected. search for a game first.</p>
			</section>
		);
	}

	if (loading) {
		return (
			<section class="m-10 text-center">
				<p class="text-muted">loading links for {titleId}…</p>
			</section>
		);
	}

	if (error) {
		return (
			<section class="m-10 text-center">
				<h1 class="text-2xl font-bold">couldn't load {titleId}</h1>
				<p class="text-muted mt-2">{error}</p>
			</section>
		);
	}

	if (!data) return null;

	const hostEntries = Object.entries(data.hosts ?? {}).filter(
		(entry): entry is [string, HostSource] => entry[1] != null && typeof entry[1] === 'object',
	);
	const totalLinks = hostEntries.reduce((sum, [, source]) => sum + countLinks(source), 0);

	return (
		<section class="mt-6 w-full max-w-3xl px-4 pb-10">
			<div class="overflow-hidden rounded-xl bg-surface border-2 border-line">
				{data.bannerUrl && (
					<img
						src={`https://wsrv.nl?url=${encodeURIComponent(data.bannerUrl)}&output=webp&w=1280`}
						alt=""
						class="w-full max-h-60 object-cover border-b-2 border-line"
					/>
				)}
				<div class="flex items-center gap-4 p-4">
					{data.iconUrl && (
						<img
							src={`https://wsrv.nl?url=${encodeURIComponent(data.iconUrl)}&output=webp&w=256`}
							alt={data.query}
							class="size-20 rounded-lg border-2 border-line object-cover shrink-0"
						/>
					)}
					<div class="min-w-0">
						<h1 class="text-2xl font-bold truncate">{data.query}</h1>
					</div>
				</div>
			</div>

			{totalLinks === 0 ? (
				<p class="mt-6 text-center text-muted">no links found for this game.</p>
			) : (
				<div class="mt-4 flex flex-col gap-6">
					{hostEntries.map(([sourceName, source]) => {
						const total = countLinks(source);
						const note = notesOf(source);
						if (total === 0 && !source.error && !note) return null;
						return (
							<div key={sourceName}>
								<h2 class="text-xl font-bold mb-2">
									{sourceName}
								</h2>
								{note && (
									<div class="mb-3 rounded-lg flex items-center border-2 border-line bg-surface p-3 gap-3">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
										</svg>
										<p class="text-sm">{note}</p>
									</div>
								)}
								<div class="flex flex-col gap-4">
									{SUBSECTIONS.map((sub) => {
										const links = linksOf(source, sub.key);
										if (links.length === 0) return null;
										if (sub.key === 'update') {
											const versionGroups = groupUpdates(links);
											const groupedByVersion = versionGroups.length > 1 || versionGroups[0]?.version != null;
											if (groupedByVersion) {
												return (
													<div key={`${sourceName}-${sub.key}`}>
														<h3 class="font-semibold mb-2 text-muted">{sub.label}</h3>
														<div class="flex flex-col gap-3">
															{versionGroups.map((versionGroup) => {
																const partGroups = groupParts(versionGroup.links);
																if (!needsPartGrouping(partGroups)) {
																	return (
																		<div key={`${sourceName}-${sub.key}-${versionGroup.version ?? 'unversioned'}`}>
																			{versionGroup.version != null && (
																				<h4 class="text-sm font-semibold mb-1 text-muted">{versionGroup.version}</h4>
																			)}
																			<ul class="flex flex-wrap gap-2">
																				{versionGroup.links.map((link) => (
																					<LinkRow
																						key={`${sourceName}-${sub.key}-${versionGroup.version ?? 'unversioned'}-${link.url}`}
																						url={link.url}
																						host={link.host}
																						part={link.part}
																					/>
																				))}
																			</ul>
																		</div>
																	);
																}
																return (
																	<div key={`${sourceName}-${sub.key}-${versionGroup.version ?? 'unversioned'}`}>
																		{versionGroup.version != null && (
																			<h4 class="text-sm font-semibold mb-1 text-muted">{versionGroup.version}</h4>
																		)}
																		<div class="flex flex-col gap-2">
																			{partGroups.map((partGroup) => (
																				<div key={`${sourceName}-${sub.key}-${versionGroup.version ?? 'unversioned'}-${partGroup.part ?? 'unparted'}`}>
																					{partGroup.part != null && (
																						<h5 class="text-sm font-semibold mb-1 text-muted">part {partGroup.part}</h5>
																					)}
																					<ul class="flex flex-wrap gap-2">
																						{partGroup.links.map((link) => (
																							<LinkRow
																								key={`${sourceName}-${sub.key}-${versionGroup.version ?? 'unversioned'}-${partGroup.part ?? 'unparted'}-${link.url}`}
																								url={link.url}
																								host={link.host}
																							/>
																						))}
																					</ul>
																				</div>
																			))}
																		</div>
																	</div>
																);
															})}
														</div>
													</div>
												);
											}
										}
										const partGroups = groupParts(links);
										if (needsPartGrouping(partGroups)) {
											return (
												<div key={`${sourceName}-${sub.key}`}>
													<h3 class="font-semibold mb-2 text-muted">{sub.label}</h3>
													<div class="flex flex-col gap-3">
														{partGroups.map((partGroup) => (
															<div key={`${sourceName}-${sub.key}-${partGroup.part ?? 'unparted'}`}>
																{partGroup.part != null && (
																	<h4 class="text-sm font-semibold mb-1 text-muted">part {partGroup.part}</h4>
																)}
																<ul class="flex flex-wrap gap-2">
																	{partGroup.links.map((link) => (
																		<LinkRow
																			key={`${sourceName}-${sub.key}-${partGroup.part ?? 'unparted'}-${link.url}`}
																			url={link.url}
																			host={link.host}
																		/>
																	))}
																</ul>
															</div>
														))}
													</div>
												</div>
											);
										}
										return (
											<div key={`${sourceName}-${sub.key}`}>
												<h3 class="font-semibold mb-2 text-muted">{sub.label}</h3>
												<ul class="flex flex-wrap gap-2">
													{links.map((link) => (
														<LinkRow key={`${sourceName}-${sub.key}-${link.url}`} url={link.url} host={link.host} part={link.part} />
													))}
												</ul>
											</div>
										);
									})}
								</div>
								{source.error && (
									<p class="mt-2 text-sm text-muted">{source.error}</p>
								)}
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}

function LinkRow(props: { url: string; host: string | null; part?: number }) {
	const label = `${props.host ?? 'download'}${props.part != null ? ` part ${props.part}` : ''}`;
	return (
		<li class="">
			<a
				href={props.url}
				target="_blank"
				rel="noreferrer"
				class="inline-block text-ink hover:shadow-xl border-line hover:-translate-y-0.5 border-2 rounded-lg p-2 font-semibold hover:border-line-strong transition-all bg-surface"
			>
				{label}
			</a>
		</li>
	);
}
