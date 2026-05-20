'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080810',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{ position:'absolute', top:-200, left:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ margin:0, fontSize:40, fontFamily:'var(--font-serif)', fontWeight:400 }}>
            Life<span style={{ color:'#fbbf24' }}>OS</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:8 }}>
            Build systems. Fall in love with the process.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 32,
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.05)', borderRadius:10, padding:4, marginBottom:24 }}>
            {(['login','signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer',
                  background: mode===m ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: mode===m ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize:13, fontWeight:700, transition:'all 0.2s',
                  fontFamily:'var(--font-sans)',
                }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {mode === 'signup' && (
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={inputStyle} />
            )}
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"
              onKeyDown={e=>e.key==='Enter'&&handleSubmit()} style={inputStyle} />

            {error && <p style={{ color:'#f87171', fontSize:12, margin:0 }}>{error}</p>}
            {message && <p style={{ color:'#34d399', fontSize:12, margin:0 }}>{message}</p>}

            <button onClick={handleSubmit} disabled={loading}
              style={{
                padding:'13px', borderRadius:10, border:'none',
                background:'linear-gradient(135deg, #fbbf24, #fb923c)',
                color:'#000', fontWeight:800, fontSize:14, cursor:'pointer',
                opacity: loading ? 0.7 : 1, transition:'opacity 0.2s',
                fontFamily:'var(--font-sans)', marginTop:4,
              }}>
              {loading ? 'Loading...' : mode === 'login' ? 'Enter Your OS' : 'Start Your Journey'}
            </button>
          </div>

          <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, textAlign:'center', marginTop:20, marginBottom:0 }}>
            "Every action is a vote for who you're becoming."
          </p>
        </div>
      </div>
    </div>
  )
}
