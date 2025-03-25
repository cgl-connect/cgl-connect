import { ExternalToast, toast, ToastT } from 'sonner'

export function useToast() {
  function loading(message: string, options?: ExternalToast) {
    toast.loading(message, options)
  }
  function error(message: string, options?: ExternalToast) {
    toast.error(message, options)
  }
  function success(message: string, options?: ExternalToast) {
    toast.success(message, options)
  }
  function info(message: string, options?: ExternalToast) {
    toast.info(message, options)
  }
  function exception(error: any) {
    switch (true) {
      case error?.info?.rejectedByPolicy:
        return toast.error('You do not have permission to perform this action.')

      case error?.info?.message:
        return toast.error(error.info.message)

      case error?.message:
        return toast.error(error.error.message)

      default:
        return toast.error('An error occurred. Please try again.')
    }
  }
  return {
    loading,
    error,
    success,
    info,
    exception,
  }
}
