import { Mission } from "@/types/store";
import { useMissionComputed } from "./mission-card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function InputMissionSection(props: {
	mission: Mission;
	answer: string;
	setAnswer: (v: string) => void;
	state: ReturnType<typeof useMissionComputed>;
}) {
	const { mission, answer, setAnswer, state } = props;
	const { submitAnswer, completed, submitting, error } = state;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!answer.trim() || submitting) return;
		try {
			await submitAnswer(mission.id, answer.trim());
			setAnswer("");
		} catch {}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mt-5 space-y-3 flex flex-col justify-between h-full"
		>
			<label htmlFor={`mission-answer-${mission.id}`} className="sr-only">
				Answer for mission {mission.title}
			</label>
			<div
				className={`relative rounded-2xl border transition-colors focus-within:ring-2 ${
					error
						? "border-red-500/60 focus-within:ring-red-500/30"
						: "border-border/40 focus-within:ring-primary/30 focus-within:border-primary/50"
				} bg-black/5 backdrop-blur-xl ${completed ? "opacity-70" : ""}`}
			>
				<Textarea
					id={`mission-answer-${mission.id}`}
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
							e.preventDefault();
							(
								e.currentTarget.form as HTMLFormElement | null
							)?.requestSubmit();
						}
					}}
					placeholder={
						completed
							? "This mission is completed."
							: mission.input?.placeholder || "Your answer..."
					}
					disabled={completed || submitting}
					maxLength={280}
					aria-invalid={!!error}
					aria-describedby={`mission-help-${mission.id} ${
						error ? `mission-error-${mission.id}` : ""
					}`}
					className="w-full rounded-2xl bg-transparent py-3 min-h-24 resize-y text-base leading-relaxed placeholder:text-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed"
				/>
			</div>

			<div className="flex items-center justify-between gap-3">
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
							id={`mission-help-${mission.id}`}
							className="text-muted-foreground"
						>
							{completed
								? "Step completed"
								: "This will help us to understand you more"}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<span
						className={`text-xs tabular-nums ${
							answer.length > 260
								? "text-amber-600"
								: "text-muted-foreground"
						}`}
					>
						{answer.length}/280
					</span>
					{answer && !completed && !submitting && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setAnswer("")}
						>
							Clear
						</Button>
					)}
					<Button
						type="submit"
						size="sm"
						disabled={completed || submitting || !answer.trim()}
					>
						{completed
							? "Completed"
							: submitting
							? "Submitting..."
							: "Submit"}
					</Button>
				</div>
			</div>
		</form>
	);
}
