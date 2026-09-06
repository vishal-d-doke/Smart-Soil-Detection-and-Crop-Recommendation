import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { getProfile } from '../api';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load profile details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active';

  return (
    <div className="page profile-page">
      <section className="page-header">
        <p className="eyebrow">Profile</p>
        <h1>Farmer account</h1>
      </section>

      {loading ? (
        <Loading message="Loading profile details..." />
      ) : error ? (
        <Card title="Account error">
          <p className="form-error">{error}</p>
        </Card>
      ) : (
        <div className="profile-grid">
          <Card title="Personal details" eyebrow="Account information">
            <dl className="profile-list">
              <div>
                <dt>Name</dt>
                <dd>{profile?.full_name || 'N/A'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile?.email || 'N/A'}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>{profile?.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{memberSince}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{profile?.is_active ? 'Active' : 'Suspended'}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Preferences" eyebrow="Farming setup">
            <ul className="check-list">
              <li>Smart soil diagnostic tracking enabled</li>
              <li>Dynamic crop recommendations and yield forecasting</li>
              <li>Real-time market price and weather integration</li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
