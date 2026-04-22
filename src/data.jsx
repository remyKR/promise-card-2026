// Themes, colors, and static data for the Promise Card editor
// All copy in Vietnamese per user spec

const THEMES = [
  {
    id: 'sinerva',
    name: 'SINERVA',
    tagline: 'SIMPLY · ME TO BE · TOGETHER',
    style: 'classic',
    bg: 'linear-gradient(135deg, #2a2420 0%, #4a3a2e 50%, #6b5443 100%)',
    accent: '#D4B583',
    dateStyle: 'stacked-serif',
    logoFont: 'display',
  },
  {
    id: 'aurelia',
    name: 'AURELIA',
    tagline: 'FOREVER · AND · ALWAYS',
    style: 'minimal',
    bg: 'linear-gradient(160deg, #e8dfd0 0%, #c9b896 60%, #a0896a 100%)',
    accent: '#FFFFFF',
    dateStyle: 'horizontal-thin',
    logoFont: 'display',
  },
  {
    id: 'noir',
    name: 'NOIR',
    tagline: 'TWO · HEARTS · ONE · PATH',
    style: 'bold',
    bg: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
    accent: '#E8C168',
    dateStyle: 'centered-large',
    logoFont: 'bold-serif',
  },
  {
    id: 'bloom',
    name: 'BLOOM',
    tagline: 'A NEW · CHAPTER · BEGINS',
    style: 'romantic',
    bg: 'linear-gradient(135deg, #f5e6e0 0%, #e8c5b8 60%, #d4a192 100%)',
    accent: '#8B4A3E',
    dateStyle: 'side-vertical',
    logoFont: 'italic-serif',
  },
  {
    id: 'verde',
    name: 'VERDE',
    tagline: 'GROWING · TOGETHER',
    style: 'natural',
    bg: 'linear-gradient(160deg, #e8ebe0 0%, #b8c4a8 60%, #6b7a5a 100%)',
    accent: '#3A4A30',
    dateStyle: 'botanical',
    logoFont: 'serif',
  },
  {
    id: 'marble',
    name: 'MARBLE',
    tagline: 'TIMELESS · LOVE',
    style: 'luxe',
    bg: 'linear-gradient(135deg, #f0ebe4 0%, #e0d5c8 40%, #c8b8a0 100%)',
    accent: '#6B5A3E',
    dateStyle: 'framed',
    logoFont: 'display',
  },
  {
    id: 'azure',
    name: 'AZURE',
    tagline: 'BLUE · HOUR · ETERNAL',
    style: 'modern',
    bg: 'linear-gradient(180deg, #1e3a5f 0%, #2e5a8f 50%, #5a8bbf 100%)',
    accent: '#F0E4C8',
    dateStyle: 'horizontal-thin',
    logoFont: 'thin-serif',
  },
  {
    id: 'dune',
    name: 'DUNE',
    tagline: 'DESERT · ROSE · IN BLOOM',
    style: 'warm',
    bg: 'linear-gradient(160deg, #f5ead8 0%, #e8c8a0 50%, #c89868 100%)',
    accent: '#5A3A20',
    dateStyle: 'side-vertical',
    logoFont: 'serif',
  },
];

const SWATCHES = [
  { id: 'gold', name: 'Vàng', value: '#9A7B3F' },
  { id: 'peach', name: 'Đào', value: '#E8B4A0' },
  { id: 'blush', name: 'Hồng phấn', value: '#F5D5D0' },
  { id: 'azure', name: 'Xanh', value: '#4A7FD4' },
  { id: 'cream', name: 'Kem', value: '#E8D4A8' },
  { id: 'mint', name: 'Bạc hà', value: '#C8E4DC' },
  { id: 'lavender', name: 'Oải hương', value: '#D4C8E4' },
  { id: 'violet', name: 'Tím', value: '#A88BC4' },
];

const STEPS = [
  { id: 'theme',    label: 'Giao diện',   sub: 'Chọn chủ đề' },
  { id: 'couple',   label: 'Cô dâu chú rể', sub: 'Thông tin cơ bản' },
  { id: 'event',    label: 'Lễ cưới',     sub: 'Thời gian & địa điểm' },
  { id: 'story',    label: 'Câu chuyện',  sub: 'Ảnh & lời nhắn' },
  { id: 'account',  label: 'Hoàn thành',  sub: 'Tài khoản & xem trước' },
];

const RELATION_OPTIONS = [
  { value: 'son',    label: 'Con trai' },
  { value: 'daughter', label: 'Con gái' },
];

const FATHER_OPTIONS = [{ value: 'bo', label: 'Bố' }, { value: 'ba', label: 'Ba' }];
const MOTHER_OPTIONS = [{ value: 'me', label: 'Mẹ' }, { value: 'ma', label: 'Má' }];

Object.assign(window, { THEMES, SWATCHES, STEPS, RELATION_OPTIONS, FATHER_OPTIONS, MOTHER_OPTIONS });
