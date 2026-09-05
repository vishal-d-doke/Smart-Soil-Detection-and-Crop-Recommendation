import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { registerUser, setAuthToken, loginUser } from '../api';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [countryCode, setCountryCode] = useState('+91');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser({ ...form, phone: `${countryCode}${form.phone.replace(/\D/g, '')}` });
      const loginResponse = await loginUser({ email: form.email, password: form.password });
      setAuthToken(loginResponse.access_token);
      navigate('/app');
    } catch (submitError) {
      setError(submitError.message || 'Unable to create account right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Join Smart Soil</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" name="fullName" placeholder="Your name" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Mobile number
            <span className="phone-input-group">
              <select aria-label="Country code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
                <option value="+91">IN +91</option>
                <option value="+1">US +1</option>
                <option value="+44">GB +44</option>
                <option value="+61">AU +61</option>
                <option value="+971">AE +971</option>
              </select>
              <input type="tel" name="phone" inputMode="tel" placeholder="98765 43210" value={form.phone} onChange={handleChange} required />
            </span>
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required minLength="6" />
          </label>

          {error && <p className="form-error">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
