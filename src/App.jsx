import { useState, useEffect } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@300;400;500&family=Noto+Serif+Display:ital@1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #FAF6F3; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-8px); } }
  .fade-in { animation: fadeIn 0.45s ease forwards; }
  .fade-out { animation: fadeOut 0.22s ease forwards; }
`;

const C = {
  cream: '#E5DED5',
  terracotta: '#C7A38E',
  mushroom: '#908276',
  dark: '#4A3F38',
  body: '#60534C',
  bg: '#FAF6F3',
  white: '#FFFFFF',
  border: '#DDD5CC',
  error: '#b5472a',
};

const questions = [
  {
    text: "When you think about the life you want —",
    options: [
      { text: "I feel overwhelmed before I even begin", result: 'capacity' },
      { text: "I feel motivated sometimes, but it never quite sticks", result: 'cycles' },
      { text: "I can feel who I want to become, but that version of me isn't the one running my daily life", result: 'identity' },
      { text: "I can picture it clearly, but I keep waiting for the moment I finally feel ready", result: 'waiting' },
    ]
  },
  {
    text: "When you get close to doing the thing that matters to you —",
    options: [
      { text: "The weight of it all lands at once and I don't know where to begin", result: 'capacity' },
      { text: "I begin with intention, but slowly fall back into old patterns", result: 'cycles' },
      { text: "I talk myself out of it, like part of me still doesn't believe I'm someone who actually does this", result: 'identity' },
      { text: "I wait until I feel more ready, and that moment rarely arrives", result: 'waiting' },
    ]
  },
  {
    text: "When you imagine yourself actually living differently —",
    options: [
      { text: "It feels like more than I know how to hold right now", result: 'capacity' },
      { text: "I worry I'll start, only to end up back where I began", result: 'cycles' },
      { text: "I'm not sure the version of me that wants this is the one running my daily life", result: 'identity' },
      { text: "I keep waiting for certainty before I let myself fully begin", result: 'waiting' },
    ]
  },
  {
    text: "If you're honest about what keeps bringing you back to this question —",
    options: [
      { text: "I get in my own way right when things start to feel possible", result: 'capacity' },
      { text: "Things work for a while, and then I slowly drift back to where I started", result: 'cycles' },
      { text: "I've broken trust with myself enough times that it's hard to fully believe this one will last", result: 'identity' },
      { text: "I believe deeply, but I keep waiting for something to click before I really begin", result: 'waiting' },
    ]
  },
  {
    text: "What you're really looking for isn't just motivation or a better plan. It's —",
    options: [
      { text: "To feel like the gap between where I am and where I want to be is actually crossable", result: 'capacity' },
      { text: "To stop starting over and actually keep going", result: 'cycles' },
      { text: "To close the gap between who I know I am and how I'm actually living", result: 'identity' },
      { text: "To feel like the life I want is something I'm building, not just imagining", result: 'waiting' },
    ]
  },
];

const results = {
  capacity: {
    title: "The Weight of It",
    paragraphs: [
      "You can feel it, the life you want, the version of you living it. The vision has never really been the problem.",
      "What stops you happens before you even begin.",
      "The weight of it all lands at once. The distance between where you are and where you want to be. The size of what you're reaching for. The gap between what you can imagine and what you can currently hold.",
      "And in that moment, something quietly suggests you're not ready yet. That you need a little more time, a little more preparation, before you take the first step.",
      "That isn't weakness. It's what happens when your vision is bigger than your current capacity to hold it.",
      "And here's what nobody tells you: capacity doesn't arrive before the work begins. It grows because of it. But first, you have to learn how to move through the weight instead of waiting for it to lift.",
      "That's exactly what this guide was made for.",
    ]
  },
  cycles: {
    title: "The Drift Cycle",
    paragraphs: [
      "You've been here before. Not because you don't try, but because you do.",
      "You begin. You move. You feel the momentum building and something in you knows this time is different.",
      "And then, slowly, almost without noticing, you find yourself back where you started.",
      "The cycle isn't a sign that you're doing it wrong. It's a sign that something underneath the trying hasn't shifted yet. That the version of you reaching for that life and the version currently shaping your life are still operating from different blueprints.",
      "You don't need more motivation. You don't need a better plan. You need to understand what keeps pulling you back, and how to interrupt it at the root instead of starting over again from the beginning.",
      "That's the work this guide was designed to do.",
    ]
  },
  identity: {
    title: "The Identity Gap",
    paragraphs: [
      "You know who you are, or more accurately, you know who you're becoming.",
      "You can feel that version of yourself clearly. The way they move through their days. The choices they make. The quiet confidence of someone who has already become what you're still reaching toward.",
      "And then there's the version of you that actually shows up in your daily life.",
      "The gap between those two isn't something to be ashamed of. It's not evidence that the version you feel is a fantasy. It's simply what it looks like before the two begin to converge, before the person you know yourself to be becomes the one leading your life.",
      "That convergence doesn't happen through more belief. It happens through intentional practice, closing the space between knowing and becoming.",
      "That closing is what this guide makes possible.",
    ]
  },
  waiting: {
    title: "The Readiness Loop",
    paragraphs: [
      "You know what you want. You've known for a while. And somewhere underneath everything, you believe it's possible for you, even if that belief feels quieter some days than others.",
      "What you're waiting for is permission. Or certainty. Or the feeling of being ready. Some sign that the timing is right, the conditions are aligned, and it's finally safe to begin.",
      "That sign isn't coming.",
      "Not because the life you want isn't real, but because readiness doesn't arrive before movement. It's built by it.",
      "Every time you wait for the feeling first, you hand the decision back to the part of you that was built to keep things exactly as they are.",
      "This guide was written for the moment you decide to move anyway.",
    ]
  },
};

function calculateResult(answers) {
  const counts = { capacity: 0, cycles: 0, identity: 0, waiting: 0 };
  answers.forEach(a => { if (a) counts[a]++; });
  const max = Math.max(...Object.values(counts));
  const tied = Object.keys(counts).filter(k => counts[k] === max);
  if (tied.length === 1) return tied[0];
  for (let i = answers.length - 1; i >= 0; i--) {
    if (tied.includes(answers[i])) return answers[i];
  }
  return tied[0];
}


function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '26px 0' }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.terracotta, opacity: 0.4 }} />
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

const BLANK = Array(5).fill(null);

export default function HomegrownQuiz() {
  const [screen, setScreen]             = useState('intro');
  const [currentQ, setCurrentQ]         = useState(0);
  const [answers, setAnswers]           = useState([...BLANK]);
  const [selected, setSelected]         = useState(null);
  const [transitioning, setTransition]  = useState(false);
  const [result, setResult]             = useState(null);
  const [email, setEmail]               = useState('');
  const [emailSent, setEmailSent]       = useState(false);
  const [emailErr, setEmailErr]         = useState(false);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = FONTS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const handleSelect = (key) => {
    setSelected(key);
    const a = [...answers];
    a[currentQ] = key;
    setAnswers(a);
  };

  const go = (direction) => {
    if (transitioning) return;
    setTransition(true);
    setTimeout(() => {
      const next = currentQ + direction;
      setCurrentQ(next);
      setSelected(answers[next] ?? null);
      setTransition(false);
    }, 240);
  };

  const handleNext = () => {
    if (!selected) return;
    if (currentQ < questions.length - 1) {
      go(1);
    } else {
      setResult(calculateResult(answers));
      setScreen('result');
    }
  };

  const handleBack = () => { if (currentQ > 0) go(-1); };

  const restart = () => {
    setScreen('intro');
    setCurrentQ(0);
    setAnswers([...BLANK]);
    setSelected(null);
    setResult(null);
    setEmail('');
    setEmailSent(false);
    setEmailErr(false);
  };

  const submitEmail = async () => {
    if (!email || !email.includes('@')) { setEmailErr(true); return; }
    setEmailErr(false);
    try {
      await fetch('/.netlify/functions/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, result }),
      });
    } catch (e) {
      // Silently continue — show success regardless
    }
    setEmailSent(true);
  };

  const wrap = (children, pt = 40) => (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '20px 16px 80px', fontFamily: "'Poppins', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 500, paddingTop: pt }}>
        {children}
      </div>
    </div>
  );

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (screen === 'intro') return wrap(
    <div className="fade-in" style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 10, letterSpacing: '0.22em', color: C.terracotta, textTransform: 'uppercase', marginBottom: 28 }}>
        Homegrown Abundance
      </p>

      <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: 26, color: C.dark, lineHeight: 1.4, marginBottom: 28, padding: '0 4px' }}>
        What's Standing Between You<br/>and the Life You're Building?
      </h1>

      <Divider />

      <p style={{ fontFamily: "'Noto Serif Display', serif", fontStyle: 'italic', fontSize: 16, color: C.body, lineHeight: 1.85, marginBottom: 4 }}>
        There's a version of your life you can feel
      </p>
      <p style={{ fontFamily: "'Noto Serif Display', serif", fontStyle: 'italic', fontSize: 16, color: C.body, lineHeight: 1.85, marginBottom: 28 }}>
        but can't quite reach yet.
      </p>

      <p style={{ fontSize: 13, color: C.mushroom, lineHeight: 1.7, marginBottom: 32 }}>
        This quiz will help you understand what hasn't shifted yet.
      </p>

      <p style={{ fontSize: 10, color: C.mushroom, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 32 }}>
        5 questions &nbsp;·&nbsp; 3 minutes
      </p>

      <button onClick={() => setScreen('quiz')} style={{
        background: C.terracotta, color: C.white, border: 'none', borderRadius: 2,
        padding: '14px 0', width: '100%', maxWidth: 260,
        fontFamily: "'Poppins', sans-serif", fontSize: 12, letterSpacing: '0.14em',
        textTransform: 'uppercase', cursor: 'pointer',
      }}>Begin</button>
    </div>
  , 44);

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if (screen === 'quiz') return wrap(
    <div>
      {/* Progress */}
      <div style={{ marginBottom: 38 }}>
        <div style={{ height: 1, background: C.border, borderRadius: 1, position: 'relative', overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${(currentQ / questions.length) * 100}%`,
            background: C.terracotta, opacity: 0.6,
            transition: 'width 0.38s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentQ > 0 ? (
            <button onClick={handleBack} style={{
              background: 'none', border: 'none', fontSize: 11, color: C.mushroom,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', padding: 0,
            }}>← Back</button>
          ) : <span />}
          <p style={{ fontSize: 10, color: C.mushroom, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {currentQ + 1} of {questions.length}
          </p>
        </div>
      </div>

      <div className={transitioning ? 'fade-out' : 'fade-in'} key={currentQ}>
        <p style={{ fontFamily: "'Marcellus', serif", fontSize: 20, color: C.dark, lineHeight: 1.5, marginBottom: 28 }}>
          {questions[currentQ].text}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 32 }}>
          {questions[currentQ].options.map((opt, i) => {
            const on = selected === opt.result;
            return (
              <button key={i} onClick={() => handleSelect(opt.result)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 13, textAlign: 'left',
                background: on ? '#F6EDE7' : C.white,
                border: `1px solid ${on ? C.terracotta : C.border}`,
                borderRadius: 2, padding: '15px 17px', cursor: 'pointer',
                transition: 'all 0.18s ease', width: '100%',
              }}>
                <div style={{
                  width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                  border: `1.5px solid ${on ? C.terracotta : '#C8BFB8'}`,
                  background: on ? C.terracotta : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s ease',
                }}>
                  {on && (
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path d="M1 2.5L2.8 4.2L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 14, color: on ? C.dark : C.body, lineHeight: 1.65, fontWeight: 300, transition: 'color 0.18s ease' }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        <button onClick={handleNext} disabled={!selected} style={{
          width: '100%',
          background: selected ? C.terracotta : C.cream,
          color: selected ? C.white : C.mushroom,
          border: 'none', borderRadius: 2, padding: '14px',
          fontFamily: "'Poppins', sans-serif", fontSize: 12, letterSpacing: '0.12em',
          textTransform: 'uppercase', cursor: selected ? 'pointer' : 'default',
          transition: 'all 0.22s ease',
        }}>
          {currentQ < questions.length - 1 ? 'Continue' : 'See My Result'}
        </button>
      </div>
    </div>
  , 36);

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (screen === 'result' && result) return wrap(
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.22em', color: C.terracotta, textTransform: 'uppercase', marginBottom: 18 }}>
          Homegrown Abundance
        </p>
      </div>

      <p style={{ fontFamily: "'Noto Serif Display', serif", fontStyle: 'italic', fontSize: 18, color: C.dark, lineHeight: 1.55, textAlign: 'center', marginBottom: 16 }}>
        Here's what you just showed yourself.
      </p>

      <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: 22, color: C.dark, textAlign: 'center', marginBottom: 22, lineHeight: 1.3 }}>
        {results[result].title}
      </h2>

      <Divider />

      <div style={{ marginBottom: 32 }}>
        {results[result].paragraphs.map((para, i) => {
          const last = i === results[result].paragraphs.length - 1;
          return (
            <p key={i} style={{
              fontSize: 14, lineHeight: 1.82, fontWeight: 300,
              color: last ? C.terracotta : C.body,
              fontStyle: last ? 'italic' : 'normal',
              marginBottom: last ? 0 : 16,
            }}>
              {para}
            </p>
          );
        })}
      </div>

      <Divider />

      {!emailSent ? (
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.75, marginBottom: 16, fontStyle: 'italic', fontWeight: 300 }}>
            Want me to send this to you, along with a short note on where to go from here?
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailErr(false); }}
            style={{
              width: '100%', padding: '13px 15px', outline: 'none', borderRadius: 2,
              border: `1px solid ${emailErr ? C.error : C.border}`,
              fontFamily: "'Poppins', sans-serif", fontSize: 14,
              color: C.dark, background: C.white,
              marginBottom: emailErr ? 6 : 11,
            }}
          />
          {emailErr && <p style={{ fontSize: 12, color: C.error, marginBottom: 10 }}>Please enter a valid email address.</p>}
          <button onClick={submitEmail} style={{
            width: '100%', background: 'transparent', color: C.terracotta,
            border: `1px solid ${C.terracotta}`, borderRadius: 2, padding: '13px',
            fontFamily: "'Poppins', sans-serif", fontSize: 12, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Send it to me</button>
        </div>
      ) : (
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: C.mushroom, fontStyle: 'italic', fontWeight: 300 }}>
            It's on its way. Check your inbox.
          </p>
        </div>
      )}

      <Divider />

      <div style={{ textAlign: 'center', paddingBottom: 8 }}>
        <p style={{ fontSize: 13, color: C.body, marginBottom: 16, fontStyle: 'italic', fontWeight: 300 }}>
          Ready to move through it now?
        </p>
        <a href="https://homegrownabundance.com" target="_blank" rel="noopener noreferrer" style={{
          display: 'block', background: C.terracotta, color: C.white, textDecoration: 'none',
          borderRadius: 2, padding: '14px',
          fontFamily: "'Poppins', sans-serif", fontSize: 12, letterSpacing: '0.12em',
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 20,
        }}>
          Begin the reset
        </a>
        <button onClick={restart} style={{
          background: 'none', border: 'none', fontSize: 11, color: C.mushroom,
          letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Start over
        </button>
      </div>
    </div>
  , 44);

  return null;
}
