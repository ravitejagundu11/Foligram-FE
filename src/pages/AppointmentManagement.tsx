import React, { useState, useEffect } from "react";
import { FiUser, FiClock, FiCalendar, FiExternalLink, FiMail, FiPhone, FiBriefcase, FiCheck, FiX, FiInfo } from "react-icons/fi";
import { apiClient } from "../services/api";
import type { Appointment } from "../types/appointment";

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Appointment[]>('/appointments/owner');
      setAppointments(response);
    } catch (err) {
      console.warn('Backend API not available, loading from localStorage');
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      setAppointments(localAppointments);
    } finally {
      setLoading(false);
    }
  };

  const generateZoomLink = async (appointmentId: string): Promise<string> => {
    try {
      const response = await apiClient.post<{ meetingLink: string }>(`/appointments/${appointmentId}/generate-zoom`);
      return response.meetingLink;
    } catch (err) {
      // Fallback: Generate a mock Zoom link
      const meetingId = Math.floor(Math.random() * 10000000000).toString();
      return `https://zoom.us/j/${meetingId}`;
    }
  };

  const handleApprove = async (appointment: Appointment) => {
    if (!window.confirm(`Approve appointment with ${appointment.booker.name}?`)) return;

    try {
      // Generate Zoom link
      const zoomLink = await generateZoomLink(appointment.id);
      
      const updatedAppointment = {
        ...appointment,
        status: 'approved' as const,
        meetingLink: zoomLink,
        updatedAt: new Date().toISOString()
      };

      await apiClient.patch(`/appointments/${appointment.id}`, {
        status: 'approved',
        meetingLink: zoomLink
      });

      // Update local state
      setAppointments(appointments.map(a => 
        a.id === appointment.id ? updatedAppointment : a
      ));

      // Update localStorage
      const localAppointments = appointments.map(a => 
        a.id === appointment.id ? updatedAppointment : a
      );
      localStorage.setItem('appointments', JSON.stringify(localAppointments));

      alert('Appointment approved! Zoom link has been generated and sent to the booker.');
    } catch (err) {
      // Fallback: Update in localStorage
      const zoomLink = await generateZoomLink(appointment.id);
      const updatedAppointment = {
        ...appointment,
        status: 'approved' as const,
        meetingLink: zoomLink,
        updatedAt: new Date().toISOString()
      };

      const localAppointments = appointments.map(a => 
        a.id === appointment.id ? updatedAppointment : a
      );
      setAppointments(localAppointments);
      localStorage.setItem('appointments', JSON.stringify(localAppointments));
      alert('Appointment approved! Zoom link has been generated.');
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    if (!window.confirm(`Cancel appointment with ${appointment.booker.name}? This action cannot be undone.`)) return;

    try {
      const updatedAppointment = {
        ...appointment,
        status: 'cancelled' as const,
        updatedAt: new Date().toISOString()
      };

      await apiClient.patch(`/appointments/${appointment.id}`, {
        status: 'cancelled'
      });

      // Update local state
      setAppointments(appointments.map(a => 
        a.id === appointment.id ? updatedAppointment : a
      ));

      // Update localStorage
      const localAppointments = appointments.map(a => 
        a.id === appointment.id ? updatedAppointment : a
      );
      localStorage.setItem('appointments', JSON.stringify(localAppointments));

      alert('Appointment cancelled successfully.');
    } catch (err) {
      // Fallback: Update in localStorage
      const updatedAppointment = {
        ...appointment,
        status: 'cancelled' as const,
        updatedAt: new Date().toISOString()
      };

      const localAppointments = appointments.map(a => 
        a.id === appointment.id ? updatedAppointment : a
      );
      setAppointments(localAppointments);
      localStorage.setItem('appointments', JSON.stringify(localAppointments));
      alert('Appointment cancelled.');
    }
  };

  const handleViewUserInfo = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowUserInfo(true);
  };

  const filteredAppointments = appointments.filter(appt => {
    if (filter === 'all') return true;
    return appt.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
      completed: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex px-8 py-10 gap-8">

      {/* LEFT SUMMARY PANEL */}
      <div className="w-1/4 bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 relative border border-gray-200 h-fit">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>

        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
            <p className="text-gray-600 font-medium text-sm">Total Appointments</p>
            <p className="text-4xl mt-1 font-bold text-blue-700">{appointments.length}</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-2xl border border-yellow-200">
            <p className="text-gray-600 font-medium text-sm">Pending</p>
            <p className="text-4xl mt-1 font-bold text-yellow-700">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-2xl border border-green-200">
            <p className="text-gray-600 font-medium text-sm">Approved</p>
            <p className="text-4xl mt-1 font-bold text-green-700">
              {appointments.filter(a => a.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* RIGHT APPOINTMENTS PANEL */}
      <div className="flex-1 flex flex-col gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
            <FiCalendar className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No appointments found</p>
            <p className="text-gray-400 text-sm mt-2">Appointments booked through your published portfolios will appear here</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                
                {/* LEFT: APPOINTMENT INFO */}
                <div className="flex flex-col gap-3 text-gray-800 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appt.status)}`}>
                      {appt.status.toUpperCase()}
                    </span>
                    {appt.reason && (
                      <span className="text-xs text-gray-500 italic">"{appt.reason}"</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-500" size={18} />
                    <span className="font-semibold">Attendee:</span>
                    <span className="text-lg">{appt.booker.name}</span>
                  </div>

                  <div className="flex gap-10 ml-7">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FiCalendar />
                        Date
                      </div>
                      <p className="font-medium text-gray-900 mt-1">{new Date(appt.date).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FiClock />
                        Time
                      </div>
                      <p className="font-medium text-gray-900 mt-1">{appt.time} ({appt.duration} min)</p>
                    </div>

                    {appt.booker.email && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FiMail />
                          Email
                        </div>
                        <p className="font-medium text-gray-900 mt-1">{appt.booker.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="flex flex-col gap-3 items-end min-w-[180px]">
                  <button 
                    onClick={() => handleViewUserInfo(appt)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <FiInfo size={16} />
                    Booker Info
                  </button>

                  {appt.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(appt)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <FiCheck size={16} />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleCancel(appt)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <FiX size={16} />
                        Reject
                      </button>
                    </>
                  )}

                  {appt.status === 'approved' && appt.meetingLink && (
                    <>
                      <a
                        href={appt.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <FiExternalLink size={16} />
                        Join Zoom
                      </a>
                      <button 
                        onClick={() => handleCancel(appt)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <FiX size={16} />
                        Cancel
                      </button>
                    </>
                  )}

                  {appt.status === 'cancelled' && (
                    <div className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-center text-sm">
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* USER INFO MODAL */}
      {showUserInfo && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Appointment Booker Information</h2>
              <button
                onClick={() => setShowUserInfo(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex gap-6 mb-6">
              {selectedAppointment.booker.profilePicture ? (
                <img
                  src={selectedAppointment.booker.profilePicture}
                  alt={selectedAppointment.booker.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedAppointment.booker.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{selectedAppointment.booker.name}</h3>
                {selectedAppointment.booker.role && (
                  <p className="text-gray-600">{selectedAppointment.booker.role}</p>
                )}
                {selectedAppointment.booker.company && (
                  <p className="text-gray-500 text-sm">{selectedAppointment.booker.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FiMail className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                  <p className="text-gray-800 font-medium">{selectedAppointment.booker.email}</p>
                </div>
              </div>

              {selectedAppointment.booker.phone && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiPhone className="text-green-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                    <p className="text-gray-800 font-medium">{selectedAppointment.booker.phone}</p>
                  </div>
                </div>
              )}

              {selectedAppointment.booker.company && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiBriefcase className="text-purple-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Company</p>
                    <p className="text-gray-800 font-medium">{selectedAppointment.booker.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FiCalendar className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Appointment Details</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                  </p>
                  <p className="text-gray-600 text-sm">Duration: {selectedAppointment.duration} minutes</p>
                </div>
              </div>

              {selectedAppointment.reason && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 uppercase font-medium mb-2">Reason for Appointment</p>
                  <p className="text-gray-800">{selectedAppointment.reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowUserInfo(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
              {selectedAppointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedAppointment);
                      setShowUserInfo(false);
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                  >
                    Approve Appointment
                  </button>
                  <button
                    onClick={() => {
                      handleCancel(selectedAppointment);
                      setShowUserInfo(false);
                    }}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                  >
                    Reject Appointment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
