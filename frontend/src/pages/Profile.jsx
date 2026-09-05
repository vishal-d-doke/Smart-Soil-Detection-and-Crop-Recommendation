import Card from '../components/Card';
import './Profile.css';

export default function Profile() {
  return (
    <div className="page profile-page">
      <section className="page-header">
        <p className="eyebrow">Profile</p>
        <h1>Farmer account</h1>
      </section>

      <div className="profile-grid">
        <Card title="Personal details" eyebrow="Account information">
          <dl className="profile-list">
            <div>
              <dt>Name</dt>
              <dd>Alex Morgan</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>alex@smartsoil.com</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>North Valley</dd>
            </div>
          </dl>
        </Card>

        <Card title="Preferences" eyebrow="Farming setup">
          <ul className="check-list">
            <li>Focus on soil moisture management</li>
            <li>Preferred crops: maize, wheat, soybean</li>
            <li>Alert frequency: weekly summary</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
