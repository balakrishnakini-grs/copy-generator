'use client';

import { useState } from 'react';

export default function Home() {
  const [parkName, setParkName] = useState('GRS Fantasy Park');
  const [offerName, setOfferName] = useState('Buy 2 Get 2 Free');
  const [audience, setAudience] = useState('Families & Friends');
  const [validity, setValidity] = useState('Every Friday, 4 PM to 6 PM');
  const [highlight, setHighlight] = useState(
    'Unlimited rides, same-day entry, fun for all age groups.'
  );
  const [extras, setExtras] = useState(
    'Tickets can be used any day till 31 March 2026.'
  );
  const [tone, setTone] = useState<'friendly' | 'excited' | 'professional'>(
    'excited'
  );
  const [copiedMsg, setCopiedMsg] = useState('');

  // AI-related state
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [aiHeadline, setAiHeadline] = useState<string | null>(null);
  const [aiHighlightLine, setAiHighlightLine] = useState<string | null>(null);
  const [aiCtaLine, setAiCtaLine] = useState<string | null>(null);
  const [aiHashtags, setAiHashtags] = useState<string | null>(null);

  const effectiveHeadline =
    aiHeadline || `${offerName} at ${parkName}!`;

  const effectiveWhatsappText = [
    `*${offerName}* at *${parkName}* 🎢`,
    '',
    aiHighlightLine || highlight,
    '',
    `📅 Valid: ${validity}`,
    `👨‍👩‍👧‍👦 For: ${audience}`,
    '',
    `👉 ${aiCtaLine || 'Book now and don’t miss out!'}`,
    '',
    `_${extras}_`,
  ].join('\n');

  const effectiveInstaCaption = [
    `🎉 ${offerName} at ${parkName}!`,
    '',
    aiHighlightLine || highlight,
    '',
    `📅 ${validity}`,
    '',
    `👉 ${aiCtaLine || 'Save this & plan your visit!'}`,
    '',
    aiHashtags || '#GRSFantasyPark #FamilyFun #WaterPark',
  ].join('\n');

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(`${label} copied!`);
      setTimeout(() => setCopiedMsg(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopiedMsg('Copy failed');
      setTimeout(() => setCopiedMsg(''), 2000);
    }
  };

  const handleGenerateWithAI = async () => {
    try {
      setIsGenerating(true);
      setErrorMsg('');
      setCopiedMsg('');

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parkName,
          offerName,
          audience,
          validity,
          highlight,
          extras,
          tone,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate with AI');
      }

      const data = await res.json();

      setAiHeadline(data.headline || '');
      setAiHighlightLine(data.highlightLine || '');
      setAiCtaLine(data.ctaLine || '');
      setAiHashtags(data.instaHashtags || '');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Something went wrong while calling AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetToTemplate = () => {
    setAiHeadline(null);
    setAiHighlightLine(null);
    setAiCtaLine(null);
    setAiHashtags(null);
    setErrorMsg('');
    setCopiedMsg('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-start justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 mt-4 md:mt-10">
        {/* Left: Form */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-950/60">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            Offer Copy Helper <span className="text-sky-400">v1</span>
          </h1>
          <p className="text-sm md:text-[13px] text-slate-300 mb-2">
            Fill these fields and get ready-made WhatsApp &amp; Instagram text for your campaign.
          </p>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="text-xs md:text-sm px-3 py-2 rounded-lg border border-sky-500 bg-sky-500/10 hover:bg-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isGenerating ? 'Generating…' : '✨ Generate with AI'}
            </button>
            {(aiHeadline || aiHighlightLine || aiCtaLine || aiHashtags) && (
              <button
                type="button"
                onClick={handleResetToTemplate}
                className="text-xs md:text-sm px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition"
              >
                Reset to template
              </button>
            )}
          </div>

          {errorMsg && (
            <p className="mb-3 text-[11px] text-red-300">
              {errorMsg}
            </p>
          )}

          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-slate-300">Park name</label>
              <input
                value={parkName}
                onChange={(e) => setParkName(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300">Offer name</label>
              <input
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                placeholder="Eg: Flash Friday Buy 2 Get 2 Free"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300">Target audience</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Eg: Families, College groups, Corporates"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300">Validity / when</label>
              <input
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                placeholder="Eg: Every Friday, 4–6 PM, till 31 March 2026"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300">Main highlight</label>
              <textarea
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300">Extra notes / T&amp;Cs line</label>
              <textarea
                value={extras}
                onChange={(e) => setExtras(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300">Tone</label>
              <div className="flex gap-2">
                {[
                  { id: 'friendly', label: 'Friendly' },
                  { id: 'excited', label: 'Excited' },
                  { id: 'professional', label: 'Professional' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as any)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs md:text-sm ${
                      tone === t.id
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            Tip: create one version per audience (schools, corporates, families) and save them.
          </p>
        </section>

        {/* Right: Output */}
        <section className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-1">Preview</h2>
            <p className="text-sm text-slate-300 mb-3">{effectiveHeadline}</p>
            {copiedMsg && (
              <p className="text-[11px] text-emerald-300 mb-2">
                {copiedMsg}
              </p>
            )}

            <div className="flex-1 grid gap-3 md:grid-rows-2">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-xs font-semibold text-emerald-300">
                    WhatsApp Text
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(effectiveWhatsappText, 'WhatsApp text')
                    }
                    className="text-[10px] px-2 py-1 rounded-md border border-emerald-400/70 bg-emerald-500/10 hover:bg-emerald-500/20 transition"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={effectiveWhatsappText}
                  className="flex-1 bg-transparent text-xs md:text-sm text-slate-100 resize-none outline-none"
                />
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-xs font-semibold text-pink-300">
                    Instagram Caption
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(effectiveInstaCaption, 'Instagram caption')
                    }
                    className="text-[10px] px-2 py-1 rounded-md border border-pink-400/70 bg-pink-500/10 hover:bg-pink-500/20 transition"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={effectiveInstaCaption}
                  className="flex-1 bg-transparent text-xs md:text-sm text-slate-100 resize-none outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}