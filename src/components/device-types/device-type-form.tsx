'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TopicSuffix } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormText } from '@/components/ui/form-fields/form-text'
import LoadingSpinner from '@/components/loading-spinner'
import {
  useCreateDeviceType,
  useFindUniqueDeviceType,
  useUpdateDeviceType,
} from '@/lib/zenstack-hooks'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { extractTopicSuffix, topicSuffixToPath } from '@/lib/mqtt/topicMapping'
import { FormMultiSelect } from '../common/form-mutiple-select'

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  topicSuffixes: z.array(z.string()),
})

type DeviceTypeFormValues = z.infer<typeof formSchema>

interface DeviceTypeFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  deviceTypeId?: string
}

export default function DeviceTypeForm({
  isOpen,
  onClose,
  onSuccess,
  deviceTypeId,
}: DeviceTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!deviceTypeId

  const { data: deviceTypeData, isLoading: isLoadingDeviceType } =
    useFindUniqueDeviceType(
      { where: { id: deviceTypeId } },
      { enabled: !!deviceTypeId },
    )

  const { mutate: createDeviceType } = useCreateDeviceType()
  const { mutate: updateDeviceType } = useUpdateDeviceType()

  const methods = useForm<DeviceTypeFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: deviceTypeData?.name || '',
      topicSuffixes: deviceTypeData?.topicSuffixes || [],
    },
  })


  const onSubmit = (values: DeviceTypeFormValues) => {
    setIsSubmitting(true)

    const deviceTypeFormattedData = {
      name: values.name,
      topicSuffixes: values.topicSuffixes as TopicSuffix[],
    }

    if (isEditMode && deviceTypeData) {
      updateDeviceType(
        {
          where: { id: deviceTypeData.id },
          data: deviceTypeFormattedData,
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            onSuccess()
          },
          onError: error => {
            console.error('Erro ao atualizar tipo de dispositivo:', error)
            setIsSubmitting(false)
          },
        },
      )
    } else {
      createDeviceType(
        {
          data: deviceTypeFormattedData,
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            onSuccess()
          },
          onError: error => {
            console.error('Erro ao criar tipo de dispositivo:', error)
            setIsSubmitting(false)
          },
        },
      )
    }
  }

  const allTopicSuffixes = Object.values(TopicSuffix)

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Tipo de Dispositivo' : 'Novo Tipo de Dispositivo'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Atualize as informações do tipo de dispositivo no formulário abaixo.'
              : 'Digite os detalhes para o novo tipo de dispositivo.'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingDeviceType ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormText
                name="name"
                label="Nome"
                placeholder="Digite o nome do tipo de dispositivo"
                required
              />

              <div className="space-y-3">
                <Label>Tópicos Suportados</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-[200px] overflow-y-auto">
                  <FormMultiSelect
                    required
                    name="topicSuffixes"
                    options={allTopicSuffixes.map(suffix => ({
                      label: topicSuffixToPath[suffix],
                      value: suffix,
                    }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      {isEditMode ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? 'Atualizar Tipo de Dispositivo' : 'Criar Tipo de Dispositivo'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}
