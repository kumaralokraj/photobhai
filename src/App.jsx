
import Navbar from "./components/Navbar.jsx";
import ImageResizer from "./components/ImageResizer.jsx";
import Footer from "./components/Footer.jsx";

// Website features
const features = [
  {
    title: "Fast resizing",
    description: "Choose precise width and height in pixels.",
  },
  {
    title: "Smart compression",
    description: "Adjust quality or aim for a target file size.",
  },
  {
    title: "Private by design",
    description: "All image processing happens in your browser.",
  },
];

export default function App() {
  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-20">

        {/* Hero Section */}
        <div className="mb-10 text-center">

          {/* Badge */}
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            100% free · No uploads to servers
          </span>

          {/* Main Heading */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Resize images{" "}
            <span className="text-blue-400">
              in seconds.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Resize, compress and convert JPG, PNG and WebP
            images without installing anything.
            Your photos stay on your device.
          </p>

        </div>

        {/* Image Resizer Component */}
        <ImageResizer />

        {/* Features Section */}
        <section className="mt-14 grid gap-4 md:grid-cols-3">

          {features.map((feature) => (
            <article
              key={feature.title}
              className="panel p-6"
            >
              <h2 className="font-bold">
                {feature.title}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}

        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
