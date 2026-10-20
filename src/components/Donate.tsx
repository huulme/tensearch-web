type DonateProps = {
	open: boolean;
	onClose: () => void;
};

export function Donate({ open, onClose }: DonateProps) {
	if (!open) return null;

	return (
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
			onClick={onClose}
		>
			<div
				class="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-line"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 class="text-xl font-bold text-ink">support tensearch</h2>
				<p class="mt-2 text-muted">
					tensearch is free software maintained entirely by{' '}
					<a
						class="text-accent-text underline hover:no-underline"
						href="https://hulme.rocks/"
						target="_blank"
					>
						one 15-year-old developer
					</a> running at a loss. if you have found it helpful in any way, please
					consider donating to cover the (currently) small hosting cost and my
					personal expenses.
				</p>
				<div class="mt-6 flex justify-end gap-2 *:hover:cursor-pointer">
					<button
						type="button"
						class="rounded-lg px-4 py-2 text-muted hover:text-ink transition-colors"
						onClick={onClose}
					>
						Maybe later
					</button>
					<a
						href="https://ko-fi.com/hulme"
						target="_blank"
						class="rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent hover:bg-accent-hover transition-colors"
						onClick={onClose}
					>
						Donate
					</a>
				</div>
			</div>
		</div>
	);
}