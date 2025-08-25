// Servicio de gestión de historias clínicas digitales
import { 
  Pet, 
  MedicalRecord, 
  MedicalRecordType,
  MedicalAlert,
  AlertType,
  AlertPriority,
  PetSpecies,
  PetGender,
  MedicalRecordFilters,
  PetFilters,
  MedicalStats
} from '@/types/medical-records';

// Datos simulados - En producción usar base de datos real
const pets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    species: PetSpecies.DOG,
    breed: 'Golden Retriever',
    birthDate: new Date('2020-03-15'),
    gender: PetGender.NEUTERED_MALE,
    weight: 28.5,
    color: 'Dorado',
    microchipNumber: '982000123456789',
    ownerId: 'user_123', // ID de Clerk
    ownerName: 'Juan Pérez',
    ownerPhone: '+51 999 888 777',
    ownerEmail: 'juan.perez@email.com',
    ownerAddress: 'Av. Principal 123, San Isidro, Lima',
    emergencyContact: {
      name: 'María Pérez',
      phone: '+51 999 777 666',
      relationship: 'Esposa'
    },
    isActive: true,
    profileImage: '/pets/max-golden.jpg',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Luna',
    species: PetSpecies.CAT,
    breed: 'Persa',
    birthDate: new Date('2021-07-20'),
    gender: PetGender.SPAYED_FEMALE,
    weight: 4.2,
    color: 'Blanco',
    microchipNumber: '982000987654321',
    ownerId: 'user_456',
    ownerName: 'Ana García',
    ownerPhone: '+51 999 666 555',
    ownerEmail: 'ana.garcia@email.com',
    ownerAddress: 'Jr. Los Olivos 456, Miraflores, Lima',
    isActive: true,
    profileImage: '/pets/luna-persian.jpg',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date()
  }
];

