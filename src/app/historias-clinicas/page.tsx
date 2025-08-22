'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PetProfile } from '@/components/medical/pet-profile'
import { MedicalRecordsList } from '@/components/medical/medical-records-list'
import { MedicalAlerts } from '@/components/medical/medical-alerts'
import {
  Heart,
  Plus,
  FileText,
  Bell,
  BarChart3,
  AlertCircle,
  Stethoscope,
} from 'lucide-react'
import { Pet, MedicalStats } from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'
import { getUserRole, ClerkUser } from '@/lib/clerk-auth'
import { UserRole } from '@/types'

export default function HistoriasClinicasPage() {
  const { user, isLoaded } = useUser()
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [stats, setStats] = useState<MedicalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT)

  useEffect(() => {
    const loadUserData = async (role: UserRole) => {
      try {
        setLoading(true)

        if (role === UserRole.CLIENT) {
          // Cargar mascotas del cliente
          const userPets = await MedicalRecordService.getPetsByOwner(user!.id)
          setPets(userPets)

          if (userPets.length > 0) {
            setSelectedPet(userPets[0])
            const petStats = await MedicalRecordService.getMedicalStats(
              userPets[0].id
            )
            setStats(petStats)
          }
        } else if (role === UserRole.VETERINARIAN) {
          // Cargar todas las mascotas para veterinarios
          const allPets = await MedicalRecordService.getAllPets()
          setPets(allPets)

          const generalStats = await MedicalRecordService.getMedicalStats()
          setStats(generalStats)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      const role = getUserRole(user as ClerkUser)
      setUserRole(role)
      loadUserData(role)
    }
  }, [isLoaded, user])

  const handlePetSelect = async (pet: Pet) => {
    setSelectedPet(pet)
    const petStats = await MedicalRecordService.getMedicalStats(pet.id)
    setStats(petStats)
  }

  const handleAddPet = () => {
    // Implementar modal para agregar mascota
    console.log('Agregar nueva mascota')
  }

  const handleAddRecord = () => {
    // Implementar modal para agregar registro médico
    console.log('Agregar nuevo registro médico')
  }

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
            <div className="lg:col-span-2 h-96 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para acceder a las historias clínicas.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Stethoscope className="w-8 h-8 mr-3 text-primary" />
              Historias Clínicas Digitales
            </h1>
            <p className="text-muted-foreground mt-1">
              {userRole === UserRole.CLIENT
                ? 'Gestiona la salud de tus mascotas'
                : 'Sistema de gestión médica veterinaria'}
            </p>
          </div>

          {userRole === UserRole.CLIENT && (
            <Button onClick={handleAddPet}>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Mascota
            </Button>
          )}
        </div>

        {/* Contenido principal */}
        {pets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {userRole === UserRole.CLIENT
                  ? '¡Registra tu primera mascota!'
                  : 'No hay mascotas registradas'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {userRole === UserRole.CLIENT
                  ? 'Comienza creando el perfil de tu mascota para llevar un registro completo de su salud.'
                  : 'Los clientes aún no han registrado mascotas en el sistema.'}
              </p>
              {userRole === UserRole.CLIENT && (
                <Button onClick={handleAddPet} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Registrar Primera Mascota
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Lista de mascotas */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Mis Mascotas</span>
                    {userRole === UserRole.CLIENT && (
                      <Button variant="ghost" size="sm" onClick={handleAddPet}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {pets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => handlePetSelect(pet)}
                        className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                          selectedPet?.id === pet.id
                            ? 'bg-muted border-r-2 border-primary'
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{pet.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {MedicalRecordService.getSpeciesLabel(
                                pet.species
                              )}{' '}
                              • {MedicalRecordService.formatAge(pet.birthDate)}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas rápidas */}
              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Resumen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {stats.totalRecords}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Registros médicos
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {stats.vaccinationStatus.upToDate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Al día
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-orange-600">
                          {stats.vaccinationStatus.upcoming}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Próximas
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-red-600">
                          {stats.vaccinationStatus.overdue}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Vencidas
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-2">
              {selectedPet ? (
                <Tabs defaultValue="profile" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile" className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Perfil
                    </TabsTrigger>
                    <TabsTrigger value="records" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Historia Clínica
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Alertas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <PetProfile
                      pet={selectedPet}
                      onEdit={() => console.log('Editar mascota')}
                      onAddRecord={handleAddRecord}
                      showOwnerInfo={userRole === UserRole.VETERINARIAN}
                    />
                  </TabsContent>

                  <TabsContent value="records">
                    <MedicalRecordsList
                      petId={selectedPet.id}
                      onAddRecord={handleAddRecord}
                      onEditRecord={(record) =>
                        console.log('Editar registro', record)
                      }
                      showAddButton={userRole === UserRole.VETERINARIAN}
                    />
                  </TabsContent>

                  <TabsContent value="alerts">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Alertas y Recordatorios
                        </h3>
                        {userRole === UserRole.VETERINARIAN && (
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Alerta
                          </Button>
                        )}
                      </div>

                      <MedicalAlerts
                        petId={selectedPet.id}
                        showCompleted={false}
                        onAlertComplete={(alert) =>
                          console.log('Alerta completada', alert)
                        }
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Selecciona una mascota
                    </h3>
                    <p className="text-muted-foreground">
                      Elige una mascota de la lista para ver su información
                      médica.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
