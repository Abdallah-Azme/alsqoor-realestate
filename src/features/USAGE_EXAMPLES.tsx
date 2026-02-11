// Example: How to use the new feature hooks in your pages

import { useBlogs, useBlog } from "@/features/blogs";
import { useProperties, useFeaturedProperties } from "@/features/properties";
import { useSettings } from "@/features/settings";
import { useLogin, useRegister } from "@/features/auth";
import { useDeals, useCreateDeal } from "@/features/deals";
import { usePartners } from "@/features/partners";
import { useHomeData } from "@/features/home";

// Example 1: Blogs Page (Client Component)
function BlogsPage() {
  const { data, isLoading, error } = useBlogs(1, 12);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading blogs</div>;

  const blogs = data?.data || [];

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
}

// Example 2: Single Blog Page
function BlogDetailPage({ params }: { params: { id: string } }) {
  const { data: blog, isLoading } = useBlog(params.id);

  if (isLoading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <article>
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.description }} />
    </article>
  );
}

// Example 3: Properties with Filters
function PropertiesPage() {
  const [filters, setFilters] = useState({ page: 1, type: "apartment" });
  const { data, isLoading } = useProperties(filters);

  return (
    <div>
      {/* Filter UI */}
      <button onClick={() => setFilters({ ...filters, type: "villa" })}>
        Show Villas
      </button>

      {/* Properties Grid */}
      {data?.data.map((property) => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}

// Example 4: Featured Properties (Server Component)
async function FeaturedPropertiesSection() {
  // For server components, you can still use the service directly
  const { propertiesService } = await import("@/features/properties");
  const response = await propertiesService.getFeatured();
  const properties = response?.data?.data || [];

  return (
    <div>
      {properties.map((property) => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}

// Example 5: Login Form with Mutation
function LoginForm() {
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await loginMutation.mutateAsync({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });

      // Success! User is logged in
      router.push("/dashboard");
    } catch (error) {
      // Handle error
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      {loginMutation.error && (
        <div className="error">{loginMutation.error.message}</div>
      )}
    </form>
  );
}

// Example 6: Create Deal with FormData
function CreateDealForm() {
  const createDealMutation = useCreateDeal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await createDealMutation.mutateAsync(formData);
      toast.success("Deal created successfully!");
    } catch (error) {
      toast.error("Failed to create deal");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="description" />
      <input name="price" type="number" />
      <input name="images" type="file" multiple />
      <button type="submit" disabled={createDealMutation.isPending}>
        {createDealMutation.isPending ? "Creating..." : "Create Deal"}
      </button>
    </form>
  );
}

// Example 7: Settings (Global)
function Navbar() {
  const { data: settings } = useSettings();

  return (
    <nav>
      <a href={`tel:${settings?.contactInfo?.sitePhone}`}>
        {settings?.contactInfo?.sitePhone}
      </a>
    </nav>
  );
}

// Example 8: Home Page Data
function HomePage() {
  const { data: homeData } = useHomeData();

  return (
    <div>
      <h1>Platform Rating: {homeData?.platformRating}</h1>
      {homeData?.contentSections?.map((section, index) => (
        <div key={index}>{section.title}</div>
      ))}
    </div>
  );
}
