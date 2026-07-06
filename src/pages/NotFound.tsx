import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow text-center">
          <h1 className="font-display text-8xl font-light text-muted-foreground/30">404</h1>
          <h2 className="mt-4 font-display text-3xl font-light">Page Not Found</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
