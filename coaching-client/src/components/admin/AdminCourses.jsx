import React from 'react';

const AdminCourses = ({
  courses,
  courseForm,
  setCourseForm,
  editingCourseId,
  setEditingCourseId,
  handleCourseSubmit,
  handleEditCourse,
  cancelEditCourse,
  handleDelete,
  loading,
  handleInputChange
}) => (
  <div className="space-y-8">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingCourseId ? 'Edit Course' : 'Add New Course'}
      </h3>
      <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="title"
          placeholder="Course Title"
          value={courseForm.title}
          onChange={(e) => handleInputChange(e, setCourseForm)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="description"
          placeholder="Course Description"
          value={courseForm.description}
          onChange={(e) => handleInputChange(e, setCourseForm)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 6 months)"
          value={courseForm.duration}
          onChange={(e) => handleInputChange(e, setCourseForm)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={courseForm.price}
          onChange={(e) => handleInputChange(e, setCourseForm)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="faculty"
          placeholder="Faculty Name"
          value={courseForm.faculty}
          onChange={(e) => handleInputChange(e, setCourseForm)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-[#473391] hover:text-white disabled:opacity-50"
          >
            {loading ? 'Processing...' : (editingCourseId ? 'Update Course' : 'Add Course')}
          </button>
          {editingCourseId && (
            <button
              type="button"
              onClick={cancelEditCourse}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses List ({courses.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <p className="text-gray-500 col-span-full">No courses added yet.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h4>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-1">Duration: {course.duration}</p>
              <p className="text-sm text-gray-500 mb-1">Price: ₹{course.price}</p>
              <p className="text-sm text-gray-500 mb-4">Faculty: {course.faculty}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="flex-1 bg-yellow-400 text-gray-900 py-1 px-3 rounded text-sm hover:bg-[#473391] hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id, 'courses')}
                  className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default AdminCourses;
