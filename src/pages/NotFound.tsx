import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";
import "@/styles/mindmake.css";

const NotFound = () => {
  const location = useLocation();

  // Log 404 for analytics/monitoring (remove console.error for production)
  // TODO: Replace with proper logging service in production
  if (process.env.NODE_ENV === 'development') {
    console.warn("404 Error: Route not found:", location.pathname);
  }

  return (
    <div className="mm-site mm-not-found">
      <SEO
        title="Page not found"
        description="This Mindmake page could not be found."
        canonical={location.pathname}
        noindex
      />
      <header className="mm-container"><MindmakeBrand /></header>
      <main className="mm-container">
        <p className="mm-error-code">404</p>
        <h1>There is nothing here.</h1>
        <p>The page may have moved. Start again or read one of the useful ideas.</p>
        <div>
          <Link className="mm-button" to="/">Go to the home page <ArrowRight aria-hidden="true" /></Link>
          <Link className="mm-text-link" to="/blog">See all ideas</Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
