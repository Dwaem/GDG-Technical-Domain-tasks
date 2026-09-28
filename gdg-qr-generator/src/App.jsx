import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './App.css';

// --- Utility: Contrast Checker ---
const getLuminance = (hex) => {
  const color = hex.charAt(0) === '#' ? hex.substring(1, 7) : hex;
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;
  
  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export default function App() {
  // --- MOUSE TRACKING FOR GRID BULGE EFFECT ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    
    // Set initial position to center of screen
    document.documentElement.style.setProperty('--mouse-x', `${window.innerWidth / 2}px`);
    document.documentElement.style.setProperty('--mouse-y', `${window.innerHeight / 2}px`);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  // --------------------------------------------

  const [qrType, setQrType] = useState('url');
  const [qrData, setQrData] = useState({
    url: 'https://gdg.community.dev',
    text: '',
    emailTo: '',
    emailSubject: '',
    phone: '',
    wifiSsid: '',
    wifiPassword: '',
    wifiEncryption: 'WPA'
  });

  const [qrOptions, setQrOptions] = useState({
    size: 250,
    margin: 10,
    fgColor: '#ffffff',
    bgColor: '#121212',
    dotStyle: 'rounded',
    ecl: 'Q' // Error Correction Level
  });

  const [contrastWarning, setContrastWarning] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [history, setHistory] = useState([]);
  
  const qrRef = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: qrOptions.size,
      height: qrOptions.size,
      margin: qrOptions.margin,
      type: 'svg',
      dotsOptions: { type: qrOptions.dotStyle, color: qrOptions.fgColor },
      backgroundOptions: { color: qrOptions.bgColor },
      qrOptions: { errorCorrectionLevel: qrOptions.ecl }
    });
    
    if (qrRef.current) {
      qrCode.current.append(qrRef.current);
    }

    const savedHistory = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const getFormattedData = useCallback(() => {
    switch (qrType) {
      case 'url': return qrData.url;
      case 'text': return qrData.text;
      case 'email': return `mailto:${qrData.emailTo}?subject=${encodeURIComponent(qrData.emailSubject)}`;
      case 'phone': return `tel:${qrData.phone}`;
      case 'wifi': return `WIFI:T:${qrData.wifiEncryption};S:${qrData.wifiSsid};P:${qrData.wifiPassword};;`;
      default: return '';
    }
  }, [qrType, qrData]);

  useEffect(() => {
    let error = '';
    if (qrType === 'url' && qrData.url && !qrData.url.startsWith('http')) {
      error = 'URL should ideally start with http:// or https://';
    } else if (qrType === 'email' && qrData.emailTo && !/\S+@\S+\.\S+/.test(qrData.emailTo)) {
      error = 'Invalid email address';
    } else if (qrType === 'wifi' && !qrData.wifiSsid && qrData.wifiEncryption !== 'nopass') {
      error = 'SSID is required for Wi-Fi';
    }
    setValidationError(error);
  }, [qrType, qrData]);

  useEffect(() => {
    if (!qrCode.current) return;
    
    const dataStr = getFormattedData() || ' '; 
    
    qrCode.current.update({
      data: dataStr,
      width: qrOptions.size,
      height: qrOptions.size,
      margin: qrOptions.margin,
      dotsOptions: { type: qrOptions.dotStyle, color: qrOptions.fgColor },
      backgroundOptions: { color: qrOptions.bgColor },
      qrOptions: { errorCorrectionLevel: qrOptions.ecl }
    });

    const ratio = getContrastRatio(qrOptions.fgColor, qrOptions.bgColor);
    setContrastWarning(ratio < 3.0); 

  }, [getFormattedData, qrOptions]);

  const handleDataChange = (field, value) => {
    setQrData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (field, value) => {
    setQrOptions(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset) => {
    setQrOptions(prev => ({ ...prev, ...preset }));
  };

  const saveToHistory = () => {
    const newEntry = { 
      id: Date.now(), 
      type: qrType, 
      data: { ...qrData }, 
      options: { ...qrOptions },
      summary: getFormattedData().substring(0, 20) + '...'
    };
    const updatedHistory = [newEntry, ...history].slice(0, 5); 
    setHistory(updatedHistory);
    localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
  };

  const loadHistoryItem = (item) => {
    setQrType(item.type);
    setQrData(item.data);
    setQrOptions(item.options);
  };

  const download = (ext) => {
    if (!qrCode.current) return;
    qrCode.current.download({ name: 'gdg-qr', extension: ext });
    saveToHistory();
  };

  const copyToClipboard = async () => {
    if (!qrRef.current) return;
    try {
      const rawSvg = await qrCode.current.getRawData('svg');
      const blob = new Blob([rawSvg], { type: 'image/svg+xml' });
      
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = qrOptions.size;
        canvas.height = qrOptions.size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': pngBlob })
          ]);
          alert('Copied to clipboard!');
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.src = url;
      saveToHistory();
    } catch (err) {
      alert('Failed to copy to clipboard.');
    }
  };

  const presets = {
    classicDark: { fgColor: '#ffffff', bgColor: '#121212', dotStyle: 'square' },
    oceanBlue: { fgColor: '#002B5B', bgColor: '#E4F1FF', dotStyle: 'rounded' },
    neonSunset: { fgColor: '#FF0055', bgColor: '#220033', dotStyle: 'classy' }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>GDG QR Code Generator</h1>
        <p>Design, Customize, and Export</p>
      </header>

      <main className="main-grid">
        <section className="controls-panel">
          <div className="card">
            <h2>1. Select Type</h2>
            <div className="tabs">
              {['url', 'text', 'email', 'phone', 'wifi'].map(t => (
                <button 
                  key={t} 
                  className={qrType === t ? 'active' : ''} 
                  onClick={() => setQrType(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="input-group">
              {qrType === 'url' && (
                <input type="text" placeholder="https://example.com" value={qrData.url} onChange={(e) => handleDataChange('url', e.target.value)} />
              )}
              {qrType === 'text' && (
                <textarea placeholder="Enter text..." value={qrData.text} onChange={(e) => handleDataChange('text', e.target.value)} />
              )}
              {qrType === 'email' && (
                <>
                  <input type="email" placeholder="Email Address" value={qrData.emailTo} onChange={(e) => handleDataChange('emailTo', e.target.value)} />
                  <input type="text" placeholder="Subject" value={qrData.emailSubject} onChange={(e) => handleDataChange('emailSubject', e.target.value)} />
                </>
              )}
              {qrType === 'phone' && (
                <input type="tel" placeholder="+1234567890" value={qrData.phone} onChange={(e) => handleDataChange('phone', e.target.value)} />
              )}
              {qrType === 'wifi' && (
                <>
                  <input type="text" placeholder="SSID (Network Name)" value={qrData.wifiSsid} onChange={(e) => handleDataChange('wifiSsid', e.target.value)} />
                  <input type="password" placeholder="Password" value={qrData.wifiPassword} onChange={(e) => handleDataChange('wifiPassword', e.target.value)} />
                  <select value={qrData.wifiEncryption} onChange={(e) => handleDataChange('wifiEncryption', e.target.value)}>
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </>
              )}
              {validationError && <span className="error-text">{validationError}</span>}
            </div>
          </div>

          <div className="card">
            <h2>2. Presets</h2>
            <div className="presets-group">
              <button onClick={() => applyPreset(presets.classicDark)}>Classic Dark</button>
              <button onClick={() => applyPreset(presets.oceanBlue)}>Ocean Blue</button>
              <button onClick={() => applyPreset(presets.neonSunset)}>Neon Sunset</button>
            </div>
          </div>

          <div className="card">
            <h2>3. Customize Design</h2>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label>Foreground Color</label>
                <div className="color-picker-wrap">
                  <input type="color" value={qrOptions.fgColor} onChange={(e) => handleOptionChange('fgColor', e.target.value)} />
                  <span>{qrOptions.fgColor}</span>
                </div>
              </div>
              <div className="setting-item">
                <label>Background Color</label>
                <div className="color-picker-wrap">
                  <input type="color" value={qrOptions.bgColor} onChange={(e) => handleOptionChange('bgColor', e.target.value)} />
                  <span>{qrOptions.bgColor}</span>
                </div>
              </div>

              <div className="setting-item full-width">
                <label>Size: {qrOptions.size}px</label>
                <input type="range" min="180" max="400" value={qrOptions.size} onChange={(e) => handleOptionChange('size', Number(e.target.value))} />
              </div>

              <div className="setting-item full-width">
                <label>Margin: {qrOptions.margin}px</label>
                <input type="range" min="0" max="50" value={qrOptions.margin} onChange={(e) => handleOptionChange('margin', Number(e.target.value))} />
              </div>

              <div className="setting-item">
                <label>Dot Style</label>
                <select value={qrOptions.dotStyle} onChange={(e) => handleOptionChange('dotStyle', e.target.value)}>
                  <option value="square">Square</option>
                  <option value="dots">Dots</option>
                  <option value="rounded">Rounded</option>
                  <option value="classy">Classy</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Error Correction Level</label>
                <select value={qrOptions.ecl} onChange={(e) => handleOptionChange('ecl', e.target.value)}>
                  <option value="L">Low (7% recovery) - Cleaner</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery) - Denser</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="preview-panel">
          <div className="sticky-container">
            <div className="preview-card">
              <h2>Live Preview</h2>
              <div className="qr-wrapper" ref={qrRef}></div>
              
              {contrastWarning && (
                <div className="warning-banner">
                  ⚠️ Colors are too similar. QR code may be unscannable.
                </div>
              )}

              <div className="export-actions">
                <button className="primary-btn" onClick={() => download('png')}>Download PNG</button>
                <button className="secondary-btn" onClick={() => download('svg')}>Download SVG</button>
                <button className="secondary-btn" onClick={copyToClipboard}>Copy to Clipboard</button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="history-card">
                <h3>Recent Codes</h3>
                <ul>
                  {history.map(item => (
                    <li key={item.id} onClick={() => loadHistoryItem(item)}>
                      <span className="history-type">{item.type}</span>
                      <span className="history-summary">{item.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}