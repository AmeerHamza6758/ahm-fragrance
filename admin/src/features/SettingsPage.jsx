import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { IoMdAdd, IoMdTrash, IoMdSave } from 'react-icons/io';
import { FiEdit2 } from 'react-icons/fi';
import { useGetFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../services/hooks/faq';
import { useGetCMSContent, useUpdateCMSContent } from '../services/hooks/cms';
import { confirmationPopup } from '../utils/alert-service';
import Loader from '../components/Loader';
import "../styles/admin.css";

const CMS_SECTIONS = [
  { key: 'about-us', label: 'About Us' },
  { key: 'privacy-policy', label: 'Privacy Policy' },
  { key: 'terms-service', label: 'Terms & Service' },
  { key: 'shipping-returns', label: 'Shipping & Returns' },
];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('faqs');
  const [editingFaq, setEditingFaq] = useState(null); 
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const { data: faqRes, isLoading: faqLoading } = useGetFaqs();
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const isCmsTab = CMS_SECTIONS.some(s => s.key === activeTab);
  const { data: cmsRes, isLoading: cmsLoading } = useGetCMSContent(isCmsTab ? activeTab : null);
  const updateCmsMutation = useUpdateCMSContent();

  const [cmsForm, setCmsForm] = useState({ content: '' });

  useEffect(() => {
    if (isCmsTab) {
      if (cmsRes?.data?.data) {
        setCmsForm({
          content: cmsRes.data.data.content || ''
        });
      } else if (!cmsLoading) {
        setCmsForm({ content: '' });
      }
    }
  }, [cmsRes, activeTab, isCmsTab, cmsLoading]);

  const handleCmsSave = () => {
    updateCmsMutation.mutate({
      key: activeTab,
      content: cmsForm.content
    });
  };

  const handleFaqSubmit = (e) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaqMutation.mutate({ id: editingFaq._id, data: editingFaq }, {
        onSuccess: () => setEditingFaq(null)
      });
    } else {
      createFaqMutation.mutate(newFaq, {
        onSuccess: () => {
          setNewFaq({ question: '', answer: '' });
          setIsAddingFaq(false);
        }
      });
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="settings-page-wrapper">
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Command Center</h1>
          <p className="catalog-subtitle">Govern your digital narratives and artisanal policies.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Navigation */}
        <div className="settings-nav-card">
           <h4 className="nav-group-title">Narrative Sections</h4>
           <div className="nav-links">
              <button 
                className={`nav-link-item ${activeTab === 'faqs' ? 'active' : ''}`}
                onClick={() => setActiveTab('faqs')}
              >
                Common Queries
              </button>
              {CMS_SECTIONS.map(section => (
                <button 
                  key={section.key}
                  className={`nav-link-item ${activeTab === section.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(section.key)}
                >
                  {section.label}
                </button>
              ))}
           </div>
        </div>

        {/* Workspace */}
        <div className="settings-workspace">
          {activeTab === 'faqs' ? (
            <div className="workspace-content">
              <div className="content-action-header">
                <h3>Frequently Asked Queries</h3>
                <button className="add-btn-minimal" onClick={() => setIsAddingFaq(true)}>
                  <IoMdAdd /> Add Narrative
                </button>
              </div>

              {(isAddingFaq || editingFaq) && (
                <div className="faq-modal-overlay">
                  <form className="faq-modal-card" onSubmit={handleFaqSubmit}>
                    <div className="modal-top">
                       <h4>{editingFaq ? 'Refine Query' : 'New Narrative'}</h4>
                       <IoMdAdd className="close-rotate" onClick={() => {
                          setEditingFaq(null);
                          setIsAddingFaq(false);
                       }} />
                    </div>
                    
                    <div className="modal-inputs">
                      <div className="input-field">
                        <label>The Inquiry</label>
                        <input 
                          type="text" 
                          placeholder="e.g. How long does the Oud last?"
                          value={editingFaq ? editingFaq.question : newFaq.question}
                          onChange={(e) => editingFaq 
                            ? setEditingFaq({...editingFaq, question: e.target.value})
                            : setNewFaq({...newFaq, question: e.target.value})
                          }
                          required
                        />
                      </div>
                      <div className="input-field">
                        <label>The Response</label>
                        <textarea 
                          placeholder="Craft your answer here..."
                          value={editingFaq ? editingFaq.answer : newFaq.answer}
                          onChange={(e) => editingFaq 
                            ? setEditingFaq({...editingFaq, answer: e.target.value})
                            : setNewFaq({...newFaq, answer: e.target.value})
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="submit" className="action-btn-primary">
                        {editingFaq ? 'Update' : 'Publish'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {faqLoading ? <Loader text="Retrieving narratives..." /> : (
                <div className="faq-registry">
                  {faqRes?.data?.data?.map(faq => (
                    <div key={faq._id} className="faq-registry-row">
                      <div className="faq-text-block">
                        <span className="faq-question">{faq.question}</span>
                        <p className="faq-answer">{faq.answer}</p>
                      </div>
                      <div className="faq-row-actions">
                        <button className="icon-btn edit" onClick={() => setEditingFaq(faq)}>
                           <FiEdit2 size={16} />
                        </button>

                        <button className="icon-btn delete" onClick={async () => {
                          const result = await confirmationPopup('Delete this query permanently?', 'Erase', 'Keep');
                          if(result.isConfirmed) {
                            deleteFaqMutation.mutate(faq._id);
                          }
                        }}>
                           <IoMdTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="workspace-content">
              <div className="content-action-header">
                <h3>{CMS_SECTIONS.find(s => s.key === activeTab)?.label} Editor</h3>
                <button 
                  className="save-btn-premium" 
                  onClick={handleCmsSave} 
                  disabled={updateCmsMutation.isPending}
                >
                  <IoMdSave /> {updateCmsMutation.isPending ? 'Syncing...' : 'Save Changes'}
                </button>
              </div>

              {cmsLoading ? <Loader text="Loading manuscript..." /> : (
                <div className="editor-workspace">
                  <div className="editor-field-group">
                    <label className="field-label">Document Manuscript</label>
                    <div className="rich-editor-container">
                      <ReactQuill 
                        theme="snow" 
                        value={cmsForm.content} 
                        onChange={(content) => setCmsForm({ content })}
                        modules={modules}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default SettingsPage;
