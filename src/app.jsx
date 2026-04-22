// Main editor app
const { useState, useEffect, useRef } = React;

const DEFAULT_FORM = {
  themeId: 'sinerva',
  accent: '#E8B4A0',

  brideLast: 'Nguyễn', brideFirst: 'Hương',
  brideRelation: 'daughter',
  brideFather: '', brideFatherTitle: 'bo',
  brideMother: '', brideMotherTitle: 'me',

  groomLast: 'Trần', groomFirst: 'Minh',
  groomRelation: 'son',
  groomFather: '', groomFatherTitle: 'bo',
  groomMother: '', groomMotherTitle: 'me',

  day: '26', month: '10', year: '24', hour: '17',
  venueName: '', venueAddress: '', venueHall: '',
  homeBride: '', homeGroom: '',

  invitation: '', message: '',
  brideBank: '', brideAcct: '', brideHolder: '',
  groomBank: '', groomAcct: '', groomHolder: '',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#9A7B3F"
}/*EDITMODE-END*/;

function Logo({ primaryColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L20 10 L12 22 L4 10 Z" stroke={primaryColor} strokeWidth="1.4" fill="none" />
        <path d="M4 10 L20 10 M8 6 L12 2 L16 6 M8 6 L12 10 L16 6" stroke={primaryColor} strokeWidth="1" fill="none" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: '#1A1A1A', letterSpacing: '-0.01em' }}>promise</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: 'italic', color: '#9B9792', letterSpacing: '0.02em' }}>card</div>
      </div>
    </div>
  );
}

function App() {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem('promise-form');
      return saved ? { ...DEFAULT_FORM, ...JSON.parse(saved) } : DEFAULT_FORM;
    } catch { return DEFAULT_FORM; }
  });
  const [step, setStep] = useState(() => {
    try { return parseInt(localStorage.getItem('promise-step') || '0', 10); }
    catch { return 0; }
  });
  const [fullscreen, setFullscreen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);

  const primaryColor = tweaks.primaryColor || '#9A7B3F';

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
  }, [primaryColor]);

  useEffect(() => { localStorage.setItem('promise-form', JSON.stringify(form)); }, [form]);
  useEffect(() => { localStorage.setItem('promise-step', String(step)); }, [step]);

  // Tweaks protocol
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const update = (patch) => setForm(f => ({ ...f, ...patch }));

  const theme = window.THEMES.find(t => t.id === form.themeId) || window.THEMES[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleTweakChange = (key, value) => {
    setTweaks(t => ({ ...t, [key]: value }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  };

  const StepComponent = [window.ThemeStep, window.CoupleStep, window.EventStep, window.StoryStep, window.AccountStep][step];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F3EE',
      color: '#1A1A1A',
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontSize: 14,
    }}>
      {/* Top bar */}
      <header style={{
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #EBE7DF',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <Logo primaryColor={primaryColor} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="muted" size="sm" onClick={() => setStep(0)}>Về trang chủ</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {saved ? '✓ Đã lưu' : 'Lưu'}
          </Button>
        </div>
      </header>

      {/* Main layout: preview left, panel right */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 560px',
        minHeight: 'calc(100vh - 56px)',
      }}>
        {/* Preview column */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '48px 32px 32px',
          gap: 28,
        }}>
          {/* Theme name + pager */}
          <div style={{ textAlign: 'center', minWidth: 300 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              color: primaryColor,
              letterSpacing: '0.04em',
              fontWeight: 500,
              marginBottom: 2,
            }}>{theme.name}</div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: `1px solid ${primaryColor}44`,
              borderBottom: `1px solid ${primaryColor}44`,
              padding: '8px 0',
              marginTop: 8,
              fontSize: 11,
              letterSpacing: '0.15em',
              color: '#6B6761',
            }}>
              <button
                onClick={() => {
                  const idx = window.THEMES.findIndex(t => t.id === form.themeId);
                  const prev = window.THEMES[(idx - 1 + window.THEMES.length) % window.THEMES.length];
                  update({ themeId: prev.id });
                }}
                style={{ background: 'none', border: 'none', fontSize: 11, letterSpacing: '0.15em', color: '#6B6761', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← GIAO DIỆN TRƯỚC
              </button>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: primaryColor }}>
                {window.THEMES.findIndex(t => t.id === form.themeId) + 1} / {window.THEMES.length}
              </span>
              <button
                onClick={() => {
                  const idx = window.THEMES.findIndex(t => t.id === form.themeId);
                  const next = window.THEMES[(idx + 1) % window.THEMES.length];
                  update({ themeId: next.id });
                }}
                style={{ background: 'none', border: 'none', fontSize: 11, letterSpacing: '0.15em', color: '#6B6761', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                GIAO DIỆN KẾ TIẾP →
              </button>
            </div>
          </div>

          {/* Device mockup */}
          <div style={{
            padding: 16,
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 30px 80px rgba(60,50,30,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <WeddingCardPreview theme={theme} form={form} primaryColor={primaryColor} scale={1} />
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#9B9792' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4AB47A',
              boxShadow: '0 0 0 3px rgba(74,180,122,0.2)',
            }} />
            Xem trước trực tiếp · {theme.style}
          </div>
        </div>

        {/* Panel */}
        <aside style={{
          background: '#fff',
          borderLeft: '1px solid #EBE7DF',
          display: 'flex', flexDirection: 'column',
          minHeight: 'calc(100vh - 56px)',
        }}>
          <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #F0EDE7' }}>
            <Stepper steps={window.STEPS} current={step} onSelect={setStep} />
          </div>

          <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
            <StepComponent form={form} update={update} themes={window.THEMES} primaryColor={primaryColor} />
          </div>

          <div style={{
            borderTop: '1px solid #F0EDE7',
            padding: '16px 32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#FAFAF7',
          }}>
            <Button variant="ghost" size="md" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              ← Quay lại
            </Button>

            <div style={{ fontSize: 11, color: '#9B9792' }}>
              {step + 1} / {window.STEPS.length}
            </div>

            {step < window.STEPS.length - 1 ? (
              <Button variant="gold" size="md" onClick={() => setStep(Math.min(window.STEPS.length - 1, step + 1))}>
                Tiếp theo →
              </Button>
            ) : (
              <Button variant="gold" size="md" onClick={() => setFullscreen(true)}>
                Xem toàn màn hình
              </Button>
            )}
          </div>
        </aside>
      </main>

      {fullscreen && (
        <FullscreenInvitation
          theme={theme}
          form={form}
          primaryColor={primaryColor}
          onClose={() => setFullscreen(false)}
        />
      )}

      {editMode && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 280,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
          padding: 18,
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500 }}>Tweaks</div>
            <div style={{ fontSize: 10, color: '#9B9792', letterSpacing: '0.15em' }}>LIVE</div>
          </div>
          <div style={{ fontSize: 11, color: '#9B9792', marginBottom: 8, letterSpacing: '0.08em' }}>PRIMARY COLOR</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { name: 'Gold', value: '#9A7B3F' },
              { name: 'Noir', value: '#1A1A1A' },
              { name: 'Rose', value: '#C4838B' },
              { name: 'Sage', value: '#7A8B72' },
              { name: 'Azure', value: '#4A6FA5' },
              { name: 'Clay', value: '#B8663F' },
            ].map(c => (
              <button
                key={c.value}
                onClick={() => handleTweakChange('primaryColor', c.value)}
                title={c.name}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: c.value,
                  border: primaryColor === c.value ? '2px solid #1A1A1A' : '2px solid transparent',
                  outline: primaryColor === c.value ? '1px solid #fff' : 'none',
                  outlineOffset: -4,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