const medicalRecords: MedicalRecord[] = [
  {
    id: '1',
    petId: '1',
    veterinarianId: 'vet_001',
    date: new Date('2024-01-15'),
    type: MedicalRecordType.CHECKUP,
    title: 'Chequeo Anual',
    description: 'Examen físico completo de rutina. Mascota en excelente estado general.',
    diagnosis: 'Mascota sana, sin hallazgos patológicos',
    treatment: 'Continuar con cuidados preventivos',
    medications: [
      {
        id: 'med_001',
        name: 'Multivitamínico',
        dosage: '1 tableta',
        frequency: 'Diario',
        duration: '30 días',
        instructions: 'Administrar con la comida',
        startDate: new Date('2024-01-15'),
        isActive: true,
        prescribedBy: 'vet_001'
      }
    ],
    vaccinations: [
      {
        id: 'vac_001',
        vaccine: 'Séxtuple Canina',
        brand: 'Nobivac',
        batchNumber: 'NB2024001',
        administeredDate: new Date('2024-01-15'),
        nextDueDate: new Date('2025-01-15'),
        veterinarianId: 'vet_001',
        location: 'Miembro posterior izquierdo',
        notes: 'Sin reacciones adversas'
      }
    ],
    allergies: [],
    surgeries: [],
    labResults: [],
    images: [],
    documents: [],
    vitalSigns: {
      heartRate: 80,
      respiratoryRate: 20,
      temperature: 38.5,
      weight: 28.5,
      bodyConditionScore: 5
    },
    weight: 28.5,
    temperature: 38.5,
    notes: 'Mascota muy sociable y cooperativa durante el examen.',
    followUpDate: new Date('2025-01-15'),
    isPrivate: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    petId: '2',
    veterinarianId: 'vet_002',
    date: new Date('2024-01-20'),
    type: MedicalRecordType.CONSULTATION,
    title: 'Consulta por Vómitos',
    description: 'Propietaria reporta episodios de vómito en las últimas 48 horas.',
    diagnosis: 'Gastritis leve, posiblemente por cambio de dieta',
    treatment: 'Dieta blanda y medicación sintomática',
    medications: [
      {
        id: 'med_002',
        name: 'Omeprazol',
        dosage: '10mg',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Administrar 30 minutos antes de las comidas',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-27'),
        isActive: false,
        prescribedBy: 'vet_002'
      }
    ],
    vaccinations: [],
    allergies: [],
    surgeries: [],
    labResults: [],
    images: [],
    documents: [],
    vitalSigns: {
      heartRate: 140,
      respiratoryRate: 25,
      temperature: 38.8,
      weight: 4.2
    },
    weight: 4.2,
    temperature: 38.8,
    notes: 'Recomendar seguimiento en 3 días si persisten los síntomas.',
    followUpDate: new Date('2024-01-23'),
    isPrivate: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

const medicalAlerts: MedicalAlert[] = [
  {
    id: 'alert_001',
    petId: '1',
    type: AlertType.VACCINATION_DUE,
    title: 'Vacuna Antirrábica Próxima',
    description: 'La vacuna antirrábica de Max vence en 30 días',
    dueDate: new Date('2024-03-15'),
    isCompleted: false,
    priority: AlertPriority.HIGH,
    createdBy: 'vet_001',
    assignedTo: 'user_123',
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'alert_002',
    petId: '2',
    type: AlertType.FOLLOW_UP_APPOINTMENT,
    title: 'Control Post-Tratamiento',
    description: 'Revisar evolución después del tratamiento para gastritis',
    dueDate: new Date('2024-01-23'),
    isCompleted: false,
    priority: AlertPriority.MEDIUM,
    createdBy: 'vet_002',
    assignedTo: 'user_456',
    createdAt: new Date('2024-01-20')
  }
];

export class MedicalRecordService {
  // ==================== GESTIÓN DE MASCOTAS ====================
  
  static async getAllPets(): Promise<Pet[]> {
    return [...pets];
  }

  static async getPetsByOwner(ownerId: string): Promise<Pet[]> {
    return pets.filter(pet => pet.ownerId === ownerId);
  }

  static async getPetById(petId: string): Promise<Pet | null> {
    return pets.find(pet => pet.id === petId) || null;
  }

  static async createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
    const newPet: Pet = {
      ...petData,
      id: `pet_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    pets.push(newPet);
    return newPet;
  }

  static async updatePet(petId: string, updates: Partial<Pet>): Promise<Pet | null> {
    const petIndex = pets.findIndex(pet => pet.id === petId);
    if (petIndex === -1) return null;

    pets[petIndex] = {
      ...pets[petIndex],
      ...updates,
      updatedAt: new Date()
    };

    return pets[petIndex];
  }

  static async deletePet(petId: string): Promise<boolean> {
    const petIndex = pets.findIndex(pet => pet.id === petId);
    if (petIndex === -1) return false;

    pets[petIndex].isActive = false;
    pets[petIndex].updatedAt = new Date();
    return true;
  }

  static async searchPets(filters: PetFilters): Promise<Pet[]> {
    let filtered = [...pets];

    if (filters.ownerId) {
      filtered = filtered.filter(pet => pet.ownerId === filters.ownerId);
    }

    if (filters.species) {
      filtered = filtered.filter(pet => pet.species === filters.species);
    }

    if (filters.breed) {
      filtered = filtered.filter(pet => 
        pet.breed.toLowerCase().includes(filters.breed!.toLowerCase())
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(search) ||
        pet.breed.toLowerCase().includes(search) ||
        pet.ownerName.toLowerCase().includes(search)
      );
    }

    if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
      filtered = filtered.filter(pet => {
        const age = this.calculateAge(pet.birthDate);
        const min = filters.ageMin ?? 0;
        const max = filters.ageMax ?? 100;
        return age >= min && age <= max;
      });
    }

    return filtered.filter(pet => pet.isActive);
  }

  // ==================== GESTIÓN DE HISTORIAS CLÍNICAS ====================

  static async getMedicalRecordsByPet(petId: string): Promise<MedicalRecord[]> {
    return medicalRecords
      .filter(record => record.petId === petId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  static async getMedicalRecordById(recordId: string): Promise<MedicalRecord | null> {
    return medicalRecords.find(record => record.id === recordId) || null;
  }

  static async createMedicalRecord(
    recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MedicalRecord> {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `record_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    medicalRecords.push(newRecord);
    return newRecord;
  }

  static async updateMedicalRecord(
    recordId: string, 
    updates: Partial<MedicalRecord>
  ): Promise<MedicalRecord | null> {
    const recordIndex = medicalRecords.findIndex(record => record.id === recordId);
    if (recordIndex === -1) return null;

    medicalRecords[recordIndex] = {
      ...medicalRecords[recordIndex],
      ...updates,
      updatedAt: new Date()
    };

    return medicalRecords[recordIndex];
  }

  static async searchMedicalRecords(filters: MedicalRecordFilters): Promise<MedicalRecord[]> {
    let filtered = [...medicalRecords];

    if (filters.petId) {
      filtered = filtered.filter(record => record.petId === filters.petId);
    }

    if (filters.veterinarianId) {
      filtered = filtered.filter(record => record.veterinarianId === filters.veterinarianId);
    }

    if (filters.type) {
      filtered = filtered.filter(record => record.type === filters.type);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(record => record.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(record => record.date <= filters.dateTo!);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(search) ||
        record.description.toLowerCase().includes(search) ||
        record.diagnosis?.toLowerCase().includes(search) ||
        record.treatment?.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // ==================== GESTIÓN DE ALERTAS ====================

  static async getAlertsByPet(petId: string): Promise<MedicalAlert[]> {
    return medicalAlerts
      .filter(alert => alert.petId === petId)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  static async getAlertsByOwner(ownerId: string): Promise<MedicalAlert[]> {
    const ownerPets = await this.getPetsByOwner(ownerId);
    const petIds = ownerPets.map(pet => pet.id);
    
    return medicalAlerts
      .filter(alert => petIds.includes(alert.petId))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  static async createAlert(
    alertData: Omit<MedicalAlert, 'id' | 'createdAt'>
  ): Promise<MedicalAlert> {
    const newAlert: MedicalAlert = {
      ...alertData,
      id: `alert_${Date.now()}`,
      createdAt: new Date()
    };

    medicalAlerts.push(newAlert);
    return newAlert;
  }

  static async completeAlert(alertId: string): Promise<MedicalAlert | null> {
    const alertIndex = medicalAlerts.findIndex(alert => alert.id === alertId);
    if (alertIndex === -1) return null;

    medicalAlerts[alertIndex].isCompleted = true;
    medicalAlerts[alertIndex].completedDate = new Date();

    return medicalAlerts[alertIndex];
  }

  static async getUpcomingAlerts(days: number = 30): Promise<MedicalAlert[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return medicalAlerts
      .filter(alert => 
        !alert.isCompleted && 
        alert.dueDate <= futureDate &&
        alert.dueDate >= new Date()
      )
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  // ==================== ESTADÍSTICAS Y REPORTES ====================

  static async getMedicalStats(petId?: string): Promise<MedicalStats> {
    let records = medicalRecords;
    let alerts = medicalAlerts;

    if (petId) {
      records = records.filter(record => record.petId === petId);
      alerts = alerts.filter(alert => alert.petId === petId);
    }

    const recordsByType = records.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<MedicalRecordType, number>);

    const recentActivity = records
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    const upcomingAlerts = alerts
      .filter(alert => !alert.isCompleted && alert.dueDate >= new Date())
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);

    // Calcular estado de vacunación
    const vaccinationAlerts = alerts.filter(alert => 
      alert.type === AlertType.VACCINATION_DUE
    );
    
    const vaccinationStatus = {
      upToDate: vaccinationAlerts.filter(alert => alert.isCompleted).length,
      overdue: vaccinationAlerts.filter(alert => 
        !alert.isCompleted && alert.dueDate < new Date()
      ).length,
      upcoming: vaccinationAlerts.filter(alert => 
        !alert.isCompleted && alert.dueDate >= new Date()
      ).length
    };

    return {
      totalRecords: records.length,
      recordsByType,
      recentActivity,
      upcomingAlerts,
      vaccinationStatus
    };
  }

  // ==================== EXPORTACIÓN ====================

  static async exportMedicalRecords(petId?: string): Promise<string> {
    let records = medicalRecords;
    let petsData = [...pets];

    if (petId) {
      records = records.filter(record => record.petId === petId);
      petsData = petsData.filter(pet => pet.id === petId);
    }

    // Crear contenido CSV
    const headers = [
      'Fecha',
      'Mascota',
      'Tipo',
      'Título',
      'Descripción',
      'Diagnóstico',
      'Tratamiento',
      'Peso (kg)',
      'Temperatura (°C)',
      'Notas'
    ];

    const csvContent = [
      headers.join(','),
      ...records.map(record => {
        const pet = petsData.find((p: Pet) => p.id === record.petId);
        return [
          record.date.toLocaleDateString(),
          pet?.name || 'Desconocida',
          this.getRecordTypeLabel(record.type),
          `"${record.title}"`,
          `"${record.description}"`,
          `"${record.diagnosis || ''}"`,
          `"${record.treatment || ''}"`,
          record.weight || '',
          record.temperature || '',
          `"${record.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historia_clinica_${petId || 'todas'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return 'Archivo exportado exitosamente';
  }

  static getRecordTypeLabel(type: MedicalRecordType): string {
    const labels = {
      [MedicalRecordType.CONSULTATION]: 'Consulta',
      [MedicalRecordType.VACCINATION]: 'Vacunación',
      [MedicalRecordType.SURGERY]: 'Cirugía',
      [MedicalRecordType.EMERGENCY]: 'Emergencia',
      [MedicalRecordType.CHECKUP]: 'Chequeo',
      [MedicalRecordType.LABORATORY]: 'Laboratorio',
      [MedicalRecordType.IMAGING]: 'Imágenes',
      [MedicalRecordType.TREATMENT]: 'Tratamiento',
      [MedicalRecordType.FOLLOW_UP]: 'Seguimiento',
    };
    return labels[type];
  }

  // ==================== UTILIDADES ====================

  static calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  static formatAge(birthDate: Date): string {
    const age = this.calculateAge(birthDate);
    const today = new Date();
    const birth = new Date(birthDate);
    
    if (age === 0) {
      const months = today.getMonth() - birth.getMonth() + 
        (12 * (today.getFullYear() - birth.getFullYear()));
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    
    return `${age} ${age === 1 ? 'año' : 'años'}`;
  }

  static getSpeciesLabel(species: PetSpecies): string {
    const labels = {
      [PetSpecies.DOG]: 'Perro',
      [PetSpecies.CAT]: 'Gato',
      [PetSpecies.BIRD]: 'Ave',
      [PetSpecies.RABBIT]: 'Conejo',
      [PetSpecies.HAMSTER]: 'Hámster',
      [PetSpecies.GUINEA_PIG]: 'Cuy',
      [PetSpecies.FERRET]: 'Hurón',
      [PetSpecies.REPTILE]: 'Reptil',
      [PetSpecies.FISH]: 'Pez',
      [PetSpecies.OTHER]: 'Otro'
    };
    return labels[species];
  }

  static getGenderLabel(gender: PetGender): string {
    const labels = {
      [PetGender.MALE]: 'Macho',
      [PetGender.FEMALE]: 'Hembra',
      [PetGender.NEUTERED_MALE]: 'Macho Castrado',
      [PetGender.SPAYED_FEMALE]: 'Hembra Esterilizada'
    };
    return labels[gender];
  }
}