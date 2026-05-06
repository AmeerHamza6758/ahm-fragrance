"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetProfile, useUpdatePassword, useUpdateProfile } from "@/lib/api/hooks/useAuth";
import { getStoredCheckoutProfile, persistAuthSession } from "@/lib/store/userProfileStore";
import { successToaster, errorToaster } from "@/utils/alert-service";
import { Calendar, Eye, EyeOff, Loader2, MapPin, Phone, Shield, User } from "lucide-react";
import Loader from "@/Components/Loader/Loader";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const profile = getStoredCheckoutProfile();
    if (!profile.id) {
      router.push("/auth/login");
    } else {
      setUserId(profile.id);
    }
  }, [router]);

  const { data: profileResponse, isLoading } = useGetProfile(userId);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();

  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      setFormData({
        userName: user.userName || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          province: user.address?.province || "",
          postalCode: user.address?.postalCode || "",
        },
      });
    }
  }, [profileResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: (res) => {
        successToaster("Profile updated successfully!");
        // Update local storage too
        persistAuthSession({ user: res.data });
      },
      onError: (err) => {
        errorToaster(err?.response?.data?.message || "Failed to update profile");
      },
    });
  };

  if (isLoading || !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader />
        <p className="text-[#a08a8a] font-medium animate-pulse">Gathering your botanical essence...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf9] min-h-screen">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
                <div className="lg:col-span-3">
                <div className="bg-white rounded-[32px] shadow-sm p-6 sm:p-10 border border-[#f2eae6]">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#f2eae6]">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#7e525c] font-noto mb-2">My Profile</h1>
                        <p className="text-[#a08a8a] text-sm">Manage your personal details and delivery preferences</p>
                    </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-[#f8f4f1] rounded-lg flex items-center justify-center">
                            <User size={18} color="#7e525c" />
                        </div>
                        <h3 className="text-lg font-bold text-[#4E4543] font-noto">Basic Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Full Name</label>
                            <input
                            type="text"
                            name="userName"
                            placeholder="Your display name"
                            value={formData.userName}
                            onChange={handleChange}
                            className="px-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Phone Number</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cdb8b0]" />
                                <input
                                type="text"
                                name="phone"
                                placeholder="+92 300 0000000"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Gender</label>
                            <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="px-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300 appearance-none cursor-pointer"
                            >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Date of Birth</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cdb8b0]" />
                                <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-[#f8f4f1] rounded-lg flex items-center justify-center">
                            <MapPin size={18} color="#7e525c" />
                        </div>
                        <h3 className="text-lg font-bold text-[#4E4543] font-noto">Delivery Address</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Street Address</label>
                            <input
                            type="text"
                            name="address.street"
                            placeholder="House #, Street name, Area"
                            value={formData.address.street}
                            onChange={handleChange}
                            className="px-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">City</label>
                            <input
                            type="text"
                            name="address.city"
                            placeholder="e.g. Lahore"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="px-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Province</label>
                            <input
                            type="text"
                            name="address.province"
                            placeholder="e.g. Punjab"
                            value={formData.address.province}
                            onChange={handleChange}
                            className="px-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-[#7e525c]/70 ml-1 tracking-wider">Postal Code</label>
                            <input
                            type="text"
                            name="address.postalCode"
                            placeholder="e.g. 54000"
                            value={formData.address.postalCode}
                            onChange={handleChange}
                            className="px-5 py-3.5 rounded-2xl border border-[#f2eae6] bg-[#fdfbf9] focus:border-[#7e525c] focus:bg-white focus:ring-4 focus:ring-[#7e525c]/5 outline-none transition-all duration-300"
                            />
                        </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-[#f2eae6]">
                        <button
                        type="submit"
                        disabled={isUpdating}
                        className="group relative px-12 py-4 bg-[#7e525c] text-white rounded-full text-[16px] font-bold tracking-widest hover:bg-[#6b4350] transition-all duration-300 disabled:opacity-60 shadow-xl shadow-[#7e525c]/25 active:scale-95 flex items-center gap-2"
                        >
                        {isUpdating ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Updating Profile...</span>
                            </>
                        ) : (
                            <span>Save Changes</span>
                        )}
                        </button>
                    </div>
                    </form>
                </div>
                </div>
        </main>
    </div>
  );
}
