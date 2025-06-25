import React, { useState, useMemo } from 'react';

const AdminStudents = ({ students, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, paid, unpaid
  const [sortBy, setSortBy] = useState('name'); // name, email, created_at
  const [selectedStudent, setSelectedStudent] = useState(null); // For viewing student profile

  // Process students data with enrollments if available
  const processedStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    
    return students.map(student => {
      // Handle different possible enrollment data structures
      const enrollments = student.enrollments || student.enrolled_courses || [];
      
      // Filter for paid enrollments with more flexible field checking
      const paidEnrollments = enrollments.filter(enrollment => {
        const paymentStatus = enrollment.payment_status || enrollment.status;
        return paymentStatus === 'paid' || paymentStatus === 'completed' || paymentStatus === 'success';
      });
      
      // Calculate total amount with flexible field names
      const totalAmountPaid = paidEnrollments.reduce((sum, enrollment) => {
        const amount = parseFloat(enrollment.amount_paid) || 
                      parseFloat(enrollment.amount) || 
                      parseFloat(enrollment.price) || 
                      parseFloat(enrollment.course_price) || 0;
        return sum + amount;
      }, 0);
      
      return {
        ...student,
        // Ensure consistent field names
        name: student.name || student.username || student.full_name || 'N/A',
        email: student.email || 'N/A',
        phone: student.phone || student.mobile || student.contact || '',
        created_at: student.created_at || student.createdAt || student.registration_date || new Date().toISOString(),
        enrollments: enrollments,
        paidEnrollments: paidEnrollments,
        paymentStatus: paidEnrollments.length > 0 ? 'paid' : 'unpaid',
        totalCoursesEnrolled: paidEnrollments.length,
        totalAmountPaid: totalAmountPaid
      };
    });
  }, [students]);

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return processedStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (filterStatus === 'all') return true;
      
      return student.paymentStatus === filterStatus;
    });
  }, [processedStudents, searchTerm, filterStatus]);

  // Sort logic
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });
  }, [filteredStudents, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = processedStudents.length;
    const paid = processedStudents.filter(s => s.paymentStatus === 'paid').length;
    const unpaid = processedStudents.filter(s => s.paymentStatus === 'unpaid').length;
    
    return { total, paid, unpaid };
  }, [processedStudents]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Handle view student profile
  const viewStudentProfile = (student) => {
    setSelectedStudent(selectedStudent?.id === student.id ? null : student);
  };

  // Get course title with fallback options
  const getCourseTitle = (enrollment) => {
    return enrollment.course_title || 
           enrollment.courseName || 
           enrollment.title || 
           enrollment.course_name ||
           'Course Name';
  };

  // Get enrollment amount with fallback options
  const getEnrollmentAmount = (enrollment) => {
    return parseFloat(enrollment.amount_paid) || 
           parseFloat(enrollment.amount) || 
           parseFloat(enrollment.price) || 
           parseFloat(enrollment.course_price) || 0;
  };

  // Get enrollment date with fallback options
  const getEnrollmentDate = (enrollment) => {
    return enrollment.enrollment_date || 
           enrollment.created_at || 
           enrollment.purchase_date ||
           enrollment.payment_date;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Students Management</h3>
            <p className="text-gray-600 mt-1">Manage all registered students and their course purchases</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="paid">Paid (Course Purchased)</option>
              <option value="unpaid">Unpaid (Only Registered)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="created_at">Registration Date</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Total Students</div>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-600 text-sm font-medium">Paid Students</div>
            <div className="text-2xl font-bold text-green-900">{stats.paid}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-orange-600 text-sm font-medium">Unpaid Students</div>
            <div className="text-2xl font-bold text-orange-900">{stats.unpaid}</div>
          </div>
        </div>
      </div>

      {/* Students Table/Cards */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-gray-500 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p className="text-lg font-medium">No students found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {sortedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-900">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                        {student.phone && (
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {student.paidEnrollments.length > 0 ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {student.paidEnrollments.length} Course{student.paidEnrollments.length > 1 ? 's' : ''}
                            </div>
                            <div className="text-green-600 font-medium">
                              {formatPrice(student.totalAmountPaid)}
                            </div>
                            {student.paidEnrollments.slice(0, 2).map((enrollment, idx) => (
                              <div key={idx} className="text-xs text-gray-500 truncate max-w-xs">
                                {getCourseTitle(enrollment)}
                              </div>
                            ))}
                            {student.paidEnrollments.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{student.paidEnrollments.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No courses purchased
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(student.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {student.paymentStatus === 'paid' ? '💳 Paid' : '📝 Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewStudentProfile(student)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              selectedStudent?.id === student.id 
                                ? 'text-blue-900 bg-blue-200' 
                                : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                            }`}
                          >
                            👁️ View
                          </button>
                          
                          <button
                            onClick={() => handleDelete(student.id, 'students')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Student Profile Row */}
                  {selectedStudent && (
                    <tr className="bg-blue-50 border-l-4 border-blue-400">
                      <td colSpan={6} className="px-6 py-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {selectedStudent.name}'s Profile
                            </h4>
                            <button
                              onClick={() => setSelectedStudent(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div>
                              <h5 className="font-medium text-gray-900 mb-3">Personal Information</h5>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Name:</span> {selectedStudent.name}</div>
                                <div><span className="font-medium">Email:</span> {selectedStudent.email}</div>
                                {selectedStudent.phone && (
                                  <div><span className="font-medium">Phone:</span> {selectedStudent.phone}</div>
                                )}
                                <div><span className="font-medium">Registered:</span> {formatDate(selectedStudent.created_at)}</div>
                                <div><span className="font-medium">Student ID:</span> {selectedStudent.id}</div>
                              </div>
                            </div>
                            
                            {/* Course & Payment Information */}
                            <div>
                              <h5 className="font-medium text-gray-900 mb-3">Course & Payment Details</h5>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Payment Status:</span> 
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                    selectedStudent.paymentStatus === 'paid' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-orange-100 text-orange-800'
                                  }`}>
                                    {selectedStudent.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                  </span>
                                </div>
                                <div><span className="font-medium">Total Courses:</span> {selectedStudent.totalCoursesEnrolled}</div>
                                <div><span className="font-medium">Total Amount Paid:</span> {formatPrice(selectedStudent.totalAmountPaid)}</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enrolled Courses */}
                          {selectedStudent.paidEnrollments.length > 0 && (
                            <div className="mt-6">
                              <h5 className="font-medium text-gray-900 mb-3">Enrolled Courses</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedStudent.paidEnrollments.map((enrollment, idx) => (
                                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="font-medium text-gray-900">
                                      {getCourseTitle(enrollment)}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      Amount: {formatPrice(getEnrollmentAmount(enrollment))}
                                    </div>
                                    {getEnrollmentDate(enrollment) && (
                                      <div className="text-sm text-gray-500 mt-1">
                                        Enrolled: {formatDate(getEnrollmentDate(enrollment))}
                                      </div>
                                    )}
                                    <div className="text-xs text-green-600 mt-2 font-medium">
                                      ✓ Payment Completed
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {selectedStudent.paymentStatus === 'unpaid' && (
                            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="text-orange-800 font-medium">📝 Registration Only</div>
                              <div className="text-sm text-orange-700 mt-1">
                                This student has registered but hasn't purchased any courses yet.
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {sortedStudents.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-lg font-medium text-gray-900">No students found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              sortedStudents.map((student) => (
                <div key={student.id}>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {/* Student Header */}
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-900">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">ID: {student.id}</p>
                      </div>
                      <div className="ml-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {student.paymentStatus === 'paid' ? '💳 Paid' : '📝 Unpaid'}
                        </span>
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="text-sm text-gray-900">{student.email}</span>
                      </div>
                      {student.phone && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">Phone:</span>
                          <span className="text-sm text-gray-900">{student.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Registered:</span>
                        <span className="text-sm text-gray-900">{formatDate(student.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Courses:</span>
                        <span className="text-sm text-gray-900">{student.totalCoursesEnrolled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Paid:</span>
                        <span className="text-sm text-green-600 font-medium">{formatPrice(student.totalAmountPaid)}</span>
                      </div>
                    </div>

                    {/* Enrolled Courses */}
                    {student.paidEnrollments && student.paidEnrollments.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Enrolled Courses:</h5>
                        <div className="space-y-2">
                          {student.paidEnrollments.map((enrollment, idx) => (
                            <div key={idx} className="text-sm text-gray-600 bg-white p-3 rounded border">
                              <div className="font-medium">{getCourseTitle(enrollment)}</div>
                              <div className="text-green-600 font-medium">{formatPrice(getEnrollmentAmount(enrollment))}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-3 border-t border-gray-300">
                      <button
                        onClick={() => viewStudentProfile(student)}
                        className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedStudent?.id === student.id 
                            ? 'text-blue-900 bg-blue-200' 
                            : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                        }`}
                      >
                        👁️ View Profile
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, 'students')}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile Student Profile */}
                  {selectedStudent?.id === student.id && (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">Detailed Profile</h4>
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      
                      {selectedStudent.paidEnrollments.length > 0 ? (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">All Enrolled Courses</h5>
                          <div className="space-y-3">
                            {selectedStudent.paidEnrollments.map((enrollment, idx) => (
                              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                <div className="font-medium text-gray-900">
                                  {getCourseTitle(enrollment)}
                                </div>
                                <div className="text-sm text-green-600 font-medium mt-1">
                                  {formatPrice(getEnrollmentAmount(enrollment))}
                                </div>
                                {getEnrollmentDate(enrollment) && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Enrolled: {formatDate(getEnrollmentDate(enrollment))}
                                  </div>
                                )}
                                <div className="text-xs text-green-600 mt-2 font-medium">
                                  ✓ Payment Completed
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="text-orange-600 font-medium">📝 Registration Only</div>
                          <div className="text-sm text-gray-600 mt-1">
                            No courses purchased yet
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;