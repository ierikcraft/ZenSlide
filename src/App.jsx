import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Monitor, 
  Download, 
  Layout, 
  Type, 
  Quote, 
  Columns, 
  Hash, 
  ArrowUp,
  ArrowDown,
  Presentation,
  FileText,
  X
} from 'lucide-react';

// --- Utilitarios para cargar librerías externas para exportar ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// --- Definición de Plantillas ---
const TEMPLATES = {
  TITLE: { 
    id: 'title', 
    name: 'Título Principal', 
    icon: <Type size={20} />,
    layout: 'flex flex-col justify-center items-center text-center h-full p-12',
    fields: [
      { key: 'title', placeholder: 'Título de la Presentación', style: 'text-5xl font-bold mb-6 w-full bg-transparent outline-none text-center placeholder-gray-300' },
      { key: 'subtitle', placeholder: 'Añade un subtítulo...', style: 'text-2xl text-gray-500 w-full bg-transparent outline-none text-center placeholder-gray-200' }
    ]
  },
  BULLETS: { 
    id: 'bullets', 
    name: 'Título y Texto', 
    icon: <Layout size={20} />,
    layout: 'flex flex-col h-full p-12 pt-16',
    fields: [
      { key: 'title', placeholder: 'Título de la diapositiva', style: 'text-4xl font-bold mb-8 w-full bg-transparent outline-none border-b-2 border-gray-100 pb-2 placeholder-gray-300' },
      { key: 'body', placeholder: '• Escribe tus puntos clave aquí\n• Presiona Enter para nueva línea', type: 'textarea', style: 'text-xl leading-relaxed text-gray-600 w-full h-full bg-transparent outline-none resize-none placeholder-gray-200' }
    ]
  },
  TWO_COL: { 
    id: 'two_col', 
    name: 'Dos Columnas', 
    icon: <Columns size={20} />,
    layout: 'grid grid-cols-2 gap-8 h-full p-12 pt-16',
    fields: [
      { key: 'col1', placeholder: 'Columna Izquierda\n\nEscribe aquí...', type: 'textarea', style: 'text-xl text-gray-600 w-full h-full bg-transparent outline-none resize-none placeholder-gray-200' },
      { key: 'col2', placeholder: 'Columna Derecha\n\nEscribe aquí...', type: 'textarea', style: 'text-xl text-gray-600 w-full h-full bg-transparent outline-none resize-none placeholder-gray-200' }
    ]
  },
  QUOTE: { 
    id: 'quote', 
    name: 'Cita Destacada', 
    icon: <Quote size={20} />,
    layout: 'flex flex-col justify-center items-center h-full p-16',
    fields: [
      { key: 'quote', placeholder: '"Tu cita inspiradora aquí"', type: 'textarea', style: 'text-4xl italic font-serif text-center text-gray-800 w-full bg-transparent outline-none resize-none mb-8 placeholder-gray-300' },
      { key: 'author', placeholder: '- Autor', style: 'text-xl text-gray-500 text-right w-full bg-transparent outline-none placeholder-gray-200' }
    ]
  },
  BIG_NUMBER: { 
    id: 'big_number', 
    name: 'Dato Grande', 
    icon: <Hash size={20} />,
    layout: 'flex flex-col justify-center items-center h-full p-12',
    fields: [
      { key: 'number', placeholder: '100%', style: 'text-9xl font-black text-indigo-600 text-center w-full bg-transparent outline-none placeholder-indigo-200' },
      { key: 'label', placeholder: 'Descripción del dato', style: 'text-3xl font-medium text-gray-400 text-center mt-4 w-full bg-transparent outline-none placeholder-gray-200' }
    ]
  }
};

