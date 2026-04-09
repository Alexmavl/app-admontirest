import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Database, AlertCircle, ChevronLeft, ChevronRight, HardHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Interface matching the INE CKAN Datastore API JSON response
interface CkanRecord {
  _id: number;
  AÑO: number;
  MES: string;
  GRUPO: string;
  SECCIÓN: number;
  SUBSECCIÓN: number | null;
  "CÓDIGO ARTÍCULO": number;
  "NOMBRE ARTÍCULO": string;
  "UNIDAD DE MEDIDA": string;
  ÍNDICE: number;
}

interface CkanResponse {
  help: string;
  success: boolean;
  result: {
    include_total: boolean;
    resource_id: string;
    records: CkanRecord[];
    total: number;
    limit: number;
  };
}

const RESOURCE_ID = '139681d7-73d5-49b6-92f4-f9fc34fa8bd0';
const API_URL = '/api-ine/es/api/3/action/datastore_search';
const LIMIT = 12; // Items per page

const MOCK_DATA: CkanRecord[] = [
  { _id: 1, AÑO: 2024, MES: "Marzo", GRUPO: "A", SECCIÓN: 1, SUBSECCIÓN: null, "CÓDIGO ARTÍCULO": 101, "NOMBRE ARTÍCULO": "Cemento Portland gris saco de 42.5 kg", "UNIDAD DE MEDIDA": "saco", ÍNDICE: 165.4 },
  { _id: 2, AÑO: 2024, MES: "Marzo", GRUPO: "B", SECCIÓN: 2, SUBSECCIÓN: null, "CÓDIGO ARTÍCULO": 202, "NOMBRE ARTÍCULO": "Hierro corrugado de 3/8", "UNIDAD DE MEDIDA": "quintal", ÍNDICE: 182.1 },
  { _id: 3, AÑO: 2024, MES: "Marzo", GRUPO: "C", SECCIÓN: 1, SUBSECCIÓN: null, "CÓDIGO ARTÍCULO": 305, "NOMBRE ARTÍCULO": "Tubo PVC de 2 pulgadas", "UNIDAD DE MEDIDA": "unidad", ÍNDICE: 121.8 },
  { _id: 4, AÑO: 2024, MES: "Marzo", GRUPO: "A", SECCIÓN: 4, SUBSECCIÓN: null, "CÓDIGO ARTÍCULO": 412, "NOMBRE ARTÍCULO": "Piedra triturada de 1/2 pulgada", "UNIDAD DE MEDIDA": "metro cúbico", ÍNDICE: 145.2 },
  { _id: 5, AÑO: 2024, MES: "Marzo", GRUPO: "B", SECCIÓN: 5, SUBSECCIÓN: null, "CÓDIGO ARTÍCULO": 530, "NOMBRE ARTÍCULO": "Arena de río lavada", "UNIDAD DE MEDIDA": "metro cúbico", ÍNDICE: 138.9 },
  { _id: 6, AÑO: 2024, MES: "Marzo", GRUPO: "C", SECCIÓN: 3, SUBSECCIÓN: null, "CÓDIGO ARTÍCULO": 601, "NOMBRE ARTÍCULO": "Ladrillo tayuyo", "UNIDAD DE MEDIDA": "millar", ÍNDICE: 155.0 }
];

