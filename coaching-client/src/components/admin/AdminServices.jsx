import React from 'react';

const AdminServices = ({
  services,
  serviceForm,
  setServiceForm,
  editingServiceId,
  setEditingServiceId,
  handleServiceSubmit,
  handleEditService,
  cancelEditService,
  handleDelete,
  loading,
  handleInputChange
}) => (
  <div className="space-y-8">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingServiceId ? 'Edit Service' : 'Add New Service'}
      </h3>
      <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="title"
          placeholder="Service Title"
          value={serviceForm.title}
          onChange={(e) => handleInputChange(e, setServiceForm)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="description"
          placeholder="Service Description"
          value={serviceForm.description}
          onChange={(e) => handleInputChange(e, setServiceForm)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={serviceForm.price}
          onChange={(e) => handleInputChange(e, setServiceForm)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-[#473391] hover:text-white disabled:opacity-50"
          >
            {loading ? 'Processing...' : (editingServiceId ? 'Update Service' : 'Add Service')}
          </button>
          {editingServiceId && (
            <button
              type="button"
              onClick={cancelEditService}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Services List ({services.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="text-gray-500 col-span-full">No services added yet.</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h4>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-sm text-gray-500 mb-1">Price: ₹{service.price}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditService(service)}
                  className="flex-1 bg-yellow-400 text-gray-900 py-1 px-3 rounded text-sm hover:bg-[#473391] hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id, 'services')}
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

export default AdminServices;
