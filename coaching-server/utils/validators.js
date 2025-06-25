module.exports = {
  isPositiveNumber: (value) => {
    return !isNaN(value) && Number(value) >= 0;
  },
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  isValidPhone: (phone) => {
    const re = /^[\+]?[1-9][0-9]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  }
};