// ───────── 경품 설정 ─────────
// 하루 준비 수량 (수·목 각각 키링 15개, 젤리 50개)
export const DAILY_STOCK = { keyring: 15, jelly: 50 }

// true로 바꾸면 3문제를 모두 맞힌 사람만 룰렛을 돌릴 수 있어요
export const REQUIRE_ALL_CORRECT = false

export const PRIZES = {
  keyring: { label: '거북이 키링', short: '키링', emoji: '🐢' },
  jelly: { label: '젤리', short: '젤리', emoji: '🍬' },
}

// ───────── 재고 저장 (태블릿 브라우저에 저장됨) ─────────
// 당첨 확률 = 남은 키링 ÷ 남은 경품 전체
// → 처음엔 15/65, 이후 남은 수량에 맞춰 자동 조정돼서 하루 수량이 딱 맞게 나가요
const KEY = 'turtle-neck-stock'

export function loadStock() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && Number.isFinite(s.keyring) && Number.isFinite(s.jelly)) return s
  } catch {}
  return { ...DAILY_STOCK }
}

export function saveStock(stock) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stock))
  } catch {}
}

export function drawPrize() {
  const s = loadStock()
  const total = Math.max(0, s.keyring) + Math.max(0, s.jelly)
  if (total <= 0) return null
  const type = Math.random() * total < Math.max(0, s.keyring) ? 'keyring' : 'jelly'
  saveStock({ ...s, [type]: s[type] - 1 }) // 돌리는 순간 바로 차감 (새로고침해도 다시 못 뽑게)
  return type
}
