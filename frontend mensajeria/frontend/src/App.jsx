import { useState, useEffect } from 'react';

function App() {
  const [id, setId] = useState('');
  const [cliente, setCliente] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [estadoCola, setEstadoCola] = useState({ principal: 0, dlq: 0, enVuelo: 0 });

  const API_BASE = 'http://localhost:8080';

  // Función para consultar el estado de SQS
  const obtenerEstado = async () => {
    try {
      const res = await fetch(`${API_BASE}/estado`);
      if (res.ok) {
        const data = await res.json();
        setEstadoCola(data);
      }
    } catch (err) {
      console.error('Error al obtener estado:', err);
    }
  };

  useEffect(() => {
    obtenerEstado();
    const interval = setInterval(obtenerEstado, 3000); // Actualiza cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  // Función para enviar orden (Asíncrona o Síncrona)
  const enviarOrden = async (esSync = false) => {
    if (!id || !cliente || !monto) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setMensaje('');

    const endpoint = esSync ? '/ordenes/sync' : '/ordenes';
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, cliente, monto: Number(monto) })
      });

      const texto = await res.text();
      setMensaje(`Respuesta: ${texto}`);
      obtenerEstado();
    } catch (err) {
      setMensaje(`Error en la petición: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📦 Gestión de Órdenes (AWS SQS / SNS)</h2>

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="ID de la Orden (ej. 101)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <input
          type="number"
          placeholder="Monto ($)"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => enviarOrden(false)}
            disabled={loading}
            style={{ flex: 1, padding: '0.7rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Enviando...' : 'Enviar Asíncrono (SQS)'}
          </button>
          <button
            onClick={() => enviarOrden(true)}
            disabled={loading}
            style={{ flex: 1, padding: '0.7rem', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Enviando...' : 'Enviar Síncrono'}
          </button>
        </div>
      </div>

      {/* Mensaje de Respuesta */}
      {mensaje && (
        <div style={{ padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '4px', marginBottom: '1.5rem' }}>
          <strong>{mensaje}</strong>
        </div>
      )}

      {/* Panel de Estado SQS */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
        <h3>📊 Estado de las Colas SQS</h3>
        <p>🟢 <strong>Mensajes Principales:</strong> {estadoCola.principal}</p>
        <p>🟡 <strong>Mensajes en Vuelo:</strong> {estadoCola.enVuelo}</p>
        <p>🔴 <strong>Dead Letter Queue (DLQ):</strong> {estadoCola.dlq}</p>
        <button onClick={obtenerEstado} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
          🔄 Refrescar Estado
        </button>
      </div>
    </div>
  );
}

export default App;