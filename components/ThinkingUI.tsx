"use client";

import { useEffect, useState } from "react";
import { useIDEStore, AgentStep } from "@/store/useIDEStore";
import { Brain, Search, FlaskConical, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

interface StepInfo {
  id: AgentStep;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const steps: StepInfo[] = [
  {
    id: "analyzing",
    label: "Analyzing Error",
    icon: <Search size={20} />,
    description: "Understanding the problem...",
  },
  {
    id: "verifying",
    label: "Verifying in Sandbox",
    icon: <FlaskConical size={20} />,
    description: "Testing the fix in E2B...",
  },
  {
    id: "self-correcting",
    label: "Self-Correcting",
    icon: <Sparkles size={20} />,
    description: "Refining the solution...",
  },
  {
    id: "done",
    label: "Done",
    icon: <CheckCircle2 size={20} />,
    description: "Fix complete!",
  },
];

export default function ThinkingUI() {
  const { agentStep } = useIDEStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (agentStep === "idle") {
      setCurrentStepIndex(0);
      setProgress(0);
      return;
    }

    const stepIndex = steps.findIndex((step) => step.id === agentStep);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
    }

    // Animate progress bar
    let animationFrame: number;
    let startTime = Date.now();
    const duration = agentStep === "done" ? 500 : 3000; // Faster animation for done

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 99);
      
      setProgress(newProgress);

      if (newProgress < 99) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [agentStep]);

  // Don't show if idle
  if (agentStep === "idle") {
    return null;
  }

  const currentStep = steps[currentStepIndex];
  const isDone = agentStep === "done";

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg shadow-2xl p-6 min-w-[500px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isDone ? "bg-green-600/20" : "bg-purple-600/20"}`}>
            {isDone ? (
              <CheckCircle2 size={24} className="text-green-500" />
            ) : (
              <Brain size={24} className="text-purple-500 animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-100">
              {isDone ? "Fix Complete!" : "AI Agent Working..."}
            </h3>
            <p className="text-sm text-zinc-400">{currentStep.description}</p>
          </div>
          {!isDone && <Loader2 size={20} className="text-purple-500 animate-spin" />}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isDone
                  ? "bg-gradient-to-r from-green-500 to-green-400"
                  : "bg-gradient-to-r from-purple-600 to-purple-400"
              }`}
              style={{ width: `${isDone ? 100 : progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex || isDone;
            const isCurrent = index <= currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : isActive
                        ? "bg-purple-600 border-purple-600 text-white animate-pulse"
                        : isCurrent
                        ? "bg-zinc-800 border-purple-600/50 text-purple-400"
                        : "bg-zinc-900 border-zinc-700 text-zinc-600"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
                      isActive ? "text-purple-400" : isCompleted ? "text-green-500" : "text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${
                      isCompleted ? "bg-green-600" : isCurrent ? "bg-purple-600/50" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Done Message */}
        {isDone && (
          <div className="mt-6 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
            <p className="text-sm text-green-400 text-center">
              ✓ Your code has been fixed and is ready for review in the Diff Editor
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
