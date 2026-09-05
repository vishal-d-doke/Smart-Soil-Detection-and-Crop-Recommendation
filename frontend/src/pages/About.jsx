import Card from '../components/Card';
import './About.css';

const values = [
  {
    title: 'Field-first insights',
    text: 'We turn soil testing and crop history into practical guidance that fits real-world farming.',
  },
  {
    title: 'Simple decision support',
    text: 'Our recommendations cut through complexity and make daily crop planning easier for growers.',
  },
  {
    title: 'Sustainable growth',
    text: 'We aim to help farmers improve yields while supporting better soil care and resource use.',
  },
];

export default function About() {
  return (
    <div className="page content-page">
      <section className="page-header">
        <p className="eyebrow">About the platform</p>
        <h1>Built for modern agriculture decisions</h1>
      </section>

      <div className="content-grid two-column">
        <div className="text-panel">
          <p>
            Smart Soil Detection and Crop Recommendation is designed to fuse soil diagnostics with
            crop suitability analysis. It gives farmers, agronomists, and extension teams a clearer
            picture of which crops fit a field best based on the current environment and growing conditions.
          </p>
          <p>
            By combining soil inputs, environmental indicators, and crop performance patterns, the
            system helps users choose more viable crops and support healthier, more productive fields.
          </p>
        </div>

        <div className="info-stack">
          <div className="info-box highlight-box">
            <strong>Mission</strong>
            <span>Improve crop planning through accessible data and smarter soil understanding.</span>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        {values.map((item) => (
          <Card key={item.title} title={item.title}>
            <p>{item.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
