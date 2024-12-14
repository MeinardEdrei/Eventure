"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { FileDown, Plus, Pencil, Trash2, FileSearch } from "lucide-react";

function MorePage({ event, evaluationForm, fetchData }) {
  // HANDLE DELETE EVALUATION FORM
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDeleteEvaluation = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/evaluation/${event.id}/delete-form`
      );
      if (res.status === 204) {
        alert("Form deleted successfully.");
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting evaluation form:", error);
      alert("Failed to delete evaluation form.");
    }
  };

  // HANDLE CANCEL EVENT
  const handleCancelEvent = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/event/${event.id}/cancel`
      );

      if (res.status === 200) {
        alert("Event has been cancelled and participants notified.");
        setIsDeleteModalOpen(false);
        // Optionally redirect or update UI
      }
    } catch (error) {
      console.error("Error cancelling event:", error);
      alert("Failed to cancel event. Please try again.");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/event/${event.id}/generate-report`,
        { responseType: "blob" }
      );

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${event.title}_Event_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="bg-[#232121] border border-[#919191] rounded-[10px] flex flex-col gap-2">
        {/* Report Generation */}
        <div className="p-6">
          <div className="text-[1.3rem] font-semibold">Report Generation</div>
          <div className="mb-8 opacity-50">
            Generate comprehensive event performance and participation reports
            effortlessly.
          </div>
          <div className="export-btn flex items-center justify-end">
            <button
              className="py-[0.5rem] px-8 border flex flex-row items-center gap-2 border-white/25 rounded-[5px]"
              onClick={handleGenerateReport}
            >
              <FileDown size={20} color="#ffffff" strokeWidth={1.5} />
              Export
            </button>
          </div>
        </div>
        <hr />

        {/* Post Evaluation */}
        <div className="p-6">
          <div className="text-[1.3rem] font-semibold">Post Evaluation</div>
          <div className="mb-8 opacity-50">
            Design and distribute surveys or forms to gather feedback and assess
            event performance.
          </div>
          <div className="post-eval-btn flex flex-row items-center justify-end gap-4">
            {evaluationForm.length === 0 ? (
              <Link href={`/PostEvaluation/${event.id}`}>
                <button className="flex flex-row items-center gap-2">
                  <Plus size={20} color="#ffffff" strokeWidth={1.5} />
                  Create
                </button>
              </Link>
            ) : (
              <>
                <Link href={`/EditPostEvaluation/${event.id}`}>
                  <button className="flex flex-row items-center gap-2">
                    <Pencil size={20} strokeWidth={1.5} />
                    Edit
                  </button>
                </Link>
                <button
                  className="flex flex-row items-center gap-2"
                  onClick={handleDeleteEvaluation}
                >
                  <Trash2 size={20} strokeWidth={1.5} />
                  Delete
                </button>
                <Link href="/EvaluationSummary">
                  <button className="flex flex-row items-center gap-2">
                    <FileSearch size={20} strokeWidth={1.5} />
                    Summary
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Event */}
      {/* Cancel Event */}
      <div className="bg-[#7C0000] p-6 border rounded-[10px] border-white/50">
        <div>
          <div className="text-[1.3rem] font-semibold">Delete Event</div>
          <div className="mb-8 opacity-60">
            Cancel and permanently delete this event. This operation cannot be
            undone. If there are any registered guests, we will notify them that
            the event has been cancelled.
          </div>
        </div>
        <div className="cancelButton flex justify-end">
          <button
            className="py-[0.5rem] px-6 flex flex-row items-center gap-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={20} strokeWidth={1.5} />
            Delete Event
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#232121] p-6 rounded-lg border border-white/25 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6 opacity-75">
              Are you absolutely sure you want to delete the event "
              {event.title}"? This action will permanently remove all event data
              and cannot be undone.
            </p>
            {deleteError && (
              <div className="text-red-500 mb-4">{deleteError}</div>
            )}
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 border border-white/25 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-600 rounded ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleCancelEvent}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MorePage;
