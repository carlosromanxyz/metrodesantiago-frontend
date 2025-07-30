export default function ServicioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Servicio</h1>
      <p className="text-muted-foreground mb-8">
        Información sobre el estado del servicio, interrupciones, horarios y atención al cliente.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <h2 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">Estado del Servicio</h2>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-700 dark:text-green-300">Operativo Normal</span>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">Todas las líneas funcionando con normalidad</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Horarios</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Lunes a Viernes:</span>
              <span className="font-medium">6:00 - 23:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sábados:</span>
              <span className="font-medium">6:30 - 23:00</span>
            </div>
            <div className="flex justify-between">
              <span>Domingos:</span>
              <span className="font-medium">8:00 - 22:30</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Atención al Cliente</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Teléfono:</span>
              <div>600 400 7000</div>
            </div>
            <div>
              <span className="font-medium">Horario:</span>
              <div>Lun-Vie 7:00-22:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}