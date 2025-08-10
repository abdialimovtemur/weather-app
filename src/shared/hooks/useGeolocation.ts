import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  isLoading: boolean
  permission: PermissionState | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
    permission: null
  })

  const requestLocation = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation qo\'llab-quvvatlanmaydi. Brauzeringiz eski versiyada.',
        isLoading: false
      }))
      return
    }

    navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((permissionStatus) => {
      setState(prev => ({ ...prev, permission: permissionStatus.state }))

      if (permissionStatus.state === 'denied') {
        setState(prev => ({
          ...prev,
          error: 'Manzil ruhsati rad etildi. Iltimos, brauzer sozlamalaridan ruhsat bering.',
          isLoading: false
        }))
        return
      }

      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Geolocation muvaffaqiyatli:', position.coords)
            setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              isLoading: false,
              permission: 'granted'
            })
          },
          (error) => {
            console.error('Geolocation xatoligi:', error)
            let errorMessage = 'Manzil olinmadi'
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Manzil ruhsati rad etildi. Iltimos, brauzer sozlamalaridan ruhsat bering.'
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Manzil ma\'lumotlari mavjud emas. Internet aloqasini tekshiring.'
                break
              case error.TIMEOUT:
                errorMessage = 'Manzil olish vaqti tugadi. Qaytadan urinib ko\'ring.'
                break
              default:
                errorMessage = `Manzil olishda xatolik: ${error.message}`
                break
            }
            setState(prev => ({
              ...prev,
              error: errorMessage,
              isLoading: false
            }))
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          }
        )
      }
    }).catch((error) => {
      console.error('Permission query xatoligi:', error)
      setState(prev => ({
        ...prev,
        error: 'Manzil ruhsati tekshirilayotganda xatolik yuz berdi.',
        isLoading: false
      }))
    })
  }

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((permissionStatus) => {
        setState(prev => ({ ...prev, permission: permissionStatus.state }))
        
        permissionStatus.addEventListener('change', () => {
          setState(prev => ({ ...prev, permission: permissionStatus.state }))
          
          if (permissionStatus.state === 'granted') {
            requestLocation()
          }
        })
      })
    }
  }, [])

  useEffect(() => {
    if (state.permission === null) {
      requestLocation()
    }
  }, [state.permission])

  return {
    ...state,
    requestLocation
  }
}
