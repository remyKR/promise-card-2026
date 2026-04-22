// Step panels — each rendered in the right-side panel
const { useState: useStateStep } = React;

// Theme thumbnail — miniaturized wedding card
function ThemeThumb({ theme, selected, onClick, primaryColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: 128, height: 200,
        borderRadius: 6,
        overflow: 'hidden',
        border: selected ? `2px solid var(--primary)` : '1px solid #E8E4DC',
        padding: 0,
        cursor: 'pointer',
        background: '#000',
        boxShadow: selected ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: theme.bg }}>
        <div style={{
          position: 'absolute',
          left: '22%', top: '28%', width: '40%', height: '50%',
          background: 'radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0.04) 55%, transparent 72%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          right: '18%', top: '22%', width: '42%', height: '54%',
          background: 'radial-gradient(ellipse at 55% 35%, rgba(255,255,255,0.2), rgba(255,255,255,0.03) 58%, transparent 74%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          fontStyle: 'italic',
          fontWeight: 300,
          lineHeight: 0.95,
          textAlign: 'center',
        }}>26<br/>10<br/>24</div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
      </div>
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 22, height: 22,
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}>✓</div>
      )}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        textAlign: 'center',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 11,
        letterSpacing: '0.25em',
        opacity: 0.9,
      }}>{theme.name}</div>
    </button>
  );
}

