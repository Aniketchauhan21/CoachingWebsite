// PrivacyPolicy.js
import React from 'react';
import '../styles/PrivacyPolicy.css';  // Import the CSS for styling

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy-container">
        <h1 className="privacy-policy-title">Privacy Policy</h1>
        <p className="privacy-policy-description">
          This Privacy Policy outlines how Discuss Coaching collects, uses, and protects the personal information of users visiting our website.
        </p>

        <ol className="privacy-policy-list">
          <li>
            <strong>Information We Collect</strong>
            <br />
            a. Personal Information: We may collect personal information, such as names, email addresses, and phone numbers, when voluntarily submitted by visitors through forms or other interactive elements on the website.
            <br />
            b. Non-Personal Information: We may also collect non-personal information, such as browser type, IP address, and the pages visited, to enhance the user experience and improve our website.
          </li>
          <li>
            <strong>Use of Information</strong>
            <br />
            a. Personal Information: The personal information collected is used for the purpose for which it was submitted, such as responding to inquiries, providing requested services, and sending periodic emails related to our educational offerings.
            <br />
            b. Non-Personal Information: Non-personal information is used for analyzing trends, administering the site, and improving our website's functionality.
          </li>
          <li>
            <strong>Cookies</strong>
            <br />
            We use cookies to enhance user experience. Cookies are small files stored on a user's computer that allow us to recognize and remember their preferences. Users may choose to set their web browser to refuse cookies, but this may affect the functionality of the website.
          </li>
          <li>
            <strong>Information Sharing</strong>
            <br />
            We do not sell, trade, or otherwise transfer personally identifiable information to third parties. This does not include trusted third parties who assist us in operating our website or conducting our business, as long as they agree to keep this information confidential.
          </li>
          <li>
            <strong>Third-Party Links</strong>
            <br />
            Our website may contain links to third-party websites. These sites have their own privacy policies, and we are not responsible for the content or practices of these external sites.
          </li>
          <li>
            <strong>Security</strong>
            <br />
            We implement a variety of security measures to safeguard the personal information provided to us. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </li>
          <li>
            <strong>Changes to Privacy Policy</strong>
            <br />
            We reserve the right to update or modify this privacy policy at any time. Any changes will be reflected on this page, and users are encouraged to review this policy periodically.
          </li>
          <li>
            <strong>Your Consent</strong>
            <br />
            By using our website, you consent to our privacy policy.
          </li>
          <li>
            <strong>Contact Information</strong>
            <br />
            If you have any questions or concerns regarding this privacy policy, you may contact us at discusscoaching@gmail.com.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default PrivacyPolicy;