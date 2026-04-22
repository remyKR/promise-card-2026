// Full-screen invitation reader mode — scrollable mobile preview sections
const { useState: useStateFS, useEffect: useEffectFS, useRef: useRefFS } = React;

function FullscreenInvitation({ theme, form, primaryColor, onClose }) {
  const scrollRef = useRefFS(null);
  const [progress, setProgress] = useStateFS(0);

  useEffectFS(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const bride = (form.brideFirst || 'Hương');
  const groom = (form.groomFirst || 'Minh');
  const day = form.day || '26';
  const month = form.month || '10';
  const year = form.year || '24';
  const hour = form.hour || '17';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fade-in 0.3s ease',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 24, right: 28,
          width: 40, height: 40,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >✕</button>

      <div style={{
        position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        letterSpacing: '0.3em',
        fontFamily: "'Cormorant Garamond', serif",
      }}>XEM TRƯỚC THIỆP CƯỚI</div>

      <div style={{
        width: 360, height: 720,
        borderRadius: 28,
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 12px #1a1a1a, 0 0 0 13px #333',
        position: 'relative',
      }}>
        {/* Progress bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 2, background: 'rgba(255,255,255,0.1)', zIndex: 10,
        }}>
          <div style={{
            height: '100%', width: `${progress * 100}%`,
            background: theme.accent,
            transition: 'width 0.1s',
          }} />
        </div>

        <div ref={scrollRef} style={{
          width: '100%', height: '100%',
          overflowY: 'auto', overflowX: 'hidden',
          scrollBehavior: 'smooth',
        }}>
          {/* Section 1: Cover */}
          <section style={{
            height: 720,
            background: theme.bg,
            position: 'relative',
          }}>
            <CouplePhotoPlaceholder theme={theme} accent={theme.accent} />
            <div style={{ position: 'absolute', top: 28, left: 24, color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.3em' }}>SIMPLY · ME</div>
            <div style={{
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
              color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic',
              fontSize: 110, lineHeight: 0.92, textAlign: 'center',
            }}>
              <div>{day}</div>
              <div>{month}</div>
              <div>{year}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 32, left: 24, color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.3em' }}>{groom.toUpperCase()}</div>
            <div style={{ position: 'absolute', bottom: 32, right: 24, color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.3em' }}>{bride.toUpperCase()}</div>
            <div style={{ position: 'absolute', bottom: 55, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.3em', opacity: 0.7 }}>· & ·</div>
            <Sparkles />
          </section>

          {/* Section 2: Invitation */}
          <section style={{ padding: '72px 32px', background: '#FAF8F3', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: primaryColor, marginBottom: 16 }}>· LỜI NGỎ ·</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#1A1A1A', lineHeight: 1.4, marginBottom: 20, fontStyle: 'italic' }}>
              Save the date
            </div>
            <div style={{ width: 40, height: 1, background: primaryColor, margin: '0 auto 20px', opacity: 0.6 }} />
            <p style={{ fontSize: 13, color: '#4a4744', lineHeight: 1.8, fontFamily: "'Cormorant Garamond', serif" }}>
              {form.invitation || 'Trân trọng kính mời quý vị đến dự buổi lễ thành hôn của chúng tôi. Sự hiện diện của bạn là niềm vinh hạnh lớn lao của chúng tôi trong ngày đặc biệt này.'}
            </p>
          </section>

          {/* Section 3: Couple details */}
          <section style={{ padding: '64px 32px', background: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: primaryColor, marginBottom: 24 }}>· CÔ DÂU & CHÚ RỂ ·</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 88, height: 108, margin: '0 auto 14px', background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}66)`, borderRadius: 4 }} />
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: '#9B9792', marginBottom: 6 }}>CÔ DÂU</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A1A1A', fontStyle: 'italic' }}>{bride}</div>
                <div style={{ fontSize: 11, color: '#6B6761', marginTop: 10, lineHeight: 1.5 }}>
                  {form.brideFather && <div>Bố: {form.brideFather}</div>}
                  {form.brideMother && <div>Mẹ: {form.brideMother}</div>}
                </div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: primaryColor, fontStyle: 'italic' }}>&</div>
              <div style={{ flex: 1 }}>
                <div style={{ width: 88, height: 108, margin: '0 auto 14px', background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}66)`, borderRadius: 4 }} />
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: '#9B9792', marginBottom: 6 }}>CHÚ RỂ</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A1A1A', fontStyle: 'italic' }}>{groom}</div>
                <div style={{ fontSize: 11, color: '#6B6761', marginTop: 10, lineHeight: 1.5 }}>
                  {form.groomFather && <div>Bố: {form.groomFather}</div>}
                  {form.groomMother && <div>Mẹ: {form.groomMother}</div>}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Date */}
          <section style={{ padding: '72px 32px', background: '#FAF8F3', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: primaryColor, marginBottom: 24 }}>· THỜI GIAN ·</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#1A1A1A', fontSize: 20, marginBottom: 8 }}>Thứ Bảy</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: '#1A1A1A', fontWeight: 300, lineHeight: 1 }}>{day}</div>
              <div>
                <div style={{ fontSize: 11, color: '#6B6761', letterSpacing: '0.2em' }}>THÁNG</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#1A1A1A' }}>{month}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B6761', letterSpacing: '0.2em' }}>NĂM</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#1A1A1A' }}>20{year}</div>
              </div>
            </div>
            <div style={{ width: 40, height: 1, background: primaryColor, margin: '20px auto', opacity: 0.5 }} />
            <div style={{ fontSize: 13, color: '#4a4744' }}>Lễ thành hôn · {hour}:00</div>
          </section>

          {/* Section 5: Venue */}
          <section style={{ padding: '64px 32px', background: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: primaryColor, marginBottom: 16 }}>· ĐỊA ĐIỂM ·</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#1A1A1A', marginBottom: 8, fontStyle: 'italic' }}>
              {form.venueName || 'Grand Ballroom'}
            </div>
            {form.venueHall && <div style={{ fontSize: 12, color: '#6B6761', marginBottom: 8 }}>{form.venueHall}</div>}
            <div style={{ fontSize: 13, color: '#4a4744', lineHeight: 1.7 }}>
              {form.venueAddress || '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}
            </div>
            <div style={{
              marginTop: 24,
              height: 180,
              background: `linear-gradient(135deg, ${primaryColor}11, ${primaryColor}33)`,
              borderRadius: 8,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(0deg, ${primaryColor}22 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}22 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
                opacity: 0.6,
              }} />
              <div style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                width: 16, height: 16, borderRadius: '50%', background: primaryColor,
                boxShadow: `0 0 0 6px ${primaryColor}33, 0 0 0 12px ${primaryColor}11`,
              }} />
              <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#9B9792', letterSpacing: '0.2em' }}>BẢN ĐỒ</div>
            </div>
          </section>

          {/* Section 6: Gallery */}
          <section style={{ padding: '56px 24px', background: '#FAF8F3', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: primaryColor, marginBottom: 24 }}>· ALBUM ·</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{
                  aspectRatio: '3/4',
                  background: `linear-gradient(${135 + i * 30}deg, ${theme.accent}44, ${primaryColor}44)`,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.2), transparent 60%)',
                  }} />
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: Accounts */}
          <section style={{ padding: '64px 32px', background: '#fff' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: primaryColor, textAlign: 'center', marginBottom: 24 }}>· HỘP MỪNG ·</div>
            {[
              { side: 'CÔ DÂU', name: form.brideHolder || bride, bank: form.brideBank || 'Vietcombank', acct: form.brideAcct || '0123 456 789' },
              { side: 'CHÚ RỂ', name: form.groomHolder || groom, bank: form.groomBank || 'Techcombank', acct: form.groomAcct || '9876 543 210' },
            ].map((a, i) => (
              <div key={i} style={{
                padding: 18,
                marginBottom: 10,
                background: '#FAF8F3',
                borderRadius: 6,
                border: `1px solid ${primaryColor}22`,
              }}>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: primaryColor, marginBottom: 6 }}>{a.side}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#1A1A1A', fontStyle: 'italic', marginBottom: 8 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: '#6B6761', lineHeight: 1.6 }}>
                  <div>{a.bank}</div>
                  <div style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{a.acct}</div>
                </div>
              </div>
            ))}
          </section>

          {/* Section 8: Closing */}
          <section style={{ padding: '80px 32px 100px', background: theme.bg, color: '#fff', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', color: theme.accent, marginBottom: 20, opacity: 0.9 }}>· THANK YOU ·</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontStyle: 'italic', marginBottom: 16, lineHeight: 1.3 }}>
              {groom} & {bride}
            </div>
            <div style={{ width: 30, height: 1, background: theme.accent, margin: '0 auto 20px', opacity: 0.6 }} />
            <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.7, maxWidth: 260, margin: '0 auto' }}>
              {form.message || 'Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của chúng tôi trong ngày trọng đại này.'}
            </p>
            <Sparkles />
          </section>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.2em',
      }}>Cuộn xuống để xem thêm ↓</div>
    </div>
  );
}

Object.assign(window, { FullscreenInvitation });
