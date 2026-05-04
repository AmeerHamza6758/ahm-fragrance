import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { useGetUsers, useDeleteUser } from "../services/hooks/users";
import { useGetContacts, useDeleteContact } from "../services/hooks/contacts";
import { useGetCircleMembers, useRemoveCircleMember } from "../services/hooks/circle";
import { successToaster, errorToaster, confirmationPopup } from "../utils/alert-service";

function CustomersPage() {
  const navigate = useNavigate();
  const entriesPerPage = 10;

  // Pagination states for different sections
  const [userPage, setUserPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [circlePage, setCirclePage] = useState(1);

  // Data Fetching
  const { data: usersRes, isLoading: usersLoading, isError: usersError } = useGetUsers(userPage, entriesPerPage);
  const { data: contactsRes, isLoading: contactsLoading } = useGetContacts(contactPage, entriesPerPage);
  const { data: circleRes, isLoading: circleLoading } = useGetCircleMembers(circlePage, entriesPerPage);

  // Mutations
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const deleteContactMutation = useDeleteContact();
  const removeCircleMutation = useRemoveCircleMember();

  // Processed Data
  const users = usersRes?.data?.data || [];
  const usersTotal = usersRes?.data?.pagination?.totalItems || 0;
  const usersPages = usersRes?.data?.pagination?.totalPages || 1;

  const contacts = contactsRes?.data?.data || [];
  const contactsTotal = contactsRes?.data?.pagination?.totalItems || 0;
  const contactsPages = contactsRes?.data?.pagination?.totalPages || 1;

  const circleMembers = circleRes?.data?.data || [];
  const circleTotal = circleRes?.data?.pagination?.totalItems || 0;
  const circlePages = circleRes?.data?.pagination?.totalPages || 1;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this customer? This action cannot be undone.");
    if (result.isConfirmed) {
      deleteUser(id, {
        onSuccess: () => successToaster("Customer deleted successfully"),
        onError: (error) => errorToaster(error.response?.data?.message || "Failed to delete customer")
      });
    }
  };

  const handleDeleteContact = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this contact message?");
    if (result.isConfirmed) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleRemoveCircle = async (id) => {
    const result = await confirmationPopup("Are you sure you want to remove this member from the Fragrance Circle?");
    if (result.isConfirmed) {
      removeCircleMutation.mutate(id);
    }
  };

  return (
    <div className="customers-page-container">
      {/* Page Header */}
      <div className="catalog-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="catalog-title">Customer Relationship Management</h1>
          <p className="catalog-subtitle">
            Oversee your botanical enthusiasts, community members, and direct inquiries.
          </p>
        </div>
      </div>

      <div className="admin-stacked-sections">
        
        {/* 1. Registered Users Section */}
        <div className="section-wrapper">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title-premium">Registered Users</h2>
              <p className="section-subtitle-premium">Profiles of enthusiasts within your ecosystem.</p>
            </div>
            <div className="count-pill">{usersTotal} Total Users</div>
          </div>

          <div className="catalog-table">
            <div className="catalog-table-header">
              <span>Identity</span>
              <span>Contact</span>
              <span>Gender</span>
              <span>Join Date</span>
              <span>Verification</span>
              <span>Actions</span>
            </div>

            {usersLoading ? (
              <Loader text="Gathering enthusiasts..." />
            ) : usersError ? (
              <div className="error-state">Failed to retrieve the customer list.</div>
            ) : users.length === 0 ? (
              <div className="empty-state">No customers found.</div>
            ) : (
              users.map((user) => (
                <div className="catalog-row" key={user._id}>
                  <div className="product-cell">
                    <div className="user-info-stack">
                      <span className="user-name">{user.userName}</span>
                      {user.isCircleMember && (
                        <span className="mini-pill">Fragrance Circle</span>
                      )}
                    </div>
                  </div>

                  <div className="contact-cell">
                    <span className="user-email">{user.email}</span>
                    <span className="user-phone">{user.phone || "---"}</span>
                  </div>

                  <span className="capitalize">{user.gender || "N/A"}</span>
                  <span>{formatDate(user.createdAt)}</span>

                  <div className="status-cell">
                    <span className={`status-pill ${user.isEmailVerified ? "active" : "inactive"}`}>
                      {user.isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="actions">
                    <GrView
                      className="action-icon-btn view"
                      size={18}
                      onClick={() => navigate(`/customers/view/${user._id}`)}
                      title="View Profile"
                    />
                    <RiDeleteBin6Line
                      className="action-icon-btn delete"
                      size={18}
                      onClick={() => !isDeleting && handleDelete(user._id)}
                      title="Delete User"
                    />
                  </div>
                </div>
              ))
            )}

            {usersTotal > entriesPerPage && (
              <Pagination
                currentPage={userPage}
                totalPages={usersPages}
                onPageChange={setUserPage}
                totalEntries={usersTotal}
                startEntry={(userPage - 1) * entriesPerPage + 1}
                endEntry={Math.min(userPage * entriesPerPage, usersTotal)}
              />
            )}
          </div>
        </div>

        {/* 2. Contact Inquiries Section */}
        <div className="section-wrapper">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title-premium">Direct Inquiries</h2>
              <p className="section-subtitle-premium">Personalized communication from your visitors.</p>
            </div>
            <div className="count-pill">{contactsTotal} Inquiries</div>
          </div>

          <div className="catalog-table">
            <div className="catalog-table-header" style={{ gridTemplateColumns: "1.5fr 2fr 1.5fr 3fr 1.2fr 0.6fr" }}>
              <span>Name</span>
              <span>Email</span>
              <span>Subject</span>
              <span>Message Snippet</span>
              <span>Received On</span>
              <span>Actions</span>
            </div>

            {contactsLoading ? (
              <Loader text="Loading inquiries..." />
            ) : contacts.length === 0 ? (
              <div className="empty-state">No new inquiries to display.</div>
            ) : (
              contacts.map((contact) => (
                <div className="catalog-row" key={contact._id} style={{ gridTemplateColumns: "1.5fr 2fr 1.5fr 3fr 1.2fr 0.6fr" }}>
                  <span style={{ fontWeight: "700", color: "#1A1716" }}>{contact.name}</span>
                  <span className="truncate" style={{ fontSize: '13px' }}>{contact.email}</span>
                  <span style={{ fontWeight: '500' }}>{contact.subject || "No Subject"}</span>
                  <span className="description-text-small truncate-multi" title={contact.message}>
                    {contact.message}
                  </span>
                  <span>{formatDate(contact.createdAt)}</span>
                  <div className="actions">
                    <RiDeleteBin6Line
                      className="action-icon-btn delete"
                      size={18}
                      onClick={() => handleDeleteContact(contact._id)}
                      title="Delete Inquiry"
                    />
                  </div>
                </div>
              ))
            )}

            {contactsTotal > entriesPerPage && (
              <Pagination
                currentPage={contactPage}
                totalPages={contactsPages}
                onPageChange={setContactPage}
                totalEntries={contactsTotal}
                startEntry={(contactPage - 1) * entriesPerPage + 1}
                endEntry={Math.min(contactPage * entriesPerPage, contactsTotal)}
              />
            )}
          </div>
        </div>

        {/* 3. Fragrance Circle Section */}
        <div className="section-wrapper">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title-premium">Fragrance Circle</h2>
              <p className="section-subtitle-premium">Managing your community of newsletter subscribers.</p>
            </div>
            <div className="count-pill">{circleTotal} Members</div>
          </div>

          <div className="catalog-table">
            <div className="catalog-table-header" style={{ gridTemplateColumns: "1fr 1fr 0.5fr" }}>
              <span>Subscriber Email</span>
              <span>Joining Date</span>
              <span>Actions</span>
            </div>

            {circleLoading ? (
              <Loader text="Loading community members..." />
            ) : circleMembers.length === 0 ? (
              <div className="empty-state">Your circle is currently empty.</div>
            ) : (
              circleMembers.map((member) => (
                <div className="catalog-row" key={member._id} style={{ gridTemplateColumns: "1fr 1fr 0.5fr" }}>
                  <span style={{ fontWeight: 700, color: "#1A1716" }}>{member.email}</span>
                  <span>{formatDate(member.subscribedAt)}</span>
                  <div className="actions">
                    <RiDeleteBin6Line
                      className="action-icon-btn delete"
                      size={18}
                      onClick={() => handleRemoveCircle(member._id)}
                      title="Remove Member"
                    />
                  </div>
                </div>
              ))
            )}

            {circleTotal > entriesPerPage && (
              <Pagination
                currentPage={circlePage}
                totalPages={circlePages}
                onPageChange={setCirclePage}
                totalEntries={circleTotal}
                startEntry={(circlePage - 1) * entriesPerPage + 1}
                endEntry={Math.min(circlePage * entriesPerPage, circleTotal)}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CustomersPage;
