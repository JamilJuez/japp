import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './Catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Producto seleccionado
  const [modalAbierto, setModalAbierto] = useState(false); // Controla si el modal está abierto o cerrado

  // Lista de palabras exactas a excluir
  const palabrasExcluir = ['dux', 'noel', 'ducales']; // Agrega aquí las palabras exactas que quieras excluir

  useEffect(() => {
    const cargarCatalogo = async () => {
      const response = await fetch('/productos.xlsx'); // Archivo en la carpeta public
      const arrayBuffer = await response.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });

      // Obtener la primera hoja del archivo
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws); // Convertir a formato JSON

      setProductos(data); // Guardar los productos en el estado
    };

    cargarCatalogo(); // Ejecutar la función cuando el componente se monta
  }, []);

  // Filtrar productos según la búsqueda y excluir aquellos que contienen alguna palabra exacta a excluir
  const productosFiltrados = productos.filter((producto) =>
    Object.values(producto).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda.toLowerCase()) &&
      !palabrasExcluir.some(palabra =>
        new RegExp(`\\b${palabra}\\b`, 'i').test(valor) // Usa \\b para delimitar las palabras exactas
      )
    )
  );

  // Función para abrir el modal
  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setModalAbierto(false);
  };

  return (
    <div className="catalogo-container">
      {/* Sello Beta V1 */}
      <div className="beta-sello">
  <span className="beta-v1">BETA V1</span>
  <span className="desarrollo">App en desarrollo temprana</span>
</div>
    

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)} // Actualizar estado de búsqueda
        className="buscador"
      />

      <div className="productos-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto, index) => (
            <div
              className="producto-card"
              key={index}
              onClick={() => abrirModal(producto)} // Abre el modal al hacer clic
            >
              {/* Cuadro azul con el número de inventario en la esquina inferior derecha */}
              <div className="numero-inventario">
                {producto['Disponible']} {/* Muestra el número de inventario */}
              </div>

              {/* Cuadro gris con el SKU en la esquina superior izquierda */}
              <div className="sku">
                {producto['Sku']} {/* Muestra el SKU */}
              </div>

              <img 
                src={`/images/${producto['Imagen']}`} 
                alt={producto['Producto']} 
                className="producto-img"
              />
              <h3>{producto['Nombre']}</h3>

              {/* El tamaño debajo del nombre */}
              <p className="size">{producto['Size']}</p>
              <p>Units: {producto['Unidades']}</p>
            </div>
          ))
        ) : (
          <p>No se han encontrado productos.</p> // Mensaje si no se encuentran productos
        )}
      </div>

      {/* Modal para mostrar el producto seleccionado */}
      {modalAbierto && (
        <div className="modal" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{productoSeleccionado['Nombre']}</h2>
            <img 
              src={`/images/${productoSeleccionado['Imagen']}`} 
              alt={productoSeleccionado['Producto']} 
              className="modal-img"
            />
            <p><strong>SKU:</strong> {productoSeleccionado['Sku']}</p>
            <p><strong>Tamaño:</strong> {productoSeleccionado['Size']}</p>
            <p><strong>Unidades:</strong> {productoSeleccionado['Unidades']}</p>
            <p><strong>Disponible:</strong> {productoSeleccionado['Disponible']}</p>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
