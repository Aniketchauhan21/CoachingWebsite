// RefundPolicy.js
import React from 'react';
import '../styles/RefundPolicy.css';  // Import the CSS for styling

const RefundPolicy = () => {
  return (
    <div className="refund-policy">
      <div className="refund-policy-container">
        <h1 className="refund-policy-title">Refund Policy</h1>
        <p className="refund-policy-description">
          If you wish to request a cancellation or a refund, please go through our Refunds and Cancellations policy carefully. Make sure to read this page thoroughly before registering for any of our services.
        </p>

        <ol className="refund-policy-list">
          <li>
            We do not offer any refunds for cancellations made after registration and payment has been made. However, in special cases such as factual errors, duplicate payments, mistaken denominations, and other inaccurate payment deductions where the payee faces unreasonable loss, we offer refunds.
          </li>
          <li>
            No refund will be provided in any case for the services provided from the end of the Institute, i.e. Study Materials once dispatched/downloaded will not be considered for refund in any case, lectures provided, portal activation charges are non-refundable in any circumstances.
          </li>
          <li>
            We offer refunds only on facts regarding a specific case (between 7-15 days of the transaction). We reserve the right to refuse refunds for any reason whatsoever, as we deem fit.
          </li>
          <li>
            All refunds will only be made to the same payment mode/account or card from which payments were made initially.
          </li>
          <li>
            Any extra charges borne by the customer such as any Govt Taxes or GST, bank transaction fees, service fees, or processing fees will not be refunded.
          </li>
          <li>
            We do not pay any interest on refunds.
          </li>
          <li>
            We will not be held responsible if the customer fails to receive our communication due to incomplete or incorrect contact details.
          </li>
          <li>
            We do not entertain refunds for any registrations made during discounted or promotional campaigns.
          </li>
          <li>
            Customers should produce valid documentation including a valid invoice to claim a refund.
          </li>
          <li>
            While we have taken almost care to ensure that our payment gateway is secure, we do not guarantee or represent that using our services will not result in unauthorized data use or theft of data online. We use the services of a third-party payment service provider for our online payment gateway. We and our payment service provider do not assume any liability for any type of damage, monetary or otherwise that a customer may suffer due to any delay, interruption, corruption or failure of information transmission during payment. Chargebacks will be made to the customer only if we fail to provide our services for any reason whatsoever after receiving payment.
          </li>
          <li>
            We reserve the right to update the contents of this Refunds and Cancellation policy from time to time without prior notice. Make sure to keep updated before you register for any of our services.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default RefundPolicy;
