import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [mostrarNuevos, setMostrarNuevos] = useState(false);
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false); // Estado para el botón de subir

  const palabrasExcluir = ['dux', 'noel', 'ducales'];

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const response = await fetch('/productos.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar el catálogo:', error);
      }
    };

    cargarCatalogo();

    // Detectar el scroll para mostrar el botón de subir
    const manejarScroll = () => {
      setMostrarBotonSubir(window.scrollY > 300);
    };

    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  const categorias = [...new Set(productos.map(producto => producto['Categoria']))];

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = Object.values(producto).some((valor) => {
      const valorStr = valor.toString().toLowerCase();
      return (
        valorStr.includes(busqueda.toLowerCase()) &&
        palabrasExcluir.every((palabra) => !new RegExp(`\\b${palabra}\\b`, 'i').test(valorStr))
      );
    });

    const coincideCategoria = categoriaSeleccionada ? producto['Categoria'] === categoriaSeleccionada : true;
    const esNuevo = mostrarNuevos ? producto['Estado'] === 'New' : true;

    return coincideBusqueda && coincideCategoria && esNuevo;
  });

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setModalAbierto(false);
  };

  const resetCategoria = () => {
    setCategoriaSeleccionada('');
  };

  const subirArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="catalogo-container">
      <div className="beta-sello">
        <span className="beta-v1">BETA V1</span>
        <span className="desarrollo">Inventory updated 2/28</span>
      </div>

      <div className="categoria-filtro-wrapper">
        <button onClick={resetCategoria} className="categoria-home-btn">
          <img src="/images/casita-icon.png" alt="Volver a todos" className="casita-icon" />
        </button>

        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="categoria-filtro"
        >
          <option value="">Categorías</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>

        <button
          onClick={() => setMostrarNuevos(!mostrarNuevos)}
          className="producto-nuevo-btn"
        >
          {mostrarNuevos ? 'Todos' : 'New Items!'}
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador"
      />

      <div className="productos-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto, index) => (
            <div className="producto-card" key={index} onClick={() => abrirModal(producto)}>
              <div className="numero-inventario">{producto['Disponible']}</div>
              <div className="sku">{producto['Sku']}</div>
              <img src={`/images/${producto['Imagen']}`} alt={producto['Producto']} className="producto-img" />
              <h3>{producto['Nombre']}</h3>
              <p className="size">{producto['Size']}</p>
              <p>Units: {producto['Unidades']}</p>
            </div>
          ))
        ) : (
          <p>No se han encontrado productos.</p>
        )}
      </div>

      {modalAbierto && (
        <div className="modal" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{productoSeleccionado['Nombre']}</h2>
            <img src={`/images/${productoSeleccionado['Imagen']}`} alt={productoSeleccionado['Producto']} className="modal-img" />
            <p><strong>SKU:</strong> {productoSeleccionado['Sku']}</p>
            <p><strong>Tamaño:</strong> {productoSeleccionado['Size']}</p>
            <p><strong>Unidades:</strong> {productoSeleccionado['Unidades']}</p>
            <p><strong>Disponible:</strong> {productoSeleccionado['Disponible']}</p>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Botón flotante para subir arriba */}
      {mostrarBotonSubir && (
        <button onClick={subirArriba} className="btn-subir">
          ⬆
        </button>
      )}
    </div>
  );
};

export default Catalogo;
