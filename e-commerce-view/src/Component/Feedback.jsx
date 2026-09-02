import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import FeedbackService from "../Services/FeedbackService";

import { motion } from "framer-motion";

function Feedback() {
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "ROLE_ADMIN";
  const [feedbacks, setFeedbacks] = useState([]);
  const toast = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });
  
  // AI State
  const [aiSummary, setAiSummary] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadFeedbacks = async () => {
    try {
      const response = await FeedbackService.getAllFeedbacks();
      setFeedbacks(response.data || []);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load feedback', life: 3000 });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadFeedbacks();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Please fill all fields', life: 3000 });
      return;
    }
    try {
      await FeedbackService.addFeedback(form);
      toast.current?.show({ severity: 'success', summary: 'Thank You!', detail: 'Your feedback means a lot to us ❤️', life: 3000 });
      setForm({ name: "", email: "", message: "", rating: 0 });
      if (isAdmin) loadFeedbacks();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Submit failed", life: 3000 });
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await FeedbackService.updateFeedbackStatus(id, status);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Feedback status updated', life: 3000 });
      loadFeedbacks();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Status update failed", life: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await FeedbackService.deleteFeedback(id);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Feedback deleted', life: 3000 });
      loadFeedbacks();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Delete failed", life: 3000 });
    }
  };

  const handleAnalyzeFeedback = async () => {
    setIsAnalyzing(true);
    try {
      const response = await FeedbackService.analyzeFeedback();
      setAiSummary(response.data.summary);
      toast.current?.show({ severity: 'success', summary: 'Analysis Complete', detail: 'AI has analyzed the feedback.', life: 3000 });
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to generate AI analysis.', life: 3000 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8 pt-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', marginTop: '80px' }}>
      <Toast ref={toast} />

      {/* Decorative background blobs */}
      <div className="absolute border-circle bg-purple-400 opacity-10" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', filter: 'blur(80px)' }}></div>
      <div className="absolute border-circle bg-blue-400 opacity-10" style={{ width: '300px', height: '300px', bottom: '-50px', right: '-50px', filter: 'blur(60px)' }}></div>

      <div className="max-w-7xl mx-auto relative z-1">
        
        {/* Admin Title */}
        {isAdmin && (
          <div className="mb-5">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Feedback Management</h1>
            <p className="text-gray-500">Review and manage customer feedback with AI.</p>
          </div>
        )}

        {/* User Form Design */}
        {!isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="flex justify-content-center"
          >
            <Card className="shadow-6 border-none border-round-3xl p-4 md:p-6 w-full max-w-4xl" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              
              <div className="text-center mb-6">
                <div className="inline-flex align-items-center justify-content-center bg-indigo-100 text-indigo-600 border-circle mb-3 shadow-2" style={{ width: '4rem', height: '4rem' }}>
                  <i className="pi pi-heart-fill text-3xl"></i>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 m-0 mb-2">We Value Your Feedback</h1>
                <p className="text-gray-500 text-lg m-0">Help us improve your experience with Bombay Luggage.</p>
              </div>

              <form onSubmit={handleSubmit} className="grid">
                
                <div className="col-12 flex justify-content-center mb-5">
                  <div className="text-center">
                    <p className="text-700 font-semibold mb-3">How was your experience?</p>
                    <Rating
                      value={form.rating}
                      cancel={false}
                      onChange={(e) => setForm({ ...form, rating: e.value })}
                      className="text-yellow-500 justify-content-center"
                      style={{ gap: '0.5rem', fontSize: '2rem' }}
                    />
                  </div>
                </div>

                <div className="col-12 md:col-6 mb-4">
                  <span className="p-float-label w-full">
                    <InputText
                      id="name"
                      className="w-full border-round-xl py-3 px-4 shadow-1"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <label htmlFor="name" className="ml-2">Full Name</label>
                  </span>
                </div>

                <div className="col-12 md:col-6 mb-4">
                  <span className="p-float-label w-full">
                    <InputText
                      id="email"
                      type="email"
                      className="w-full border-round-xl py-3 px-4 shadow-1"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <label htmlFor="email" className="ml-2">Email Address</label>
                  </span>
                </div>

                <div className="col-12 mb-5">
                  <span className="p-float-label w-full">
                    <InputTextarea
                      id="message"
                      rows={5}
                      className="w-full border-round-xl py-3 px-4 shadow-1"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      autoResize
                    />
                    <label htmlFor="message" className="ml-2">Your Message</label>
                  </span>
                </div>

                <div className="col-12 text-center mt-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Button 
                      label="Submit Feedback" 
                      icon="pi pi-send" 
                      type="submit" 
                      className="p-button-rounded px-6 py-3 font-bold text-lg shadow-4 text-white" 
                      style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', border: 'none' }}
                    />
                  </motion.div>
                </div>

              </form>
            </Card>
          </motion.div>
        )}

        {isAdmin && (
          <>
            <div className="flex justify-content-between align-items-center mb-4 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 m-0">Feedback Records</h2>
              <Button 
                label="Analyze Feedbacks with AI ✨" 
                icon="pi pi-sparkles" 
                severity="help" 
                loading={isAnalyzing}
                onClick={handleAnalyzeFeedback}
                className="font-bold border-round-xl shadow-2"
              />
            </div>

            {aiSummary && (
              <Card className="mb-6 border-round-2xl shadow-2 surface-50 border-left-3 border-purple-500">
                <div className="flex align-items-center mb-3">
                  <div className="w-3rem h-3rem border-circle bg-purple-100 flex align-items-center justify-content-center text-purple-600 mr-3">
                    <i className="pi pi-bolt text-xl"></i>
                  </div>
                  <h3 className="m-0 text-xl text-800">AI Feedback Summary</h3>
                </div>
                <div 
                    className="text-700 line-height-3"
                    dangerouslySetInnerHTML={{ 
                      __html: aiSummary.replace(/\n/g, '<br/>')
                                       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                />
              </Card>
            )}

            <Card className="shadow-sm border-round-2xl border-none p-0 overflow-hidden">
              <DataTable value={feedbacks} stripedRows paginator rows={8} emptyMessage="No feedback records">
                <Column field="id" header="ID" />
                <Column field="name" header="Name" />
                <Column field="email" header="Email" />
                <Column field="message" header="Message" />
                <Column
                  field="rating"
                  header="Rating"
                  body={(rowData) => <Rating value={rowData.rating || 0} readOnly cancel={false} />}
                />
                <Column
                  field="status"
                  header="Status"
                  body={(rowData) => (
                    <Tag
                      value={rowData.status}
                      severity={rowData.status === "RESOLVED" ? "success" : "warning"}
                      className="border-round-xl px-3"
                    />
                  )}
                />
                <Column
                  header="Actions"
                  body={(rowData) => (
                    <div className="flex gap-2 flex-wrap">
                      {rowData.status !== "RESOLVED" && (
                        <Button
                          label="Resolve"
                          size="small"
                          severity="success"
                          className="border-round-xl"
                          onClick={() => handleStatusUpdate(rowData.id, "RESOLVED")}
                        />
                      )}
                      <Button
                        icon="pi pi-trash"
                        size="small"
                        severity="danger"
                        outlined
                        className="border-round-xl"
                        onClick={() => handleDelete(rowData.id)}
                      />
                    </div>
                  )}
                />
              </DataTable>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default Feedback;
