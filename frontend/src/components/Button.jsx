import { Link } from 'react-router-dom';

export default function Button({ children, to, variant = 'primary', type = 'button', onClick, className = '', ...props }) {
  const classes = `button button-${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
