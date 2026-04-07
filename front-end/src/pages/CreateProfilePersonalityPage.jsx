import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import './CreateProfileFlow.css'

const QUESTIONS = [
  {
    key: 'ei',
    title: 'After a busy week, what sounds better?',
    options: [
      { label: 'A social event with new people', letter: 'E' },
      { label: 'A calm night to recharge', letter: 'I' }
    ]
  },
  {
    key: 'sn',
    title: 'When planning, you trust...',
    options: [
      { label: 'Concrete details and facts', letter: 'S' },
      { label: 'Big-picture ideas and patterns', letter: 'N' }
    ]
  },
  {
    key: 'tf',
    title: 'In tough decisions, you lean on...',
    options: [
      { label: 'Logic and consistency', letter: 'T' },
      { label: 'Values and people impact', letter: 'F' }
    ]
  },
  {
    key: 'jp',
    title: 'Your work style is usually...',
    options: [
      { label: 'Structured and scheduled', letter: 'J' },
      { label: 'Flexible and spontaneous', letter: 'P' }
    ]
  }
]

function CreateProfilePersonalityPage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [answers, setAnswers] = useState({})

  const personality = useMemo(() => {
    const result = [answers.ei, answers.sn, answers.tf, answers.jp].join('')
    return result.length === 4 ? result : ''
  }, [answers])

  const selectAnswer = (questionKey, letter) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: letter }))
  }

  return (
    <div className="create-profile-page">
      <div className="create-profile-card">
        <div className="create-profile-badge">Step 9 of 10</div>
        <h1 className="create-profile-title">Quick personality test</h1>
        <p className="create-profile-subtitle">Answer 4 quick prompts to generate your personality badge.</p>

        {QUESTIONS.map((question) => (
          <div key={question.key} style={{ marginBottom: '14px' }}>
            <p className="create-profile-help" style={{ marginBottom: '8px' }}>{question.title}</p>
            <div className="profile-chips-grid">
              {question.options.map((option) => (
                <button
                  key={option.letter}
                  className={`profile-chip${answers[question.key] === option.letter ? ' selected' : ''}`}
                  onClick={() => selectAnswer(question.key, option.letter)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <p className="create-profile-help">
          Current result: <strong>{personality || profile.personality}</strong>
        </p>

        <button
          className="create-profile-next-btn"
          onClick={() => {
            if (!personality) return
            updateProfile({ personality })
            navigate('/create-profile/meetup-types')
          }}
          disabled={!personality}
          style={{ opacity: personality ? 1 : 0.45, cursor: personality ? 'pointer' : 'default' }}
        >
          Next
        </button>

        <button className="create-profile-link-btn" onClick={() => navigate('/create-profile/friend-preference')}>
          Back
        </button>
      </div>
    </div>
  )
}

export default CreateProfilePersonalityPage
