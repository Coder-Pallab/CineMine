import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { axios, setToken, setUser } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser({ id: data.id || data._id, name: data.name, email: data.email, role: data.role });
                
                localStorage.setItem('user', JSON.stringify({ id: data.id || data._id, name: data.name, email: data.email, role: data.role }));
                toast.success('Login Successful');
                window.scrollTo(0, 0);
                if (data.role === 'admin') navigate('/admin');
                else if (data.role === 'cinemaHallOwner') navigate('/owner');
                else navigate('/');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

                .login-root {
                    min-height: 100vh;
                    display: flex;
                    background: #060608;
                    font-family: 'DM Sans', sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                /* Film-strip left panel */
                .login-film-panel {
                    display: none;
                    position: relative;
                    flex: 1;
                    overflow: hidden;
                }

                @media (min-width: 900px) {
                    .login-film-panel { display: block; }
                }

                .film-strip {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    animation: scrollFilm 22s linear infinite;
                }

                @keyframes scrollFilm {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }

                .film-frame {
                    width: 100%;
                    aspect-ratio: 3/4;
                    background: #111114;
                    position: relative;
                    flex-shrink: 0;
                    overflow: hidden;
                    border-bottom: 2px solid #1a1a1f;
                }

                .film-frame::before,
                .film-frame::after {
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 28px;
                    background: repeating-linear-gradient(
                        to bottom,
                        transparent 0px,
                        transparent 14px,
                        #060608 14px,
                        #060608 22px
                    );
                    z-index: 2;
                }

                .film-frame::before { left: 0; }
                .film-frame::after { right: 0; }

                .film-frame-inner {
                    margin: 0 28px;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    filter: sepia(0.2) brightness(0.6) contrast(1.1);
                    transition: filter 0.5s;
                }

                .film-frame:hover .film-frame-inner {
                    filter: sepia(0) brightness(0.8) contrast(1.1);
                }

                .film-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, rgba(6,6,8,0.7) 0%, transparent 30%, transparent 70%, rgba(6,6,8,0.7) 100%);
                    z-index: 3;
                    pointer-events: none;
                }

                .film-vignette {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, #060608 0%, transparent 25%, transparent 75%, #060608 100%);
                    z-index: 10;
                    pointer-events: none;
                }

                .film-label {
                    position: absolute;
                    top: 16px;
                    left: 36px;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 13px;
                    letter-spacing: 4px;
                    color: rgba(255,255,255,0.25);
                    z-index: 4;
                }

                /* Right form panel */
                .login-form-panel {
                    width: 100%;
                    max-width: 520px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 48px 40px;
                    position: relative;
                    z-index: 10;
                }

                @media (min-width: 900px) {
                    .login-form-panel {
                        padding: 64px 56px;
                    }
                }

                /* Subtle noise grain */
                .login-form-panel::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    opacity: 0.03;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
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

                .login-heading {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(48px, 8vw, 72px);
                    line-height: 0.9;
                    color: #fff;
                    margin: 0 0 8px;
                    letter-spacing: 2px;
                }

                .login-heading span {
                    color: #e50914;
                }

                .login-sub {
                    font-size: 14px;
                    color: rgba(255,255,255,0.38);
                    margin: 0 0 48px;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                }

                /* Input group */
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .field-wrap {
                    position: relative;
                }

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

                .field-input::placeholder {
                    color: rgba(255,255,255,0.15);
                }

                .field-input:focus {
                    border-color: rgba(229,9,20,0.5);
                    background: rgba(229,9,20,0.04);
                }

                .field-input:focus + .field-line {
                    transform: scaleX(1);
                }

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

                /* Submit button */
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

                /* Divider / footer */
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

                .register-link {
                    text-align: center;
                    font-size: 13px;
                    color: rgba(255,255,255,0.3);
                    font-weight: 300;
                }

                .register-link a {
                    color: #e50914;
                    text-decoration: none;
                    font-weight: 400;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                }

                .register-link a:hover {
                    border-color: #e50914;
                }

                /* Ambient dot grid */
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
                    bottom: -200px;
                    right: -100px;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

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
            `}</style>

            <div className="login-root">
                <div className="dot-grid" />
                <div className="red-glow" />

                {/* Film Strip Decoration Panel */}
                <div className="login-film-panel">
                    <div className="film-vignette" />
                    <div className="film-strip">
                        {[
                            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
                            'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
                            'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
                            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
                            'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
                            'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400',
                            // duplicate for seamless loop
                            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
                            'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
                            'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
                            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
                            'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
                            'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400',
                        ].map((src, i) => (
                            <div className="film-frame" key={i}>
                                <span className="film-label">{String(i % 6 + 1).padStart(2,'0')}</span>
                                <div className="film-frame-inner film-overlay" style={{ backgroundImage: `url(${src})` }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Panel */}
                <div className="login-form-panel">
                    <div className="brand-mark reveal reveal-1">
                        <div className="">
                            <img src="cinemine_favicon.png" alt="" className='w-10 h-10'/>
                        </div>
                        <span className="brand-name">CineMine</span>
                    </div>

                    <h1 className="login-heading reveal reveal-2">
                        Welcome<br /><span>Back.</span>
                    </h1>
                    <p className="login-sub reveal reveal-3">Sign in to continue your cinematic journey</p>

                    <form onSubmit={handleSubmit}>
                        <div className="field-group reveal reveal-4">
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
                            </div>
                        </div>

                        <div className="reveal reveal-5">
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <><div className="btn-spinner" /> Authenticating</>
                                ) : (
                                    <>Sign In</>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="divider-row reveal reveal-6">
                        <div className="divider-line" />
                        <span className="divider-text">or</span>
                        <div className="divider-line" />
                    </div>

                    <p className="register-link reveal reveal-6">
                        New here?{' '}
                        <Link onClick={() => window.scrollTo(0,0)} to="/register">Create an account</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;