import { useState } from 'react'
import useStore from '../../store/useStore'

export default function PinPad({ mode = 'verify', onSuccess, onCancel }) {
  const [input, setInput] = useState('')
  const [confirm, setConfirm] = useState('')
  const [step, setStep] = useState('enter') // 'enter' | 'confirm'
  const [error, setError] = useState('')
  const { pin, setPin, verifyPin } = useStore()

  const isSetup = mode === 'setup' || !pin

  const handleDigit = (d) => {
    if (input.length >= 4) return
    setInput((p) => p + d)
  }

  const handleDelete = () => setInput((p) => p.slice(0, -1))

  const handleSubmit = () => {
    if (input.length < 4) return
    if (isSetup) {
      if (step === 'enter') {
        setConfirm(input)
        setInput('')
        setStep('confirm')
        setError('')
      } else {
        if (input === confirm) {
          setPin(input)
          onSuccess()
        } else {
          setError('PIN码不一致，请重试')
          setInput('')
          setStep('enter')
          setConfirm('')
        }
      }
    } else {
      if (verifyPin(input)) {
        onSuccess()
      } else {
        setError('PIN码错误')
        setInput('')
      }
    }
  }

  const dots = Array(4).fill(0)

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          {isSetup ? (step === 'enter' ? '设置PIN码' : '确认PIN码') : '输入PIN码'}
        </h2>
        <p className="text-center text-gray-500 mb-8 text-lg">
          {isSetup
            ? step === 'enter'
              ? '请设置4位家长PIN码'
              : '再次输入PIN码确认'
            : '请输入家长PIN码'}
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {dots.map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                i < input.length ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1,2,3,4,5,6,7,8,9].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(String(d))}
              className="bg-indigo-100 text-indigo-800 text-2xl font-bold py-5 rounded-2xl active:bg-indigo-200 transition-colors"
            >
              {d}
            </button>
          ))}
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-500 text-lg font-semibold py-5 rounded-2xl active:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="bg-indigo-100 text-indigo-800 text-2xl font-bold py-5 rounded-2xl active:bg-indigo-200"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="bg-gray-100 text-gray-600 text-2xl py-5 rounded-2xl active:bg-gray-200"
          >
            ⌫
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={input.length < 4}
          className="w-full bg-indigo-600 text-white text-xl font-bold py-4 rounded-2xl disabled:opacity-40 active:bg-indigo-700 transition-colors"
        >
          {isSetup && step === 'enter' ? '下一步' : '确认'}
        </button>
      </div>
    </div>
  )
}
