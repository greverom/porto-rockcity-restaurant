import { Injectable } from '@angular/core';
import { Database, ref, set, update, remove, get, push } from '@angular/fire/database';
import { AlimentoModel } from '../../models/food';


@Injectable({
  providedIn: 'root',
})
export class AlimentosService {
  constructor(private db: Database) {}

  // Agregar un nuevo alimento
  async createAlimento(alimento: Omit<AlimentoModel, 'id'>): Promise<void> {
    const alimentosRef = ref(this.db, `alimentos/${alimento.categoria}`);
    const newAlimentoRef = push(alimentosRef);

    const alimentoData: AlimentoModel = {
      ...alimento,
      id: newAlimentoRef.key || '',
      fechaCreacion: alimento.fechaCreacion || new Date(),
      fechaActualizacion: alimento.fechaActualizacion || new Date(),
    };

    await set(newAlimentoRef, alimentoData);
  }

  // Obtener alimentos de una categoría específica
  async obtenerAlimentosPorCategoria(categoria: string, subcategoria?: string): Promise<AlimentoModel[]> {
  try {
    // Si hay subcategoría, buscar en esa ruta específica
    if (categoria === 'bebidas' && subcategoria) {
      const subcategoriaRef = ref(this.db, `alimentos/${categoria}/${subcategoria}`);
      const snapshot = await get(subcategoriaRef);
      if (!snapshot.exists()) {
        return [];
      }

      const alimentos = snapshot.val();
      return Object.keys(alimentos).map((id) => ({
        ...alimentos[id],
        id, 
      }));
    }

    const categoriaRef = ref(this.db, `alimentos/${categoria}`);
    const snapshot = await get(categoriaRef);
    if (!snapshot.exists()) {
      return [];
    }

    const alimentos = snapshot.val();
    if (categoria === 'bebidas') {
      return Object.keys(alimentos).flatMap((key) =>
        Object.keys(alimentos[key]).map((id) => ({
          ...alimentos[key][id],
          id,
        }))
      );
    } else {
      return Object.keys(alimentos).map((id) => ({
        ...alimentos[id],
        id,
      }));
    }
  } catch (error) {
    console.error('Error al obtener alimentos:', error);
    return [];
  }
}

  // Obtener todos los alimentos
  async obtenerAlimentos(): Promise<AlimentoModel[]> {
    const alimentosRef = ref(this.db, `alimentos`);
    const snapshot = await get(alimentosRef);

    if (!snapshot.exists()) {
      return [];
    }
    const alimentos = snapshot.val();
    const alimentosArray: AlimentoModel[] = [];

    for (const categoria in alimentos) {
      for (const id in alimentos[categoria]) {
        alimentosArray.push({ ...alimentos[categoria][id], id });
      }
    }
    return alimentosArray;
  }

  async buscarAlimentosPorNombre(query: string): Promise<AlimentoModel[]> {
    if (!query.trim()) {
      return []; 
    }
  
    const alimentosRef = ref(this.db, 'alimentos');
    const snapshot = await get(alimentosRef);
  
    if (!snapshot.exists()) {
      return []; 
    }
  
    const alimentos = snapshot.val();
    const resultados: AlimentoModel[] = [];
  
    const procesarNodo = (nodo: any): void => {
      if (typeof nodo === 'object' && nodo !== null) {
        Object.entries(nodo).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            const item = value as Record<string, any>;
  
            if (item['nombre'] && typeof item['nombre'] === 'string' && item['nombre'].toLowerCase().includes(query.toLowerCase())) {
              resultados.push(item as AlimentoModel); // Convertimos a `AlimentoModel`.
            } else {
              procesarNodo(item); // Llamada recursiva si no es un alimento.
            }
          }
        });
      }
    };
  
    procesarNodo(alimentos); // Inicia la búsqueda recursiva.
  
    return resultados;
  }


  // Editar un alimento
  async editarAlimento(alimento: AlimentoModel): Promise<void> {
    const alimentoRef = ref(this.db, `alimentos/${alimento.categoria}/${alimento.id}`);
    const alimentoData = {
      ...alimento,
      fechaActualizacion: new Date().toISOString(),
    };
    await update(alimentoRef, alimentoData);
  }

  // Eliminar un alimento
  async eliminarAlimento(categoria: string, id: string): Promise<void> {
    const alimentoRef = ref(this.db, `alimentos/${categoria}/${id}`);
    await remove(alimentoRef);
  }

  // Cambiar disponibilidad
  async cambiarDisponibilidad(categoria: string, id: string, disponible: boolean): Promise<void> {
    const alimentoRef = ref(this.db, `alimentos/${categoria}/${id}`);
    await update(alimentoRef, { activo: disponible });
  }
}