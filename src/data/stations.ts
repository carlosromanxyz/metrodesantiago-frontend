export interface Station {
  id: string;
  name: string;
  line: string;
  lineNumber: number;
  lineColor: string;
  isTransfer?: boolean;
  transferLines?: number[];
}

export interface MetroLine {
  number: number;
  name: string;
  color: string;
  colorHex: string;
  stations: string[];
}

// Metro Lines Configuration
export const metroLines: MetroLine[] = [
  {
    number: 1,
    name: "Línea 1",
    color: "Roja",
    colorHex: "#E10E0E",
    stations: [
      "San Pablo", "Neptuno", "Pajaritos", "Las Rejas", "Ecuador", 
      "San Alberto Hurtado", "Universidad de Santiago", "Estación Central", 
      "Unión Latinoamericana", "República", "Los Héroes", "La Moneda", 
      "Universidad de Chile", "Santa Lucía", "Universidad Católica", 
      "Baquedano", "Salvador", "Manuel Montt", "Pedro de Valdivia", 
      "Los Leones", "Tobalaba", "El Golf", "Alcántara", "Escuela Militar", 
      "Manquehue", "Hernando de Magallanes", "Los Dominicos"
    ]
  },
  {
    number: 2,
    name: "Línea 2",
    color: "Amarilla",
    colorHex: "#FFD100",
    stations: [
      "Vespucio Norte", "Zapadores", "Dorsal", "Einstein", "Cementerios", 
      "Cerro Blanco", "Patronato", "Puente Cal y Canto", "Santa Ana", 
      "Los Héroes", "Toesca", "Parque O'Higgins", "Rondizzoni", "Franklin", 
      "El Llano", "San Miguel", "Lo Vial", "Departamental", "Ciudad del Niño", 
      "Lo Ovalle", "El Parrón", "La Cisterna", "El Bosque", "Observatorio", 
      "Copa Lo Martínez", "Hospital El Pino"
    ]
  },
  {
    number: 3,
    name: "Línea 3",
    color: "Verde",
    colorHex: "#007F00",
    stations: [
      "Plaza Quilicura", "Lo Cruzat", "Ferrocarril", "Los Libertadores", 
      "Cardenal Caro", "Vivaceta", "Conchalí", "Plaza Chacabuco", "Hospitales", 
      "Puente Cal y Canto", "Plaza de Armas", "Universidad de Chile", 
      "Parque Almagro", "Matta", "Irarrázaval", "Monseñor Eyzaguirre", 
      "Ñuñoa", "Chile España", "Villa Frei", "Plaza Egaña", 
      "Fernando Castillo Velasco"
    ]
  },
  {
    number: 4,
    name: "Línea 4",
    color: "Azul",
    colorHex: "#0066CC",
    stations: [
      "Tobalaba", "Cristóbal Colón", "Francisco Bilbao", "Príncipe de Gales", 
      "Simón Bolívar", "Plaza Egaña", "Los Orientales", "Grecia", 
      "Los Presidentes", "Quilín", "Las Torres", "Macul", "Vicuña Mackenna", 
      "Vicente Valdés", "Rojas Magallanes", "Trinidad", "San José de la Estrella", 
      "Los Quillayes", "Elisa Correa", "Hospital Sótero del Río", "Protectora de la Infancia", "Las Mercedes", "Plaza de Puente Alto"
    ]
  },
  {
    number: 41,
    name: "Línea 4A",
    color: "Celeste",
    colorHex: "#00A4E4",
    stations: [
      "La Cisterna", "San Ramón", "Santa Rosa", "La Granja", "Santa Julia", "Vicuña Mackenna"
    ]
  },
  {
    number: 5,
    name: "Línea 5",
    color: "Verde Claro",
    colorHex: "#00B04F",
    stations: [
      "Plaza de Maipú", "Santiago Bueras", "Del Sol", "Monte Tabor", 
      "Las Parcelas", "Laguna Sur", "Barrancas", "Pudahuel", "San Pablo", 
      "Lo Prado", "Blanqueado", "Gruta de Lourdes", "Quinta Normal", 
      "Cumming", "Santa Ana", "Plaza de Armas", "Bellas Artes", "Baquedano", 
      "Parque Bustamante", "Santa Isabel", "Irarrázaval", "Ñuble", 
      "Rodrigo de Araya", "Carlos Valdovinos", "Camino Agrícola", 
      "San Joaquín", "Pedrero", "Mirador", "Bellavista de La Florida", "Vicente Valdés"
    ]
  },
  {
    number: 6,
    name: "Línea 6",
    color: "Morada",
    colorHex: "#8B1FA9",
    stations: [
      "Cerrillos", "Lo Valledor", "Presidente Pedro Aguirre Cerda", 
      "Franklin", "Bio Bio", "Ñuble", "Estadio Nacional", "Ñuñoa", 
      "Inés de Suárez", "Los Leones"
    ]
  }
];

// Generate complete stations list with metadata
export const stations: Station[] = metroLines.flatMap((line) =>
  line.stations.map((stationName, index) => {
    const station: Station = {
      id: `${line.number}-${index + 1}`,
      name: stationName,
      line: line.name,
      lineNumber: line.number,
      lineColor: line.color,
    };

    // Identify transfer stations (stations that appear in multiple lines)
    const transferLines = metroLines
      .filter((otherLine) => 
        otherLine.number !== line.number && 
        otherLine.stations.includes(stationName)
      )
      .map((transferLine) => transferLine.number);

    if (transferLines.length > 0) {
      station.isTransfer = true;
      station.transferLines = [line.number, ...transferLines];
    }

    return station;
  })
);

// Helper functions
export const getStationsByLine = (lineNumber: number): Station[] => {
  return stations.filter((station) => station.lineNumber === lineNumber);
};

export const getTransferStations = (): Station[] => {
  return stations.filter((station) => station.isTransfer);
};

export const searchStations = (query: string): Station[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];
  
  return stations.filter((station) =>
    station.name.toLowerCase().includes(searchTerm)
  );
};

export const getStationById = (id: string): Station | undefined => {
  return stations.find((station) => station.id === id);
};

export const getStationByName = (name: string): Station | undefined => {
  return stations.find((station) => 
    station.name.toLowerCase() === name.toLowerCase()
  );
};

// All station names for quick access
export const allStationNames = stations.map((station) => station.name);

// Unique station names (removing duplicates from transfer stations)
export const uniqueStationNames = Array.from(
  new Set(stations.map((station) => station.name))
).sort();

export default stations;