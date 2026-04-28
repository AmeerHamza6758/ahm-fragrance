import PageSection from "../components/PageSection";

function CustomersPage() {
  return (
    <PageSection
      title="Customers"
      description="Auth routes currently support sign-in/sign-up/OTP flow. Add a user-list endpoint in backend to fully power this page."
      endpoint="POST /api/auth/signUp | POST /api/auth/signIn | POST /api/auth/otp | POST /api/auth/reset-password"
    />
  );
}

export default CustomersPage;
