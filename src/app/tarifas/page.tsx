export default function TarifasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tarifas</h1>
      <p className="text-muted-foreground mb-8">
        Información sobre las tarifas del Metro de Santiago, tarjeta BIP! y descuentos disponibles.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tarifa General</h2>
          <div className="text-3xl font-bold text-green-600 mb-2">$800</div>
          <p className="text-muted-foreground">Tarifa estándar para adultos en horario normal</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tarifa Estudiante</h2>
          <div className="text-3xl font-bold text-blue-600 mb-2">$230</div>
          <p className="text-muted-foreground">Tarifa con descuento para estudiantes</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tercera Edad</h2>
          <div className="text-3xl font-bold text-purple-600 mb-2">$230</div>
          <p className="text-muted-foreground">Tarifa preferencial para adultos mayores</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tarjeta BIP!</h2>
          <div className="text-lg font-semibold text-orange-600 mb-2">Sistema de pago</div>
          <p className="text-muted-foreground">Tarjeta de pago sin contacto para el transporte público</p>
        </div>
      </div>
    </div>
  );
}