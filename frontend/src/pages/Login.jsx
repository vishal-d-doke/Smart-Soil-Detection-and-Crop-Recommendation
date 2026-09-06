import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { loginUser, requestOtp, setAuthToken, verifyOtp } from '../api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState('email');
  const [form, setForm] = useState({ email: '', password: '' });
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    setLoading(true);

    try {
      const response = authMethod === 'mobile'
        ? await verifyOtp(`${countryCode}${mobile.replace(/\D/g, '')}`, otp)
        : await loginUser(form);
      setAuthToken(response.access_token);
      navigate('/app');
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!mobile.trim()) {
      setError('Enter your mobile number first.');
      return;
    }

    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await requestOtp(`${countryCode}${mobile.replace(/\D/g, '')}`);
      setOtpRequested(true);
      if (res?.otp) {
        setInfo(`Test code generated: ${res.otp}`);
        setOtp(res.otp);
      } else {
        setInfo('OTP has been sent to your mobile phone.');
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to request OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Login to your account</h1>

        <div className="auth-methods" role="tablist" aria-label="Login method">
          <button
            type="button"
            className={authMethod === 'email' ? 'active' : ''}
            onClick={() => { setAuthMethod('email'); setOtpRequested(false); setError(''); }}
            role="tab"
            aria-selected={authMethod === 'email'}
          >
            Email
          </button>
          <button
            type="button"
            className={authMethod === 'mobile' ? 'active' : ''}
            onClick={() => { setAuthMethod('mobile'); setOtpRequested(false); setError(''); }}
            role="tab"
            aria-selected={authMethod === 'mobile'}
          >
            Mobile number (OTP)
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {authMethod === 'email' ? (
            <>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
              </label>
            </>
          ) : (
            <>
              <label>
                Mobile number
                <span className="phone-input-group">
                  <select aria-label="Country code" value={countryCode} onChange={(event) => { setCountryCode(event.target.value); setOtpRequested(false); }}>
                    <option value="+91">IN +91</option>
                    <option value="+1">US +1</option>
                    <option value="+44">GB +44</option>
                    <option value="+61">AU +61</option>
                    <option value="+971">AE +971</option>
                  </select>
                  <input type="tel" inputMode="tel" placeholder="98765 43210" value={mobile} onChange={(event) => { setMobile(event.target.value); setOtpRequested(false); }} required />
                </span>
              </label>
              <Button type="button" variant="secondary" onClick={handleRequestOtp} disabled={loading || otpRequested}>
                {otpRequested ? 'OTP requested' : loading ? 'Requesting OTP...' : 'Request OTP'}
              </Button>
              <label>
                OTP
                <input type="text" inputMode="numeric" placeholder="Enter 6-digit OTP" value={otp} onChange={(event) => setOtp(event.target.value)} maxLength="6" required />
              </label>
            </>
          )}

          {info && <p style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.875rem', margin: '0.5rem 0' }}>{info}</p>}
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : authMethod === 'email' ? 'Sign in' : 'Verify OTP'}</Button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
