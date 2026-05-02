"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/lib/api/hooks/useAuth";
import Image from "next/image";
import { saveCheckoutProfile } from "@/lib/store/userProfileStore";
import { errorToaster } from "@/utils/alert-service";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
    province: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validate = (name, value, currentForm = form) => {
    let error = "";
    switch (name) {
      case "userName":
        if (!value) error = "Full name is required";
        break;
      case "email":
        if (!value) {
          error = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else if (!/^\d{10,11}$/.test(value)) {
          error = "Please enter a valid 10-11 digit phone number";
        }
        break;
      case "address":
        if (!value) error = "Address is required";
        break;
      case "city":
        if (!value) error = "City is required";
        break;
      case "postal":
        if (!value) error = "Postal code is required";
        break;
      case "province":
        if (!value) error = "Please select a province";
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== currentForm.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value, nextForm) }));
    }
    // Cross-validate confirmPassword when password changes
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validate("confirmPassword", nextForm.confirmPassword, nextForm),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validate(key, form[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      );
      errorToaster("Please fix the errors in the form before submitting");
      return;
    }

    saveCheckoutProfile({
      name: form.userName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postal: form.postal,
      province: form.province,
    });

    signUp(
      {
        userName: form.userName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postal,
        },
      },
      {
        onSuccess: () => {
          router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
        },
        onError: (err) => {
          errorToaster(
            err?.response?.data?.message ||
              err?.message ||
              "Signup failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <main className="min-h-screen flex items-start justify-center bg-[#f5ede8] px-4 pt-6 pb-10 sm:pt-10 sm:pb-16">
      <div
        className="flex w-full max-w-6xl rounded-[48px] overflow-hidden"
        style={{ boxShadow: "0 8px 48px 0 rgba(80,30,40,0.13)" }}
      >
        {/* Left: Full-bleed image with overlay quote */}
        <div className="relative hidden md:block md:w-[42%] lg:w-[40%] shrink-0">
          <Image
            src="/Images/signup.png"
            alt="Perfume"
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(50,18,22,0.82)] via-[rgba(80,30,40,0.25)] to-transparent" />
          {/* Quote at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-8">
            <p  
              className="text-white font-noto text-2xl sm:text-[32px] leading-snug mb-2"
            >
              &ldquo;The scent of a memory, captured in a bottle.&rdquo;
            </p>
            <span
              className="text-[#e8c9c0] text-xs tracking-[0.18em] uppercase font-sans"
              style={{ letterSpacing: "0.18em" }}
            >
              COLLECTION AHM
            </span>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-[58%] lg:w-[60%] bg-white flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
          <h1
            className=" text-3xl sm:text-[48px] text-[#6b3a44] font-normal mb-1 leading-tight"
          >
            Begin Your Journey
          </h1>
          <p className="text-[13.5px] text-[#b09090] mb-7 font-sans leading-relaxed">
            Join our inner circle for exclusive access to seasonal harvests and
            rare botanical blends.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="userName"
                className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Full Name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="name"
                
                placeholder="Julianne Moore"
                value={form.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
              />
              {touched.userName && errors.userName && (
                <span className="text-xs text-red-500 mt-1 ml-1">{errors.userName}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                
                placeholder="j.moore@botanique.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
              />
              {touched.email && errors.email && (
                <span className="text-xs text-red-500 mt-1 ml-1">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="phone"
                className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                
                placeholder="03001234567"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
              />
              {touched.phone && errors.phone && (
                <span className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="address"
                className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                
                placeholder="House 24, Street 8, DHA"
                value={form.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
              />
              {touched.address && errors.address && (
                <span className="text-xs text-red-500 mt-1 ml-1">{errors.address}</span>
              )}
            </div>

            {/* City + Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.25">
                <label
                  htmlFor="city"
                  className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  
                  placeholder="Lahore"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
                />
                {touched.city && errors.city && (
                  <span className="text-xs text-red-500 mt-1 ml-1">{errors.city}</span>
                )}
              </div>
              <div className="flex flex-col gap-1.25">
                <label
                  htmlFor="postal"
                  className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
                >
                  Postal Code
                </label>
                <input
                  id="postal"
                  name="postal"
                  type="text"
                  autoComplete="postal-code"
                  
                  placeholder="54000"
                  value={form.postal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
                />
                {touched.postal && errors.postal && (
                  <span className="text-xs text-red-500 mt-1 ml-1">{errors.postal}</span>
                )}
              </div>
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="province"
                className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Province
              </label>
              <select
                id="province"
                name="province"
                value={form.province}
                onChange={handleChange}
                onBlur={handleBlur}
                
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition"
              >
                <option value="" disabled>
                  Select Province
                </option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Islamabad Capital Territory">
                  Islamabad Capital Territory
                </option>
                <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                <option value="Azad Jammu & Kashmir">
                  Azad Jammu & Kashmir
                </option>
              </select>
              {touched.province && errors.province && (
                <span className="text-xs text-red-500 mt-1 ml-1">{errors.province}</span>
              )}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.25">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cdb8b0] hover:text-[#7e525c] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <span className="text-xs text-red-500 mt-1 ml-1">{errors.password}</span>
                )}
              </div>
              <div className="flex flex-col gap-1.25">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cdb8b0] hover:text-[#7e525c] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <span className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-1 py-3 rounded-full text-[15px] font-semibold tracking-wide font-sans text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(90deg, #7e525c 0%, #9b6370 100%)",
              }}
            >
              {isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-[13.5px] text-[#b09090] font-sans">
            Already part of the garden?{" "}
            <Link
              href="/auth/login"
              className="text-[#7e525c] font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