function ThemeStep({ form, update, themes, primaryColor }) {
  const [page, setPage] = useStateStep(0);
  const perPage = 3;
  const pages = Math.ceil(themes.length / perPage);
  const visible = themes.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <SectionTitle eyebrow="BƯỚC 01" title="Chọn giao diện" sub="Chọn một chủ đề phù hợp với câu chuyện của bạn." />

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, minHeight: 200 }}>
        {visible.map(t => (
          <ThemeThumb
            key={t.id}
            theme={t}
            selected={form.themeId === t.id}
            onClick={() => update({ themeId: t.id })}
            primaryColor={primaryColor}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 11, color: '#9B9792', letterSpacing: '0.05em' }}>{page + 1}/{pages}</span>
        <div style={{ flex: 1, height: 2, background: '#E8E4DC', borderRadius: 1, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: `${(page / (pages - 1 || 1)) * 80}%`,
            top: -1, width: '20%', height: 4,
            background: 'var(--primary)', borderRadius: 1,
            transition: 'left 0.2s',
          }} />
        </div>
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          style={{ width: 28, height: 28, border: '1px solid #E8E4DC', background: '#fff', borderRadius: 4, cursor: 'pointer', opacity: page === 0 ? 0.4 : 1 }}
        >‹</button>
        <button
          onClick={() => setPage(Math.min(pages - 1, page + 1))}
          disabled={page === pages - 1}
          style={{ width: 28, height: 28, border: '1px solid #E8E4DC', background: '#fff', borderRadius: 4, cursor: 'pointer', opacity: page === pages - 1 ? 0.4 : 1 }}
        >›</button>
      </div>

      <div>
        <div style={{ fontSize: 11, color: '#9B9792', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 500 }}>MÀU CHỦ ĐẠO</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {window.SWATCHES.map(s => {
            const selected = form.accent === s.value;
            return (
              <button
                key={s.id}
                onClick={() => update({ accent: s.value })}
                title={s.name}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: s.value,
                  border: selected ? '2px solid #1A1A1A' : '2px solid transparent',
                  outline: selected ? '1px solid #fff' : 'none',
                  outlineOffset: -4,
                  cursor: 'pointer',
                  boxShadow: selected ? '0 0 0 1px #1A1A1A' : '0 1px 3px rgba(0,0,0,0.08)',
                  padding: 0,
                  transition: 'transform 0.15s',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CoupleStep({ form, update }) {
  return (
    <div>
      <SectionTitle eyebrow="BƯỚC 02" title="Thông tin cơ bản" sub="Nhập thông tin cô dâu và chú rể." />

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Cô dâu</div>
        <FormRow>
          <TextField value={form.brideLast} onChange={v => update({ brideLast: v })} placeholder="Họ" flex={1} />
          <TextField value={form.brideFirst} onChange={v => update({ brideFirst: v })} placeholder="Tên" flex={1} />
          <Select
            value={form.brideRelation}
            onChange={v => update({ brideRelation: v })}
            options={window.RELATION_OPTIONS}
            placeholder="Con gái"
            flex={1}
          />
        </FormRow>
        <FormRow>
          <TextField value={form.brideFather} onChange={v => update({ brideFather: v })} placeholder="Họ tên bố" flex={2} />
          <Select value={form.brideFatherTitle} onChange={v => update({ brideFatherTitle: v })} options={window.FATHER_OPTIONS} placeholder="Bố" flex={1} />
        </FormRow>
        <FormRow>
          <TextField value={form.brideMother} onChange={v => update({ brideMother: v })} placeholder="Họ tên mẹ" flex={2} />
          <Select value={form.brideMotherTitle} onChange={v => update({ brideMotherTitle: v })} options={window.MOTHER_OPTIONS} placeholder="Mẹ" flex={1} />
        </FormRow>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Chú rể</div>
        <FormRow>
          <TextField value={form.groomLast} onChange={v => update({ groomLast: v })} placeholder="Họ" flex={1} />
          <TextField value={form.groomFirst} onChange={v => update({ groomFirst: v })} placeholder="Tên" flex={1} />
          <Select
            value={form.groomRelation}
            onChange={v => update({ groomRelation: v })}
            options={window.RELATION_OPTIONS}
            placeholder="Con trai"
            flex={1}
          />
        </FormRow>
        <FormRow>
          <TextField value={form.groomFather} onChange={v => update({ groomFather: v })} placeholder="Họ tên bố" flex={2} />
          <Select value={form.groomFatherTitle} onChange={v => update({ groomFatherTitle: v })} options={window.FATHER_OPTIONS} placeholder="Bố" flex={1} />
        </FormRow>
        <FormRow>
          <TextField value={form.groomMother} onChange={v => update({ groomMother: v })} placeholder="Họ tên mẹ" flex={2} />
          <Select value={form.groomMotherTitle} onChange={v => update({ groomMotherTitle: v })} options={window.MOTHER_OPTIONS} placeholder="Mẹ" flex={1} />
        </FormRow>
      </div>

      <div style={{ fontSize: 11, color: '#9B9792', marginTop: 8 }}>
        · Thông tin bố mẹ có thể bỏ qua.
      </div>
    </div>
  );
}

function EventStep({ form, update }) {
  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: `Tháng ${i + 1}` }));
  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: String(i + 1) }));
  const years = Array.from({ length: 5 }, (_, i) => ({ value: String(2026 + i).slice(2), label: String(2026 + i) }));
  const hours = Array.from({ length: 24 }, (_, i) => ({ value: String(i).padStart(2, '0'), label: `${String(i).padStart(2, '0')}:00` }));

  return (
    <div>
      <SectionTitle eyebrow="BƯỚC 03" title="Thời gian & địa điểm" sub="Chọn ngày giờ và nơi tổ chức." />

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Ngày cưới</div>
        <FormRow>
          <Select value={form.year} onChange={v => update({ year: v })} options={years} placeholder="Năm" flex={1} />
          <Select value={form.month} onChange={v => update({ month: v })} options={months} placeholder="Tháng" flex={1} />
          <Select value={form.day} onChange={v => update({ day: v })} options={days} placeholder="Ngày" flex={1} />
        </FormRow>
        <FormRow>
          <Select value={form.hour} onChange={v => update({ hour: v })} options={hours} placeholder="Giờ lễ" flex={1} />
          <div style={{ flex: 1 }} />
        </FormRow>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Địa điểm tổ chức</div>
        <FormRow>
          <TextField value={form.venueName} onChange={v => update({ venueName: v })} placeholder="Tên địa điểm (VD: Grand Ballroom)" />
        </FormRow>
        <FormRow>
          <TextField value={form.venueAddress} onChange={v => update({ venueAddress: v })} placeholder="Địa chỉ cụ thể" />
        </FormRow>
        <FormRow>
          <TextField value={form.venueHall} onChange={v => update({ venueHall: v })} placeholder="Sảnh / Phòng (không bắt buộc)" />
        </FormRow>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Lễ gia tiên</div>
        <FormRow>
          <TextField value={form.homeBride} onChange={v => update({ homeBride: v })} placeholder="Nhà gái" />
          <TextField value={form.homeGroom} onChange={v => update({ homeGroom: v })} placeholder="Nhà trai" />
        </FormRow>
      </div>
    </div>
  );
}

