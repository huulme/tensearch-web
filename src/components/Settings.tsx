type SettingsProps = {
	open: boolean;
	onClose: () => void;
};

export function Settings({ open, onClose }: SettingsProps) {
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
				<h2 class="text-xl font-bold text-ink">settings</h2>
				<p>this is a placeholder i actually didnt make the settings menu yet :troll:</p>
				<div class="mt-6 flex justify-end gap-2 *:hover:cursor-pointer">
					<button class="rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent hover:bg-accent-hover transition-colors" onClick={onClose}>
						aight
					</button>
				</div>
			</div>
		</div>
	);
}