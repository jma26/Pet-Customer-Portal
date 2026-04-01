import { Link } from 'react-router';
import CompanyLogo from '~/assets/paws-and-plays-logo.png';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 shadow-sm">
      <div className="flex-none md:hidden">
        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-7 w-7 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <Link to="/" className="mx-auto md:ml-0" tabIndex={0}>
        <img className="max-w-48" src={CompanyLogo} alt="Paws & Play" />
      </Link>
    </header>
  )
}