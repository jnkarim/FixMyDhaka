import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Info,
  Layers3,
  MapPin,
  MousePointer2,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const steps = [
  {
    number: "01",
    icon: MapPin,
    by: "You do this",
    title: "Choose the location",
    description:
      "Click a point on the map, search for an area, or enter a location. The selected place helps the system understand which part of Dhaka you mean.",
    detail: "Map selection / area search / location",
  },
  {
    number: "02",
    icon: Camera,
    by: "You do this",
    title: "Describe the problem",
    description:
      "Explain what happened in your own words. You can also attach a JPEG, PNG, or WebP photo to give the analysis more context.",
    detail: "Description + optional photo",
  },
  {
    number: "03",
    icon: Sparkles,
    by: "FixMyDhaka does this",
    title: "AI understands the issue",
    description:
      "Gemini analyzes the description and optional image to suggest a category, such as pothole, garbage, streetlight, drainage, or water supply. Unclear reports can need clarification.",
    detail: "Issue classification",
  },
  {
    number: "04",
    icon: Building2,
    by: "FixMyDhaka does this",
    title: "Find the right authority",
    description:
      "The system checks the location's jurisdiction, then uses its indexed authority documents to find supporting information about who handles that service.",
    detail: "Jurisdiction + evidence retrieval",
  },
  {
    number: "05",
    icon: ClipboardCheck,
    by: "FixMyDhaka does this",
    title: "Prepare your next step",
    description:
      "Review the suggested authority, the available evidence, a ready-to-copy formal complaint, and the relevant reporting route. Weak evidence may be flagged for review.",
    detail: "Routing result + complaint draft",
  },
  {
    number: "06",
    icon: ExternalLink,
    by: "You do this",
    title: "Submit through the official channel",
    description:
      "Copy the prepared complaint, open the official channel, and submit it yourself. FixMyDhaka does not automatically file a government complaint for you.",
    detail: "External submission by you",
  },
];

const engine = [
  {
    icon: Workflow,
    title: "LangGraph",
    text: "Coordinates the steps from location validation to the final reporting plan.",
  },
  {
    icon: Sparkles,
    title: "Gemini",
    text: "Helps classify the issue using the description and optional image.",
  },
  {
    icon: MapPin,
    title: "Jurisdiction resolver",
    text: "Distinguishes a Dhaka North or South area from the service provider itself.",
  },
  {
    icon: Layers3,
    title: "RAG + Chroma",
    text: "Retrieves relevant authority information to support the suggested route.",
  },
];

const examples = {
  road: {
    label: "Pothole",
    issue: "A large pothole on a road in Gulshan",
    category: "Road / Pothole",
    jurisdiction: "DNCC",
    authority: "DNCC",
    authorityLong: "Dhaka North City Corporation",
    explanation: "The issue is a city road problem within Dhaka North.",
  },
  water: {
    label: "Water supply",
    issue: "No water supply for three days in Gulshan",
    category: "Water / Sewerage",
    jurisdiction: "DNCC",
    authority: "DWASA",
    authorityLong: "Dhaka Water Supply and Sewerage Authority",
    explanation: "The area is still in Dhaka North, but water supply is a DWASA service.",
  },
};

const destinations = [
  {
    icon: MousePointer2,
    eyebrow: "START HERE",
    title: "Interactive map",
    text: "Choose a spot in Dhaka, see nearby reports, and start your own civic report.",
    action: "Open map",
    to: "/",
  },
  {
    icon: FileText,
    eyebrow: "PUBLIC RECORDS",
    title: "All reports",
    text: "Search and filter issues already recorded in FixMyDhaka, including status and authority.",
    action: "Browse reports",
    to: "/reports",
  },
  {
    icon: BarChart3,
    eyebrow: "DATA EXPLORER",
    title: "City Insights",
    text: "Explore reported issue hotspots, category breakdowns, trends, and authority routing.",
    action: "Explore insights",
    to: "/insights",
  },
];

