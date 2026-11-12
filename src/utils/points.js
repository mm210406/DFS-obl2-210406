import { MAX_POINTS, MIN_POINTS } from '../config/constants'

export const isFullPointsRange = ({ from, to }) => from === MIN_POINTS && to === MAX_POINTS
