// Shared UI primitives — inputs, selects, buttons, stepper
const { useState: useStateUI, useRef: useRefUI, useEffect: useEffectUI } = React;

function TextField({ label, value, onChange, placeholder, flex = 1 }) {
  return (
    <div style={{ flex, position: 'relative', minWidth: 0 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 11,
          color: '#9B9792',
          marginBottom: 6,
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}>{label}</label>
      )}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 12px',
          border: '1px solid #E8E4DC',
          borderRadius: 6,
          background: '#fff',
          fontSize: 14,
          color: '#1A1A1A',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border 0.15s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => e.target.style.borderColor = '#9A7B3F'}
        onBlur={(e) => e.target.style.borderColor = '#E8E4DC'}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, flex = 1, placeholder }) {
  return (
    <div style={{ flex, position: 'relative', minWidth: 0 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 11,
          color: '#9B9792',
          marginBottom: 6,
          fontWeight: 500,
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 30px 11px 12px',
            border: '1px solid #E8E4DC',
            borderRadius: 6,
            background: '#fff',
            fontSize: 14,
            color: value ? '#1A1A1A' : '#9B9792',
            fontFamily: 'inherit',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}>
          <path d="M2 4 L5 7 L8 4" stroke="#9B9792" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 11,
          color: '#9B9792',
          marginBottom: 6,
          fontWeight: 500,
        }}>{label}</label>
      )}
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '11px 12px',
          border: '1px solid #E8E4DC',
          borderRadius: 6,
          background: '#fff',
          fontSize: 14,
          color: '#1A1A1A',
          fontFamily: 'inherit',
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.55,
          boxSizing: 'border-box',
        }}
        onFocus={(e) => e.target.style.borderColor = '#9A7B3F'}
        onBlur={(e) => e.target.style.borderColor = '#E8E4DC'}
      />
    </div>
  );
}

function Button({ children, variant = 'primary', onClick, disabled, size = 'md', icon }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    border: 'none',
    borderRadius: 6,
    fontFamily: 'inherit',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    letterSpacing: '0.01em',
  };
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 12 },
    md: { padding: '10px 18px', fontSize: 13 },
    lg: { padding: '13px 24px', fontSize: 14 },
  };
  const variants = {
    primary: { background: '#1A1A1A', color: '#fff' },
    gold:    { background: 'var(--primary)', color: '#fff' },
    ghost:   { background: 'transparent', color: '#1A1A1A', border: '1px solid #E8E4DC' },
    muted:   { background: '#F0EDE7', color: '#9B9792' },
    text:    { background: 'transparent', color: '#1A1A1A', padding: '8px 4px' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
    >
      {icon}
      {children}
    </button>
  );
}

function Stepper({ steps, current, onSelect }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.id}>
            <button
              onClick={() => onSelect(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 24, height: 24,
                borderRadius: '50%',
                border: `1px solid ${active || done ? 'var(--primary)' : '#E8E4DC'}`,
                background: done ? 'var(--primary)' : active ? '#fff' : '#fff',
                color: done ? '#fff' : active ? 'var(--primary)' : '#9B9792',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Cormorant Garamond', serif",
                transition: 'all 0.2s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 12,
                color: active ? '#1A1A1A' : done ? '#1A1A1A' : '#9B9792',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.01em',
              }}>{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1,
                background: done ? 'var(--primary)' : '#E8E4DC',
                margin: '0 12px',
                minWidth: 16,
                transition: 'background 0.2s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {eyebrow && (
        <div style={{
          fontSize: 10,
          letterSpacing: '0.25em',
          color: 'var(--primary)',
          fontWeight: 600,
          marginBottom: 8,
          textTransform: 'uppercase',
        }}>{eyebrow}</div>
      )}
      <h2 style={{
        margin: 0,
        fontSize: 22,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 500,
        color: '#1A1A1A',
        letterSpacing: '-0.01em',
        lineHeight: 1.2,
      }}>{title}</h2>
      {sub && (
        <p style={{
          margin: '6px 0 0',
          fontSize: 13,
          color: '#9B9792',
          lineHeight: 1.5,
        }}>{sub}</p>
      )}
    </div>
  );
}

function FormRow({ children, gap = 10 }) {
  return (
    <div style={{ display: 'flex', gap, marginBottom: 10 }}>
      {children}
    </div>
  );
}

Object.assign(window, { TextField, Select, Textarea, Button, Stepper, SectionTitle, FormRow });
