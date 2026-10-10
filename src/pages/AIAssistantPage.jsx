import { useEffect, useRef, useState } from 'react';
import { Bot, Info, Mic, Send, User, Volume2, VolumeX } from 'lucide-react';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import { SourceChip, LoadingState, StatusBadge } from '../components/shared/States.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { askAssistant } from '../api/services.js';

function AssistantAnswer({ answer, source, lang, t }) {
  return (
    <>
      {source === 'demo' && (
        <p style={{ marginBottom: 8 }}>
          <StatusBadge tone="warning">{t('ai.demoAnswer.title')}</StatusBadge>
        </p>
      )}
      <h4>{t('ai.summary')}</h4>
      <p>{answer.summary}</p>
      {answer.observations?.length > 0 && (
        <>
          <h4>{t('ai.observations')}</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {answer.observations.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </>
      )}
      {answer.actions?.length > 0 && (
        <>
          <h4>{t('ai.actions')}</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {answer.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </>
      )}
      {answer.avoid?.length > 0 && (
        <>
          <h4>{t('ai.avoid')}</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {answer.avoid.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </>
      )}
      {answer.sources?.length > 0 && (
        <>
          <h4>{t('ai.sources')}</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {answer.sources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}
      {answer.uncertainty && (
        <>
          <h4>{t('ai.uncertainty')}</h4>
          <p>{answer.uncertainty}</p>
        </>
      )}
      {answer.followups?.length > 0 && (
        <>
          <h4>{t('ai.followup')}</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {(lang === 'te' && answer.followupsTe ? answer.followupsTe : answer.followups).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}
      <div style={{ marginTop: 10 }}>
        <SourceChip source={source} />
      </div>
      <p className="chat-meta">{source === 'demo' ? t('ai.demoAnswer.body') : t('ai.providerNote')}</p>
    </>
  );
}

export default function AIAssistantPage() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuestion, setLastQuestion] = useState('');
  const logRef = useRef(null);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const speechLocale = {
    en: 'en-IN', te: 'te-IN', hi: 'hi-IN', ta: 'ta-IN',
    kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', bn: 'bn-IN',
  }[lang] || 'en-IN';

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, sending]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || sending) return;
    setLastQuestion(question);
    setInput('');
    setSending(true);
    setError(null);
    try {
      const res = await askAssistant(question);
      setMessages((m) => [...m, { role: 'user', text: question }, { role: 'assistant', answer: res.data, source: res.source }]);
    } catch (e) {
      setError(e);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => () => {
    try { recognitionRef.current?.stop(); } catch { /* no active recognition */ }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  function startVoiceInput() {
    setVoiceMessage('');
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage(t('ai.voiceUnsupported'));
      return;
    }
    try {
      recognitionRef.current?.stop();
      const recognition = new Recognition();
      recognition.lang = speechLocale;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setInput(transcript);
          setListening(false);
          send(transcript);
        }
      };
      recognition.onerror = () => {
        setListening(false);
        setVoiceMessage(t('ai.voiceError'));
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setListening(false);
      setVoiceMessage(t('ai.voiceError'));
    }
  }

  function stopVoiceInput() {
    try { recognitionRef.current?.stop(); } catch { /* ignore stop if not active */ }
    setListening(false);
  }

  function speakAnswer(answer) {
    setVoiceMessage('');
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
      setVoiceMessage(t('ai.voiceOutputUnsupported'));
      return;
    }
    window.speechSynthesis.cancel();
    const text = [
      answer?.summary,
      ...(answer?.observations || []),
      ...(answer?.actions || []),
      ...(answer?.avoid || []),
    ].filter(Boolean).join('. ');
    if (!text) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = speechLocale;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  const suggestions = [
    t('ai.suggestion.storage'),
    t('ai.suggestion.weather'),
    t('ai.suggestion.market'),
    t('ai.suggestion.diary'),
  ];

  return (
    <PageContainer>
      <PageHeading title={t('ai.title')} subtitle={t('ai.subtitle')} />

      <div className="chat-shell card">
        <div className="chat-log" ref={logRef}>
          {messages.length === 0 && !sending && (
            <div className="state-box" style={{ padding: 20 }}>
              <div className="state-icon">
                <Bot size={26} aria-hidden />
              </div>
              <h3>{t('ai.title')}</h3>
              <p className="mb-0">{t('ai.subtitle')}</p>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="chat-bubble user">
                {m.text}
              </div>
            ) : (
              <div key={i} className="chat-bubble assistant">
                <AssistantAnswer answer={m.answer} source={m.source} lang={lang} t={t} />
                <div className="assistant-voice-row">
                  <button type="button" className="btn btn-white btn-sm" onClick={() => speakAnswer(m.answer)} aria-label={t('ai.voiceOutput')}>
                    <Volume2 size={15} aria-hidden /> {t('ai.voiceOutput')}
                  </button>
                </div>
              </div>
            )
          )}
          {sending && (
            <div className="chat-bubble assistant">
              <LoadingState label={t('ai.thinking')} />
            </div>
          )}
          {error && (
            <div className="alert-item error" role="alert">
              <Info size={18} aria-hidden />
              <div>
                <strong>{t('ai.error.title')}</strong>
                <p>{t('ai.error.body')}</p>
                <button type="button" className="btn btn-white btn-sm" onClick={() => send(lastQuestion)}>
                  {t('ai.retry')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="chat-suggestions">
          {suggestions.map((s) => (
            <button key={s} type="button" className="filter-chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>

        <form
          className="chat-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <span style={{ alignSelf: 'center', color: 'var(--muted)' }} aria-hidden>
            <User size={18} />
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.placeholder')}
            aria-label={t('ai.placeholder')}
          />
          <button
            type="button"
            className={`btn ${listening ? 'btn-primary' : 'btn-white'}`}
            onClick={listening ? stopVoiceInput : startVoiceInput}
            aria-label={listening ? t('ai.stopListening') : t('ai.voiceInput')}
            title={listening ? t('ai.stopListening') : t('ai.voiceInput')}
            disabled={sending}
          >
            <Mic size={16} aria-hidden /> {listening ? t('ai.stopListening') : t('ai.voiceInput')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={sending || !input.trim()}>
            <Send size={15} aria-hidden /> {t('ai.send')}
          </button>
        </form>
        {(listening || voiceMessage) && (
          <p className="assistant-voice-status" role="status">
            {listening ? t('ai.listening') : voiceMessage}
          </p>
        )}
        {speaking && (
          <button type="button" className="assistant-stop-voice" onClick={stopSpeaking}>
            <VolumeX size={15} aria-hidden /> {t('ai.stopVoice')}
          </button>
        )}
      </div>
    </PageContainer>
  );
}