const THEMES = [
  { id: 'slate', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-900' },
  { id: 'dark', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-indigo-500' },
  { id: 'cream', bg: 'bg-[#FDFBF7]', text: 'text-stone-800', accent: 'bg-stone-800' },
  { id: 'blue', bg: 'bg-blue-50', text: 'text-blue-900', accent: 'bg-blue-600' },
];

export default function ZenSlide() {
  // --- Estados ---
  const [slides, setSlides] = useState([
    { id: Date.now(), templateId: 'TITLE', content: { title: 'Bienvenidos a ZenSlide', subtitle: 'La forma minimalista de presentar' } }
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  // --- Efectos para cargar librerías ---
  useEffect(() => {
    const loadLibs = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js');
      } catch (e) {
        console.error("Error cargando librerías de exportación", e);
      }
    };
    loadLibs();
  }, []);

  // --- Handlers ---

  const addSlide = (templateId) => {
    const newSlide = {
      id: Date.now(),
      templateId,
      content: {}
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    setShowTemplateModal(false);
  };

  const updateSlideContent = (key, value) => {
    const newSlides = [...slides];
    newSlides[activeSlideIndex].content[key] = value;
    setSlides(newSlides);
  };

  const deleteSlide = (e) => {
    e.stopPropagation();
    if (slides.length === 1) return showNotification("Mínimo una diapositiva.");
    const newSlides = slides.filter((_, i) => i !== activeSlideIndex);
    setSlides(newSlides);
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
  };

  const moveSlide = (direction) => {
    if (direction === -1 && activeSlideIndex === 0) return;
    if (direction === 1 && activeSlideIndex === slides.length - 1) return;
    
    const newSlides = [...slides];
    const temp = newSlides[activeSlideIndex];
    newSlides[activeSlideIndex] = newSlides[activeSlideIndex + direction];
    newSlides[activeSlideIndex + direction] = temp;
    
    setSlides(newSlides);
    setActiveSlideIndex(activeSlideIndex + direction);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Lógica de Exportación ---

  const exportPDF = async () => {
    if (typeof window.jspdf === 'undefined') return showNotification("Librerías cargando... intenta de nuevo.");
    setExporting(true);
    showNotification("Generando PDF...");
    
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720] });
      
      const slideElements = document.querySelectorAll('.slide-render-target');
      
      for (let i = 0; i < slideElements.length; i++) {
        if (i > 0) doc.addPage([1280, 720], 'landscape');
        const canvas = await window.html2canvas(slideElements[i], { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(imgData, 'JPEG', 0, 0, 1280, 720);
      }
      
      doc.save('ZenSlide-Presentation.pdf');
      showNotification("PDF descargado con éxito.");
    } catch (err) {
      console.error(err);
      showNotification("Error al generar PDF.");
    } finally {
      setExporting(false);
    }
  };

  const exportPPTX = () => {
    if (typeof window.PptxGenJS === 'undefined') return showNotification("Librerías cargando... intenta de nuevo.");
    setExporting(true);
    showNotification("Generando PowerPoint...");

    try {
      const pptx = new window.PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      slides.forEach(slide => {
        const slideAdd = pptx.addSlide();
        // Fondo (simple)
        slideAdd.background = { color: currentTheme.bg.includes('slate-900') ? '1e293b' : 'ffffff' };
        const color = currentTheme.text.includes('white') ? 'ffffff' : '000000';

        const { content, templateId } = slide;

        if (templateId === 'TITLE') {
            slideAdd.addText(content.title || 'Título', { x: 0.5, y: 2, w: '90%', fontSize: 44, bold: true, align: 'center', color });
            slideAdd.addText(content.subtitle || '', { x: 0.5, y: 3.5, w: '90%', fontSize: 24, align: 'center', color: '888888' });
        } else if (templateId === 'BULLETS') {
            slideAdd.addText(content.title || 'Título', { x: 0.5, y: 0.5, w: '90%', fontSize: 32, bold: true, color });
            slideAdd.addText(content.body || '', { x: 0.5, y: 1.5, w: '90%', h: '70%', fontSize: 18, color, bullet: true });
        } else if (templateId === 'TWO_COL') {
            slideAdd.addText(content.col1 || '', { x: 0.5, y: 1, w: '45%', h: '80%', fontSize: 18, color });
            slideAdd.addText(content.col2 || '', { x: 5, y: 1, w: '45%', h: '80%', fontSize: 18, color });
        } else if (templateId === 'QUOTE') {
            slideAdd.addText(`"${content.quote || ''}"`, { x: 1, y: 2, w: '80%', fontSize: 36, italic: true, align: 'center', color });
            slideAdd.addText(`- ${content.author || ''}`, { x: 1, y: 4, w: '80%', fontSize: 20, align: 'right', color: '888888' });
        } else if (templateId === 'BIG_NUMBER') {
            slideAdd.addText(content.number || '0', { x: 0, y: 1.5, w: '100%', fontSize: 120, bold: true, align: 'center', color: '4f46e5' });
            slideAdd.addText(content.label || '', { x: 0, y: 4, w: '100%', fontSize: 24, align: 'center', color: '888888' });
        }
      });

      pptx.writeFile({ fileName: 'ZenSlide-Presentation.pptx' });
      showNotification("PPTX generado con éxito.");
    } catch (err) {
      console.error(err);
      showNotification("Error al generar PPTX.");
    } finally {
      setExporting(false);
    }
  };

  // --- Renderizado de Componentes ---

  const SlideRenderer = ({ slide, readOnly = false, scale = 1 }) => {
    const tmpl = TEMPLATES[slide.templateId];
    
    // Si estamos exportando a PDF, necesitamos capturar el DOM, así que forzamos un contenedor limpio
    // Si estamos en vista previa (sidebar), hacemos scale
    const style = {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: '1280px',
      height: '720px',
    };

    return (
      <div 
        className={`${currentTheme.bg} ${currentTheme.text} overflow-hidden shadow-sm relative slide-render-target transition-colors duration-300`}
        style={readOnly ? style : { width: '100%', height: '100%', aspectRatio: '16/9' }}
      >
        <div className={tmpl.layout}>
          {tmpl.fields.map((field) => {
            const val = slide.content[field.key] || '';
            if (readOnly) {
              return (
                 <div key={field.key} className={`${field.style} whitespace-pre-wrap`}>
                   {val || <span className="opacity-0">Vacío</span>}
                 </div>
              );
            }
            if (field.type === 'textarea') {
              return (
                <textarea
                  key={field.key}
                  value={val}
                  onChange={(e) => updateSlideContent(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={field.style}
                />
              );
            }
            return (
              <input
                key={field.key}
                type="text"
                value={val}
                onChange={(e) => updateSlideContent(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={field.style}
              />
            );
          })}
        </div>
        {/* Marca de agua sutil o número de página */}
        <div className="absolute bottom-4 right-6 text-sm opacity-30 pointer-events-none">
            ZenSlide • {slides.indexOf(slide) + 1}
        </div>
      </div>
    );
  };

  // --- Interfaz Principal ---

  if (isPresenting) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center outline-none" 
           tabIndex={0} 
           onKeyDown={(e) => {
             if(e.key === 'ArrowRight') setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1));
             if(e.key === 'ArrowLeft') setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
             if(e.key === 'Escape') setIsPresenting(false);
           }}
           onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
           autoFocus
      >
        <div className="w-full h-full max-w-7xl max-h-[90vh] aspect-video">
           <SlideRenderer slide={slides[activeSlideIndex]} readOnly scale={1} />
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setIsPresenting(false); }}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X size={32} />
        </button>

        <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 pointer-events-none">
            {activeSlideIndex + 1} / {slides.length}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden font-sans text-slate-800">
      
      {/* --- Top Bar --- */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Presentation size={20} />
          </div>
          <h1 className="font-bold text-lg hidden sm:block tracking-tight text-slate-900">ZenSlide</h1>
        </div>

        <div className="flex items-center gap-2">
           <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1 mr-4">
              {THEMES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setCurrentTheme(t)}
                    className={`w-6 h-6 rounded-md m-1 transition-all ${t.id === 'slate' ? 'bg-white border' : t.id === 'dark' ? 'bg-slate-900' : t.id === 'cream' ? 'bg-[#FDFBF7] border border-stone-200' : 'bg-blue-100' } ${currentTheme.id === t.id ? 'ring-2 ring-indigo-500 shadow-md' : ''}`}
                    title={`Tema ${t.id}`}
                  />
              ))}
           </div>

           <button onClick={() => setIsPresenting(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
             <Monitor size={16} /> <span className="hidden sm:inline">Presentar</span>
           </button>
           
           <div className="h-6 w-px bg-gray-300 mx-2"></div>

           <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
                <Download size={16} /> <span className="hidden sm:inline">Exportar</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                  <button onClick={exportPDF} disabled={exporting} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                    <FileText size={16} className="text-red-500" /> Exportar a PDF
                  </button>
                  <button onClick={exportPPTX} disabled={exporting} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                    <Presentation size={16} className="text-orange-500" /> Exportar a PPTX
                  </button>
              </div>
           </div>
        </div>
      </div>

      {/* --- Main Area --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* --- Sidebar (Slides List) --- */}
        <div className="w-24 lg:w-64 bg-white border-r border-gray-200 flex flex-col z-10">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`group relative transition-all duration-200 cursor-pointer ${activeSlideIndex === idx ? 'ring-2 ring-indigo-600 ring-offset-2' : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-1'}`}
              >
                <div className="aspect-video bg-white border border-gray-200 rounded-lg overflow-hidden relative shadow-sm">
                   {/* Mini Preview Hack: We use CSS scale to fit the renderer in a tiny box */}
                   <div className="w-[1280px] h-[720px] absolute top-0 left-0 origin-top-left scale-[0.05] lg:scale-[0.16] bg-white pointer-events-none select-none">
                     <SlideRenderer slide={slide} readOnly />
                   </div>
                </div>
                <div className="absolute top-1 left-2 text-[10px] font-bold text-gray-400 bg-white/80 px-1 rounded backdrop-blur-sm">
                   {idx + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 transition-all group"
            >
               <Plus size={24} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
               <span className="text-xs font-medium hidden lg:block">Nueva Diapositiva</span>
            </button>
          </div>
        </div>

        {/* --- Editor Canvas --- */}
        <div className="flex-1 bg-gray-100 flex flex-col relative overflow-hidden">
          
          {/* Toolbar flotante de diapositiva */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 flex items-center gap-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
             <button onClick={() => moveSlide(-1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500" title="Mover arriba">
               <ArrowUp size={16} />
             </button>
             <button onClick={() => moveSlide(1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500" title="Mover abajo">
               <ArrowDown size={16} />
             </button>
             <div className="w-px h-4 bg-gray-300"></div>
             <button onClick={(e) => deleteSlide(e)} className="p-1 hover:bg-red-50 rounded-full text-red-500" title="Eliminar">
               <Trash2 size={16} />
             </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 lg:p-12 overflow-auto">
             <div className="w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-sm overflow-hidden ring-1 ring-black/5 transition-all">
                <SlideRenderer slide={slides[activeSlideIndex]} />
             </div>
          </div>
        </div>

      </div>

      {/* --- Template Selection Modal --- */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Elige una estructura</h2>
              <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(TEMPLATES).map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => addSlide(tmpl.id)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center text-gray-500 group-hover:text-indigo-600 mb-3 transition-colors">
                    {tmpl.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-900">{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300">
          {notification}
        </div>
      )}

    </div>
  );
}