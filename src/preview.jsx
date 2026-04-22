// Live wedding card preview — renders based on theme + form state
const { useState, useEffect, useMemo } = React;

function CouplePhotoPlaceholder({ theme, accent }) {
  // Abstract monochrome "couple silhouette" placeholder using radial gradients
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: theme.bg,
      overflow: 'hidden',
    }}>
      {/* Two overlapping soft circles suggesting two figures */}
      <div style={{
        position: 'absolute',
        left: '18%', top: '22%', width: '44%', height: '56%',
        background: `radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 55%, transparent 72%)`,
        borderRadius: '50%',
        filter: 'blur(1px)',
      }} />
      <div style={{
        position: 'absolute',
        right: '14%', top: '18%', width: '46%', height: '60%',
        background: `radial-gradient(ellipse at 55% 35%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 58%, transparent 74%)`,
        borderRadius: '50%',
        filter: 'blur(1px)',
      }} />
      {/* Subtle grain */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(45deg, transparent 0 2px, rgba(255,255,255,0.015) 2px 4px)`,
        pointerEvents: 'none',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)',
      }} />
    </div>
  );
}

function DateBlock({ day, month, year, style, accent }) {
  const d = day || '26';
  const m = month || '10';
  const y = year || '24';

  if (style === 'stacked-serif') {
    return (
      <div style={{
        position: 'absolute',
        left: '50%', top: '52%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: 78,
        lineHeight: 0.95,
        textAlign: 'center',
        letterSpacing: '0.02em',
        fontStyle: 'italic',
      }}>
        <div>{d}</div>
        <div>{m}</div>
        <div>{y}</div>
      </div>
    );
  }
  if (style === 'horizontal-thin') {
    return (
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: '28%',
        textAlign: 'center',
        color: accent,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: 44,
        letterSpacing: '0.18em',
      }}>
        {d} · {m} · 20{y}
      </div>
    );
  }
  if (style === 'centered-large') {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        fontSize: 110,
        lineHeight: 0.95,
        letterSpacing: '-0.02em',
      }}>
        {d}.{m}
      </div>
    );
  }
  if (style === 'side-vertical') {
    return (
      <div style={{
        position: 'absolute',
        right: 18, top: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 16,
        letterSpacing: '0.3em',
        writingMode: 'vertical-rl',
      }}>
        {d}.{m}.20{y}
      </div>
    );
  }
  if (style === 'botanical') {
    return (
      <div style={{
        position: 'absolute',
        left: '50%', bottom: '20%',
        transform: 'translateX(-50%)',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 52,
        fontWeight: 300,
        letterSpacing: '0.04em',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.4em', marginBottom: 8, opacity: 0.8 }}>· THE DATE ·</div>
        {d}/{m}/20{y}
      </div>
    );
  }
  if (style === 'framed') {
    return (
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        color: accent,
        fontFamily: "'Cormorant Garamond', serif",
        textAlign: 'center',
        padding: '24px 36px',
        border: `1px solid ${accent}66`,
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.4em', marginBottom: 8 }}>SAVE THE DATE</div>
        <div style={{ fontSize: 44, lineHeight: 1, fontWeight: 300 }}>{d}.{m}</div>
        <div style={{ fontSize: 14, letterSpacing: '0.2em', marginTop: 4 }}>20{y}</div>
      </div>
    );
  }
  return null;
}

function WeddingCardPreview({ theme, form, primaryColor, scale = 1 }) {
  const { brideFirst, brideLast, groomFirst, groomLast, day, month, year } = form;

  const bride = (brideFirst || 'Hương').trim();
  const groom = (groomFirst || 'Minh').trim();

  const width = 300 * scale;
  const height = 600 * scale;

  return (
    <div style={{
      position: 'relative',
      width, height,
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)',
      background: '#000',
    }}>
      <CouplePhotoPlaceholder theme={theme} accent={theme.accent} />

      {/* Top corner label */}
      <div style={{
        position: 'absolute', top: 18, left: 18,
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 10,
        letterSpacing: '0.3em',
        opacity: 0.9,
      }}>
        SIMPLY · ME
      </div>
      <div style={{
        position: 'absolute', top: 18, right: 18,
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 9,
        letterSpacing: '0.25em',
        opacity: 0.85,
        padding: '2px 6px',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 2,
      }}>
        #1
      </div>

      <DateBlock day={day} month={month} year={year} style={theme.dateStyle} accent={theme.accent} />

      {/* Bottom names */}
      <div style={{
        position: 'absolute', bottom: 22, left: 18,
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 11,
        letterSpacing: '0.3em',
      }}>
        {groom.toUpperCase()}
      </div>
      <div style={{
        position: 'absolute', bottom: 22, right: 18,
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 11,
        letterSpacing: '0.3em',
      }}>
        {bride.toUpperCase()}
      </div>
      <div style={{
        position: 'absolute', bottom: 38, left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 9,
        letterSpacing: '0.3em',
        opacity: 0.7,
      }}>
        · & ·
      </div>

      {/* Accent corner mark using primary color */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%',
        transform: 'translateX(-50%)',
        width: 24, height: 1,
        background: primaryColor,
        opacity: 0.8,
      }} />

      {/* Subtle sparkle dots to mimic the reference */}
      <Sparkles />
    </div>
  );
}

function Sparkles() {
  const dots = useMemo(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      list.push({
        left: Math.random() * 100,
        top: 30 + Math.random() * 55,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    return list;
  }, []);
  return (
    <>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${d.left}%`, top: `${d.top}%`,
          width: d.size, height: d.size,
          borderRadius: '50%',
          background: '#fff',
          opacity: d.opacity,
          boxShadow: '0 0 4px rgba(255,255,255,0.6)',
        }} />
      ))}
    </>
  );
}

Object.assign(window, { WeddingCardPreview, CouplePhotoPlaceholder, DateBlock });
