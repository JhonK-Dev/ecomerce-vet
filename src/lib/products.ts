// Gestión de productos para el módulo E-commerce
import { Product, ProductCategory, ProductFilters, PaginationParams, ApiResponse } from '@/types';

// Base de datos simulada de productos
const products: Product[] = [
  // Alimentos
  {
    id: '1',
    name: 'Royal Canin Adult Medium',
    description: 'Alimento completo y balanceado para perros adultos de raza mediana (11-25kg). Fórmula especialmente diseñada para mantener la salud digestiva y el peso ideal.',
    price: 89.90,
    discountPrice: 79.90,
    category: ProductCategory.FOOD,
    brand: 'Royal Canin',
    images: ['/products/royal-canin-medium.jpg', '/products/royal-canin-medium-2.jpg'],
    stock: 25,
    isActive: true,
    tags: ['perros', 'adultos', 'raza mediana', 'premium'],
    specifications: {
      'Peso': '15kg',
      'Edad': 'Adultos (1-7 años)',
      'Raza': 'Mediana (11-25kg)',
      'Proteína': '23%',
      'Grasa': '14%'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Hill\'s Science Diet Kitten',
    description: 'Nutrición científicamente formulada para gatitos en crecimiento. Con DHA para el desarrollo cerebral y visual, y antioxidantes para un sistema inmune fuerte.',
    price: 65.50,
    category: ProductCategory.FOOD,
    brand: 'Hill\'s',
    images: ['/products/hills-kitten.jpg'],
    stock: 18,
    isActive: true,
    tags: ['gatos', 'gatitos', 'crecimiento', 'DHA'],
    specifications: {
      'Peso': '7.5kg',
      'Edad': 'Gatitos (hasta 1 año)',
      'Proteína': '37%',
      'Grasa': '21%',
      'DHA': 'Incluido'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Pro Plan Sensitive Skin',
    description: 'Alimento especializado para perros con piel sensible. Con salmón como fuente principal de proteína y ácidos grasos omega para una piel saludable.',
    price: 95.00,
    discountPrice: 85.50,
    category: ProductCategory.FOOD,
    brand: 'Pro Plan',
    images: ['/products/proplan-sensitive.jpg'],
    stock: 12,
    isActive: true,
    tags: ['perros', 'piel sensible', 'salmón', 'omega'],
    specifications: {
      'Peso': '12kg',
      'Proteína principal': 'Salmón',
      'Omega 3': 'Alto contenido',
      'Sin colorantes': 'Sí'
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22')
  },

  // Medicamentos
  {
    id: '4',
    name: 'Bravecto Antipulgas y Garrapatas',
    description: 'Protección de larga duración contra pulgas y garrapatas. Una sola dosis protege por 12 semanas. Para perros de 10-20kg.',
    price: 145.00,
    category: ProductCategory.MEDICINE,
    brand: 'MSD',
    images: ['/products/bravecto.jpg'],
    stock: 8,
    isActive: true,
    tags: ['antipulgas', 'garrapatas', 'protección', '12 semanas'],
    specifications: {
      'Peso del perro': '10-20kg',
      'Duración': '12 semanas',
      'Principio activo': 'Fluralaner',
      'Presentación': 'Tableta masticable'
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '5',
    name: 'Nexgard Spectra',
    description: 'Protección integral contra pulgas, garrapatas y parásitos internos. Tableta masticable sabor carne para perros de 7.5-15kg.',
    price: 89.90,
    category: ProductCategory.MEDICINE,
    brand: 'Boehringer Ingelheim',
    images: ['/products/nexgard.jpg'],
    stock: 15,
    isActive: true,
    tags: ['antipulgas', 'desparasitante', 'integral', 'masticable'],
    specifications: {
      'Peso del perro': '7.5-15kg',
      'Duración': '1 mes',
      'Sabor': 'Carne',
      'Protección': 'Pulgas, garrapatas, parásitos internos'
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-21')
  },

  // Accesorios
  {
    id: '6',
    name: 'Collar Ajustable Premium',
    description: 'Collar de nylon resistente con hebilla de liberación rápida. Disponible en múltiples colores y tamaños. Ideal para uso diario.',
    price: 25.90,
    discountPrice: 19.90,
    category: ProductCategory.ACCESSORIES,
    brand: 'PetSafe',
    images: ['/products/collar-premium.jpg'],
    stock: 35,
    isActive: true,
    tags: ['collar', 'ajustable', 'nylon', 'resistente'],
    specifications: {
      'Material': 'Nylon resistente',
      'Talla': 'M (30-45cm)',
      'Ancho': '2cm',
      'Peso máximo': '25kg'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '7',
    name: 'Correa Retráctil Flexi',
    description: 'Correa retráctil de 5 metros con sistema de frenado suave. Mango ergonómico antideslizante para mayor comodidad y control.',
    price: 75.00,
    category: ProductCategory.ACCESSORIES,
    brand: 'Flexi',
    images: ['/products/correa-flexi.jpg'],
    stock: 20,
    isActive: true,
    tags: ['correa', 'retráctil', 'ergonómica', '5 metros'],
    specifications: {
      'Longitud': '5 metros',
      'Peso máximo': '25kg',
      'Material': 'Plástico ABS',
      'Sistema': 'Frenado suave'
    },
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-23')
  },

  // Higiene
  {
    id: '8',
    name: 'Shampoo Hipoalergénico',
    description: 'Shampoo suave formulado especialmente para mascotas con piel sensible. Sin parabenos, sulfatos ni colorantes artificiales.',
    price: 32.50,
    category: ProductCategory.HYGIENE,
    brand: 'Virbac',
    images: ['/products/shampoo-hipoalergenico.jpg'],
    stock: 28,
    isActive: true,
    tags: ['shampoo', 'hipoalergénico', 'piel sensible', 'natural'],
    specifications: {
      'Volumen': '250ml',
      'pH': 'Balanceado',
      'Sin parabenos': 'Sí',
      'Sin sulfatos': 'Sí'
    },
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-24')
  },

  // Juguetes
  {
    id: '9',
    name: 'Pelota Kong Classic',
    description: 'Juguete resistente de caucho natural. Perfecto para rellenar con premios. Ayuda a limpiar dientes y encías mientras juega.',
    price: 45.00,
    category: ProductCategory.TOYS,
    brand: 'Kong',
    images: ['/products/kong-classic.jpg'],
    stock: 22,
    isActive: true,
    tags: ['juguete', 'resistente', 'caucho', 'dental'],
    specifications: {
      'Material': 'Caucho natural',
      'Talla': 'M',
      'Resistencia': 'Alta',
      'Función': 'Dental y entretenimiento'
    },
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-26')
  },

  // Suplementos
  {
    id: '10',
    name: 'Omega 3 para Mascotas',
    description: 'Suplemento de ácidos grasos omega 3 derivado de aceite de pescado. Mejora la salud de la piel, pelaje y articulaciones.',
    price: 68.90,
    category: ProductCategory.SUPPLEMENTS,
    brand: 'Nutri-Vet',
    images: ['/products/omega3.jpg'],
    stock: 16,
    isActive: true,
    tags: ['suplemento', 'omega 3', 'piel', 'articulaciones'],
    specifications: {
      'Contenido': '60 cápsulas',
      'Dosis': '1 cápsula por día',
      'Origen': 'Aceite de pescado',
      'EPA/DHA': 'Alto contenido'
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-27')
  }
];

export class ProductService {
  // Obtener todos los productos con filtros y paginación
  static async getProducts(
    filters: ProductFilters = {},
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<ApiResponse<Product[]>> {
    let filteredProducts = [...products];

    // Aplicar filtros
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => 
        (p.discountPrice || p.price) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => 
        (p.discountPrice || p.price) <= filters.maxPrice!
      );
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Aplicar ordenamiento
    if (pagination.sortBy) {
      filteredProducts.sort((a, b) => {
  let aValue: string | number | Date;
  let bValue: string | number | Date;
        
        switch (pagination.sortBy) {
          case 'price':
            aValue = a.discountPrice || a.price;
            bValue = b.discountPrice || b.price;
            break;
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'createdAt':
            aValue = a.createdAt;
            bValue = b.createdAt;
            break;
          default:
            return 0;
        }

        if (pagination.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Aplicar paginación
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      message: 'Productos obtenidos exitosamente',
      success: true,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages
      }
    };
  }

  // Obtener producto por ID
  static async getProductById(id: string): Promise<Product | null> {
    return products.find(p => p.id === id) || null;
  }

  // Obtener productos relacionados
  static async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    const product = await this.getProductById(productId);
    if (!product) return [];

    return products
      .filter(p => 
        p.id !== productId && 
        (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, limit);
  }

  // Obtener productos destacados
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return products
      .filter(p => p.discountPrice && p.isActive)
      .slice(0, limit);
  }

  // Obtener productos más vendidos (simulado)
  static async getBestSellingProducts(limit: number = 6): Promise<Product[]> {
    return products
      .filter(p => p.isActive)
      .sort(() => Math.random() - 0.5) // Simulación aleatoria
      .slice(0, limit);
  }

  // Obtener categorías disponibles
  static getCategories(): { value: ProductCategory; label: string; count: number }[] {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<ProductCategory, number>);

    const categoryLabels: Record<ProductCategory, string> = {
      [ProductCategory.FOOD]: 'Alimentos',
      [ProductCategory.MEDICINE]: 'Medicamentos',
      [ProductCategory.ACCESSORIES]: 'Accesorios',
      [ProductCategory.HYGIENE]: 'Higiene',
      [ProductCategory.TOYS]: 'Juguetes',
      [ProductCategory.SUPPLEMENTS]: 'Suplementos'
    };

    return Object.entries(categoryCounts).map(([category, count]) => ({
      value: category as ProductCategory,
      label: categoryLabels[category as ProductCategory],
      count
    }));
  }

  // Obtener marcas disponibles
  static getBrands(): { value: string; label: string; count: number }[] {
    const brandCounts = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(brandCounts).map(([brand, count]) => ({
      value: brand,
      label: brand,
      count
    }));
  }

  // Obtener rango de precios
  static getPriceRange(): { min: number; max: number } {
    const prices = products.map(p => p.discountPrice || p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Buscar productos
  static async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return products
      .filter(p =>
        p.isActive &&
        (p.name.toLowerCase().includes(searchTerm) ||
         p.description.toLowerCase().includes(searchTerm) ||
         p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
         p.brand.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  }
}