const questions = [
  {
    question: "Does FixMyDhaka send my complaint to the government?",
    answer:
      "No. FixMyDhaka identifies a suggested authority, prepares a complaint, and points you toward an official reporting channel. You must complete the actual government submission yourself.",
  },
  {
    question: "Do I need to upload a photo?",
    answer:
      "No. A location and written description are enough to request analysis. A photo is optional and can help provide context. Supported formats are JPEG, PNG, and WebP.",
  },
  {
    question: "Why can the jurisdiction and authority be different?",
    answer:
      "A place can be inside DNCC or DSCC, while the service you are reporting belongs to a different organization. For example, a water-supply issue in Gulshan can be routed to DWASA rather than DNCC.",
  },
  {
    question: "What if the system cannot confidently find an authority?",
    answer:
      "The result may indicate that more information or review is needed. Treat the suggested route and supporting evidence as guidance, not a guaranteed official decision.",
  },
  {
    question: "Can I see reports after they are created?",
    answer:
      "Yes. Eligible saved reports are visible in All reports, where visitors can review the issue, location, category, and recorded statuses. City Insights summarizes that public report data.",
  },
];

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#647000]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black tracking-[-0.045em] text-zinc-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StepCard({ step }) {
  const Icon = step.icon;
  const citizenStep = step.by === "You do this";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#D4E500] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${citizenStep ? "bg-[#E8FF00] text-black" : "bg-zinc-950 text-[#E8FF00]"}`}>
          <Icon size={23} strokeWidth={2} aria-hidden="true" />
        </div>
        <span className="select-none text-4xl font-black tracking-[-0.07em] text-zinc-200">
          {step.number}
        </span>
      </div>
      <span className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
        {step.by}
      </span>
      <h3 className="mt-2 text-xl font-black tracking-[-0.035em] text-zinc-950">
        {step.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-zinc-600">
        {step.description}
      </p>
      <div className="mt-6 flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs font-semibold text-zinc-500">
        <CheckCircle2 size={16} className="shrink-0 text-[#8B9C00]" aria-hidden="true" />
        {step.detail}
      </div>
    </article>
  );
}

