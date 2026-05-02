import AuthHeader from "@/Components/Header/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8f0ed] via-[#f4e8e4] to-[#ede3de]">
      <AuthHeader />
      {children}
    </div>
  );
}