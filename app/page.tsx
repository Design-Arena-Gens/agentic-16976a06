"use client";

import { useMemo, useState } from "react";
import { AgentSection } from "../components/agent-section";
import {
  buildDistributionPlan,
  buildIdea,
  buildScript,
  buildVisualPlan,
  type DistributionPlan,
  type GeneratorInput,
  type IdeaOutput,
  type ScriptOutput,
  type VisualPlan
} from "../lib/agent-engine";
import { motion } from "framer-motion";
import clsx from "clsx";

type FormState = {
  topic: string;
  audience: string;
  tone: string;
  goal: string;
  brandKeywords: string;
  duration: number;
};

type AgentBundle = {
  idea: IdeaOutput;
  script: ScriptOutput;
  visuals: VisualPlan;
  distribution: DistributionPlan;
};

const DEFAULT_FORM: FormState = {
  topic: "AI tools for creators",
  audience: "busy YouTube creators",
  tone: "high-energy",
  goal: "grow your channel fast",
  brandKeywords: "ShortSpark Studio",
  duration: 55
};

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [step, setStep] = useState<"idle" | "generating" | "ready">("idle");
  const [snapshot, setSnapshot] = useState<GeneratorInput | null>(null);

  const outputs: AgentBundle | null = useMemo(() => {
    if (step !== "ready" || !snapshot) return null;
    return {
      idea: buildIdea(snapshot),
      script: buildScript(snapshot),
      visuals: buildVisualPlan(snapshot),
      distribution: buildDistributionPlan(snapshot)
    };
  }, [snapshot, step]);

  const handleInputChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "duration" ? Number(value) || prev.duration : value
    }));
    setStep("idle");
  };

  const runAgents = () => {
    const nextInput: GeneratorInput = {
      topic: form.topic.trim(),
      audience: form.audience.trim(),
      tone: form.tone.trim(),
      goal: form.goal.trim(),
      brandKeywords: form.brandKeywords.trim(),
      duration: form.duration
    };
    setSnapshot(nextInput);
    setStep("generating");
    setTimeout(() => {
      setStep("ready");
    }, 450);
  };

  return (
    <div className="relative overflow-hidden pb-32">
      <GradientBackdrop />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 md:px-12">
        <Hero onGenerate={runAgents} generating={step === "generating"} />
        <div className="grid gap-8 lg:grid-cols-[360px,1fr]">
          <ControlPanel form={form} onChange={handleInputChange} onGenerate={runAgents} generating={step === "generating"} />
          <Timeline step={step} />
        </div>
        {outputs ? (
          <section className="grid gap-8 text-sm xl:grid-cols-2">
            <AgentSection
              tone="idea"
              title="Ideation Agent"
              subtitle="Rapid ideation tailored to your audience and niche."
            >
              <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
                <h3 className="text-lg font-semibold text-white">Hook</h3>
                <p className="mt-2 text-base font-medium text-brand-accent">{outputs.idea.hook}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Concept</h4>
                <p className="mt-1 leading-relaxed text-white/80">{outputs.idea.concept}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Beat Breakdown</h4>
                <ul className="mt-2 space-y-2">
                  {outputs.idea.supportingPoints.map((point) => (
                    <li
                      key={point}
                      className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-white/80 shadow-inner shadow-black/20"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Title Sparks</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {outputs.idea.titleIdeas.map((title) => (
                    <span key={title} className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </AgentSection>

            <AgentSection
              tone="script"
              title="Script Agent"
              subtitle="Crisp voiceover cues with delivery notes optimised for retention."
            >
              <div className="grid gap-3">
                {outputs.script.beats.map((beat) => (
                  <div key={beat.timestamp} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{beat.timestamp}</span>
                      <span>{beat.delivery}</span>
                    </div>
                    <p className="mt-2 text-base font-semibold text-white/90">{beat.line}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-accent">{beat.action}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/5 bg-brand-accent/10 p-4 text-sm">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/70">Voiceover Direction</h4>
                <p className="mt-1 text-white/80">{outputs.script.voiceover}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-brand/10 p-4 text-sm">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/70">Pacing</h4>
                <p className="mt-1 text-white/80">{outputs.script.pacing}</p>
              </div>
            </AgentSection>

            <AgentSection tone="visual" title="Motion Director" subtitle="Shot-by-shot visual blueprint with overlays and motion cues.">
              <div className="grid gap-3">
                {outputs.visuals.beats.map((beat) => (
                  <div key={beat.timestamp} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{beat.timestamp}</span>
                      <span>{beat.shotType}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/80">{beat.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-white/70">
                      <span className="rounded-full bg-white/10 px-3 py-1">{beat.motion}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1">{beat.overlay}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">B-Roll Vault</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {outputs.visuals.bRollIdeas.map((idea) => (
                    <span key={idea} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Transitions</h4>
                <ul className="mt-2 space-y-2">
                  {outputs.visuals.transitions.map((transition) => (
                    <li key={transition} className="rounded-xl bg-brand-accent/10 px-4 py-2 text-white/80">
                      {transition}
                    </li>
                  ))}
                </ul>
              </div>
            </AgentSection>

            <AgentSection
              tone="distribution"
              title="Distribution Agent"
              subtitle="Publishing playbook tuned for Shorts momentum and cross-posting."
            >
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Caption</h4>
                <p className="mt-2 text-base text-white/80">{outputs.distribution.caption}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Hashtags</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {outputs.distribution.hashtags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Launch Checklist</h4>
                <ul className="mt-2 space-y-2">
                  {outputs.distribution.postingChecklist.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/80">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-accent" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-brand-accent/15 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">Thumbnail Concept</h4>
                <p className="mt-2 text-white/80">{outputs.distribution.thumbnailConcept}</p>
              </div>
            </AgentSection>
          </section>
        ) : (
          <EmptyState step={step} />
        )}
      </main>
    </div>
  );
}

function Hero({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/40 via-brand-accent/30 to-purple-900/40 p-10 text-white shadow-2xl">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Multimodal Creator Agents
        </div>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">ShortSpark Agent Studio</h1>
        <p className="max-w-2xl text-base text-white/80">
          Generate hooks, scripts, visuals, and publishing playbooks for YouTube Shorts in seconds. Each agent specialises in a stage
          of your workflow so you can focus on shooting, not planning.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {["Hook engineer", "Script polisher", "Motion director", "Distribution strategist"].map((item) => (
            <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-white/80">
              {item}
            </span>
          ))}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={generating}
        className={clsx(
          "mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg",
          generating ? "bg-white/30 text-white/60" : "bg-brand hover:bg-brand-accent transition"
        )}
      >
        {generating ? "Generating..." : "Launch Agent Stack"}
      </motion.button>
    </div>
  );
}

function ControlPanel({
  form,
  onChange,
  onGenerate,
  generating
}: {
  form: FormState;
  onChange: (key: keyof FormState, value: string) => void;
  onGenerate: () => void;
  generating: boolean;
}) {
  const fields: Array<{
    key: keyof FormState;
    label: string;
    placeholder: string;
    type?: "textarea" | "number" | "text";
    hint?: string;
  }> = [
    { key: "topic", label: "Video Topic", placeholder: "e.g. AI shorts editing workflow" },
    { key: "audience", label: "Target Audience", placeholder: "e.g. new creators, busy founders" },
    { key: "tone", label: "Delivery Tone", placeholder: "e.g. high-energy, cinematic, playful" },
    { key: "goal", label: "Outcome / CTA", placeholder: "e.g. grow your channel, download template" },
    { key: "brandKeywords", label: "Brand / Creator Keywords", placeholder: "e.g. ShortSpark Studio" },
    { key: "duration", label: "Desired Runtime (seconds)", placeholder: "60", type: "number" }
  ];

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm shadow-xl shadow-brand/10">
      <h2 className="text-lg font-semibold text-white">Agent Brief</h2>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/60">Provide a creative brief to align the agents.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onGenerate();
        }}
        className="mt-6 space-y-4"
      >
        {fields.map((field) => {
          const value = form[field.key];
          const isTextArea = field.type === "textarea";
          const isNumber = field.type === "number";
          return (
            <label key={field.key as string} className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{field.label}</span>
              {isTextArea ? (
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  rows={3}
                  value={String(value)}
                  placeholder={field.placeholder}
                  onChange={(event) => onChange(field.key, event.target.value)}
                />
              ) : (
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  type={isNumber ? "number" : "text"}
                  value={String(value)}
                  placeholder={field.placeholder}
                  min={isNumber ? 15 : undefined}
                  max={isNumber ? 60 : undefined}
                  onChange={(event) => onChange(field.key, event.target.value)}
                />
              )}
              {field.hint ? <p className="text-xs text-white/50">{field.hint}</p> : null}
            </label>
          );
        })}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={generating}
          className={clsx(
            "w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition",
            generating ? "bg-white/10 text-white/40" : "bg-brand hover:bg-brand-accent"
          )}
          type="submit"
        >
          {generating ? "Assembling Agents..." : "Generate Playbook"}
        </motion.button>
      </form>
    </aside>
  );
}

function Timeline({ step }: { step: "idle" | "generating" | "ready" }) {
  const checkpoints = [
    { label: "Brief synced", status: step !== "idle" },
    { label: "Ideation mapped", status: step === "ready" || step === "generating" },
    { label: "Script locked", status: step === "ready" },
    { label: "Visuals staged", status: step === "ready" },
    { label: "Distribution primed", status: step === "ready" }
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-brand/10">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Agent Pipeline</h2>
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Live status of the autonomous stack</p>
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
            step === "generating" ? "bg-white/10 text-white/70" : step === "ready" ? "bg-emerald-500/20 text-emerald-200" : "bg-white/5 text-white/40"
          )}
        >
          {step === "idle" ? "Standby" : step === "generating" ? "Syncing" : "Complete"}
        </span>
      </header>
      <ol className="mt-6 space-y-4">
        {checkpoints.map((checkpoint, index) => (
          <li key={checkpoint.label} className="flex items-center gap-4">
            <div
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold",
                checkpoint.status ? "border-emerald-300 bg-emerald-500/20 text-emerald-100" : "border-white/10 bg-white/5 text-white/40"
              )}
            >
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{checkpoint.label}</p>
              <p className="text-xs text-white/60">
                {checkpoint.status ? "Agent output captured" : "Awaiting signal..."}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EmptyState({ step }: { step: "idle" | "generating" | "ready" }) {
  const message =
    step === "idle"
      ? "Launch the agent stack to generate a Shorts playbook."
      : "Running inference across ideation, scripting, visuals, and distribution...";

  return (
    <section className="relative flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 py-24 text-center">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-brand-accent to-purple-500 opacity-60" />
      <p className="text-sm uppercase tracking-[0.3em] text-white/40">Awaiting agent outputs</p>
      <p className="mt-4 max-w-md text-lg text-white/70">{message}</p>
    </section>
  );
}

function GradientBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,57,255,0.45),rgba(14,12,18,0.95))]" />
      <div className="absolute left-1/4 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/40 blur-[120px]" />
      <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-brand-accent/30 blur-[140px]" />
    </>
  );
}
