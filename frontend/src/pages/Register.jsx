import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { axios, setToken, setUser } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password, role });
            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser({ id: data.id || data._id, name: data.name, email: data.email, role: data.role });
                
                localStorage.setItem('user', JSON.stringify({ id: data.id || data._id, name: data.name, email: data.email, role: data.role }));
                toast.success('Registration Successful');
                window.scrollTo(0, 0);
                if (data.role === 'cinemaHallOwner') navigate('/owner');
                else navigate('/');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const strength = (() => {
        if (!password) return 0;
        let s = 0;
        if (password.length >= 8) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return s;
    })();

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', '#e50914', '#e5890a', '#6aab2e', '#2eb86a'][strength];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

                .reg-root {
                    min-height: 100vh;
                    display: flex;
                    background: #060608;
                    font-family: 'DM Sans', sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                .dot-grid {
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 32px 32px;
                    pointer-events: none;
                    z-index: 0;
                }

                .red-glow {
                    position: fixed;
                    top: -200px;
                    left: -100px;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Ticket tape right panel */
                .reg-tape-panel {
                    display: none;
                    position: relative;
                    flex: 1;
                    overflow: hidden;
                    order: 2;
                }

                @media (min-width: 900px) {
                    .reg-tape-panel { display: block; }
                }

                .tape-vignette {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to left, #060608 0%, transparent 25%, transparent 75%, #060608 100%);
                    z-index: 10;
                    pointer-events: none;
                }

                .tape-scroll {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 12px 0;
                    animation: scrollTape 28s linear infinite;
                }

                @keyframes scrollTape {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }

                .ticket-card {
                    margin: 0 20px;
                    background: #0e0e12;
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex-shrink: 0;
                    position: relative;
                    overflow: hidden;
                }

                .ticket-card::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: var(--accent, #e50914);
                }

                .ticket-poster {
                    width: 38px;
                    height: 54px;
                    border-radius: 3px;
                    object-fit: cover;
                    flex-shrink: 0;
                    background: #1a1a20;
                    filter: brightness(0.75);
                }

                .ticket-info {
                    flex: 1;
                    min-width: 0;
                }

                .ticket-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 15px;
                    letter-spacing: 1.5px;
                    color: rgba(255,255,255,0.8);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .ticket-meta {
                    font-size: 11px;
                    color: rgba(255,255,255,0.25);
                    margin-top: 3px;
                    letter-spacing: 0.5px;
                }

                .ticket-seat {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 20px;
                    letter-spacing: 2px;
                    color: var(--accent, #e50914);
                    flex-shrink: 0;
                }

                /* Form panel */
                .reg-form-panel {
                    width: 100%;
                    max-width: 520px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 48px 40px;
                    position: relative;
                    z-index: 10;
                    order: 1;
                }

                @media (min-width: 900px) {
                    .reg-form-panel { padding: 64px 56px; }
                }

                .brand-mark {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 64px;
                }

                .brand-icon {
                    width: 32px;
                    height: 32px;
                    background: #e50914;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    clip-path: polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%, 20% 50%);
                }

                .brand-name {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 22px;
                    letter-spacing: 4px;
                    color: #fff;
                }

                .reg-heading {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(48px, 8vw, 72px);
                    line-height: 0.9;
                    color: #fff;
                    margin: 0 0 8px;
                    letter-spacing: 2px;
                }

                .reg-heading span { color: #e50914; }

                .reg-sub {
                    font-size: 14px;
                    color: rgba(255,255,255,0.38);
                    margin: 0 0 48px;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .field-wrap { position: relative; }

                .field-label {
                    display: block;
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.35);
                    margin-bottom: 10px;
                }

                .field-input {
                    width: 100%;
                    padding: 16px 20px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 4px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 300;
                    outline: none;
                    box-sizing: border-box;
                    transition: border-color 0.2s, background 0.2s;
                    caret-color: #e50914;
                }

                .field-input::placeholder { color: rgba(255,255,255,0.15); }

                .field-input:focus {
                    border-color: rgba(229,9,20,0.5);
                    background: rgba(229,9,20,0.04);
                }

                .field-input:focus + .field-line { transform: scaleX(1); }

                .field-line {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 1px;
                    background: #e50914;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
                    border-radius: 0 0 4px 4px;
                }

                .pw-toggle {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: rgba(255,255,255,0.3);
                    transition: color 0.2s;
                    display: flex;
                }

                .pw-toggle:hover { color: rgba(255,255,255,0.7); }

                /* Password strength */
                .strength-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 10px;
                }

                .strength-bars {
                    display: flex;
                    gap: 4px;
                    flex: 1;
                }

                .strength-bar {
                    flex: 1;
                    height: 2px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 2px;
                    transition: background 0.3s;
                }

                .strength-label {
                    font-size: 11px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    font-weight: 500;
                    min-width: 40px;
                    text-align: right;
                    transition: color 0.3s;
                }

                /* Submit */
                .submit-btn {
                    width: 100%;
                    padding: 18px 24px;
                    background: #e50914;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 18px;
                    letter-spacing: 4px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .submit-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
                    pointer-events: none;
                }

                .submit-btn:hover:not(:disabled) { background: #c40812; }
                .submit-btn:active:not(:disabled) { background: #a20710; transform: scale(0.99); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .btn-spinner {
                    width: 18px; height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .divider-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin: 32px 0 24px;
                }

                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                }

                .divider-text {
                    font-size: 11px;
                    letter-spacing: 2px;
                    color: rgba(255,255,255,0.2);
                    text-transform: uppercase;
                }

                .login-link {
                    text-align: center;
                    font-size: 13px;
                    color: rgba(255,255,255,0.3);
                    font-weight: 300;
                }

                .login-link a {
                    color: #e50914;
                    text-decoration: none;
                    font-weight: 400;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                }

                .login-link a:hover { border-color: #e50914; }

                /* Staggered reveal */
                .reveal {
                    opacity: 0;
                    transform: translateY(16px);
                    animation: revealUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
                }
                .reveal-1 { animation-delay: 0.05s; }
                .reveal-2 { animation-delay: 0.12s; }
                .reveal-3 { animation-delay: 0.19s; }
                .reveal-4 { animation-delay: 0.26s; }
                .reveal-5 { animation-delay: 0.33s; }
                .reveal-6 { animation-delay: 0.40s; }

                @keyframes revealUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Terms note */
                .terms-note {
                    font-size: 11px;
                    color: rgba(255,255,255,0.2);
                    text-align: center;
                    margin-top: 16px;
                    line-height: 1.6;
                    font-weight: 300;
                }

                .terms-note a {
                    color: rgba(255,255,255,0.35);
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
            `}</style>

            <div className="reg-root">
                <div className="dot-grid" />
                <div className="red-glow" />

                {/* Form Panel (left) */}
                <div className="reg-form-panel">
                    <div className="brand-mark reveal reveal-1">
                        <div className="">
                            <img src="cinemine_favicon.png" alt="" className='w-10 h-10'/>
                        </div>
                        <span className="brand-name">CineMine</span>
                    </div>

                    <h1 className="reg-heading reveal reveal-2">
                        Join<br /><span>Us.</span>
                    </h1>
                    <p className="reg-sub reveal reveal-3">Create your account and start booking today</p>

                    <form onSubmit={handleSubmit}>
                        <div className="field-group reveal reveal-4">
                            <div className="field-wrap">
                                <label className="field-label" htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="field-input"
                                    placeholder="John Doe"
                                />
                                <div className="field-line" />
                            </div>

                            <div className="field-wrap">
                                <label className="field-label" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="field-input"
                                    placeholder="you@example.com"
                                />
                                <div className="field-line" />
                            </div>

                            <div className="field-wrap">
                                <label className="field-label" htmlFor="role">Account Type</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="field-input"
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="user" className='text-black'>User</option>
                                    <option value="cinemaHallOwner" className='text-black'>Cinema Hall</option>
                                </select>
                                <div className="field-line" />
                            </div>

                            <div className="field-wrap">
                                <label className="field-label" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="field-input"
                                    style={{ paddingRight: '48px' }}
                                    placeholder="••••••••"
                                />
                                <div className="field-line" />
                                <button
                                    type="button"
                                    className="pw-toggle"
                                    onClick={() => setShowPassword(s => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>

                                {/* Password strength meter */}
                                {password.length > 0 && (
                                    <div className="strength-row">
                                        <div className="strength-bars">
                                            {[1,2,3,4].map(i => (
                                                <div
                                                    key={i}
                                                    className="strength-bar"
                                                    style={{ background: i <= strength ? strengthColor : undefined }}
                                                />
                                            ))}
                                        </div>
                                        <span className="strength-label" style={{ color: strengthColor }}>
                                            {strengthLabel}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="reveal reveal-5">
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <><div className="btn-spinner" /> Creating Account</>
                                ) : (
                                    <>Create Account</>
                                )}
                            </button>
                            <p className="terms-note">
                                By creating an account you agree to our{' '}
                                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                            </p>
                        </div>
                    </form>

                    <div className="divider-row reveal reveal-6">
                        <div className="divider-line" />
                        <span className="divider-text">or</span>
                        <div className="divider-line" />
                    </div>

                    <p className="login-link reveal reveal-6">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>

                {/* Ticket Tape Right Panel */}
                <div className="reg-tape-panel">
                    <div className="tape-vignette" />
                    <div className="tape-scroll">
                        {[
                            { title: 'DUNE: PART TWO', meta: 'Today · 7:30 PM · Hall A', seat: 'D4', accent: '#e50914' },
                            { title: 'OPPENHEIMER', meta: 'Today · 9:00 PM · Hall B', seat: 'F7', accent: '#e5890a' },
                            { title: 'THE BATMAN', meta: 'Tomorrow · 6:00 PM · Hall C', seat: 'B2', accent: '#5a9ae5' },
                            { title: 'POOR THINGS', meta: 'Tomorrow · 8:15 PM · Hall A', seat: 'G9', accent: '#2eb86a' },
                            { title: 'KILLERS OF THE FLOWER MOON', meta: 'Sat · 5:00 PM · Hall D', seat: 'A1', accent: '#e5890a' },
                            { title: 'PAST LIVES', meta: 'Sat · 7:45 PM · Hall B', seat: 'C5', accent: '#e50914' },
                            { title: 'MAY DECEMBER', meta: 'Sun · 4:30 PM · Hall C', seat: 'H3', accent: '#b45ae5' },
                            { title: 'SALTBURN', meta: 'Sun · 9:30 PM · Hall A', seat: 'E6', accent: '#2eb86a' },
                            // duplicate for seamless loop
                            { title: 'DUNE: PART TWO', meta: 'Today · 7:30 PM · Hall A', seat: 'D4', accent: '#e50914' },
                            { title: 'OPPENHEIMER', meta: 'Today · 9:00 PM · Hall B', seat: 'F7', accent: '#e5890a' },
                            { title: 'THE BATMAN', meta: 'Tomorrow · 6:00 PM · Hall C', seat: 'B2', accent: '#5a9ae5' },
                            { title: 'POOR THINGS', meta: 'Tomorrow · 8:15 PM · Hall A', seat: 'G9', accent: '#2eb86a' },
                            { title: 'KILLERS OF THE FLOWER MOON', meta: 'Sat · 5:00 PM · Hall D', seat: 'A1', accent: '#e5890a' },
                            { title: 'PAST LIVES', meta: 'Sat · 7:45 PM · Hall B', seat: 'C5', accent: '#e50914' },
                            { title: 'MAY DECEMBER', meta: 'Sun · 4:30 PM · Hall C', seat: 'H3', accent: '#b45ae5' },
                            { title: 'SALTBURN', meta: 'Sun · 9:30 PM · Hall A', seat: 'E6', accent: '#2eb86a' },
                        ].map((t, i) => (
                            <div className="ticket-card" key={i} style={{ '--accent': t.accent }}>
                                <div className="ticket-poster" style={{
                                    background: `linear-gradient(135deg, ${t.accent}22, #1a1a20)`,
                                }} />
                                <div className="ticket-info">
                                    <div className="ticket-title">{t.title}</div>
                                    <div className="ticket-meta">{t.meta}</div>
                                </div>
                                <div className="ticket-seat">{t.seat}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;