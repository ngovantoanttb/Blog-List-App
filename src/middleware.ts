import {
  AnyAction,
  isRejected,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI
} from '@reduxjs/toolkit'

import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helpers'

function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: String
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    if (isRejected(action)) {
      if (action.error.name === 'CustomError') {
        // Những lỗi liên quan đến quá trình thực thi
        toast.warn(action.error.message)
      }
    }
    /**
     * `isRejectedWithValue` là một function giúp chúng ta kiểm tra những action có rejectedWithValue = true từ createAsyncThunk
     * RTK Query sử dụng `createAsyncThunk` bên trong nên chúng ta có thể dùng `isRejectedWithValue` để kiểm tra lỗi 🎉
     */

    // Option: Trong thực tế không bắt buộc đến mức này!

    if (isRejectedWithValue(action)) {
      // Mỗi khi thực hiện query hoặc mutation mà bị lỗi thì nó sẽ chạy vào đây
      // Những lỗi từ server thì action nó mới có rejectedWithValue = true
      // Còn những action liên quan đến việc caching mà bị rejected thì rejectedWithValue = false, nên đừng lo lắng, nó không lọt vào đây được

      if (isPayloadErrorMessage(action.payload)) {
        // Lỗi reject tuừ server chỉ có message
        toast.warn(action.payload.data.error)
      } else if (!isEntityError(action.payload)) {
        // Lỗi còn lại trừ lỗi 422: có thẻ là từ SerializeError
        toast.warn(action.error.message)
      }
    }
    return next(action)
  }
