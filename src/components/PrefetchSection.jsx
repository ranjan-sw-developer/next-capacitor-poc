import ImageSection from "./ImageSection";

// Server Component (data fetched on server)
async function getDropdownData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/photos", {
    cache: "force-cache", // ✅ enables prefetching cache
  });

  const data = await res.json();

  // Attach placehold.co images instead of jsonplaceholder's broken ones
  return data.slice(0, 10).map((item, idx) => ({
    id: item.id,
    title: item.title,
    url: `https://placehold.co/600x400?text=Photo+${idx + 1}`,
    thumbnailUrl: `https://placehold.co/150x150?text=Thumb+${idx + 1}`,
  }));
}

export default async function PrefetchSection() {
  const users = await getDropdownData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 rounded-md">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="mr-3">🚀</span>
            Prefetch Demo Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demonstrating server-side data fetching with caching and asset
            prefetching for optimal performance.
          </p>
        </div>

        <ImageSection photos={users} />
      </div>
    </div>
  );
}
