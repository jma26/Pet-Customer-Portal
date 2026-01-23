import { redirect, type ActionFunctionArgs } from 'react-router';
import CompanyLogo from '~/assets/paws-and-plays-logo.png';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase, headers } = await createSupabaseServerClient(request);

  console.log('These are the values', { email, password });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  console.log('Supabase signUp response', { data, error });

  if (error) {
    console.log('Something went wrong...', error);
  }

  return redirect('/dashboard', { headers });
}

export default function Register() {
  return (
    <main>
      <section className="bg-base-100 flex mx-auto max-w-md min-h-screen place-items-center px-4 w-full">
        <div className="card card-border p-4 shadow-lg">
          <figure>
            <img
              src={CompanyLogo}
              alt="Paws & Play logo" />
          </figure>
          <div className="card-body gap-4">
            <h1 className="card-title self-center text-center text-2xl">Customer Portal</h1>
            <form className="flex flex-col gap-4" method="post">
              {/* Email input */}
              <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input type="email" placeholder="Enter your email" name="email" required />
              </label>
              {/* Password input */}
              <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  </g>
                </svg>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  minLength={8}
                  name="password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                />
              </label>
              <div className="card-actions gap-4 mt-2 place-items-center">
                <button className="btn btn-primary w-full">Register</button>
                <div className="flex place-items-center w-full">
                  <hr className="flex-3 border-[var(--color-base-300)] border-1" />
                  <p className="grow-1 font-bold color-neutral text-center">or</p>
                  <hr className="flex-3 border-[var(--color-base-300)] border-1" />
                </div>
                <button className="btn bg-black text-white border-black w-full">
                  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#000000"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                  Login with Google
                </button>
              </div>
            </form>
          </div>
          <div>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-bold">
                Login here
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}