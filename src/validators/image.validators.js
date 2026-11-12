import Joi from 'joi'
import { formatFileSize } from '../utils/format'

export const MAX_IMAGE_SIZE_MB = 4

const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export const imageFileRule = Joi.any()
  .custom((value, helpers) => {
    const file = value?.[0]

    if (!file) {
      return value
    }

    if (!file.type?.startsWith('image/')) {
      return helpers.error('file.type')
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return helpers.error('file.size', { size: formatFileSize(file.size) })
    }

    return value
  })
  .messages({
    'file.type': 'El archivo tiene que ser una imagen (JPG, PNG, WebP…).',
    'file.size': `La imagen pesa {#size}. El máximo es ${MAX_IMAGE_SIZE_MB} MB.`,
  })

export const avatarSchema = Joi.object({ imagen: imageFileRule })
