// src/components/Settings.tsx


export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your account settings and set your preferences.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="mt-8 space-y-6">

        {/* Profile Settings Card */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              User Profile
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Update your personal and account information.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings Card */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Notifications
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage how you receive notifications from us.</p>
            </div>
             <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Manage Notifications
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}