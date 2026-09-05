export default function Card({ title, eyebrow, children, actions }) {
  return (
    <article className="info-card">
      {eyebrow ? <p className="card-eyebrow">{eyebrow}</p> : null}
      {title ? <h3>{title}</h3> : null}
      <div className="card-body">{children}</div>
      {actions ? <div className="card-actions">{actions}</div> : null}
    </article>
  );
}
