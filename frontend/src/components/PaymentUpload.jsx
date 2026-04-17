import { useState } from 'react';
import { getPaymentInfo, submitPayment } from '../services/api';
import { useEffect } from 'react';

export default function PaymentUpload({ orderId, totalAmount, onSuccess }) {
  const [method, setMethod] = useState('easypaisa');
  const [txnNumber, setTxnNumber] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getPaymentInfo().then(res => setPaymentInfo(res.data));
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!txnNumber || !senderNumber || !screenshot) {
      alert('Please fill all fields and upload screenshot');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('order', orderId);
      formData.append('method', method);
      formData.append('transaction_number', txnNumber);
      formData.append('sender_number', senderNumber);
      formData.append('screenshot', screenshot);
      await submitPayment(formData);
      onSuccess();
    } catch (err) {
      alert('Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const merchantNumber = paymentInfo?.[method]?.number || '---';

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#2C1810', marginBottom: '0.5rem' }}>Complete Payment</h3>
      <p style={{ fontFamily: 'Jost', fontSize: '0.85rem', color: '#8B6F5E', marginBottom: '2rem' }}>
        Total Amount: <strong style={{ color: '#2C1810', fontSize: '1.1rem' }}>Rs. {parseFloat(totalAmount).toLocaleString()}</strong>
      </p>

      {/* Method Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {['easypaisa', 'jazzcash'].map(m => (
          <button key={m} onClick={() => setMethod(m)} style={{
            padding: '1rem',
            border: `2px solid ${method === m ? '#F2A7A7' : '#FAE8D0'}`,
            background: method === m ? 'linear-gradient(135deg, #FDF0E8, #FAE8D0)' : '#FFFDF9',
            cursor: 'pointer',
            fontFamily: 'Jost', fontSize: '0.82rem', letterSpacing: '0.1em',
            textTransform: 'capitalize', color: '#2C1810',
            transition: 'all 0.2s',
          }}>
            {m === 'easypaisa' ? '💚' : '🔴'} {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Merchant Number Box */}
      <div style={{
        background: 'linear-gradient(135deg, #F2A7A7, #F9D5C0)',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5C3D2E', marginBottom: '0.5rem' }}>
          Send Rs. {parseFloat(totalAmount).toLocaleString()} to:
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2C1810', letterSpacing: '0.05em' }}>
          {merchantNumber}
        </p>
        <p style={{ fontFamily: 'Jost', fontSize: '0.75rem', color: '#5C3D2E' }}>Velaur Fragrances</p>
      </div>

      {/* Instructions */}
      <div style={{ background: '#FDF0E8', padding: '1rem 1.2rem', marginBottom: '2rem', borderLeft: '3px solid #F2A7A7' }}>
        <p style={{ fontFamily: 'Jost', fontSize: '0.78rem', color: '#5C3D2E', lineHeight: 1.8 }}>
          📱 Open {method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} app → Send Money → Enter the number above → Send exact amount → Take a screenshot
        </p>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>
            Your Mobile Number
          </label>
          <input value={senderNumber} onChange={e => setSenderNumber(e.target.value)}
            placeholder="03XX-XXXXXXX"
            style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
        </div>

        <div>
          <label style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>
            Transaction ID
          </label>
          <input value={txnNumber} onChange={e => setTxnNumber(e.target.value)}
            placeholder="Enter transaction ID from confirmation"
            style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
        </div>

        <div>
          <label style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>
            Upload Screenshot
          </label>
          <input type="file" accept="image/*" onChange={handleFile}
            style={{ display: 'none' }} id="screenshot-upload" />
          <label htmlFor="screenshot-upload" style={{
            display: 'block', border: '2px dashed #F2A7A7', padding: '1.5rem',
            textAlign: 'center', cursor: 'pointer', background: preview ? 'none' : '#FDF0E8',
          }}>
            {preview ? (
              <img src={preview} alt="Screenshot" style={{ maxHeight: 150, margin: '0 auto' }} />
            ) : (
              <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#8B6F5E' }}>
                📸 Click to upload payment screenshot
              </span>
            )}
          </label>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          background: '#2C1810', color: '#FFFDF9', border: 'none',
          padding: '1rem', fontFamily: 'Jost', fontSize: '0.82rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1, marginTop: '0.5rem',
        }}>
          {loading ? 'Submitting...' : 'Submit Payment Proof'}
        </button>
      </div>
    </div>
  );
}