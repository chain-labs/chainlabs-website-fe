import { Mission } from "@/types/store";
import { Button } from "../ui/button";
import { useMissionComputed } from "./mission-card";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function ReadCaseStudySection(props: {
	mission: Mission;
	state: ReturnType<typeof useMissionComputed>;
	onConfirm: () => void;
	openCaseStudy: () => void;
}) {
	const { mission, state, onConfirm, openCaseStudy } = props;
	const {
		completed,
		submitting,
		error,
		targetCaseStudy,
		requiredSeconds,
		timeSpent,
	} = state;

	const capped = Math.min(timeSpent, requiredSeconds);
	const pct = completed ? 1 : capped / requiredSeconds;
	const pctPct = Math.round(pct * 100);
	const remaining = Math.max(0, requiredSeconds - capped);
	const ready = !completed && pct >= 1;

	// --- Auto submit when in view & ready ---
	const rootRef = useRef<HTMLDivElement | null>(null);
	const inView = useInView(rootRef, { amount: 0.4 });
	const autoSubmittedRef = useRef(false);
	useEffect(() => {
		if (
			inView &&
			ready &&
			!completed &&
			!submitting &&
			!autoSubmittedRef.current
		) {
			autoSubmittedRef.current = true;
			onConfirm(); // triggers submitAnswer upstream
		}
	}, [inView, ready, completed, submitting, onConfirm]);

	return (
		<div ref={rootRef} className="mt-5 space-y-4">
			<div
				className={`rounded-xl border bg-card/50 p-4 backdrop-blur-sm transition-colors border-border/40 ${
					completed ? "opacity-70" : "hover:border-border/60"
				}`}
			>
				<div className="space-y-3">
					<p className="text-sm font-medium">
						Read Case Study{" "}
						{targetCaseStudy && (
							<span className="text-primary">
								“{targetCaseStudy.title}”
							</span>
						)}
					</p>
					<p className="text-xs leading-relaxed text-muted-foreground">
						Spend {requiredSeconds}s with the case study. Progress
						updates automatically.
					</p>
				</div>
			</div>

			{/* Actions */}
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
								: "Keep reading..."}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={openCaseStudy}
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
