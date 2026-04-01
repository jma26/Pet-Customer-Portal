import { Link } from 'react-router';
import SignOutButton from './SignOutButton';

export default function SideBar() {
  const Links = [
    'Home',
    'Pets',
    'Reservations',
    'Billing',
    'Documents',
    'Messages'
  ];

  const closeDrawer = () => {
    const drawerEl = document.querySelector('#my-drawer-2') as HTMLInputElement;
    if (drawerEl) drawerEl.checked = false;
  }

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
      <ul className="menu bg-base-200 min-h-full p-4 w-80 max-[520px]:w-64 md:w-48">
        {/* Sidebar content here */}
        {
          Links.map((link: string) => {
            return (
              <li key={link}>
                <Link to={link} onClick={closeDrawer}>{link}</Link>
              </li>
            );
          })
        }
        {/* Profile */}
        <li>
          <details>
            <summary>Profile</summary>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 l-0 m-0 w-full ml-0 p-0">
              <li>
                <Link to="/profile" onClick={closeDrawer}>View Profile</Link>
              </li>
              <li>
                <SignOutButton />
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  )
}