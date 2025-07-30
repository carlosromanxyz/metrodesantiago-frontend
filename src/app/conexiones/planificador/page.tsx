export default function PlanificadorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Planificador de Viajes</h1>
      <p className="text-muted-foreground mb-8">
        Planifica tu viaje en el Metro de Santiago. Encuentra la ruta más rápida y eficiente para llegar a tu destino.
      </p>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Planifica tu viaje</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Desde</label>
              <input 
                type="text" 
                placeholder="Estación de origen"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Hasta</label>
              <input 
                type="text" 
                placeholder="Estación de destino"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Buscar Ruta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}