function StoryStep({ form, update }) {
  return (
    <div>
      <SectionTitle eyebrow="BƯỚC 04" title="Câu chuyện & ảnh" sub="Thêm ảnh đại diện, album và lời nhắn." />

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Ảnh bìa</div>
        <div style={{
          border: '1.5px dashed #D4CEC0',
          borderRadius: 8,
          padding: '28px 16px',
          textAlign: 'center',
          background: '#FAF8F3',
          cursor: 'pointer',
        }}>
          <div style={{ fontSize: 26, color: '#9B9792', marginBottom: 4 }}>＋</div>
          <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>Tải ảnh bìa lên</div>
          <div style={{ fontSize: 11, color: '#9B9792', marginTop: 2 }}>Khuyến nghị 1080 × 1920 (JPG, PNG)</div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Album ảnh cưới</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{
              aspectRatio: '1',
              background: i === 0 ? '#F0EDE7' : '#FAF8F3',
              border: '1px dashed #D4CEC0',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#9B9792',
              cursor: 'pointer',
            }}>＋</div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#9B9792', marginTop: 8 }}>Tối đa 8 ảnh.</div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <Textarea
          label="LỜI MỜI"
          value={form.invitation}
          onChange={v => update({ invitation: v })}
          placeholder="Trân trọng kính mời đến dự lễ thành hôn của chúng tôi..."
          rows={4}
        />
      </div>

      <Textarea
        label="LỜI NHẮN GỬI KHÁCH MỜI"
        value={form.message}
        onChange={v => update({ message: v })}
        placeholder="Sự hiện diện của bạn là niềm hạnh phúc của chúng tôi."
        rows={3}
      />
    </div>
  );
}

function AccountStep({ form, update }) {
  return (
    <div>
      <SectionTitle eyebrow="BƯỚC 05" title="Hoàn thành" sub="Thông tin tài khoản & xem trước thiệp cưới." />

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Tài khoản cô dâu</div>
        <FormRow>
          <TextField value={form.brideBank} onChange={v => update({ brideBank: v })} placeholder="Tên ngân hàng" flex={2} />
          <TextField value={form.brideAcct} onChange={v => update({ brideAcct: v })} placeholder="Số tài khoản" flex={3} />
        </FormRow>
        <FormRow>
          <TextField value={form.brideHolder} onChange={v => update({ brideHolder: v })} placeholder="Chủ tài khoản" />
        </FormRow>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Tài khoản chú rể</div>
        <FormRow>
          <TextField value={form.groomBank} onChange={v => update({ groomBank: v })} placeholder="Tên ngân hàng" flex={2} />
          <TextField value={form.groomAcct} onChange={v => update({ groomAcct: v })} placeholder="Số tài khoản" flex={3} />
        </FormRow>
        <FormRow>
          <TextField value={form.groomHolder} onChange={v => update({ groomHolder: v })} placeholder="Chủ tài khoản" />
        </FormRow>
      </div>

      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, #FAF8F3 0%, #F0EDE7 100%)',
        borderRadius: 8,
        border: '1px solid #E8E4DC',
      }}>
        <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.15em', marginBottom: 4 }}>SẴN SÀNG</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#1A1A1A', marginBottom: 8 }}>Thiệp cưới của bạn đã hoàn tất</div>
        <div style={{ fontSize: 12, color: '#6B6761', lineHeight: 1.5, marginBottom: 14 }}>
          Nhấn "Xem toàn màn hình" để trải nghiệm thiệp cưới, hoặc "Lưu" để tiếp tục chỉnh sửa sau.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ThemeStep, CoupleStep, EventStep, StoryStep, AccountStep });