export default function HowItWorksPage() {
  const [activeExample, setActiveExample] = useState("road");
  const example = examples[activeExample];

  return (
    <div className="flex min-h-dvh flex-col bg-[#F7F7F4] text-zinc-950">
      <Header />

      <main className="w-full flex-1">
        <div className="mx-auto max-w-[1500px] px-4 pb-20 pt-5 sm:px-7 sm:pt-7 lg:px-10">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[27px] bg-[#0A0A0A] px-6 py-10 text-white sm:rounded-[32px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-44 h-[470px] w-[470px] rounded-full bg-[#E8FF00]/10 blur-[95px]" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-44 w-72 bg-[linear-gradient(135deg,transparent_45%,rgba(232,255,0,0.07)_45%,rgba(232,255,0,0.07)_46%,transparent_46%)]" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E8FF00]/30 bg-[#E8FF00]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#E8FF00]">
                  <BookOpen size={14} aria-hidden="true" />
                  A guide to FixMyDhaka
                </div>
                <h1 className="mt-7 max-w-3xl text-[clamp(2.65rem,5vw,5.25rem)] font-black leading-[1.05] tracking-[-0.065em]">
                  How it <span className="text-[#E8FF00]">works.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
                  See how a problem on your street becomes a clear, evidence-supported route to the right civic authority.
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                  From picking a location to preparing your complaint, here is what happens at every step.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/report" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E8FF00] px-5 py-3 text-sm font-extrabold text-black transition hover:bg-[#F2FF6B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8FF00]">
                    Report a problem <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                  <a href="#steps" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-bold text-white transition hover:border-zinc-400 hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                    Explore the steps <ArrowDownRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="relative rounded-[24px] border border-zinc-700/70 bg-[#151515] p-5 shadow-2xl sm:p-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-400">Your report's journey</p>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#E8FF00]/10 px-3 py-1 text-[10px] font-bold text-[#E8FF00]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E8FF00]" />
                    3 phases
                  </span>
                </div>
                <div className="relative mt-6 space-y-6 before:absolute before:bottom-8 before:left-[21px] before:top-8 before:w-px before:bg-zinc-700">
                  {[
                    { icon: MapPin, title: "Tell us what happened", subtitle: "Location, description, optional photo" },
                    { icon: Sparkles, title: "We analyze and route", subtitle: "AI classification + authority evidence" },
                    { icon: Route, title: "You take the next step", subtitle: "Review, copy, and submit externally" },
                  ].map((phase, index) => {
                    const Icon = phase.icon;
                    return (
                      <div key={phase.title} className="relative flex items-center gap-4">
                        <div className={`z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${index === 2 ? "border-[#E8FF00] bg-[#E8FF00] text-black" : "border-zinc-700 bg-zinc-900 text-[#E8FF00]"}`}>
                          <Icon size={20} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{phase.title}</p>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">{phase.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-7 flex gap-3 rounded-xl border border-[#E8FF00]/20 bg-[#E8FF00]/10 p-4">
                  <Info size={18} className="mt-0.5 shrink-0 text-[#E8FF00]" aria-hidden="true" />
                  <p className="text-xs leading-6 text-zinc-200">
                    FixMyDhaka prepares the route. It does <strong className="text-[#E8FF00]">not</strong> automatically submit a complaint to the government.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Step-by-step walkthrough */}
          <section id="steps" className="scroll-mt-8 pt-20 sm:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <SectionHeading
                eyebrow="THE CITIZEN JOURNEY"
                title="Six steps. A clearer way forward."
                subtitle="You provide the local knowledge. FixMyDhaka connects it to a suggested category, supporting authority information, and a practical next step."
              />
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600">No account required to explore</span>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {steps.map((step) => <StepCard key={step.number} step={step} />)}
            </div>
          </section>

          {/* Live interactive example (illustrative, no API request) */}
          <section id="routing-example" className="scroll-mt-10 pt-20 sm:pt-24">
            <SectionHeading
              eyebrow="A PRACTICAL EXAMPLE"
              title="Same area. Different responsibility."
              subtitle="The city corporation jurisdiction tells us where the problem is. The responsible authority depends on what service the complaint is about."
            />

            <div className="mt-8 overflow-hidden rounded-[28px] border border-zinc-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-[#F9FAF2] px-5 py-5 sm:px-8">
                <p className="text-sm font-bold text-zinc-700">Select an example issue in Gulshan:</p>
                <div className="flex rounded-xl border border-zinc-200 bg-white p-1" aria-label="Example issue">
                  {Object.entries(examples).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={activeExample === key}
                      onClick={() => setActiveExample(key)}
                      className={`rounded-lg px-3 py-2.5 text-xs font-extrabold transition sm:px-4 sm:text-sm ${activeExample === key ? "bg-zinc-950 text-[#E8FF00]" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#738000]">Example complaint</p>
                  <h3 className="mt-3 text-2xl font-black leading-snug tracking-tight text-zinc-950">{example.issue}</h3>
                  <p className="mt-4 text-sm leading-7 text-zinc-600">{example.explanation}</p>
                  <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-zinc-500">
                    <Info size={16} className="mt-1 shrink-0" aria-hidden="true" />
                    Illustrative examples only. Actual results depend on location validation, category, and available evidence.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-[#F7F7F4] p-5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                      <Search size={15} aria-hidden="true" /> Category
                    </p>
                    <p className="mt-4 text-base font-black text-zinc-900">{example.category}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-[#F7F7F4] p-5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                      <MapPin size={15} aria-hidden="true" /> Jurisdiction
                    </p>
                    <p className="mt-4 text-2xl font-black text-zinc-900">{example.jurisdiction}</p>
                    <p className="mt-1 text-xs text-zinc-500">Where it happened</p>
                  </div>
                  <div className="rounded-2xl border border-[#C8DB00] bg-[#E8FF00] p-5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-700">
                      <Building2 size={15} aria-hidden="true" /> Suggested authority
                    </p>
                    <p className="mt-4 text-2xl font-black text-black">{example.authority}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-800">{example.authorityLong}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* After a report has been analyzed */}
          <section className="pt-20 sm:pt-24">
            <SectionHeading
              eyebrow="AFTER THE ANALYSIS"
              title="Your report stays useful."
              subtitle="A report can also contribute to the public picture of civic problems recorded through FixMyDhaka. Explore the rest of the website here."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {destinations.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} className="group flex flex-col rounded-[24px] border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#D4E500] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-950 text-[#E8FF00]">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <ArrowRight size={21} className="text-zinc-400 transition group-hover:-rotate-45 group-hover:text-black" aria-hidden="true" />
                    </div>
                    <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#737E00]">{item.eyebrow}</p>
                    <h3 className="mt-2 text-xl font-black text-zinc-950">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-zinc-600">{item.text}</p>
                    <p className="mt-6 flex items-center gap-2 border-t border-zinc-100 pt-4 text-sm font-bold text-zinc-900">
                      {item.action} <ArrowRight size={16} aria-hidden="true" />
                    </p>
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-start gap-3 rounded-2xl border border-[#DDE4AB] bg-[#F5F8E4] p-5 sm:items-center">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#7D8B00]" aria-hidden="true" />
              <p className="flex-1 text-sm leading-6 text-zinc-700">
                <strong className="text-zinc-950">About public reports:</strong> saved reports can be viewed in the registry. Statuses shown on FixMyDhaka are its own records, not proof of official submission or resolution.
              </p>
              <Link to="/reports" className="inline-flex items-center gap-1 text-sm font-extrabold text-zinc-900 hover:underline">
                View reports <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* Keep the three different report statuses clear */}
          <section className="mt-6 rounded-[26px] border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#748000]">REPORT TRACKING</p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-zinc-950 sm:text-2xl">Three statuses, three different meanings.</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600">A saved report can display separate indicators so the suggested route is not confused with official submission or issue resolution.</p>
              </div>
              <FileText size={24} className="text-zinc-500" aria-hidden="true" />
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { label: "Issue status", value: "Open / Resolved", description: "What the FixMyDhaka record currently says about the issue." },
                { label: "Routing status", value: "Routed / Needs review", description: "Whether the available authority information supports the suggested route." },
                { label: "Official submission", value: "Not submitted / Submitted externally", description: "A separate record of the user's external submission step, not government confirmation." },
              ].map((status) => (
                <div key={status.label} className="rounded-2xl border border-zinc-200 bg-[#FAFAF8] p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-zinc-500">{status.label}</p>
                  <p className="mt-3 text-sm font-black text-zinc-950">{status.value}</p>
                  <p className="mt-2 text-xs leading-6 text-zinc-600">{status.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trust / FAQ */}
          <section className="grid gap-10 pt-20 sm:pt-24 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="GOOD TO KNOW"
                title="Frequently asked questions."
                subtitle="A few details that help make the process clearer before you submit a civic issue."
              />
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E3E3CE] bg-[#F0F1E7] p-5">
                <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#758000]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-black text-zinc-900">Independent civic project</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    FixMyDhaka is not an official website of DNCC, DSCC, DWASA, or any government authority.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {questions.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-zinc-200 bg-white px-5 py-1 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-bold text-zinc-950 marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown size={18} className="shrink-0 text-zinc-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="border-t border-zinc-100 pb-5 pt-4 text-sm leading-7 text-zinc-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-20 overflow-hidden rounded-[26px] bg-[#E8FF00] px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-700">
                <Check size={16} aria-hidden="true" /> You're ready
              </div>
              <h2 className="max-w-xl text-3xl font-black tracking-[-0.055em] text-black sm:text-4xl">Know the process. Make your report count.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-800">Pick a location, explain the issue, and let FixMyDhaka help you find the next step.</p>
            </div>
            <Link to="/report" className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-extrabold text-white transition hover:bg-zinc-800 lg:mt-0">
              Start a report <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
