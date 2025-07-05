import React, { useState, useRef } from 'react';
import API from '../utils/api';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import jsPDF from 'jspdf';
import Select from 'react-select';
import { SketchPicker } from 'react-color';
import { useNavigate } from 'react-router-dom';
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
} from 'react-share';

const fontOptions = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { label: 'Impact', value: 'Impact, sans-serif' },
];

const themeOptions = {
  modern: { bgColor: '#f5f5f5', font: 'Arial, sans-serif' },
  retro: { bgColor: '#ffe4b5', font: '"Courier New", monospace' },
  bold: { bgColor: '#000000', font: 'Impact, sans-serif' },
  minimal: { bgColor: '#ffffff', font: 'Georgia, serif' },
};

const FlyerGenerator = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [flyerText, setFlyerText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [font, setFont] = useState(fontOptions[0]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState('');
  const [theme, setTheme] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const flyerRef = useRef(null);

  const templates = [
    "50% Off Grand Opening!",
    "Live Music + Food Deals This Friday",
    "Register Now: Free Online Webinar",
    "Exclusive Fashion Drop – Today Only!",
  ];

  const generateFlyer = async () => {
    if (!prompt) return alert('Enter a promo idea');
    setIsLoading(true);
    setFlyerText('');
    try {
      const { flyer } = await API.ai.generateFlyer({ prompt });
      setFlyerText(flyer || 'No content generated.');
    } catch {
      setFlyerText('❌ Error generating flyer.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateImageBackground = async () => {
    if (!imagePrompt) return alert('Enter an image prompt');
    setIsLoading(true);
    try {
      const res = await API.ai.generateImage({ prompt: imagePrompt }); // Your backend should call DALL·E or similar
      setBgImage(res.url);
    } catch {
      alert('❌ Image generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPNG = async () => {
    if (!flyerRef.current) return;
    const canvas = await html2canvas(flyerRef.current);
    const link = document.createElement('a');
    link.download = 'flyer.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadPDF = async () => {
    if (!flyerRef.current) return;
    const canvas = await html2canvas(flyerRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('flyer.pdf');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBgImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const applyTheme = (name) => {
    const t = themeOptions[name];
    if (t) {
      setTheme(name);
      setFont({ label: name, value: t.font });
      setBgColor(t.bgColor);
    }
  };

  const shareUrl = 'https://your-app-url.com'; // Replace with your deployed app URL

  return (
    <div className="p-4">
      <button onClick={() => navigate('/dashboard')} className="text-blue-600 mb-3">← Back</button>
      <h1 className="text-2xl font-bold mb-2">🧠 Viral AI Flyer Generator</h1>

      {/* Templates */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {templates.map((t, i) => (
          <button key={i} onClick={() => setPrompt(t)} className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
            {t}
          </button>
        ))}
      </div>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. 'Gym Membership Launch'"
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={generateFlyer}
        disabled={isLoading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate Flyer'}
      </button>

      {/* Design Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="font-bold block mb-1">Font:</label>
          <Select options={fontOptions} value={font} onChange={setFont} />

          <label className="font-bold block mt-4 mb-1">Background Color:</label>
          <SketchPicker color={bgColor} onChangeComplete={(c) => setBgColor(c.hex)} />

          <label className="font-bold block mt-4 mb-1">Upload Image Background:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <div>
          <label className="font-bold block mb-1">AI Image Background Prompt:</label>
          <input
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="e.g. Sunset Beach"
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={generateImageBackground}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Generate Background Image
          </button>

          <div className="mt-4">
            <label className="font-bold block mb-1">Themes:</label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(themeOptions).map((t) => (
                <button
                  key={t}
                  onClick={() => applyTheme(t)}
                  className={`px-3 py-1 rounded ${
                    theme === t ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={flyerRef}
        className="mt-6 border shadow-lg p-4 relative text-center min-h-[300px]"
        style={{
          backgroundColor: bgColor,
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: font.value,
        }}
      >
        <Draggable>
          <div className="cursor-move inline-block p-2 bg-white/90 rounded shadow text-black">
            <textarea
              value={flyerText}
              onChange={(e) => setFlyerText(e.target.value)}
              className="bg-transparent border-none w-full text-xl text-center resize-none"
              rows={5}
            />
          </div>
        </Draggable>
      </div>

      {/* Actions */}
      {flyerText && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={downloadPNG} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            📥 Download PNG
          </button>
          <button onClick={downloadPDF} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            📄 Download PDF
          </button>
        </div>
      )}

      {/* Share Buttons */}
      <div className="mt-6">
        <label className="font-bold block mb-2">📣 Share Flyer Page:</label>
        <div className="flex gap-3">
          <FacebookShareButton url={shareUrl} quote="Check out this flyer!">
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title="🔥 AI Flyer Generator">
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title="Create flyers with AI!">
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
};

export default FlyerGenerator;

