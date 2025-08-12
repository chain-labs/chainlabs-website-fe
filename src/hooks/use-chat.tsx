import React, { useCallback, useState } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";

function isGoalAlreadySetError(err: unknown): boolean {
	if (!(err instanceof Error)) return false;
	return err.message.includes("Session already has a goal");
}

export const useChat = () => {
	const store = useGlobalStore();
	const [isThisLatestAssistantMessage, setIsThisLatestAssistantMessage] =
		useState(false);

	const sendMessage = useCallback(
		// ...existing code...
		async (content: string) => {
			// Ensure we have a session
			try {
				store.setIsEnsuringSession(true);
				await apiClient.ensureSession();
				store.setHasSession(true);
			} catch (e) {
				console.error("Failed to ensure session", e);
				store.setHasSession(false);
			} finally {
				store.setIsEnsuringSession(false);
			}

			// Add user message to history
			const userMessage = {
				role: "user" as const,
				message: content,
				timestamp: new Date().toISOString(),
			};

			store.addChatMessage(userMessage);
			store.setInputValue("");
			store.setIsThinking(true);
			setIsThisLatestAssistantMessage(true);

			try {
				// Check if goal is already set
				if (store.hasGoal()) {
					// If goal exists, go directly to clarify flow
					store.setIsSubmittingGoal(false);
					store.setIsClarifying(true);

					const clar = await apiClient.clarifyGoal(content);

					// Update state with clarified payload
					store.setHeadline(clar.hero?.title ?? null);
					store.setGoal({ description: clar.goal });
					store.setMissions(
						(clar.missions || []).map((m) => ({
							id: m.id,
							title: m.title,
							points: m.points,
							status: "pending" as const,
							description: (m as any).description,
						}))
					);
					store.setShowPersonalized(true);

					// Select the first pending mission to ask
					const nextMission =
						store.getNextPendingMission() ||
						((clar.missions || [])[0]
							? {
									id: clar.missions[0].id,
									title: clar.missions[0].title,
							  }
							: null);
					store.setCurrentMissionId(
						nextMission ? nextMission.id : null
					);

					// Format a ReactNode with heading, description, process, why, and next mission prompt
					const node = (
						<div>
							{clar.hero?.title && (
								<h3 className="text-xl font-semibold mb-1">
									{clar.hero.title}
								</h3>
							)}
							{clar.hero?.description && (
								<p className="text-sm text-muted-foreground mb-3">
									{clar.hero.description}
								</p>
							)}

							{Array.isArray(clar.process) &&
								clar.process.length > 0 && (
									<div className="mb-4">
										<h4 className="font-medium">Process</h4>
										<ol className="list-decimal list-inside space-y-1 mt-1">
											{clar.process.map((p, idx) => (
												<li key={idx}>
													<span className="font-medium">
														{p.name}:
													</span>{" "}
													<span className="text-sm text-muted-foreground">
														{p.description}
													</span>
												</li>
											))}
										</ol>
									</div>
								)}

							{clar.why && (
								<div className="mb-4">
									<h4 className="font-medium">
										Why this path
									</h4>
									<p className="text-sm text-muted-foreground mt-1">
										{clar.why}
									</p>
								</div>
							)}

							{nextMission ? (
								<div className="mt-2">
									<h4 className="font-medium">
										First mission
									</h4>
									<p className="mt-1">{nextMission.title}</p>
									<p className="text-sm text-muted-foreground mt-2">
										Please answer this to continue. I'll
										guide you through the rest one by one.
									</p>
								</div>
							) : (
								<p className="mt-2">
									No missions are pending right now.
								</p>
							)}
						</div>
					);

					const assistantMessage = {
						role: "assistant" as const,
						message: node,
						timestamp: new Date().toISOString(),
					};
					store.addChatMessage(assistantMessage);

					return clar;
				} else {
					// If no goal exists, try /goal first
					store.setIsSubmittingGoal(true);
					const goalRes = await apiClient.submitGoal(content);

					const assistantMessage = {
						role: "assistant" as const,
						message: goalRes.message || "I'm here to help.",
						timestamp:
							goalRes.timestamp || new Date().toISOString(),
					};
					store.addChatMessage(assistantMessage);

					return goalRes;
				}
			} catch (error) {
				// If goal submission failed and goal already set, use /clarify flow
				if (isGoalAlreadySetError(error)) {
					try {
						store.setIsClarifying(true);

						const clar = await apiClient.clarifyGoal(content);

						// Update state with clarified payload
						store.setHeadline(clar.hero?.title ?? null);
						store.setGoal({ description: clar.goal });
						store.setMissions(
							(clar.missions || []).map((m) => ({
								id: m.id,
								title: m.title,
								points: m.points,
								status: "pending" as const,
								description: (m as any).description,
							}))
						);
						store.setShowPersonalized(true);

						// Select the first pending mission to ask
						const nextMission =
							store.getNextPendingMission() ||
							((clar.missions || [])[0]
								? {
										id: clar.missions[0].id,
										title: clar.missions[0].title,
								  }
								: null);
						store.setCurrentMissionId(
							nextMission ? nextMission.id : null
						);

						// 3) Format a ReactNode with heading, description, process, why, and next mission prompt
						const node = (
							<div>
								{clar.hero?.title && (
									<h3 className="text-xl font-semibold mb-1">
										{clar.hero.title}
									</h3>
								)}
								{clar.hero?.description && (
									<p className="text-sm text-muted-foreground mb-3">
										{clar.hero.description}
									</p>
								)}

								{Array.isArray(clar.process) &&
									clar.process.length > 0 && (
										<div className="mb-4">
											<h4 className="font-medium">
												Process
											</h4>
											<ol className="list-decimal list-inside space-y-1 mt-1">
												{clar.process.map((p, idx) => (
													<li key={idx}>
														<span className="font-medium">
															{p.name}:
														</span>{" "}
														<span className="text-sm text-muted-foreground">
															{p.description}
														</span>
													</li>
												))}
											</ol>
										</div>
									)}

								{clar.why && (
									<div className="mb-4">
										<h4 className="font-medium">
											Why this path
										</h4>
										<p className="text-sm text-muted-foreground mt-1">
											{clar.why}
										</p>
									</div>
								)}

								{nextMission ? (
									<div className="mt-2">
										<h4 className="font-medium">
											First mission
										</h4>
										<p className="mt-1">
											{nextMission.title}
										</p>
										<p className="text-sm text-muted-foreground mt-2">
											Please answer this to continue. I'll
											guide you through the rest one by
											one.
										</p>
									</div>
								) : (
									<p className="mt-2">
										No missions are pending right now.
									</p>
								)}
							</div>
						);

						const assistantMessage = {
							role: "assistant" as const,
							message: node,
							timestamp: new Date().toISOString(),
						};
						store.addChatMessage(assistantMessage);

						return clar;
					} catch (clarifyErr) {
						console.error("Clarify failed:", clarifyErr);
						store.setLastError(
							clarifyErr instanceof Error
								? clarifyErr.message
								: "Clarify failed"
						);
						const errorMessage = {
							role: "assistant" as const,
							message:
								clarifyErr instanceof Error
									? `Error clarifying: ${clarifyErr.message}`
									: "I'm sorry, I couldn't clarify your goal. Please try again.",
							timestamp: new Date().toISOString(),
						};
						store.addChatMessage(errorMessage);
						throw clarifyErr;
					} finally {
						store.setIsClarifying(false);
					}
				}

				// Other errors
				console.error("Failed to send message:", error);
				store.setLastError(
					error instanceof Error ? error.message : "Unknown error"
				);

				// Try to recover session automatically once
				try {
					await apiClient.startSession();
					store.setHasSession(true);
				} catch {
					// ignore
				}

				const errorMessage = {
					role: "assistant" as const,
					message:
						error instanceof Error &&
						error.message === "AUTHENTICATION_FAILED"
							? "Your session has expired. Please refresh the page to continue."
							: error instanceof Error
							? `Error: ${error.message}`
							: "I'm sorry, I encountered an error. Please try again.",
					timestamp: new Date().toISOString(),
				};
				store.addChatMessage(errorMessage);

				throw error;
			} finally {
				store.setIsSubmittingGoal(false);
				store.setIsThinking(false);
				store.setIsClarifying(false);
			}
		},
		[store]
	);

	return {
		messages: store.chatHistory,
		isThinking: store.isThinking,
		inputValue: store.inputValue,
		hasMessages: store.chatHistory.length > 0,
		voiceInputValue: store.voiceInputValue,
		sendMessage,
		isThisLatestAssistantMessage: isThisLatestAssistantMessage,
		setInputValue: store.setInputValue,
		setVoiceInputValue: store.setVoiceInputValue,
		clearMessages: store.clearChatHistory,
		setCurrentContext: store.setCurrentContext,
	};
};
