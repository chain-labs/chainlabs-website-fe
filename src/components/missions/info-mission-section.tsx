import { Mission } from "@/types/store";
import { useMissionComputed } from "./mission-card";
import { Button } from "../ui/button";

export default function InfoMissionSection(props: {
	mission: Mission;
	state: ReturnType<typeof useMissionComputed>;
	onConfirm: () => void;
}) {
	const { mission, state, onConfirm } = props;
	const { completed, submitting, error } = state;
	return (
		<div className="mt-5 space-y-4">
			<div
				className={`relative w-full rounded-2xl border px-3 py-3 overflow-hidden transition-colors ${
					error
						? "border-red-500/60"
						: "border-border/40 hover:border-border/60"
				} bg-gradient-to-br from-black/5 via-black/0 to-primary/5 backdrop-blur-xl ${
					completed ? "opacity-70" : ""
				}`}
				aria-hidden="true"
			>
				<div className="flex items-start gap-3">
					<div className="min-w-0 space-y-1.5">
						<p className="text-sm font-medium text-foreground">
							Informational Step
						</p>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Review this step then confirm to earn{" "}
							<span className="font-semibold text-primary">
								{Number(mission.points ?? 0)} points
							</span>
							.
						</p>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="min-h-5 text-xs">
					{error ? (
						<span
							id={`mission-error-${mission.id}`}
							className="text-red-500"
							aria-live="polite"
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
								: "Click confirm to complete this step"}
						</span>
					)}
				</div>
				<Button
					type="button"
					size="sm"
					onClick={onConfirm}
					disabled={completed || submitting}
				>
					{completed
						? "Completed"
						: submitting
						? "Submitting..."
						: "Confirm"}
				</Button>
			</div>
		</div>
	);
}
