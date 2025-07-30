# Design Tokens - Metro de Santiago

Esta documentación describe el sistema de design tokens implementado para el proyecto Metro de Santiago, incluyendo colores corporativos, colores de líneas, tipografía y espaciado optimizado para móvil.

## Archivos Creados

### 1. `tailwind.config.ts`
Configuración principal de Tailwind CSS con:
- Colores corporativos de Metro
- Colores específicos por línea de metro
- Breakpoints personalizados (incluyendo `xs: 475px`)
- Espaciado personalizado para Metro
- Tipografía optimizada para móvil
- Animaciones específicas de Metro

### 2. `src/lib/design-tokens.ts`
Tokens centralizados con:
- Definiciones de todos los colores
- Funciones de utilidad para obtener clases de Tailwind
- Escalas de tipografía y espaciado
- Información de líneas de metro
- Variables CSS personalizadas

### 3. `src/app/globals.css` (actualizado)
CSS global actualizado con:
- Variables CSS para todos los colores
- Soporte para tema claro/oscuro
- Colores de líneas de metro como custom properties

## Colores Disponibles

### Colores Corporativos Metro
```css
--color-metro-red: #ce0e2d
--color-metro-black: #000000
--color-metro-orange: #e66300
--color-metro-burgundy: #813030
--color-metro-gray: #888a8c
--color-metro-turquoise: #00aca7
```

**Clases de Tailwind:**
- `bg-metro-red`, `text-metro-red`, `border-metro-red`
- `bg-metro-black`, `text-metro-black`, `border-metro-black`
- `bg-metro-orange`, `text-metro-orange`, `border-metro-orange`
- `bg-metro-burgundy`, `text-metro-burgundy`, `border-metro-burgundy`
- `bg-metro-gray`, `text-metro-gray`, `border-metro-gray`
- `bg-metro-turquoise`, `text-metro-turquoise`, `border-metro-turquoise`

### Colores por Línea de Metro
```css
--color-metro-line-1: #e10e0e   /* Línea 1 - Roja */
--color-metro-line-2: #ffd100   /* Línea 2 - Amarilla */
--color-metro-line-3: #8b4513   /* Línea 3 - Café */
--color-metro-line-4: #0066cc   /* Línea 4 - Azul */
--color-metro-line-4a: #00a4e4  /* Línea 4A - Celeste */
--color-metro-line-5: #00b04f   /* Línea 5 - Verde Claro */
--color-metro-line-6: #8b1fa9   /* Línea 6 - Morada */
```

**Clases de Tailwind:**
- `bg-metro-line-1`, `text-metro-line-1`, `border-metro-line-1`
- `bg-metro-line-2`, `text-metro-line-2`, `border-metro-line-2`
- `bg-metro-line-3`, `text-metro-line-3`, `border-metro-line-3`
- `bg-metro-line-4`, `text-metro-line-4`, `border-metro-line-4`
- `bg-metro-line-4a`, `text-metro-line-4a`, `border-metro-line-4a`
- `bg-metro-line-5`, `text-metro-line-5`, `border-metro-line-5`
- `bg-metro-line-6`, `text-metro-line-6`, `border-metro-line-6`

## Tipografía

### Escala de Tipografía Optimizada para Móvil
- `text-metro-xs`: 11px (0.6875rem) - line-height: 1rem
- `text-metro-sm`: 13px (0.8125rem) - line-height: 1.125rem
- `text-metro-base`: 15px (0.9375rem) - line-height: 1.375rem
- `text-metro-lg`: 17px (1.0625rem) - line-height: 1.5rem
- `text-metro-xl`: 19px (1.1875rem) - line-height: 1.625rem

## Espaciado

### Escala de Espaciado Metro
- `metro-xs`: 4px (0.25rem)
- `metro-sm`: 8px (0.5rem)
- `metro-md`: 12px (0.75rem)
- `metro-lg`: 16px (1rem)
- `metro-xl`: 24px (1.5rem)
- `metro-2xl`: 32px (2rem)
- `metro-3xl`: 40px (2.5rem)
- `metro-4xl`: 48px (3rem)
- `metro-5xl`: 64px (4rem)
- `metro-6xl`: 80px (5rem)

**Uso:**
```jsx
<div className="p-metro-md m-metro-lg gap-metro-sm">
  Contenido con espaciado Metro
</div>
```

## Breakpoints

Breakpoints personalizados incluyendo soporte mejorado para móviles:
- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Animaciones

### Animaciones Específicas de Metro
- `animate-metro-fade-in`: Entrada suave con desplazamiento
- `animate-metro-slide-in`: Deslizamiento desde la izquierda
- `animate-metro-pulse`: Pulso suave para elementos activos
- `animate-marquee-up`: Animación marquesina vertical

## Sombras

### Sombras Metro
- `shadow-metro-sm`: Sombra sutil
- `shadow-metro-md`: Sombra mediana
- `shadow-metro-lg`: Sombra prominente
- `shadow-metro-xl`: Sombra dramática

## Funciones de Utilidad

### En `src/lib/design-tokens.ts`

```typescript
import { 
  getMetroLineTailwindClass, 
  getMetroLineTextClass, 
  getMetroLineBorderClass 
} from '@/lib/design-tokens';

// Obtener clase de fondo para una línea
const bgClass = getMetroLineTailwindClass('L1'); // returns 'bg-metro-line-1'

// Obtener clase de texto para una línea
const textClass = getMetroLineTextClass('L2'); // returns 'text-metro-line-2'

// Obtener clase de borde para una línea
const borderClass = getMetroLineBorderClass('L3'); // returns 'border-metro-line-3'
```

## Ejemplos de Uso

### Indicador de Línea
```jsx
import { getMetroLineTailwindClass } from '@/lib/design-tokens';

const LineIndicator = ({ lineNumber }) => {
  const bgClass = getMetroLineTailwindClass(lineNumber);
  
  return (
    <div className={`${bgClass} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold`}>
      {lineNumber}
    </div>
  );
};
```

### Botón Metro
```jsx
const MetroButton = ({ children, onClick }) => {
  return (
    <button 
      className="bg-metro-red hover:bg-metro-red/90 text-white px-metro-lg py-metro-md rounded-metro-md transition-colors duration-metro"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Layout Responsivo
```jsx
const ResponsiveGrid = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-metro-md p-metro-lg">
      <div className="bg-metro-line-1 text-white p-metro-md rounded-metro-sm">
        Línea 1
      </div>
      <div className="bg-metro-line-2 text-white p-metro-md rounded-metro-sm">
        Línea 2
      </div>
      {/* más elementos */}
    </div>
  );
};
```

## Compatibilidad

- ✅ Tema claro/oscuro mantenido
- ✅ Componentes existentes no afectados
- ✅ Colores corporativos preservados
- ✅ Optimización móvil mejorada
- ✅ Accesibilidad mantenida

## Notas de Implementación

1. **Compatibilidad hacia atrás**: Todos los componentes existentes que usan `text-metro-red`, `bg-metro-red`, etc. siguen funcionando sin cambios.

2. **Optimización móvil**: Los nuevos breakpoints y tipografía están optimizados para dispositivos móviles, especialmente el breakpoint `xs: 475px`.

3. **Flexibilidad**: Las funciones de utilidad permiten mapeo dinámico de números de línea a clases de Tailwind.

4. **Mantenimiento**: Todos los tokens están centralizados en archivos específicos para facilitar futuras actualizaciones.

5. **Performance**: Las variables CSS permiten cambios de tema eficientes sin re-compilación.