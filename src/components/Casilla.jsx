function Casilla({ letra, estado = '', activa, onCambio, onKeyDown }) {
  return (
    <input
      className={`casilla ${estado}`}
      value={letra}
      maxLength={1}
      disabled={!activa}
      onChange={onCambio}
      onKeyDown={onKeyDown}
    />
  )
}

export default Casilla
