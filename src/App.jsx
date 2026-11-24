import { useCallback, useEffect, useState } from 'react'
import { QUESTIONS } from './quizData.js'

const NUMS = ['①', '②', '③', '④', '⑤']

export default function App() {
  const [phase, setPhase] = useState('start') // 'start' | 'play' | 'result'
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null) // null | 선택한 보기 번호(1부터)
  const [results, setResults] = useState([]) // 문제별 정답 여부

  const total = QUESTIONS.length
  const current = QUESTIONS[index]
  const score = results.filter(Boolean).length

  const start = () => {
    setPhase('play')
    setIndex(0)
    setPicked(null)
    setResults([])
  }

  const choose = useCallback(
    (n) => {
      if (phase !== 'play' || picked !== null) return
      if (n < 1 || n > current.options.length) return
      setPicked(n)
      setResults((prev) => [...prev, n === current.answer])
    },
    [phase, picked, current]
  )

  const next = useCallback(() => {
    if (picked === null) return
    if (index + 1 >= total) {
      setPhase('result')
    } else {
      setIndex((i) => i + 1)
      setPicked(null)
    }
  }, [picked, index, total])

  // 키보드(블루투스 키보드 포함): 1·2·3으로 답하고 Enter로 다음 문제
  useEffect(() => {
    const onKey = (e) => {
      if (phase === 'play') {
        if (/^[1-9]$/.test(e.key)) choose(Number(e.key))
        else if (e.key === 'Enter' && picked !== null) {
          e.preventDefault()
          next()
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        start()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, picked, choose, next])

  return (
    <main className="page">
      <section className="card" key={phase + index}>
        {phase === 'start' && <StartScreen total={total} onStart={start} />}

        {phase === 'play' && (
          <PlayScreen
            q={current}
            index={index}
            total={total}
            picked={picked}
            onChoose={choose}
            onNext={next}
          />
        )}

        {phase === 'result' && (
          <ResultScreen score={score} total={total} results={results} onRetry={start} />
        )}
      </section>
    </main>
  )
}

function StartScreen({ total, onStart }) {
  return (
    <div className="start">
      <span className="eyebrow">TURTLE NECK QUIZ</span>
      <h1 className="title">
        우리 <span className="accent">자세 교정기</span>,
        <br />
        얼마나 알고 있나요?
      </h1>
      <p className="lead">하드웨어부터 웹서비스까지, {total}문제로 알아보는 Turtle Neck.</p>
      <button className="primary" onClick={onStart}>
        퀴즈 시작하기
      </button>
    </div>
  )
}

function PlayScreen({ q, index, total, picked, onChoose, onNext }) {
  const answered = picked !== null
  const correct = answered && picked === q.answer
  const isLast = index + 1 === total

  const optClass = (n) => {
    let c = 'option'
    if (answered) {
      if (n === q.answer) c += ' answer'
      else if (n === picked) c += ' wrong'
      else c += ' dim'
    }
    return c
  }

  return (
    <div className="play">
      <div className="progress-row">
        <span className="tag">{q.category}</span>
        <div className="progress">
          <div
            className="progress-fill"
            style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <span className="count">
          <b>{index + 1}</b> / {total}
        </span>
      </div>

      <div className="play-body">
        <h2 className="question">
          <span className="qnum">Q{index + 1}.</span> {q.q}
        </h2>

        <div className="options">
          {q.options.map((text, i) => {
            const n = i + 1
            return (
              <button key={n} className={optClass(n)} onClick={() => onChoose(n)} disabled={answered}>
                <span className="num">{NUMS[i]}</span>
                <span className="text">{text}</span>
                {answered && n === q.answer && <span className="mark">정답</span>}
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <div className={`feedback ${correct ? 'good' : 'bad'}`} aria-live="polite">
          <div>
            <p className="verdict">
              {correct ? '정답이에요! 🎉' : `아쉬워요! 정답은 ${NUMS[q.answer - 1]} ${q.options[q.answer - 1]}`}
            </p>
            {q.explain && <p className="explain">{q.explain}</p>}
          </div>
          <button className="primary" onClick={onNext}>
            {isLast ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  )
}

function ResultScreen({ score, total, results, onRetry }) {
  const ratio = score / total
  const message =
    ratio === 1 ? '완벽해요! Turtle Neck 마스터 🐢👑'
    : ratio >= 0.6 ? '훌륭해요! 거의 다 맞혔어요'
    : '다시 도전해 볼까요? 💪'

  return (
    <div className="result">
      <span className="eyebrow">RESULT</span>
      <p className="score">
        <b>{score}</b>
        <span> / {total}</span>
      </p>
      <p className="lead">{message}</p>

      <ol className="dots" aria-label="문제별 결과">
        {results.map((ok, i) => (
          <li key={i} className={ok ? 'ok' : 'no'}>
            Q{i + 1} {ok ? '정답' : '오답'}
          </li>
        ))}
      </ol>

      <button className="primary" onClick={onRetry}>
        다시 풀기
      </button>
    </div>
  )
}
