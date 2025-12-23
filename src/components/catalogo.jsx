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
  const [mostrarConPrecio, setMostrarConPrecio] = useState(false);
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);

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
    const tienePrecio = mostrarConPrecio ? producto['Precio'] && producto['Precio'] > 0 : true;

    return coincideBusqueda && coincideCategoria && esNuevo && tienePrecio;
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

  return (
    <div className="catalogo-container">
      <div className="franja-superior">
        <div className="beta-sello">
          <span className="beta-v1">BETA V1</span>
          <span className="desarrollo">Inventory updated 12/22</span>
        </div>

        <div className="categoria-filtro-wrapper">
          <button onClick={resetCategoria} className="categoria-home-btn">
            <img src="/images/casita-icon.webp" alt="Volver a todos" className="casita-icon" />
          </button>

          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="categoria-filtro"
          >
            <option value="">All</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          <button onClick={() => setMostrarConPrecio(!mostrarConPrecio)} className="price-list-btn">
            {mostrarConPrecio ? 'Catálogo Completo' : 'Price List 2/16'}
          </button>

          <button onClick={() => setMostrarNuevos(!mostrarNuevos)} className="producto-nuevo-btn">
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
      </div>

      {mostrarConPrecio && (
        <div className="precio-lista-container">
          <p className="precio-lista-texto">PRODUCTS ON PRICE LIST (FEB/16)</p>
          <p className="precio-lista-subtexto">Some prices might increase or decrease, verify price in portal</p>
        </div>
      )}

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
              {mostrarConPrecio && producto['Precio'] > 0 && <p><strong>Precio:</strong> ${producto['Precio']}</p>}
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
            {productoSeleccionado['Precio'] > 0 && <p><strong>Precio:</strong> ${productoSeleccionado['Precio']}</p>}
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}

      {mostrarBotonSubir && (
        <button className="btn-subir" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/images/flecha-arriba.webp" alt="Subir" className="icono-subir" />
        </button>
      )}
    </div>
  );
};

export default Catalogo;