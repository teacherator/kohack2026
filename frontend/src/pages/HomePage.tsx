export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-start pt-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Hello World - Home Page</h1>
      <p className="text-lg max-w-xl text-center">
        Welcome to your site! This is the main landing page. You can add sections, images, or links below to make it look more like a real website.
      </p>
      <div className="mt-10 w-full max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Featured Content</h2>
          <p className="text-gray-700">
            Here you can put any content you want — text, images, cards, etc.
          </p>
        </div>
      </div>
    </div>
  );
}