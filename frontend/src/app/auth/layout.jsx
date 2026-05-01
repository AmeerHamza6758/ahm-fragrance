import AuthHeader from "@/Components/Header/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      <AuthHeader />
      {children}
    </div>
  );
}