function todayStr(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ─── Tab: Información ───────────────────────────────────────
function InfoTab() {
  return (
    <div className="info-section">
      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon soap">🔗</div>
          <h3>Protocolo REST</h3>
          <p>
            Esta aplicación consume un servicio web REST (Representational State Transfer)
            del Instituto Nacional de Estadística. REST utiliza JSON para el intercambio de mensajes, permitiendo despliegues ágiles en aplicaciones web modernas.
          </p>
        </div>
        <div className="info-card">
          <div className="info-card-icon api">🏦</div>
          <h3>API de Datos INE</h3>
          <p>
            El servicio web Action API de CKAN del INE expone el Datastore de
            materiales de construcción. Permite realizar consultas dinámicas (queries)
            como búsquedas por término (q=) de todos los índices de precios.
          </p>
        </div>
        <div className="info-card">
          <div className="info-card-icon data">📊</div>
          <h3>Datos en Tiempo Real</h3>
          <p>
            Los datos de índices de materiales son proporcionados por el INE de forma mensual.
            Se puede consultar el índice inflacionario de acero, tuberías, y demás, consumiendo el DataStore público.
          </p>
        </div>
        <div className="info-card">
          <div className="info-card-icon soap">⚖️</div>
          <h3>SOAP vs REST</h3>
          <p>
            <strong>SOAP</strong> ofrece tipado fuerte mediante WSDL/XSD, ideal para bancos (Banguat). 
            <strong>REST</strong> es más ligero, usa JSON y arquitectura sin estado, 
            siendo la elección óptima para Open Data como la del INE.
          </p>
        </div>
        <div className="info-card">
          <div className="info-card-icon api">🔧</div>
          <h3>Operaciones REST Utilizadas</h3>
          <p>
            <strong>Datastore_Search:</strong> Método GET para consultar registros usando `fetch`.<br />
            <strong>Paginación Dinámica:</strong> Utilizando los parámetros `limit` y `offset`.<br />
            <strong>Búsqueda:</strong> Filtrado Full-Text usando `q=...`.
          </p>
        </div>
        <div className="info-card">
          <div className="info-card-icon data">🎓</div>
          <h3>Tarea de Clase</h3>
          <p>
            Desarrollado como caso de uso práctico de REST para la clase de
            <strong> Administración de Tecnologías de Información</strong>, 9no Semestre,
            Universidad Mariano Gálvez de Guatemala (UMG).<br />
            <strong>Sede:</strong> Chiquimulilla, Santa Rosa.<br />
            <strong>Facultad:</strong> Ingeniería en Sistemas — 2026.
          </p>
        </div>
      </div>

      {/* Integrantes */}
      <div className="team-section">
        <h3 className="team-title">👥 Integrantes del Equipo</h3>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-avatar">MV</div>
            <div className="team-info">
              <div className="team-name">Marvin Alexander Vásquez López</div>
              <div className="team-carnet">1790-22-12802</div>
            </div>
          </div>
          <div className="team-member">
            <div className="team-avatar">TH</div>
            <div className="team-info">
              <div className="team-name">Teddy Leonardo Hernández Pérez</div>
              <div className="team-carnet">1790-22-2563</div>
            </div>
          </div>
          <div className="team-member">
            <div className="team-avatar">WH</div>
            <div className="team-info">
              <div className="team-name">Wilson Eduardo Hernández López</div>
              <div className="team-carnet">1790-22-7315</div>
            </div>
          </div>
          <div className="team-member">
            <div className="team-avatar">GG</div>
            <div className="team-info">
              <div className="team-name">Guillermo José Gómez Aguilera</div>
              <div className="team-carnet">1790-22-16429</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<'consulta' | 'info'>('consulta');
  const [data, setData] = useState<CkanRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);

  // Debounce search query to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setOffset(0); // Reset pagination on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build the CKAN Datastore Search URL
      const url = new URL(API_URL, window.location.origin);
      url.searchParams.append('resource_id', RESOURCE_ID);
      url.searchParams.append('limit', LIMIT.toString());
      url.searchParams.append('offset', offset.toString());

      // If there's a search term, query it across fields
      if (debouncedQuery.trim() !== '') {
        url.searchParams.append('q', debouncedQuery.trim());
      }

      const response = await fetch(url.toString(), {
        // Agregamos timeout de 5 segundos
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
      });
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      
      const json: CkanResponse = await response.json();
      
      if (json.success && json.result) {
        setData(json.result.records);
        setTotalRecords(json.result.total);
      } else {
        throw new Error('La API respondió con error de validación CKAN');
      }
    } catch (err) {
      console.error("Fetch Data Error:", err);
      // Fallback para defender la presentación si el INE falla
      let localData = MOCK_DATA;
      if (debouncedQuery.trim() !== '') {
        const queryLower = debouncedQuery.toLowerCase();
        localData = MOCK_DATA.filter(item => 
          item["NOMBRE ARTÍCULO"].toLowerCase().includes(queryLower)
        );
      }
      setData(localData);
      setTotalRecords(localData.length);
      setError('Servidor INE Inaccesible (Mostrando Datos de Demostración Locales)');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, offset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNextPage = () => {
    if (offset + LIMIT < totalRecords) {
      setOffset(prev => prev + LIMIT);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(prev => Math.max(0, prev - LIMIT));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="navbar" id="main-navbar">
        <a className="navbar-brand" href="#">
          <img src="/imagen/Umg_logotipo.png" alt="Logo UMG" className="navbar-logo" />
          <div>
            <div className="navbar-subtitle">Administración de Técnologia de Información</div>
          </div>
        </a>
        <div className="navbar-badge">REST Web Service</div>
      </nav>

    <div className="app-container">
      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'consulta' ? 'active' : ''}`}
          onClick={() => setActiveTab('consulta')}
        >
          <span className="tab-icon">🔍</span>
          <span className="tab-label">Consulta INE</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <span className="tab-icon">ℹ️</span>
          <span className="tab-label">Información de Tarea</span>
        </button>
      </div>

      {/* Main content */}
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'consulta' && (
            <motion.div
              key="consulta-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <section className="search-section">
                <p className="search-description">
                  Busca en tiempo real índices de materiales de construcción consumiendo directamente la API pública del Instituto Nacional de Estadística.
                </p>
                <div className="search-bar-container">
                  <Search className="search-icon" size={20} />
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Buscar material (ej. Tubo, Acero, Cemento)..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </section>

              <div style={{ position: 'relative', width: '100%' }}>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500, boxShadow: '0 4px 12px rgba(239,68,68,0.1)' }}
                  >
                    <AlertCircle size={24} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{error}</span>
                  </motion.div>
                )}

                {loading && data.length === 0 ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="loading-container"
                  >
                    <Loader2 className="spinner" size={48} />
                    <p>Conectando con API REST del INE...</p>
                  </motion.div>
                ) : data.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="empty-container"
                  >
                    <HardHat size={48} color="var(--text-muted)" opacity={0.5} />
                    <h3>No se encontraron resultados</h3>
                    <p>No hay materiales que coincidan con "{debouncedQuery}"</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="results-grid">
                      {data.map((item) => (
                        <motion.div variants={itemVariants} key={item._id} className="material-card">
                          <div className="card-header">
                            <h3 className="card-title">{item["NOMBRE ARTÍCULO"]}</h3>
                            <span className="card-badge">Grupo {item.GRUPO}</span>
                          </div>
                          
                          <div className="card-info">
                            <div className="info-row">
                              <span className="info-label">Unidad de Medida</span>
                              <span className="info-value">{item["UNIDAD DE MEDIDA"]}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Fecha</span>
                              <span className="info-value">{item.MES} {item.AÑO}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Índice</span>
                              <span className="index-value">{item.ÍNDICE}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalRecords > 0 && (
                      <div className="pagination">
                        <button 
                          className="page-btn" 
                          onClick={handlePrevPage} 
                          disabled={offset === 0 || loading}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="page-info">
                          {loading ? (
                            <Loader2 size={16} className="spinner" />
                          ) : (
                            `Mostrando ${offset + 1} - ${Math.min(offset + LIMIT, totalRecords)} de ${totalRecords}`
                          )}
                        </span>
                        <button 
                          className="page-btn" 
                          onClick={handleNextPage} 
                          disabled={offset + LIMIT >= totalRecords || loading}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div
              key="info-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InfoTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-grid">
          <div className="footer-col footer-col-brand">
            <img src="/imagen/Umg_logotipo.png" alt="Logo UMG" className="footer-logo" />
            <p className="footer-text">
              <strong>Universidad Mariano Gálvez de Guatemala</strong><br />
              Sede Chiquimulilla, Santa Rosa<br />
              Facultad de Ingeniería en Sistemas
            </p>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Tarea</p>
            <p className="footer-text">
              Administración de TI — 9no Semestre<br />
              Consumo de servicio web <strong>REST</strong><br />
              API INE — {todayStr()}
            </p>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Integrantes</p>
            <p className="footer-text footer-text-sm">
              Marvin Alexander Vásquez López — 1790-22-12802<br />
              Teddy Leonardo Hernández Pérez — 1790-22-2563<br />
              Wilson Eduardo Hernández López — 1790-22-7315<br />
              Guillermo José Gómez Aguilera — 1790-22-16429
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
