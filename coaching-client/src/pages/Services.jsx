import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/comman/Loader'; // ✅ Adjust the path if needed

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false); // ✅ stop loader after fetch
    }
  };

  if (loading) return <Loader />; // ✅ show loader while loading

  return (
    <div style={{ paddingTop: '100px' }}>
      <section className="section">
        <div className="container">
          <h1 className="section-title">Our Services</h1>
          <div className="cards-grid">
            {Array.isArray(services) && services.length > 0 ? (
              services.map(service => (
                <div key={service.id} className="card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <p><strong>Price:</strong> ₹{service.price}</p>
                  <button className="btn">Get Service</button>
                </div>
              ))
            ) : (
              <p>No services available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
