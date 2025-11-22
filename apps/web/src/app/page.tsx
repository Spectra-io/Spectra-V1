export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            <span className="text-primary-500">Spectra</span> KYC Global
          </h1>
          <p className="text-xl text-gray-600">
            Universal identity verification for the Stellar ecosystem
          </p>
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
              ✨ Setting up your experience...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
