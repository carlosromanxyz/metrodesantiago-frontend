export default function ConexionesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Conexiones</h1>
      <p className="text-muted-foreground mb-8">
        Planifica tu viaje, consulta el mapa de la red y encuentra información sobre estaciones y líneas del Metro de Santiago.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Planificador de Viajes</h2>
          <p className="text-muted-foreground">Encuentra la mejor ruta para tu destino.</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Mapa de Red</h2>
          <p className="text-muted-foreground">Visualiza toda la red del Metro de Santiago.</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Estaciones</h2>
          <p className="text-muted-foreground">Información detallada de todas las estaciones.</p>
        </div>
      </div>
    </div>
  );
}