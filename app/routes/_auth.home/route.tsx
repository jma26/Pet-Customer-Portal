import Placeholder from '~/assets/camera-placeholder.svg';

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      {/* Intro */}
      <div className="flex flex-col gap-8">
        <section className="card bg-base-100 card-md shadow-sm">
          <div className="card-body">
            <h2 className="card-title font-semibold text-lg">Welcome back, User</h2>
            <p>Here's what's happening with your pets today</p>
          </div>
        </section>
        {/* Quick Stats */}
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Quick Stats</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
            <div className="card bg-base-100 card-sm min-w-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title font-normal text-sm ">Pets</h3>
                <p className="text-lg font-medium self-center">3</p>
              </div>
            </div>
            <div className="card bg-base-100 card-sm min-w-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title font-normal text-sm">Appts</h3>
                <p className="text-lg font-medium self-center">2</p>
              </div>
            </div>
            <div className="card bg-base-100 card-sm min-w-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title font-normal text-sm">Msgs</h3>
                <p className="text-lg font-medium self-center">5</p>
              </div>
            </div>
          </div>
        </section>
        {/* Your Pets */}
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Your Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card card-side bg-base-100 card-sm p-4 shadow-sm">
              <div className="avatar w-24">
                <div className="avatar aspect-square rounded-full">
                  <img 
                    className="rounded-full" 
                    src={Placeholder} 
                    alt="Avatar" 
                  />
                </div>
              </div>
              <div className="card-body gap-1 w-full">
                <h3 className="card-title font-semibold text-normal">Earl Grey</h3>
                <div className="flex flex-col gap-1">
                  <p className="text-xs">Russian Blue Tabby</p>
                  <p className="text-xs">3 years</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}