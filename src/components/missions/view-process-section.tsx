import { Mission } from "@/types/store";
import { Button } from "../ui/button";
import { useMissionComputed } from "./mission-card";

export default function ViewProcessSection(props: {
	mission: Mission;
	state: ReturnType<typeof useMissionComputed>;
	onConfirm: () => void;
}) {
	const { mission, state, onConfirm } = props;
	const { completed, submitting, error, requiredSeconds, timeSpent } = state;

	const capped = Math.min(timeSpent, requiredSeconds);
	const pct = completed ? 1 : capped / requiredSeconds;
	const pctPct = Math.round(pct * 100);
	const remaining = Math.max(0, requiredSeconds - capped);
	const ready = !completed && pct >= 1;

	const openProcess = () => {
		document
			.getElementById("processes")
			?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="mt-5 space-y-4">
			<div
				className={`rounded-xl border bg-card/50 p-4 backdrop-blur-sm transition-colors border-border/40 ${
					completed ? "opacity-70" : "hover:border-border/60"
				}`}
			>
				<div className="space-y-3">
					<p className="text-sm font-medium">View Process Section</p>
					<p className="text-xs leading-relaxed text-muted-foreground">
						Spend {requiredSeconds}s actively viewing the process
						steps. Time accumulates while steps are visible.
					</p>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="min-h-5 text-xs">
					{error ? (
						<span
							className="text-red-500"
							id={`mission-error-${mission.id}`}
						>
							{error}
						</span>
					) : (
						<span
							className="text-muted-foreground"
							id={`mission-help-${mission.id}`}
						>
							{completed
								? "Step completed"
								: ready
								? "You can now confirm"
								: "Keep viewing the process..."}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={openProcess}
						disabled={submitting}
					>
						{completed
							? "View"
							: ready
							? "Review"
							: capped > 0
							? "Continue"
							: "Open"}
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={onConfirm}
						disabled={completed || submitting || !ready}
					>
						{completed
							? "Done"
							: submitting
							? "..."
							: ready
							? "Confirm"
							: `Remaining ${remaining}s`}
					</Button>
				</div>
			</div>
		</div>
	);
}
