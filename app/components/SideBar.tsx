import CompanyLogo from '~/assets/paws-and-plays-logo.png';

export default function SideBar() {
  return (
    <div className="drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col shadow-sm">
        {/* Navbar */}
        <div className="navbar p-4 w-full">
          <div className="mr-auto">
            <a className="flex gap-4" href="" tabIndex={0}>
              <img className="max-w-48" src={CompanyLogo} alt="Paws & Play" />
            </a>
          </div>
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
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
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <li><a>Dashboard</a></li>
              <li><a>Pets</a></li>
              <li><a>Reservations</a></li>
              <li><a>Billing</a></li>
              <li><a>Documents</a></li>
              <li><a>Messages</a></li>
              <li><a>Profile</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li><a>Dashboard</a></li>
          <li><a>Pets</a></li>
          <li><a>Reservations</a></li>
          <li><a>Billing</a></li>
          <li><a>Documents</a></li>
          <li><a>Messages</a></li>
          <li><a>Profile</a></li>
        </ul>
      </div>
    </div>
  )
}