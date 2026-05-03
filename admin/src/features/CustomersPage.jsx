import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { useGetUsers, useDeleteUser } from "../services/hooks/users";
import { useGetContacts, useDeleteContact } from "../services/hooks/contacts";
import { successToaster, errorToaster, confirmationPopup } from "../utils/alert-service";

function CustomersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  
  const { data: usersRes, isLoading, isError } = useGetUsers(currentPage, entriesPerPage);
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const { data: contactsRes, isLoading: contactsLoading } = useGetContacts();
  const deleteContactMutation = useDeleteContact();

  const users = usersRes?.data?.data || [];
  const totalEntries = usersRes?.data?.pagination?.totalItems || 0;
  const totalPages = usersRes?.data?.pagination?.totalPages || 1;

  const contacts = contactsRes?.data?.data || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (id) => {
    navigate(`/customers/view/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this customer? This action cannot be undone.");
    if (result.isConfirmed) {
      deleteUser(id, {
        onSuccess: () => {
          successToaster("Customer deleted successfully");
        },
        onError: (error) => {
          errorToaster(error.response?.data?.message || "Failed to delete customer");
        }
      });
    }
  };

  const handleDeleteContact = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this contact message?");
    if (result.isConfirmed) {
      deleteContactMutation.mutate(id);
    }
  };

  return (
    <div className="customers-page-container">
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Customer Directory</h1>
          <p className="catalog-subtitle">
            Manage your registered botanical enthusiasts and their preferences.
          </p>
        </div>
      </div>

      {/* Contact Inquiries Section */}
      <div className="section-wrapper" style={{ marginBottom: "3rem" }}>
        <div className="catalog-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h2 className="catalog-title" style={{ fontSize: "1.25rem" }}>Contact Inquiries</h2>
            <p className="catalog-subtitle">Messages from your visitors and customers.</p>
          </div>
        </div>
        
        <div className="catalog-table">
          <div className="catalog-table-header" style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr 3fr 1fr 0.5fr" }}>
            <span>Name</span>
            <span>Email</span>
            <span>Subject</span>
            <span>Message</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          {contactsLoading ? (
            <Loader text="Loading inquiries..." />
          ) : contacts.length === 0 ? (
            <div className="empty-state">No new inquiries.</div>
          ) : (
            contacts.map((contact) => (
              <div className="catalog-row" key={contact._id} style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr 3fr 1fr 0.5fr" }}>
                <span style={{ fontWeight: 600 }}>{contact.name}</span>
                <span>{contact.email}</span>
                <span>{contact.subject || "No Subject"}</span>
                <span className="description-text-small" style={{ fontSize: "12px", color: "#666" }}>{contact.message}</span>
                <span>{formatDate(contact.createdAt)}</span>
                <div className="actions">
                  <RiDeleteBin6Line
                    className="action-icon delete-icon"
                    size={18}
                    style={{ color: "#ef4444", cursor: "pointer" }}
                    onClick={() => handleDeleteContact(contact._id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="catalog-header" style={{ marginBottom: "1rem" }}>
        <div>
          <h2 className="catalog-title" style={{ fontSize: "1.25rem" }}>Registered Users</h2>
        </div>
      </div>

      {/* Users Table */}
      <div className="catalog-table">
        <div className="catalog-table-header customer-grid-simple">
          <span>Identity</span>
          <span>Contact Details</span>
          <span>Gender</span>
          <span>Member Since</span>
          <span>Verification</span>
          <span>Actions</span>
        </div>

        {isLoading ? (
          <Loader text="Gathering customer data..." />
        ) : isError ? (
          <div className="error-state">
             <p>Failed to retrieve the customer list.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">No customers found.</div>
        ) : (
          users.map((user) => (
            <div className="catalog-row customer-grid-simple" key={user._id}>
              {/* Customer Name */}
              <div className="product-cell">
                <span className="user-name">{user.userName}</span>
              </div>

              {/* Contact */}
              <div className="contact-cell">
                <span className="user-email">{user.email}</span>
                <span className="user-phone">{user.phone || "No contact"}</span>
              </div>

              {/* Gender */}
              <span className="capitalize">{user.gender || "N/A"}</span>

              {/* Join Date */}
              <span>{formatDate(user.createdAt)}</span>

              {/* Status */}
              <div className="status-cell">
                <span className={`status-badge ${user.isEmailVerified ? "status-active" : "status-inactive"}`}>
                  {user.isEmailVerified ? "Verified" : "Pending"}
                </span>
              </div>

              {/* Actions */}
              <div className="actions">
                <GrView
                  className="action-icon view-icon"
                  size={18}
                  style={{ color: "#10b981", cursor: "pointer" }}
                  onClick={() => handleView(user._id)}
                />
                <RiDeleteBin6Line
                  className="action-icon delete-icon"
                  size={18}
                  style={{ color: "#ef4444", cursor: isDeleting ? "not-allowed" : "pointer" }}
                  onClick={() => !isDeleting && handleDelete(user._id)}
                />
              </div>
            </div>
          ))
        )}

        {totalEntries > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalEntries={totalEntries}
            startEntry={(currentPage - 1) * entriesPerPage + 1}
            endEntry={Math.min(currentPage * entriesPerPage, totalEntries)}
          />
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
